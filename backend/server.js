const express = require("express");
const cors = require("cors");
const pool = require("./db");
const app = express();
app.use(cors());
app.use(express.json());
app.get("/" , (req,res) => {res.send("Radhe Radhe! From Finance Manager Backend!")});

const exchangeRates = { USD : 83 , EUR : 93 , GBP : 110 , INR : 1 } ;

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
    res.status(201).json({ message : "Transaction Received" ,transaction});
    console.log("Transaction Created:",transaction);
});

app.listen(3000,()=>{console.log("Server is running on port 3000")});
