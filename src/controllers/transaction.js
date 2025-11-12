import { sql } from "../config/db.js"

export async function getTransactionsByUserId(req, res) {
    const {userId} = req.params
    try {
        const transactions = await sql`
            SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
        `

        return res.status(200).json(transactions)
    } catch (error) {
        console.log("Error getting the transactions", error)
        res.status(500).json({message: "Internal server error"})
    }
}

export async function createTransaction (req, res) {
    try {
        const { title, amount, category, user_id, type} = req.body

        if(!title || !user_id || !category || amount === undefined || !type) {
            return res.status(400).json({message: "All fields are required"})
        }

        const transaction = await sql`
            INSERT INTO transactions(user_id, title, amount, category, type)
            VALUES (${user_id}, ${title}, ${amount}, ${category}, ${type})
            RETURNING *
        `

        res.status(201).json(transaction[0])
    } catch (error) {
        console.log("Error creating the transaction", error)
        res.status(500).json({message: "Internal server error"})
    }
}

export async function deleteTransaction (req, res) {
    
    try {
        const {id} = req.params

        if(isNaN(parseInt(id))) {
            return res.status(400).json({message: "Invalid transaction ID"})
        }

        const result = await sql`
            DELETE FROM transactions WHERE id = ${id} RETURNING *
        `

        if(result.length === 0) {
            return res.status(404).json({message: "Transaction not found"})
        }

        return res.status(200).json({message: "Transaction deleted successfully"})
    } catch (error) {
        console.log("Error deleting the transactions", error)
        res.status(500).json({message: "Internal server error"})
    }
}

export async function getSummaryByUserId (req, res) {
    try {
        const { userId } = req.params

        const balanceResult = await sql`
            SELECT COALESCE(SUM(amount), 0) as balance FROM transactions WHERE user_id = ${userId}
        `

        const incomeResult = await sql`
            SELECT COALESCE(SUM(amount), 0) as income 
            FROM transactions WHERE user_id = ${userId} AND amount > 0
        `

        const expenseResult = await sql`
            SELECT COALESCE(SUM(amount), 0) as expense 
            FROM transactions WHERE user_id = ${userId} AND amount < 0
        `

        return res.status(200).json({
            balance: balanceResult[0].balance, 
            income: incomeResult[0].income, 
            expense: expenseResult[0].expense
        })

    } catch(error) {
        console.log("Error getting the transactions summary", error)
        res.status(500).json({message: "Internal server error"})
    }
}

export async function getTopSpendByUserId (req, res) {
    console.log('demo')
    try {
        const { userId } = req.params;

        const topResult = await sql`
            SELECT category, total_spent
            FROM (
            SELECT 
                user_id,
                category,
                SUM(amount) AS total_spent,
                RANK() OVER (PARTITION BY user_id ORDER BY SUM(amount) ASC) AS rank
            FROM transactions
            WHERE type = 'expense' AND user_id = ${userId}
            GROUP BY user_id, category
            ) ranked
            WHERE rank <= 3;
        `
        return res.status(200).json(topResult)
    } catch (error) {
        console.log("Error getting the transactions", error)
        res.status(500).json({message: "Internal server error"})
    }
}