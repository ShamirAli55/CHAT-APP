import User from "../models/user.js";
import jwt from 'jsonwebtoken';

export async function signup(req, res) {
  const { email, password, fullName } = req.body;

  try 
  {
    if (!email || !password || !fullName) 
    {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password.length < 6) 
    {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) 
    {
      return res.status(400).json({ error: "User already exists" });
    }

    const indx = Math.floor(Math.random() * 100) + 1;
    const RandomAvatar = `https://avatar.iran.liara.run/public/${indx}.png`;

    const newUser = await User.create({
      email,
      password,
      fullName,
      profilePic: RandomAvatar,
    });


    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h"
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(201).json({ success: true, message: "User created successfully", user: newUser });
  }
  catch (error) 
  {
    console.log("Error in signup controller :", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
export async function login(req, res) {
  res.send("Login route");
}

export function logout(req, res) {
  res.send("Logout route");
}
