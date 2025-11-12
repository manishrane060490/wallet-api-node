import express from 'express'
import { createTransaction, deleteTransaction, getTransactionsByUserId, getSummaryByUserId, getTopSpendByUserId } from '../controllers/transaction.js'

const router = express.Router()

router.post("/", createTransaction)

router.get("/:userId", getTransactionsByUserId)

router.delete("/:id", deleteTransaction)

router.get("/summary/:userId", getSummaryByUserId)

router.get("/getTopSpend/:userId", getTopSpendByUserId)

export default router