# AWS EC2 Deployment Guide

This guide provides a step-by-step walkthrough to deploy the TodoList application to an **AWS EC2 instance** running **Ubuntu 22.04 LTS** using the automated deployment script.

---

## Prerequisites
- An active AWS Account.
- Git repository pushed to: `https://github.com/Chituongnguyen24/TodoList.git`.
- SSH client (Terminal, PuTTY, or PowerShell).

---

## Step 1: Launch an AWS EC2 Instance

1. Navigate to the **EC2 Dashboard** in the AWS Console.
2. Click **Launch Instance**.
3. Configure the following settings:
   - **Name**: `todolist-server`
   - **Amazon Machine Image (AMI)**: Select **Ubuntu 22.04 LTS** (Free tier eligible).
   - **Instance Type**: Select **t2.micro** or **t3.micro** (Free tier eligible).
   - **Key Pair**: Create a new key pair (e.g., `todo-key.pem`) and download it. Store it securely.
4. Keep the other settings as default and click **Launch**.

---

## Step 2: Configure Security Groups (Firewall)

To access the web application and API endpoints, you must allow inbound traffic on specific ports.

1. In the EC2 Instance description, navigate to the **Security** tab and click on the active **Security Group**.
2. Click **Edit inbound rules**.
3. Add the following rules:

| Type | Protocol | Port Range | Source | Description |
| :--- | :--- | :--- | :--- | :--- |
| **SSH** | TCP | `22` | My IP (or `0.0.0.0/0`) | SSH Console access |
| **HTTP** | TCP | `80` | `0.0.0.0/0` | Web Browser access (Frontend UI) |
| **Custom TCP** | TCP | `8080` | `0.0.0.0/0` | Backend API & Swagger UI access |

4. Click **Save rules**.

---

## Step 3: Connect to the EC2 Instance via SSH

1. Open your terminal and navigate to the directory containing your downloaded key pair (`todo-key.pem`).
2. Modify key permissions to read-only (required on macOS/Linux):
   ```bash
   chmod 400 todo-key.pem
   ```
3. Establish connection:
   ```bash
   ssh -i "todo-key.pem" ubuntu@<YOUR_EC2_PUBLIC_IP>
   ```
   *(Replace `<YOUR_EC2_PUBLIC_IP>` with the IPv4 Public IP of your running EC2 instance).*

---

## Step 4: Clone and Deploy the Application

Once connected, run the following commands to pull the code and trigger the automated script.

1. Clone the repository:
   ```bash
   git clone https://github.com/Chituongnguyen24/TodoList.git
   cd TodoList
   ```
2. Make the deployment script executable:
   ```bash
   chmod +x deploy.sh
   ```
3. Run the automated deployment script:
   ```bash
   ./deploy.sh
   ```

### What the `deploy.sh` script does:
- Installs **Docker** and **Docker Compose** on the instance if they are not already installed.
- Pulls the latest commits from the `main` branch.
- Stops any existing containers.
- Rebuilds and boots the containers in production mode using `docker-compose.prod.yml`, exposing the **Frontend Web UI on port 80**.

---

## Step 5: Verify Deployment

Once the script completes, open your local web browser and verify access:

- **Frontend User Interface**:
  Visit: `http://<YOUR_EC2_PUBLIC_IP>` (no port needed since it maps to standard port 80).
- **Backend Swagger API Docs**:
  Visit: `http://<YOUR_EC2_PUBLIC_IP>:8080/swagger-ui/index.html` to execute API commands.
- **REST Endpoints**:
  Visit: `http://<YOUR_EC2_PUBLIC_IP>:8080/todos` to query raw task data.

---

## Troublshooting Commands

To manage your running services on the EC2 instance, execute these commands inside the `TodoList` directory:

- **Check logs**:
  ```bash
  docker compose logs -f
  ```
- **Stop application**:
  ```bash
  docker compose down
  ```
- **Inspect service status**:
  ```bash
  docker compose ps
  ```
