# 💸 SpendSense — MERN Full Stack Expense Tracker

React + Tailwind CSS + Node.js + Express + MongoDB (ES6 Modules)

---

## ✨ Features
- 📊 Dashboard — total, avg, top category, category bars
- ➕ Add expense with **auto current date/time** or **manually pick date & time**
- 🗑️ Delete any expense
- 🔍 Filter by category
- 🗓️ **Auto-delete after 30 days** via MongoDB TTL index
- ⏱️ Shows "X days left" countdown on each expense
- 🌙 Dark theme, mobile-friendly

---

## 🚀 How to Run

### Prerequisites
- Node.js (https://nodejs.org)
- MongoDB running locally OR MongoDB Atlas free account

---

### Step 1 — Setup Backend

```bash
cd backend
cp .env.example .env
```

Open `backend/.env` and set your MongoDB URI:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/spendsense
```

Install and run:
```bash
npm install
npm run dev
```
Backend runs on: **http://localhost:5000**

---

### Step 2 — Setup Frontend

Open a NEW terminal:
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: **http://localhost:5173**

---

### Step 3 — Open App
Visit **http://localhost:5173** in your browser ✅

---

## 🔄 Run Both Together (from root)

```bash
npm install
npm run install:all
npm run dev
```

---

## 🗓️ Auto-Delete (30 Days)
MongoDB TTL index on `expiresAt` field automatically removes each expense 30 days after its date. Each expense row shows how many days remain before deletion.

---

## 🌐 API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/expenses | Get all expenses |
| GET | /api/expenses?category=Food | Filter by category |
| GET | /api/expenses/summary | Dashboard stats |
| POST | /api/expenses | Add new expense |
| PUT | /api/expenses/:id | Update expense |
| DELETE | /api/expenses/:id | Delete expense |

---

## 🛠 Tech Stack
- **Frontend:** React 18, Tailwind CSS 3, Vite 5, Axios
- **Backend:** Node.js, Express 4, Mongoose 8, ES6 Modules
- **Database:** MongoDB (TTL index for auto-expiry)
