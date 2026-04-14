User Manager
A simple web app for managing users. You can create, view, edit, and delete users.

What is the project?

User Manager lets you:
View all users
Create new users
View a single user's profile
Edit a user's information
Delete a user

Tech Stack
Node.js, express, mongodb, mongoose, ejs, css, dotenv

How do I set it up locally?

Clone the repository
git clone https://github.com/your-username/hand-in-three.git
cd hand-in-three
Install dependencies
npm install
Create a `.env` file in the root of the project:

MONGODB_URI=mongodb://127.0.0.1:27017/mydb
PORT=3000

Make sure MongoDB is running on your machine:

mongod

How do I run it?

node first.js

Then open your browser and go to:

http://localhost:3000


How do I test it?
There are tests embedded in the code, unit tests. 
And if you try to write for example a duplicate it will throw an error at you.

Project Structure

hand-in-three/
├── public/
│   └── style.css        # Styling
├── views/
│   ├── partials/
│   │   ├── head.ejs     # HTML head
│   │   ├── header.ejs   # Header
│   │   └── footer.ejs   # Footer
│   ├── users/
│   │   ├── index.ejs    # List all users
│   │   ├── show.ejs     # Single user profile
│   │   ├── new.ejs      # Create user form
│   │   └── edit.ejs     # Edit user form
│   └── index.ejs        # Home page
├── .env                 # Environment variables (not committed to git)
├── .gitignore
├── first.js             # Main server file
├── test_app.js          # Automated API tests
└── package.json

Deployment

This app is deployed on Render with a MongoDB Atlas cloud database.
Environment variables (`MONGODB\\\_URI`, `PORT`) are set in Render's Environment tab
Any push to the `master` branch on GitHub triggers an automatic redeploy