# AWS EC2 Setup Guide - Detailed Step-by-Step Instructions

Complete visual guide with exact button clicks and settings for launching an EC2 instance for ShipThis.

---

## 📋 Prerequisites

- AWS Account (create one at https://aws.amazon.com if you don't have)
- Credit card for AWS account verification (Free tier available)
- Basic understanding of SSH

---

## 🚀 Part 1: Launching EC2 Instance

### Step 1: Login to AWS Console

1. Go to https://console.aws.amazon.com
2. Enter your email and password
3. Click **Sign In**

### Step 2: Navigate to EC2 Dashboard

**Option A: Using Search**

1. At the top of the page, click the **search bar**
2. Type `EC2`
3. Click **EC2** (Virtual Servers in the Cloud)

**Option B: Using Services Menu**

1. Click **Services** in the top-left corner
2. Under "Compute" section, click **EC2**

### Step 3: Launch Instance

1. You'll see the EC2 Dashboard
2. Look for the orange button that says **Launch instance**
3. Click **Launch instance**
   - If you see a dropdown, click **Launch instance** (not "Launch instance from template")

---

## 🔧 Part 2: Configure Instance Settings

### Step 4: Name and Tags

**What you'll see:** "Name and tags" section at the top

1. **Name**: Enter `shipthis-production`
   - This is just a label to identify your server
2. **Tags** (optional): Leave as default or add custom tags
   - Click **Add additional tags** if you want to add more (not required)

### Step 5: Application and OS Images (Amazon Machine Image)

**What you'll see:** Section showing different operating system options

1. **Quick Start**: Make sure this tab is selected (should be orange/highlighted)
2. **Select OS**: Click on **Ubuntu**
   - You'll see a card with Ubuntu logo
3. **Amazon Machine Image (AMI)**:
   - From the dropdown, select **Ubuntu Server 22.04 LTS (HVM), SSD Volume Type**
   - Make sure it says **Free tier eligible** (green label)
4. **Architecture**: Select **64-bit (x86)**

### Step 6: Instance Type

**What you'll see:** Section to choose server size/power

1. **Instance type dropdown**: Click the dropdown menu
2. **Recommended options**:
   - **For testing/demo**: Select `t2.micro` (Free tier eligible - 1 vCPU, 1 GB RAM)
   - **For production**: Select `t2.medium` (2 vCPU, 4 GB RAM) - Recommended
   - **For better performance**: Select `t3.medium` (2 vCPU, 4 GB RAM)

> ⚠️ **Note**: t2.micro may be too small to run both frontend and backend smoothly. t2.medium is recommended.

### Step 7: Key Pair (Login)

**What you'll see:** Section for SSH key configuration

**If you already have a key pair:**

1. Select your existing key from the dropdown
2. Skip to Step 8

**If you need to create a new key pair:**

1. Click **Create new key pair** (orange link)
2. A popup window will appear:
   - **Key pair name**: Enter `shipthis-key` (or any name you prefer)
   - **Key pair type**: Select **RSA**
   - **Private key file format**:
     - Select **.pem** (for Mac/Linux)
     - Select **.ppk** (for Windows with PuTTY)
3. Click **Create key pair** (orange button)
4. **IMPORTANT**: The `.pem` file will download automatically
   - Save it in a safe location (e.g., `~/Downloads/shipthis-key.pem`)
   - You'll need this file to connect to your server
   - **DO NOT LOSE THIS FILE** - you cannot download it again

### Step 8: Network Settings

**What you'll see:** Section for firewall and network configuration

Click **Edit** button on the right side of "Network settings"

#### 8.1 VPC and Subnet

- **VPC**: Leave as default (usually "default vpc-xxxxx")
- **Subnet**: Leave as "No preference" or select any available
- **Auto-assign public IP**: Make sure it's **Enable**

#### 8.2 Firewall (Security Groups)

**Select**: **Create security group** (should be selected by default)

1. **Security group name**: Enter `shipthis-sg` (or leave auto-generated)
2. **Description**: Enter `Security group for ShipThis application`

#### 8.3 Inbound Security Group Rules

You need to add rules to allow traffic. Click **Add security group rule** for each rule below:

**Rule 1: SSH (Already added by default)**

- **Type**: SSH
- **Protocol**: TCP
- **Port range**: 22
- **Source type**: Select from dropdown:
  - **My IP** (Recommended for security - only your IP can SSH)
  - OR **Anywhere** (0.0.0.0/0) - Less secure but more flexible
- **Description**: SSH access

**Rule 2: HTTP**

1. Click **Add security group rule**
2. **Type**: Select **HTTP** from dropdown
3. **Protocol**: TCP (auto-filled)
4. **Port range**: 80 (auto-filled)
5. **Source type**: Select **Anywhere** (0.0.0.0/0)
6. **Description**: HTTP web traffic

**Rule 3: HTTPS**

1. Click **Add security group rule**
2. **Type**: Select **HTTPS** from dropdown
3. **Protocol**: TCP (auto-filled)
4. **Port range**: 443 (auto-filled)
5. **Source type**: Select **Anywhere** (0.0.0.0/0)
6. **Description**: HTTPS web traffic

**Rule 4: Custom TCP for Backend API**

1. Click **Add security group rule**
2. **Type**: Select **Custom TCP** from dropdown
3. **Protocol**: TCP (auto-filled)
4. **Port range**: Enter `5000`
5. **Source type**: Select **Anywhere** (0.0.0.0/0)
6. **Description**: Backend API

**Your security group rules should look like this:**

```
Type        Protocol    Port Range    Source          Description
SSH         TCP         22            My IP           SSH access
HTTP        TCP         80            0.0.0.0/0       HTTP web traffic
HTTPS       TCP         443           0.0.0.0/0       HTTPS web traffic
Custom TCP  TCP         5000          0.0.0.0/0       Backend API
```

### Step 9: Configure Storage

**What you'll see:** Section for disk space configuration

1. **Size (GiB)**: Change from 8 to **20** (or more if needed)
2. **Volume type**: Select **gp3** (General Purpose SSD - faster and cheaper)
3. **Delete on termination**: Keep checked (recommended)
4. **Encrypted**: Leave unchecked (or check if you want encryption)

> 💡 **Tip**: 20 GB is minimum. For production, consider 30-50 GB.

### Step 10: Advanced Details (Optional)

**You can skip this section** or configure if needed:

1. Click **Advanced details** to expand
2. Most settings can be left as default
3. **Optional**: Add user data script for automatic setup (advanced users only)

---

## 🎯 Part 3: Launch and Connect

### Step 11: Review and Launch

**What you'll see:** Summary section on the right side

1. Review the **Summary** panel on the right:
   - Number of instances: 1
   - Instance type: t2.medium (or your choice)
   - Storage: 20 GiB
   - Security groups: 4 rules

2. **Number of instances**: Leave as **1**

3. Click the orange **Launch instance** button at the bottom right

### Step 12: Launch Status

**What you'll see:** Success message

1. You'll see a green success banner: "Successfully initiated launch of instance"
2. Note the **Instance ID** (looks like `i-0123456789abcdef0`)
3. Click **View all instances** (blue link)

### Step 13: Wait for Instance to Start

**What you'll see:** Instances list

1. You'll see your instance in the list
2. **Instance state** column will show:
   - First: "Pending" (orange) - Wait 1-2 minutes
   - Then: "Running" (green) - Ready to use!
3. **Status check** column will show:
   - First: "Initializing" - Wait 2-3 minutes
   - Then: "2/2 checks passed" - Fully ready!

4. **Important**: Note down these values (click on your instance to see details):
   - **Instance ID**: `i-xxxxxxxxx`
   - **Public IPv4 address**: `xx.xx.xx.xx` (This is your server's IP)
   - **Public IPv4 DNS**: `ec2-xx-xx-xx-xx.compute-1.amazonaws.com`

---

## 🔐 Part 4: Connect to Your Instance

### Step 14: Prepare SSH Key (Mac/Linux)

Open Terminal and run:

```bash
# Navigate to where you saved the key
cd ~/Downloads

# Set correct permissions (REQUIRED)
chmod 400 shipthis-key.pem

# Move to a safe location (optional but recommended)
mkdir -p ~/.ssh
mv shipthis-key.pem ~/.ssh/
```

### Step 15: Connect via SSH

**Method 1: Using Terminal (Mac/Linux)**

```bash
# Replace with your actual key path and IP address
ssh -i ~/.ssh/shipthis-key.pem ubuntu@YOUR_EC2_PUBLIC_IP

# Example:
# ssh -i ~/.ssh/shipthis-key.pem ubuntu@54.123.45.67
```

**Method 2: Using AWS Console (Browser-based)**

1. Go back to EC2 Instances page
2. Select your instance (checkbox)
3. Click **Connect** button at the top
4. Choose **EC2 Instance Connect** tab
5. Click **Connect** button
6. A new browser tab will open with terminal access

**Method 3: Using PuTTY (Windows)**

1. Open PuTTY
2. **Host Name**: `ubuntu@YOUR_EC2_PUBLIC_IP`
3. **Port**: 22
4. **Connection type**: SSH
5. In left panel: **Connection** → **SSH** → **Auth**
6. **Private key file**: Browse and select your `.ppk` file
7. Click **Open**

### Step 16: First Connection

**What you'll see when connecting:**

```
The authenticity of host 'xx.xx.xx.xx' can't be established.
ECDSA key fingerprint is SHA256:xxxxxxxxxxxxx.
Are you sure you want to continue connecting (yes/no)?
```

1. Type `yes` and press Enter
2. You should see:

```
Welcome to Ubuntu 22.04.x LTS
...
ubuntu@ip-xxx-xx-xx-xx:~$
```

**You're now connected to your EC2 instance!** 🎉

---

## 🔒 Part 5: Security Group Management (After Launch)

### How to Modify Security Groups Later

If you need to add/remove rules after launching:

1. **Go to EC2 Dashboard**
2. **Left sidebar**: Click **Security Groups** (under "Network & Security")
3. **Find your security group**: Look for `shipthis-sg`
4. **Select it** (checkbox)
5. **Bottom panel**: Click **Inbound rules** tab
6. **Click**: **Edit inbound rules** button
7. **Add/Remove rules** as needed
8. **Click**: **Save rules**

### Common Security Group Modifications

**To allow only your IP for SSH:**

1. Edit SSH rule (port 22)
2. Change Source from `0.0.0.0/0` to **My IP**
3. Save rules

**To add a custom port:**

1. Click **Add rule**
2. Type: Custom TCP
3. Port range: Your port number
4. Source: 0.0.0.0/0 (or specific IP)
5. Save rules

---

## 📊 Part 6: Monitoring Your Instance

### View Instance Details

1. **EC2 Dashboard** → **Instances**
2. **Click on your Instance ID**
3. You'll see tabs:
   - **Details**: Basic info, IP addresses, instance type
   - **Security**: Security groups, key pair
   - **Networking**: VPC, subnet, network interfaces
   - **Storage**: Attached volumes
   - **Status checks**: Health checks
   - **Monitoring**: CPU, network, disk metrics
   - **Tags**: Your custom tags

### Important Metrics to Monitor

- **CPU Utilization**: Should be < 80% normally
- **Network In/Out**: Traffic to/from your instance
- **Status Checks**: Should show "2/2 checks passed"

---

## 💰 Part 7: Cost Management

### Check Your Costs

1. **Top right corner**: Click your account name
2. Click **Billing Dashboard**
3. View **Month-to-date costs**

### Free Tier Limits

- **t2.micro**: 750 hours/month free (first 12 months)
- **Storage**: 30 GB free
- **Data transfer**: 15 GB out free

### Stop Instance to Save Money

**When not using:**

1. **EC2 Dashboard** → **Instances**
2. **Select your instance**
3. **Instance state** dropdown → **Stop instance**
4. To restart: **Instance state** → **Start instance**

> ⚠️ **Note**: Stopping instance stops compute charges but storage charges continue.

---

## 🆘 Troubleshooting

### Can't Connect via SSH

**Error: "Permission denied (publickey)"**

- Check key file permissions: `chmod 400 your-key.pem`
- Verify you're using correct key file
- Verify username is `ubuntu` (not `root` or `ec2-user`)

**Error: "Connection timed out"**

- Check security group allows SSH (port 22) from your IP
- Verify instance is running (not stopped)
- Check if your IP changed (update security group)

**Error: "Host key verification failed"**

- Remove old key: `ssh-keygen -R YOUR_EC2_IP`
- Try connecting again

### Instance Not Starting

- Wait 5 minutes and refresh
- Check **Status checks** tab for errors
- Try stopping and starting again (not rebooting)

### Can't Access Website

- Verify security group allows HTTP (80) and HTTPS (443)
- Check if nginx is running: `sudo systemctl status nginx`
- Verify application is running: `pm2 status`
- Check firewall: `sudo ufw status`

---

## 📝 Quick Reference

### Instance Details You'll Need

```
Instance ID: i-xxxxxxxxxxxxxxxxx
Public IPv4: xx.xx.xx.xx
Public DNS: ec2-xx-xx-xx-xx.compute-1.amazonaws.com
Key Pair: shipthis-key.pem
Security Group: shipthis-sg
Instance Type: t2.medium
Region: us-east-1 (or your selected region)
```

### Security Group Rules Summary

| Type       | Port | Source    | Purpose     |
| ---------- | ---- | --------- | ----------- |
| SSH        | 22   | My IP     | SSH access  |
| HTTP       | 80   | 0.0.0.0/0 | Web traffic |
| HTTPS      | 443  | 0.0.0.0/0 | Secure web  |
| Custom TCP | 5000 | 0.0.0.0/0 | Backend API |

### Essential Commands

```bash
# Connect to instance
ssh -i ~/.ssh/shipthis-key.pem ubuntu@YOUR_EC2_IP

# Check instance info
curl http://169.254.169.254/latest/meta-data/public-ipv4

# Update system
sudo apt update && sudo apt upgrade -y
```

---

## ✅ Checklist

Before proceeding to application deployment:

- [ ] EC2 instance is running (green status)
- [ ] Status checks show "2/2 checks passed"
- [ ] You have the `.pem` key file saved securely
- [ ] You can SSH into the instance successfully
- [ ] Security group has all 4 required rules
- [ ] You've noted down the Public IPv4 address
- [ ] Instance has at least 20 GB storage
- [ ] You're using t2.medium or better instance type

---

## 🎉 Next Steps

Once your EC2 instance is set up and you can connect via SSH, proceed to:

**[📖 DEPLOYMENT.md](./DEPLOYMENT.md)** - Application deployment guide

This will walk you through:

- Installing dependencies (Python, Node.js, Nginx)
- Deploying backend and frontend
- Configuring Nginx reverse proxy
- Setting up SSL/HTTPS
- Process management with PM2

---

**Need Help?**

- AWS Documentation: https://docs.aws.amazon.com/ec2/
- AWS Support: Available in AWS Console
- Community: Stack Overflow, AWS Forums
