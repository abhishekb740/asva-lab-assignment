const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const { connectKafka } = require('./src/config/kafka');

const app = express();

app.use(express.json());

const authRoutes = require('./src/api/routes/auth');
const projectRoutes = require('./src/api/routes/projects');
const taskRoutes = require('./src/api/routes/tasks');

app.use('/auth', authRoutes);
app.use('/projects', projectRoutes);
app.use('/projects/:projectId/tasks', taskRoutes);

app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'AsvaLabs Assignment API is running',
        timestamp: new Date().toISOString()
    });
});

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to AsvaLabs Assignment API',
        version: '1.0.0',
    });
});

async function startServer() {
    try {
        connectKafka();
        
        app.listen(process.env.SERVER_PORT, () => {
            console.log(`Server is running on port ${process.env.SERVER_PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();


