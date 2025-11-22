const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import Prisma client for graceful shutdown

const app = express();
const PORT = process.env.PORT || 8000;

// Import routes
const linkRoutes = require('./routes/linkRoutes');
const { redirectLink } = require('./controllers/linkController');

// Middleware
app.use(cors({
    origin: 'https://shorten-url-task.vercel.app',
    credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/healthz', (req, res) => {
  res.status(200).json({
    ok: true,
    version: '1.0'
  });
});

// Use routes
app.use('/api', linkRoutes);

// Redirect endpoint (root level)
app.get('/:code', redirectLink);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

