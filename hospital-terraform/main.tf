provider "aws" {
  region = "ap-south-1"
}

# -------------------- VPC --------------------
resource "aws_vpc" "hospital_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = {
    Name = "HospitalVPC"
  }
}

# -------------------- Subnets --------------------
resource "aws_subnet" "hospital_subnet_a" {
  vpc_id                  = aws_vpc.hospital_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "ap-south-1a"
  map_public_ip_on_launch = true
  tags = {
    Name = "HospitalSubnetA"
  }
}

resource "aws_subnet" "hospital_subnet_b" {
  vpc_id                  = aws_vpc.hospital_vpc.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "ap-south-1b"
  map_public_ip_on_launch = true
  tags = {
    Name = "HospitalSubnetB"
  }
}

# -------------------- Internet Gateway --------------------
resource "aws_internet_gateway" "hospital_igw" {
  vpc_id = aws_vpc.hospital_vpc.id
  tags = {
    Name = "HospitalIGW"
  }
}

# -------------------- Route Table + Associations --------------------
resource "aws_route_table" "hospital_route_table" {
  vpc_id = aws_vpc.hospital_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.hospital_igw.id
  }

  tags = {
    Name = "HospitalRouteTable"
  }
}

resource "aws_route_table_association" "route_a" {
  subnet_id      = aws_subnet.hospital_subnet_a.id
  route_table_id = aws_route_table.hospital_route_table.id
}

resource "aws_route_table_association" "route_b" {
  subnet_id      = aws_subnet.hospital_subnet_b.id
  route_table_id = aws_route_table.hospital_route_table.id
}

# -------------------- Security Group --------------------
resource "aws_security_group" "monitoring_sg" {
  vpc_id      = aws_vpc.hospital_vpc.id
  name        = "monitoring_sg"
  description = "Allow Grafana (3000), Prometheus (9090), and SSH (22)"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 9090
    to_port     = 9090
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "MonitoringSG"
  }
}

# -------------------- AMI --------------------
data "aws_ami" "latest_amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }
}

# -------------------- Key Pair --------------------
resource "aws_key_pair" "hospital_key" {
  key_name   = "hospital-key"
  public_key = file("${path.module}/hospital-key.pub")
}

# -------------------- Prometheus EC2 --------------------
resource "aws_instance" "prometheus" {
  ami                         = data.aws_ami.latest_amazon_linux.id
  instance_type               = "t2.micro"
  subnet_id                   = aws_subnet.hospital_subnet_a.id
  vpc_security_group_ids      = [aws_security_group.monitoring_sg.id]
  associate_public_ip_address = true
  key_name                    = aws_key_pair.hospital_key.key_name

  user_data = <<-EOF
              #!/bin/bash
              yum update -y
              yum install -y wget tar
              cd /opt
              wget https://github.com/prometheus/prometheus/releases/download/v2.41.0/prometheus-2.41.0.linux-amd64.tar.gz
              tar -xvzf prometheus-2.41.0.linux-amd64.tar.gz
              mv prometheus-2.41.0.linux-amd64 prometheus
              cd prometheus
              echo '
              global:
                scrape_interval: 15s

              scrape_configs:
                - job_name: prometheus
                  static_configs:
                    - targets: ["localhost:9090"]
              ' > prometheus.yml
              nohup ./prometheus --config.file=prometheus.yml > /var/log/prometheus.log 2>&1 &
              EOF

  tags = {
    Name = "PrometheusServer"
  }
}

# -------------------- Grafana EC2 --------------------
resource "aws_instance" "grafana" {
  ami                         = data.aws_ami.latest_amazon_linux.id
  instance_type               = "t2.micro"
  subnet_id                   = aws_subnet.hospital_subnet_b.id
  vpc_security_group_ids      = [aws_security_group.monitoring_sg.id]
  associate_public_ip_address = true
  key_name                    = aws_key_pair.hospital_key.key_name

  user_data = <<-EOF
              #!/bin/bash
              yum update -y
              yum install -y wget
              cd /opt
              wget https://dl.grafana.com/oss/release/grafana-8.5.4-1.x86_64.rpm
              yum localinstall -y grafana-8.5.4-1.x86_64.rpm
              systemctl start grafana-server
              systemctl enable grafana-server
              EOF

  tags = {
    Name = "GrafanaServer"
  }
}

# -------------------- Outputs --------------------
output "prometheus_public_ip" {
  value       = aws_instance.prometheus.public_ip
  description = "Public IP of the Prometheus server"
}

output "grafana_public_ip" {
  value       = aws_instance.grafana.public_ip
  description = "Public IP of the Grafana server"
}

output "grafana_dashboard_url" {
  value = "http://${aws_instance.grafana.public_ip}:3000"
}

output "prometheus_dashboard_url" {
  value = "http://${aws_instance.prometheus.public_ip}:9090"
}

# -------------------- Ubuntu Monitor EC2 --------------------
resource "aws_instance" "monitor_ubuntu" {
  ami                         = "ami-0f58b397bc5c1f2e8" # Ubuntu 22.04 LTS in ap-south-1
  instance_type               = "t2.micro"
  subnet_id                   = aws_subnet.hospital_subnet_a.id
  vpc_security_group_ids      = [aws_security_group.monitoring_sg.id]
  associate_public_ip_address = true
  key_name                    = aws_key_pair.hospital_key.key_name

  tags = {
    Name = "UbuntuMonitor"
  }
}

output "ubuntu_monitor_ip" {
  value       = aws_instance.monitor_ubuntu.public_ip
  description = "Public IP of the Ubuntu monitor node"
}