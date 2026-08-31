import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import databaseConnection from './config/databaseConnection.js';
import router from './routes/route.js';
import HttpStatus from './constants/http-status.constant.js';
import ToastyConstant from './constants/toasty.constant.js';
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 5000;

//  CORS
app.use(cors({
  origin: true,
  credentials: true
}));

app.options('*', cors());

app.use(express.json());
app.use(cookieParser());

//  Debug middleware
app.use((req, res, next) => {
  console.log(" Incoming Request:", req.method, req.url);
  next();
});

//  Routes
// Resolve the uploads directory relative to this file (not process.cwd()) so
// static file serving works no matter which directory `node`/`nodemon` is launched from.
app.use('/api', express.static(path.join(__dirname, process.env.UPLOAD_DIRECTORY || 'uploads')));
app.use("/api", router);

app.get("/", (req, res) => {
  res.send("Server Running Successfully");
});

//  404 handler for unmatched API routes
app.use((req, res) => {
  res.status(HttpStatus.NOT_FOUND).json({ status: false, message: "Route not found" });
});

//  Central error handler (multer errors, uncaught route errors, etc.)
app.use((err, req, res, next) => {
  console.error(" ERROR:", err);
  if (err && err.message && err.message.includes("allowed")) {
    // File-type/validation errors thrown by multer's fileFilter
    return res.status(HttpStatus.BAD_REQUEST).json({ status: false, message: err.message });
  }
  if (err && err.code === "LIMIT_FILE_SIZE") {
    return res.status(HttpStatus.BAD_REQUEST).json({ status: false, message: "File is too large. Maximum size is 5MB." });
  }
  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    status: false,
    message: ToastyConstant.SERVER.INTERNAL_SERVER_ERROR
  });
});


const startServer = async () => {
  try {
    await databaseConnection(
      process.env.DATABASE_URL,
      process.env.DATABASE_NAME
    );

    app.listen(PORT, () => {
      console.log(`🚀 Server Listening at ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};


startServer();