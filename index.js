import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './database/db.js'; 
import Razorpay from 'razorpay' 
import cors from "cors"


dotenv.config();

export const instance =new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret:process.env.RAZORPAY_SECRET,
})
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.get("/",(req,res) => {
  // console.log("Hello World");
    res.send("Hello World");
})

app.use("/uploads",express.static("uploads"));

//importing routes
import userRoutes from './routes/user.js';
import courseRoutes from './routes/course.js';
import adminRoutes from './routes/admin.js';

//using routes
app.use("/api", userRoutes);
app.use("/api", courseRoutes);
app.use("/api", adminRoutes);

 app.listen(port, () => {
  console.log(`Server is running on port ${port}`); 
  connectDB(); 
});

