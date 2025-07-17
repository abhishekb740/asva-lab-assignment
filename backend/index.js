const express = require('express');
const dotenv = require('dotenv').config();

const app = express();

app.use(express.json());



app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server is running on port ${process.env.SERVER_PORT}`);
});


