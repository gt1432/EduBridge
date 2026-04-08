const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
require('./database'); // establish db connection on startup

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: 'edubridge_super_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // false for localhost
}));

// Route imports
const authRoutes = require('./routes/auth');
const resourcesRoutes = require('./routes/resources');
const doubtsRoutes = require('./routes/doubts');
const chatRoutes = require('./routes/chat');

// Enable routes
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourcesRoutes);
app.use('/api/doubts', doubtsRoutes);
app.use('/api/chat', chatRoutes);

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
