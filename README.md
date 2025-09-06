# Recipe Ideas for Taylor

This is a full-stack web application built to solve the user need of finding recipe ideas based on a list of available ingredients. The project was developed as a take-home challenge, focusing on building a robust user-friendly interface and a scalable backend solution.

## Live Demo
[ https://recipie-ideas-fuwtiphk4-sidd1224s-projects.vercel.app/ ]

## Features
- **Multi-Ingredient Search**: Users can enter a comma-separated list of ingredients to find matching recipes.
- **Backend Logic**: A custom Node.js backend fetches data from the external TheMealDB API and performs the logic to find recipes that contain all specified ingredients.
- **Dynamic UI**: The interface displays recipe results in a clean, responsive grid.
- **Loading & Error States**: The application provides clear feedback to the user, showing a loading indicator during searches and displaying friendly messages if no recipes are found or if a network error occurs.
- **Modern Design**: The UI is styled with a professional, dark-themed aesthetic and includes interactive hover effects for a better user experience.
- **Fully Containerized**: The entire application (frontend and backend) can be built and run using Docker and Docker Compose for a consistent and isolated development environment.

## Architectural Choice: Backend-for-Frontend (BFF)
While the challenge allowed for a frontend-only solution, I chose to implement a Backend-for-Frontend (BFF) architecture to better address the user's complex needs and to demonstrate my backend development skills.

**The Problem**: The user, Taylor, wants to find recipes based on multiple ingredients. The provided API (TheMealDB) only allows searching for one ingredient at a time.

**The Solution**: A custom Node.js (Express) server was created to act as a middleman.

- The React frontend sends a single request to our BFF with all the ingredients.
- The BFF then makes multiple parallel requests to TheMealDB API, one for each ingredient.
- It processes the results, calculating the intersection (recipes common to all lists) on the server.
- Finally, it sends a clean, consolidated list of matching recipes back to the frontend.

This approach not only solves the user's problem elegantly but also demonstrates skills in API orchestration, data manipulation, and building scalable server-side logic.

## Technology Stack

**Frontend:**
- React
- CSS3 (with modern layout techniques like Flexbox and Grid)

**Backend:**
- Node.js
- Express.js
- node-fetch for making requests to the external API

**Development & Deployment:**
- Docker & Docker Compose

## Getting Started

You can run this project locally using two methods: with Docker (recommended for consistency) or with Node.js directly.

### Option 1: Running with Docker (Recommended)
This is the simplest way to get the entire application running.

**Prerequisites:**
- Docker Desktop installed and running.

**Instructions:**
```bash
# Clone the repository
git clone [https://github.com/sidd1224/recipie-ideas.git]

# Navigate to the project's root directory
cd recipe-ideas

# Build and start the containers
docker-compose up --build
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Option 2: Running Locally with Node.js

**Prerequisites:**
- Node.js (v16 or later)
- npm

**Instructions:**
```bash
# Clone the repository and navigate to the root directory

# Set up the Backend
cd server
npm install
npm start
```
The server will be running on [http://localhost:5001](http://localhost:5001).

```bash
# Set up the Frontend (in a new terminal)
cd client
npm install
npm start
```
The application will be available at [http://localhost:3000](http://localhost:3000).

## Folder Structure

The project is organized into two main parts in a monorepo structure:

- `/client`: Contains the React frontend application.
- `/server`: Contains the Node.js/Express backend server.
