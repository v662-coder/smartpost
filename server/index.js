import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import databaseConnection from './config/databaseConnection.js';
import router from './routes/route.js';
const HttpStatus = require("../server/constants/http-status.constant.js");
const ToastyConstant = require("../server/constants/toasty.constant");
dotenv.config();

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
app.use('/api', express.static("uploads"));
app.use("/api", router);

app.get("/", (req, res) => {
  res.send("Server Running Successfully");
});

//  Error handler
app.use((err, req, res, next) => {
  console.error(" ERROR:", err);
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