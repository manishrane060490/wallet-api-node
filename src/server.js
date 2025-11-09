import express from "express"
import dotenv from "dotenv"
import {initDB} from './config/db.js';
import rateLimiter from "./middleware/rateLimiter.js";
import transactionRoutes from "./routes/transactions.js"
import job from "./config/cron.js";

dotenv.config()

const app = express()

const PORT = process.env.PORT || 5001

if(process.env.NODE_ENV === "production") job.start();

app.use(express.json())
app.use(cors({ origin: "*" }));
app.use(rateLimiter)

app.use("/api/transactions", transactionRoutes)

app.get("/api/health", (req, res) => {
    res.status(200).json({status: "ok"});
})


initDB().then(() => {
    app.listen(PORT, () => {
        console.log("server running on PORT:", PORT)
    })
})

