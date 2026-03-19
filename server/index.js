import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import databaseConnection from './config/databaseConnection.js';
import router from './routes/route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://smartpost-iota.vercel.app",
      "https://smartpost-bqaawqse5-vishnu-chaurasiyas-projects.vercel.app",
      "https://smartpost-avgum3ze6-vishnu-chaurasiyas-projects.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ VERY IMPORTANT (preflight fix)
app.options("*", cors());

databaseConnection(process.env.DATABASE_URL, process.env.DATABASE_NAME);

app.use(express.json());
app.use(cookieParser());

app.use('/api', express.static("uploads"));
app.use("/api", router);

app.get("/", (req, res) => {
  res.send("Server Running Successfully");
});

app.listen(PORT, () => {
  console.log(`Server Listening at ${PORT}`);
});