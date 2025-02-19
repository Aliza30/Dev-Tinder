const express = require('express');
const app = express();

app.get("/", (req, res) => {
    res.send('Response from 3000'); // Send response
});

app.get('/test', (req, res) => {
    console.log('Hello from /hello');
    res.send('Running Test'); // Send response
});

app.get('/hello', (req, res) => {
    console.log('Hello from /hello');
    res.send('Hello, World!'); // Send response
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
