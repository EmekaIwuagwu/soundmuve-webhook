const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 7000;

// MongoDB connection
const mongoURI = 'mongodb+srv://migospay:5gi9mrI7ICAE40Jj@cluster0.rp3pump.mongodb.net/techguard';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Transaction schema
const transactionSchema = new mongoose.Schema({
    email: {
        type: String,
        max: 255,
    },
    narration: {
        type: String,
        max: 255,
    },
    credit: {
        type: mongoose.SchemaTypes.Number,
    },
    debit: {
        type: mongoose.SchemaTypes.Number,
    },
    amount: {
        type: mongoose.SchemaTypes.Number,
    },
    currency: {
        type: String,
        max: 255,
    },
    status: {
        type: String,
        max: 255,
    },
    balance: {
        type: mongoose.SchemaTypes.Number,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

const Transaction = mongoose.model('Transactions', transactionSchema);

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Webhook endpoint to receive POST requests
app.post('/webhook', async (req, res) => {
    const receivedData = req.body;

    // Log the received data to the console
    console.log('Received webhook request payload:', JSON.stringify(receivedData, null, 2));

    try {
        // Extract relevant fields from the received data
        const { status, email, narration, credit, debit, amount, currency, balance } = receivedData;

        // Create a new transaction document
        const newTransaction = new Transaction({
            email,
            narration,
            credit,
            debit,
            amount,
            currency,
            status, // Save the status to the database
            balance,
        });

        // Save the transaction to the database
        await newTransaction.save();

        // Respond with the message and the saved data
        res.status(200).json({
            message: 'Webhook received and transaction saved!',
            data: newTransaction,
        });
    } catch (error) {
        console.error('Error saving transaction:', error);
        res.status(500).json({
            message: 'Internal server error',
        });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
