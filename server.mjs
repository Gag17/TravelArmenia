// server.mjs
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log('Current working directory:', process.cwd());

const usersFilePath = './users.json'; // Define usersFilePath

// Function to load users from JSON file
const loadUsers = async () => {
    try {
        const usersData = await fs.promises.readFile(usersFilePath, 'utf8');
        const parsedData = JSON.parse(usersData);
        console.log('Parsed users data:', parsedData);
        return parsedData;
    } catch (error) {
        console.error('Error loading users:', error.message);
        return [];
    }
};


// Save user data to the JSON file
const saveUsers = (users) => {
    try {
        const data = JSON.stringify(users, null, 2);
        const filePath = path.join(__dirname, 'users.json');

        // Use synchronous writeFileSync to ensure data is written before continuing
        fs.writeFileSync(filePath, data);
        console.log('Users saved successfully.');
        console.log('Saved users data:', data);
        console.log('File path:', filePath);
    } catch (error) {
        console.error('Error saving users:', error);
    }
};

// Define the publicPath variable
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicPath = path.join(__dirname, 'public');

// Serve static files from the "public" directory
app.use(express.static(publicPath));

// Serve the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// Serve the signup page
app.get('/signup', (req, res) => {
    res.sendFile('signup.html', { root: publicPath });
});
// Handle user signup
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Load existing users
        const users = await loadUsers();
        console.log('Users from loadUsers:', users);

        // Additional logging
        console.log('Type of users:', typeof users);
        console.log('Is users an array?', Array.isArray(users));

        // Check if the username is already taken
        if (users.some(user => user.username === username)) {
            // Display an error message and allow retry
            console.log('Username already taken');
            return res.sendFile('signup_retry.html', { root: publicPath });
        }

        // Add the new user to the list
        const newUser = { username, password };
        users.push(newUser);

        // Save the updated user list
        await saveUsers(users);

        // Log the new user for verification
        console.log('New user signed up:', newUser);

        // Redirect to the website page after signup
        res.redirect('/');
    } catch (error) {
        console.error('Error in signup:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Serve the login page
app.get('/login', (req, res) => {
    res.sendFile('login.html', { root: publicPath });
});
// Handle user login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    console.log('Received login request:', { username, password });

    // Load existing users
    const users = await loadUsers();

    console.log('Loaded users:', users);

    // Find the user by username (case-sensitive for now)
    const user = users.find(user => user.username === username);

    console.log('Found user:', user);

    if (!user || user.password !== password) {
        console.log('Incorrect username or password');
        // Display an error message and retry
        return res.sendFile('login-retry.html', { root: publicPath });
    }

    // Password is correct, redirect to the first page
    console.log('Login successful');
    res.redirect('/');
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
