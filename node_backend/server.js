require('dotenv').config();
const app = require('./app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`\n🚀 SR4IPR Partners API running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 API Base: http://localhost:${PORT}/api`);
    console.log(`💚 Health: http://localhost:${PORT}/api/health\n`);
  });
};

startServer();
