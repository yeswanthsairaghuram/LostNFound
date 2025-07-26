# 🔍 Lost & Found - Campus Item Recovery Platform

Lost & Found is a web application built to help students and staff easily **report lost items**, **submit found items**, and **reconnect lost belongings with their rightful owners**. The platform includes secure authentication and admin moderation for smooth and reliable item verification.

## 🌟 Features

- 🔐 **User Authentication**
  - Login and Register securely.
  - Session-based user management.

- 📢 **Report Lost Items**
  - Users can submit a lost report with relevant details (item name, description, location, date, etc.).
  - Option to upload an image for better identification.

- 🎯 **Report Found Items**
  - Users can report found items with detailed information and photo uploads.
  - Matching system to notify if similar lost items exist.

- 🛂 **Admin Approval System**
  - Admin panel to review both lost and found item submissions.
  - Admin approves or rejects items after verifying the submitted details.
  - Notification system to inform users once approved.

- 🔄 **Matching System**
  - Helps to identify potential matches between reported lost and found items.

- 📱 **Responsive UI**
  - Fully optimized for mobile, tablet, and desktop.

## 🛠️ Tech Stack

**Frontend**  
- React.js  
-  CSS3  
- Axios

**Backend**  
- Node.js  
- Express.js  
- MongoDB (Mongoose)

**Authentication**  
- JWT-based user authentication

**Image Uploads**  
- Multer (for file handling)

## ⚙️ Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/lost-and-found.git
   cd lost-and-found

2. Install dependencies for both frontend and backend:
   ```bash
    cd frontend
    npm install
    cd ../server
    npm install

3. Create a .env file in the server directory with the following content:
    ```bash
    MONGO_URI=your_mongo_db_connection_string
    JWT_SECRET=your_secret_key

4. Start the application:
In one terminal:
    ```bash
    cd server
    npm start
    
In another terminal:
  ```bash
   cd frontend
   npm run dev


