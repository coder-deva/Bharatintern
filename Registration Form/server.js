const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3003;

// Connect to MongoDB and specify the database name
mongoose.connect('mongodb+srv://deva:deva1234@cluster0.mnpgtme.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    // useNewUrlParser: true, // Deprecated and no longer needed
    // useUnifiedTopology: true // Deprecated and no longer needed
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit the application if unable to connect to MongoDB
});


// Create a schema for user data
const userSchema = new mongoose.Schema({
    username: String,
    firstName: String,
    lastName: String,
    email: String,
    password: String
}, { collection: 'users' }); // Set the collection name explicitly to 'users'

// Define the collection name explicitly
const User = mongoose.model('User', userSchema); // Use a more descriptive model name

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route to handle form submission
app.post('/signup', async (req, res) => {
    try {
        const newUser = new User({
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        });

        // Save the new user to the database
        await newUser.save();

        console.log('User created:', newUser);
        res.status(201).send('User created successfully!');
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).send('Internal Server Error');
    }
});


// Serve static files (assuming index.html is in the 'public' directory)
app.use(express.static('public'));

// Homepage route to serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});