const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const { connectKafka } = require('./src/config/kafka');

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
});

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
        
        const port = process.env.SERVER_PORT || 8000;
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();


