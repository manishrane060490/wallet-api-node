import express from 'express'
import { createTransaction, deleteTransaction, getTransactionsByUserId, getSummaryByUserId } from '../controllers/transaction.js'

const router = express.Router()

router.post("/", createTransaction)

router.get("/:userId", getTransactionsByUserId)

router.delete("/:id", deleteTransaction)

router.get("/summary/:userId", getSummaryByUserId)

export default router