# Smart Leads CRM

A full-stack Customer Relationship Management (CRM) application.

## 🚀 Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS v4
- **Backend:** Node.js, Express, TypeScript
- **Database:** MongoDB (Atlas or Local via Docker)
- **Deployment:** Docker & Docker Compose

---

## 🛠️ Setup Instructions

### ⚙️ Environment Configuration

Before running the application, ensure your `.env` files are properly configured in both the Frontend and Backend folders.

#### 1. Backend (`./Backend/.env`)
This file is read automatically by Docker Compose to configure your backend container.

```env
PORT=5000
NODE_ENV=development
# Your MongoDB Atlas URI. If left blank, it will default to the local Docker MongoDB container.
MONGO_URI=mongodb+srv://<your_username>:<your_password>@<your_cluster>.mongodb.net/smart-leads
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
# Crucial for CORS when running via Docker
CLIENT_ORIGIN=http://localhost
```

#### 2. Frontend (`./Frontend/.env`)
Configures the frontend to talk to your local backend container.

```env
VITE_API_URL=http://localhost:5000/api
```

### 🐳 Running the Project (Docker)

Ensure **Docker Desktop** is open and running on your machine.

1. Open a terminal in the root directory (where `docker-compose.yml` is located).
2. Run the following command to build the images and start the containers in the background:
   ```bash
   docker compose up -d --build
   ```

**Accessing the Application:**
- **Frontend App:** [http://localhost](http://localhost) (Mapped to Port 80)
- **Backend API:** [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **Local Database (Optional):** `mongodb://localhost:27017`

**Managing Containers:**
- **To stop the project:** `docker compose down`
- **To view live logs:** `docker compose logs -f`
- **To check container status:** `docker compose ps`

---

## 💻 Running Locally (Without Docker)

If you need to run the servers manually for development:

1. **Start Backend:**
   ```bash
   cd Backend
   npm install
   npm run dev
   ```
   *(Note: You will need to temporarily change `CLIENT_ORIGIN=http://localhost:5173` in your Backend `.env` if you do this).*

2. **Start Frontend:**
   ```bash
   cd Frontend
   npm install
   npm run dev
   ```

---

## 📚 API Documentation

Base URL: `http://localhost:5000/api`

### 🔒 Auth Routes (`/api/auth`)
- `POST /register` - Register a new user
- `POST /login` - Login to an existing account
- `GET /me` - Get current authenticated user details (Requires Token)

### 👥 Lead Routes (`/api/leads`)
*Note: All Lead routes require an authentication token.*

- `GET /` - Retrieve all leads (Supports Pagination, Filtering, Searching, & Sorting)
  - *Example:* `/api/leads?page=1&limit=10&status=New&source=Website&search=John&sort=latest`
- `GET /export` - Export all leads as a CSV file
- `GET /:id` - Retrieve a single lead by ID
- `POST /` - Create a new lead
- `PUT /:id` - Update an existing lead by ID
- `DELETE /:id` - Delete a lead by ID (⚠️ Admin Role Required)

### 🩺 System
- `GET /health` - API Health check (Returns `{ success: true, message: "Smart Leads API is running." }`)
