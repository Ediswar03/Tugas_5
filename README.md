# User Management System (Backend & Frontend)

This project is a simple User Management System built with Node.js, Express, and MySQL on the backend, and Vue.js on the frontend.

## Features
- **CRUD Operations**: Create, Read, Update, and Delete users.
- **Authentication**: Secure Login and Registration using JWT and Bcrypt.
- **Search & Pagination**: Efficient data browsing.
- **Data Visualization**: Bar chart showing user distribution by email domain.
- **Export Data**: Professional reports in CSV, Excel, and PDF formats.

## Setup
1. Clone the repository.
2. Install dependencies: `npm install`.
3. Create a MySQL database named `fullstack`.
4. Run the SQL script below to create the table:
   ```sql
   CREATE TABLE users (
       id INT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(100),
       email VARCHAR(100) UNIQUE,
       phone VARCHAR(20),
       password VARCHAR(255),
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```
5. Configure database in `config/db.js`.
6. Start the server: `node server.js`.
7. Access `http://localhost:3000`.

## Seed Data
Run `node seed.js` to add dummy users for testing graphs and reports.
