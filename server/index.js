import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import databaseConnection from './config/databaseConnection.js';
import router from './routes/route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// ✅ Allow ALL origins temporarily (debug purpose)
app.use(cors({
  origin: true,
  credentials: true
}));

// ✅ Handle preflight requests
app.options('*', cors());

app.use(express.json());
app.use(cookieParser());

// ✅ Debug middleware (VERY IMPORTANT)
app.use((req, res, next) => {
  console.log("🔥 Incoming Request:", req.method, req.url);
  next();
});

databaseConnection(process.env.DATABASE_URL, process.env.DATABASE_NAME);

app.use('/api', express.static("uploads"));
app.use("/api", router);

app.get("/", (req, res) => {
  res.send("Server Running Successfully");
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err);
  res.status(500).json({
    status: false,
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`Server Listening at ${PORT}`);
});