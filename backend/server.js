import express from 'express';
const app = express();

app.get("/api/auth/signup",(req,res)=>{
    res.send("Signup route");
})

app.get("/api/auth/signup",(req,res)=>{
    res.send("Login route");
})
app.get("/api/auth/logout",(req,res)=>{
    res.send("logout route");
})
app.listen(5000,()=>{
    console.log("Server is running on port 5000");
})