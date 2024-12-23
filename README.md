# Restaurant Management System

A full-stack Restaurant Management System designed by using React.js, Node.js, MongoDB and Elasticsearch

## Features

- **Restaurant Management**: Add, update and delete restaurants and view their details such as name, category, address, phone, photo, and details.
- **Search Functionality**: Leverage Elasticsearch to perform searches by restaurant name or category.
- **Real-Time Indexing**: Automatically index restaurant data in Elasticsearch when created, updated, or deleted in MongoDB.

## Technologies Used

- **Frontend**: React.js
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Search Engine**: Elasticsearch

## Installation Guide

### Steps to Run the Project

1. **Clone the Repository & Change Directory**:

   ```bash
   git clone https://github.com/zs-akkaya/RestaurantManagementSystem.git
   
   cd RestaurantManagementSystem
   ```

2. **Install Dependencies**:

   Navigate to the backend folder and install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

   Navigate to the frontend folder and install frontend dependencies:

   ```bash
   cd frontend
   npm install
   ```

3. **Configure `backend/server.js` file**:

   - Ensure Elasticsearch is running on `localhost:9200/`.
   - Ensure MongoDB is running on `localhost:27017`.
   - Do not forget to change `backend/server.js` line 20 with your own password.
  
4. **Run the Backend Server**:

   ```bash
   cd backend
   node server.js
   ```

   You should see this output:
   ```bash
   Server is running on http://localhost:5001
   MongoDB connected
   Elasticsearch connected
   Restaurants index created.
   ```

6. **Run the Frontend in a separate Terminal**:

   ```bash
   cd frontend
   npm start
   ```