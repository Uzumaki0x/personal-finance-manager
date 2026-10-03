const express = require("express");
const cors = require("cors");
const pool = require("./db");
const app = express();
app.use(cors());
app.use(express.json());
app.get("/" , (req,res) => {res.send("Radhe Radhe! From Finance Manager Backend!")});

const exchangeRates = { USD : 83 , EUR : 93 , GBP : 110 , INR : 1 } ;
function mapTransaction(row){return {id:Number(row.id),merchant:row.merchant,category:row.category,amount:Number(row.amount),currency:row.currency,baseAmount:Number(row.base_amount),baseCurrency:row.base_currency,exchangeRate:Number(row.exchange_rate),date:row.date,type:row.type,rateTimestamp:row.rate_timestamp};}
app.post("/api/transactions",(req,res)=>{
    console.log(req.body);

    if(req.body.amount === undefined || typeof req.body.amount !== "number" || req.body.amount <= 0 )
    {
    return res.status(400).json({message: "Invalid amount"});
    }
    if( typeof req.body.currency !== "string" || exchangeRates[req.body.currency] === undefined ) 
    {
        return res.status(400).json({message: "Invalid or unsupported currency"});
    }
    if( req.body.type !== "income" && req.body.type !== "expense" ){
        return res.status(400).json({message:"Invalid transaction type"});
    }
    if(typeof req.body.merchant !== "string" || req.body.merchant.trim()  === "" || req.body.merchant.length > 100 ){
        return res.status(400).json({message:"Invalid merchant"});
    }
    if( typeof req.body.category !== "string" || req.body.category.trim() === "" || req.body.category.length > 50 ){
        return res.status(400).json({message:"Invalid category"});
    }
    if( typeof req.body.date !== "string" || req.body.date.trim() === "" ) {
        return res.status(400).json({message:"Invalid date"});
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(req.body.date)) {
    return res.status(400).json({ message: "Invalid date format" });
    }
    const input = req.body.date;
    const [year , month , day] = input.split("-").map(Number);
    const date = new Date(input);
    if(date.getFullYear()!== year||date.getMonth()+1!==month||date.getDate()!==day){
        return res.status(400).json({message:"Invalid date"});
    }
    const exchangeRate = exchangeRates[req.body.currency] ;
    const baseAmount = exchangeRate*req.body.amount ;
    const transaction = {merchant:req.body.merchant ,category :req.body.category ,amount:req.body.amount , currency:req.body.currency , baseCurrency:"INR" , exchangeRate: exchangeRate , baseAmount : baseAmount , date:req.body.date , type:req.body.type ,rateTimestamp : new Date()} 
    const sql = `INSERT INTO transactions(merchant,category,amount,currency,base_currency,exchange_rate,base_amount,date,type,rate_timestamp)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *;`;
    const values = [transaction.merchant,transaction.category,transaction.amount,transaction.currency,transaction.baseCurrency,transaction.exchangeRate,transaction.baseAmount,transaction.date,transaction.type,transaction.rateTimestamp];
    pool.query(sql,values,(error,result)=>{
        if(error)
        {
            console.error("Database Insert Failed:",error);
            return res.status(500).json({message:"Failed to create transaction"});
        }
        const apitransaction = mapTransaction(result.rows[0]);
        console.log("Database Row:",result.rows[0]);
        console.log("API Transaction:",apitransaction);
        res.status(201).json({message:"Transaction Created",transaction:apitransaction})
});
});
app.get("/api/transactions", (req,res)=>{
    const sql = `SELECT * FROM transactions ORDER BY date desc,id desc;` ;
    pool.query(sql,(error,result)=>{
        if(error){
            console.error("Database Fetch Failed:" ,error);
            return res.status(500).json({message:"Failed to fetch transactions"});
        }
        const transactions = result.rows.map(mapTransaction);
        res.status(200).json({transactions:transactions});
    });
});
app.listen(3000,()=>{console.log("Server is running on port 3000")});
