terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region = "ap-southeast-2"
}

# ---------------------------------------------------------
# VPC
# ---------------------------------------------------------

data "aws_vpc" "default" {
  id = "vpc-0190c81ed6011214e"
}

# ---------------------------------------------------------
# ECR
# ---------------------------------------------------------

resource "aws_ecr_repository" "nilayam" {
  name = "nilayam"
}

# ---------------------------------------------------------
# ECS Cluster
# ---------------------------------------------------------

resource "aws_ecs_cluster" "nilayam" {
  name = "nilayam-cluster"
}

# ---------------------------------------------------------
# IAM Role
# ---------------------------------------------------------

resource "aws_iam_role" "ecs_task_execution" {
  name = "ecsTaskExecutionRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }

        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# ---------------------------------------------------------
# ECS Security Group
# ---------------------------------------------------------

resource "aws_security_group" "nilayam" {
  name        = "nilayam-sg"
  description = "Security group for Nilayam ECS"
  vpc_id      = data.aws_vpc.default.id
}

# ALB → ECS port 3000
resource "aws_vpc_security_group_ingress_rule" "nilayam_from_alb" {
  security_group_id            = aws_security_group.nilayam.id
  referenced_security_group_id = aws_security_group.nilayam_alb.id

  from_port   = 3000
  to_port     = 3000
  ip_protocol = "tcp"
}

# ---------------------------------------------------------
# ECS Task Definition
# ---------------------------------------------------------

resource "aws_ecs_task_definition" "nilayam" {
  family                   = "nilayam"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]

  cpu    = "512"
  memory = "1024"

  execution_role_arn = aws_iam_role.ecs_task_execution.arn

  container_definitions = jsonencode([
    {
      name      = "nilayam"
      image     = "${aws_ecr_repository.nilayam.repository_url}:latest"
      essential = true

      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
          protocol      = "tcp"
        }
      ]

      environment = [
        {
          name  = "NODE_ENV"
          value = "production"
        },
        {
          name  = "PRISMA_LOG_QUERIES"
          value = "false"
        }
      ]

      secrets = [
        {
          name      = "DATABASE_URL"
          valueFrom = "arn:aws:secretsmanager:ap-southeast-2:867041163374:secret:nilayam/DATABASE_URL-Suo8yp"
        },
        {
          name      = "NEXTAUTH_SECRET"
          valueFrom = "arn:aws:secretsmanager:ap-southeast-2:867041163374:secret:nilayam/NEXTAUTH_SECRET-LJLAUO"
        },
        {
          name      = "GOOGLE_CLIENT_ID"
          valueFrom = "arn:aws:secretsmanager:ap-southeast-2:867041163374:secret:nilayam/GOOGLE_CLIENT_ID-HUwep3"
        },
        {
          name      = "GOOGLE_CLIENT_SECRET"
          valueFrom = "arn:aws:secretsmanager:ap-southeast-2:867041163374:secret:nilayam/GOOGLE_CLIENT_SECRET-A3Uz4P"
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"

        options = {
          awslogs-group         = "/ecs/nilayam"
          awslogs-region        = "ap-southeast-2"
          awslogs-stream-prefix = "ecs"
        }
      }
    }
  ])
}

# ---------------------------------------------------------
# ECS Service
# ---------------------------------------------------------

resource "aws_ecs_service" "nilayam" {
  name            = "nilayam-service"
  cluster         = aws_ecs_cluster.nilayam.id
  task_definition = aws_ecs_task_definition.nilayam.arn

  launch_type = "FARGATE"

  desired_count = 1

  network_configuration {
    subnets = [
      "subnet-06cc20a5c2ebc02bc",
      "subnet-0c62ff67789c10192"
    ]

    security_groups = [
      aws_security_group.nilayam.id
    ]

    assign_public_ip = true
  }

  # Connect ECS service to ALB target group
  load_balancer {
    target_group_arn = aws_lb_target_group.nilayam.arn
    container_name   = "nilayam"
    container_port   = 3000
  }

  depends_on = [
    aws_lb_listener.nilayam_http
  ]
}

# ---------------------------------------------------------
# ALB Security Group
# ---------------------------------------------------------

resource "aws_security_group" "nilayam_alb" {
  name        = "nilayam-alb-sg"
  description = "Security group for Nilayam Application Load Balancer"
  vpc_id      = data.aws_vpc.default.id
}

# Internet → ALB port 80
resource "aws_vpc_security_group_ingress_rule" "nilayam_alb_http" {
  security_group_id = aws_security_group.nilayam_alb.id

  cidr_ipv4   = "0.0.0.0/0"
  from_port   = 80
  to_port     = 80
  ip_protocol = "tcp"
}

# ALB outbound traffic
resource "aws_vpc_security_group_egress_rule" "nilayam_alb_all" {
  security_group_id = aws_security_group.nilayam_alb.id

  cidr_ipv4   = "0.0.0.0/0"
  ip_protocol = "-1"
}

# ---------------------------------------------------------
# Application Load Balancer
# ---------------------------------------------------------

resource "aws_lb" "nilayam" {
  name               = "nilayam-alb"
  internal           = false
  load_balancer_type = "application"

  security_groups = [
    aws_security_group.nilayam_alb.id
  ]

  subnets = [
    "subnet-06cc20a5c2ebc02bc",
    "subnet-0c62ff67789c10192"
  ]
}

# ---------------------------------------------------------
# Target Group
# ---------------------------------------------------------

resource "aws_lb_target_group" "nilayam" {
  name        = "nilayam-tg"
  port        = 3000
  protocol    = "HTTP"
  target_type = "ip"

  vpc_id = data.aws_vpc.default.id

  health_check {
    enabled             = true
    path                = "/"
    protocol            = "HTTP"
    port                = "3000"
    healthy_threshold   = 2
    unhealthy_threshold = 3
    timeout             = 5
    interval            = 30
    matcher             = "200-399"
  }
}

# ---------------------------------------------------------
# ALB Listener
# ---------------------------------------------------------

resource "aws_lb_listener" "nilayam_http" {
  load_balancer_arn = aws_lb.nilayam.arn

  port     = 80
  protocol = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.nilayam.arn
  }
}

# ---------------------------------------------------------
# Secrets Manager
# ---------------------------------------------------------

resource "aws_secretsmanager_secret" "database_url" {
  name = "nilayam/DATABASE_URL"

  lifecycle {
    ignore_changes = [
      description,
      recovery_window_in_days,
      force_overwrite_replica_secret
    ]
  }
}

resource "aws_secretsmanager_secret" "nextauth_secret" {
  name = "nilayam/NEXTAUTH_SECRET"

  lifecycle {
    ignore_changes = [
      description,
      recovery_window_in_days,
      force_overwrite_replica_secret
    ]
  }
}

resource "aws_secretsmanager_secret" "google_client_id" {
  name = "nilayam/GOOGLE_CLIENT_ID"

  lifecycle {
    ignore_changes = [
      description,
      recovery_window_in_days,
      force_overwrite_replica_secret
    ]
  }
}

resource "aws_secretsmanager_secret" "google_client_secret" {
  name = "nilayam/GOOGLE_CLIENT_SECRET"

  lifecycle {
    ignore_changes = [
      description,
      recovery_window_in_days,
      force_overwrite_replica_secret
    ]
  }
}