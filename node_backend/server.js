require("dotenv").config();

process.on("uncaughtException", (err) => {
  console.error("❌ UNCAUGHT EXCEPTION! Shutting down...");
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

const app = require("./app");
const connectDB = require("./src/config/db");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 5000;
let server;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    server = app.listen(PORT, () => {
      console.log("=================================");
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`📡 API: http://localhost:${PORT}`);
      console.log("=================================");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ UNHANDLED REJECTION! Shutting down gracefully...");
  console.error(err.name, err.message, err.stack);
  if (server) {
    server.close(() => {
      mongoose.connection.close().then(() => {
        process.exit(1);
      }).catch(() => {
        process.exit(1);
      });
    });
  } else {
    process.exit(1);
  }
});

// Graceful shutdown on termination signals
const gracefulShutdown = (signal) => {
  console.log(`\n📶 ${signal} received. Starting graceful shutdown...`);
  if (server) {
    server.close(() => {
      console.log("🔒 HTTP server closed.");
      mongoose.connection.close().then(() => {
        console.log("💾 MongoDB connection closed.");
        process.exit(0);
      }).catch(() => {
        process.exit(0);
      });
    });
  } else {
    process.exit(0);
  }
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));