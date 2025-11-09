import express from "express"
import dotenv from "dotenv"
import {initDB} from './config/db.js';
import rateLimiter from "./middleware/rateLimiter.js";
import transactionRoutes from "./routes/transactions.js"

dotenv.config()

const app = express()


app.use(express.json())
app.use(rateLimiter)

app.use("/api/transactions", transactionRoutes)

const PORT = process.env.PORT || 5001

initDB().then(() => {
    app.listen(PORT, () => {
        console.log("server running on PORT:", PORT)
    })
})

