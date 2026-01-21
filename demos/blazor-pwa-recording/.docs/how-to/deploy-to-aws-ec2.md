# How-to: Deploy Blazor PWA to AWS EC2 via ECR

This guide explains how to containerize the Blazor PWA Recording app and deploy it to an AWS EC2 instance using Amazon Elastic Container Registry (ECR).

## Prerequisites

- AWS CLI installed and configured.
- Docker installed locally.
- An AWS account with ECR and EC2 permissions.

## 1. Prepare Docker Image

### Authenticate with ECR

Replace `<AWS_REGION>` and `<AWS_ACCOUNT_ID>` with your values.

```bash
aws ecr get-login-password --region <AWS_REGION> | docker login --username AWS --password-stdin <AWS_ACCOUNT_ID>.dkr.ecr.<AWS_REGION>.amazonaws.com
```

### Build and Tag

Run these commands from the `demos/blazor-pwa-recording/` directory:

```bash
# Build
docker build -t blazor-pwa-recording .

# Tag for ECR
docker tag blazor-pwa-recording:latest <AWS_ACCOUNT_ID>.dkr.ecr.<AWS_REGION>.amazonaws.com/blazor-pwa-recording:latest
```

### Push to ECR

```bash
docker push <AWS_ACCOUNT_ID>.dkr.ecr.<AWS_REGION>.amazonaws.com/blazor-pwa-recording:latest
```

## 2. Deploy to EC2

### EC2 Instance Setup

1. Launch an Amazon Linux 2023 instance.
2. Attach an IAM Role with `AmazonEC2ContainerRegistryReadOnly` policy.
3. Open port **80** in the Security Group.

### Launch Container

Connect to EC2 via SSH:

```bash
# Install and start Docker
sudo dnf install docker -y
sudo systemctl start docker

# Login to ECR
aws ecr get-login-password --region <AWS_REGION> | sudo docker login --username AWS --password-stdin <AWS_ACCOUNT_ID>.dkr.ecr.<AWS_REGION>.amazonaws.com

# Run the container
sudo docker run -d -p 80:80 --name blazor-pwa <AWS_ACCOUNT_ID>.dkr.ecr.<AWS_REGION>.amazonaws.com/blazor-pwa-recording:latest
```

## Related
- [Dockerfile Reference](../reference/docker-configuration.md)
- [Architecture Explanation](../explanation/container-deployment-strategy.md)
