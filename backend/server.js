const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.get("/" , (req,res) => {res.send("Radhe Radhe! From Finance Manager Backend!")});

app.post("/api/transactions",(req,res)=>{
    console.log(req.body);
    res.status(201).json({
        message:"Transaction recieved" ,
        transaction : req.body 
    })
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

