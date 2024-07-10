const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// MongoDB connection
mongoose.connect('mongodb+srv://deva:deva1234@cluster0.mnpgtme.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// Define a schema for transactions
const transactionSchema = new mongoose.Schema({
    type: { type: String, required: true },
    amount: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// Middleware to parse JSON bodies
app.use(express.json());

// Route to handle form submissions
app.post('/transactions', async (req, res) => {
    const { type, amount } = req.body;

    try {
        // Create a new transaction
        const transaction = new Transaction({ type, amount });

        // Save the transaction to MongoDB
        await transaction.save();

        // Respond with the saved transaction data
        res.status(201).json(transaction);

    } catch (error) {
        console.error('Error saving transaction:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to fetch all transactions
// Route to fetch all transactions and calculate income, expense, and balance
app.get('/transactions', async (req, res) => {
    try {
        // Fetch all transactions from MongoDB
        const transactions = await Transaction.find();

        // Initialize income and expense variables
        let income = 0;
        let expense = 0;

        // Calculate income and expense
        transactions.forEach(({ type, amount }) => {
            if (type === 'income') {
                income += amount;
            } else if (type === 'expense') {
                expense += amount;
            }
        });

        // Calculate balance
        const balance = income - expense;

        // Respond with income, expense, and balance
        res.status(200).json({ income, expense, balance });

    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
