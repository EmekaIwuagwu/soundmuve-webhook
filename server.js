const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 7000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Webhook endpoint to receive POST requests
app.post('/webhook', (req, res) => {
    const receivedData = req.body;

    // Log the received data to the console
    console.log('Received webhook request:', receivedData);

    // Respond with the message and the received data
    res.status(200).json({
        message: 'Webhook received!',
        data: receivedData
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
