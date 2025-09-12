# Job Automation Service

<img src="https://www.reshot.com/preview-assets/icons/8GJ7ED4K6U/bull-8GJ7ED4K6U.svg" alt="{project_name} Logo" width="50"> Lightweight scheduling microservice for background job automation

## 🌟 Overview

This is a small service (microservice style) designed for **automation and scheduling**.
It allows other services to define, schedule, and organize actions automatically.
The goal is to provide flexibility and dynamic configuration so that developers and DevOps teams can easily manage background jobs, trace logs, and monitor execution.

## ✨ Features

- ⭐ **Queue Management** - Create and manage multiple job queues with priority settings

- ⏰ **Flexible Scheduling** - Schedule jobs with cron syntax, delays, or immediate execution

- 💎 **Modular Helpers** - Extensible helper system for various job types (email, crawling, reports, etc.)

- 🔧 **Dynamic Job Mapping** - Automatic routing to appropriate helper scripts based on job code

- 📊 **Built-in Dashboard** - Bull Board UI for real-time queue monitoring and management

- 🔍 **Comprehensive Logging** - Detailed execution logs and error tracking

- 🗄️ **Dual Storage** - PostgreSQL for job application and Redis for queue performance

## 🎯 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/thaivoth02/jobs-center-api
   cd jobs-center-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Run the application**
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

```

```

## 🙏 Acknowledgments

<a href="https://github.com/OptimalBits/bull">Bull</a> for reliable job processing

<a href="https://github.com/balderdashy/sails?tab=readme-ov-file">Sails.js</a> framework

<a href="https://github.com/felixmosh/bull-board">Bull Board</a for monitoring UI

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/thaivoth02">@thaivoth02</a>
</div>
