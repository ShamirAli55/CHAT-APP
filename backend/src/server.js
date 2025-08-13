import express from 'express';
import dotenv from 'dotenv';


const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;

app.get("/api/auth/signup",(req,res)=>{
    res.send("Signup route");
})

app.get("/api/auth/login",(req,res)=>{
    res.send("Login route");
})
app.get("/api/auth/logout",(req,res)=>{
    res.send("Logout route");
})
app.listen(PORT,()=>{
    console.log("Server is running on port :", PORT);
})