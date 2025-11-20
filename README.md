# 🍽️ Fine Dine Backend

A powerful and minimal backend API for the **Fine Dine** application.  
Built using **Node.js**, **Express**, **MongoDB**, and **JWT authentication**, this backend handles user authentication, menu management, category management, cart operations, and image uploads.

---

## 📌 Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [API Endpoints](#api-endpoints)
  - [Auth Routes](#auth-routes)
  - [Menu Routes](#menu-routes)
  - [Cart Routes](#cart-routes)
  - [Category Routes](#category-routes)
- [Image Upload Handling](#image-upload-handling)
- [Security](#security)
- [License](#license)

---

## 🌟 Introduction

The **Fine Dine Backend** is the core API powering the Fine Dine Menu platform.  
It provides secure authentication, menu CRUD operations with image uploads, category management, and a complete cart system.  
All APIs are structured, modular, and optimized for scalability.

---

## ✨ Features

### 🔐 Authentication

- Register / Login
- JWT-based authentication
- Update profile
- Delete account
- Get logged-in user

### 🍽️ Menu Management

- Create menu items with image uploads
- Edit menu items
- Delete menu items
- Get specific menu item
- Get current user's menu items
- Public route for all menu items

### 🗂️ Category Management

- Create category
- Fetch all categories

### 🛒 Cart System

- Add to cart
- Remove item from cart
- Update quantity
- Clear entire cart
- Fetch user cart

### 📁 File Uploads

- Supports uploading up to **5 images**
- Multer-based secure upload system
- Upload directory auto-creates if missing

---

## 🛠️ Tech Stack

**Backend**

- Node.js
- Express
- MongoDB & Mongoose
- JWT (jsonwebtoken)
- Multer (image uploads)
- bcryptjs (password hashing)
- dotenv
- CORS
- Morgan (logging)
- Dayjs (date formatting)

**Developer Tools**

- Nodemon
- Chalk

---

## 📁 Folder Structure

```markdown
src/
├── controllers/
│ ├── authController.js
│ ├── cartController.js
│ ├── categoryController.js
│ └── menuController.js
│
├── middlewares/
│ ├── auth.js # JWT protection
│
├── routes/
│ ├── auth.js
│ ├── menu.js
│ ├── cart.js
│ ├── category.js
│ └── api.js # Unified API router
│
├── server.js
└── config/
└── database.js
```


## ⚙️ Installation

**Clone the repository:**


```bash
git clone https://github.com/ahbab-zaman/finedine-backend
cd fine-dine-b
npm install
npm run dev
```

---

# 🔐 AUTH API  
### **Route Prefix:** `/api/auth`

| Method | Endpoint | Body / Query | Protected | Description |
|--------|----------|--------------|-----------|-------------|
| **POST** | `/register` | `{ name, email, password }` | ❌ | Register new user |
| **POST** | `/login` | `{ email, password }` | ❌ | Login user |
| **GET** | `/me` | – | ✔️ | Get current logged-in user |
| **PUT** | `/me` | `{ name?, email?, password? }` | ✔️ | Update profile |
| **DELETE** | `/me` | – | ✔️ | Delete account |

---

# 🍽️ MENU API  
### **Route Prefix:** `/api/menus`

| Method | Endpoint | Body / Params | Protected | Description |
|--------|----------|----------------|-----------|-------------|
| **POST** | `/` | `FormData: { images[], ...fields }` | ✔️ | Create a menu item (supports up to 5 images) |
| **GET** | `/me` | – | ✔️ | Get all menu items owned by logged-in user |
| **GET** | `/:id` | `menuId` | ❌ | Get single menu item |
| **PUT** | `/:id` | `FormData: { images[], ...fields }` | ✔️ | Update menu item |
| **DELETE** | `/:id` | `menuId` | ✔️ | Delete menu item |
| **GET** | `/` | – | ❌ | Get all menu items (public) |

---

# 🛒 CART API  
### **Route Prefix:** `/api/cart`

> **Note:** All cart routes are protected with JWT.

| Method | Endpoint | Body / Params | Description |
|--------|----------|----------------|-------------|
| **GET** | `/` | – | Get user cart |
| **POST** | `/` | `{ menuItemId, quantity }` | Add item to cart |
| **PUT** | `/:cartItemId` | `{ quantity }` | Update cart item quantity |
| **DELETE** | `/:cartItemId` | – | Remove item from cart |
| **POST** | `/clear` | – | Clear entire cart |

---

# 🗂️ CATEGORY API  
### **Route Prefix:** `/api/category`

| Method | Endpoint | Body | Description |
|--------|----------|-------|-------------|
| **GET** | `/` | – | Fetch all categories |
| **POST** | `/` | `{ name }` | Create a new category |

---

