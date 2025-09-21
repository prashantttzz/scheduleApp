import express from "express";
import dotenv from "dotenv";
import slotRoutes from "./routes/slots.js";
import cors from "cors";
dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.use("/slots", slotRoutes);
app.get('/', (req, res) => res.send('Scheduler API running!'));
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
