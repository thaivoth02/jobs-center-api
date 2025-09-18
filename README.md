# Job Automation Service

<div align="center">
  <img src="https://www.reshot.com/preview-assets/icons/8GJ7ED4K6U/bull-8GJ7ED4K6U.svg" alt="{project_name} Logo" width="50" height="50">

  <p>
    <strong>Lightweight RESTful service for background job automation</strong>
  </p>
</div>

## 🌟 Overview

This is a small service, built in a microservice style, for **automation and scheduling**.  
It provides RESTful APIs to define, schedule, and organize background jobs.  
The goal is to keep things flexible and configurable so developers can manage jobs, trace logs, and monitor execution with ease.

## 🛠️ Built With

*   **Backend Framework:** [Sails.js](https://sailsjs.com/) (Node.js)
*   **Queue Engine:** [Bull](https://optimalbits.github.io/bull/) (Redis)
*   **Primary Database:** PostgreSQL
*   **Dashboard:** [Bull-Board](https://github.com/felixmosh/bull-board)
*   **Language:** JavaScript

## ✨ Features

- ⭐ **Queue Management** - External queue and job management via RESTful APIs

- ⏰ **Flexible Scheduling** - Adaptive job scheduling with human-friendly JSON converted to cron syntax or immediate execution

- 💎 **Modular Helpers** - Extensible helper system for various job types

- 🔧 **Dynamic Job Mapping** - Automatic job routing to appropriate helper scripts based on job code

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
jobs-center-api/
├── api/
│   ├── controllers/         # Route controllers
│   │   ├── job/             # Job management endpoints
│   │   ├── queue/           # Queue management endpoints
│   │   └── log/             # Log management endpoints
│   ├── helpers/             # Job action implementations
│   │   ├── bull/            # Bull integration helpers
│   │   ├── job/             # Job management helpers
│   │   ├── queue/           # Queue management helpers
│   │   └── log/             # Log management helpers
│   │   ├── redis/           # Redis client management
│   │   └── util/            # Utility functions
│   ├── models/              # Database models
│   ├── hooks/               # Sails.js hooks
│   │   ├── bull-board.js    # Bull Board UI integration
│   │   └── axios/           # HTTP client configuration
│   └── policies/            # Authorization policies
├── config/                  # Application configuration
│   ├── queue.js             # BullMQ queue configuration
│   ├── datastores.js        # Database connections
│   ├── routes.js            # API route definitions
│   └── env/                 # Environment-specific configs
├── test/                    # Test suites
│   ├── integrations/        # Integration tests
│   └── lifecycle.test.js    # Application lifecycle tests
└── views/                   # Frontend templates (if needed)

```

## 🙏 Acknowledgments

<a href="https://github.com/OptimalBits/bull">Bull</a> for reliable job processing

<a href="https://github.com/balderdashy/sails?tab=readme-ov-file">Sails.js</a> framework

<a href="https://github.com/felixmosh/bull-board">Bull Board</a> for monitoring UI

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/thaivoth02">@thaivoth02</a>
</div>
