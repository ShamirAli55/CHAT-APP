import User from "../models/user.js";
import jwt from 'jsonwebtoken';
import { upsertStreamUser } from "../lib/stream.js";

export async function signup(req, res) {
  const {
    email,
    password,
    fullName
  } = req.body;

  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({
        error: "All fields are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters long"
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format"
      });
    }

    const existingUser = await User.findOne({
      email
    });

    if (existingUser) {
      return res.status(400).json({
        error: "User already exists"
      });
    }

    const indx = Math.floor(Math.random() * 100) + 1;
    const RandomAvatar = `https://avatar.iran.liara.run/public/${indx}.png`;

    const newUser = await User.create({
      email,
      password,
      fullName,
      profilePic: RandomAvatar,
    });

    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: fullName,
        image: newUser.profilePic || "",
      });
      console.log(`Stream user created for ${newUser.fullName}`);
    }
    catch (error) {
      console.error("Error creating Stream user:", error);
    }


    const token = jwt.sign({
      id: newUser._id
    }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h"
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser
    });
  } catch (error) {
    console.log("Error in signup controller :", error);
    return res.status(500).json({
      error: "Internal server error"
    });
  }
}
export async function login(req, res) {
  try {
    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required"
      });
    }

    const user = await User.findOne({
      email
    });

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password"
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) return res.status(401).json({
      error: "Invalid email or password"
    });

    const token = jwt.sign({
      id: user._id
    }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h"
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user
    });

  } catch (error) {
    console.log("Error in login controller :", error);
    return res.status(500).json({
      error: "Internal server error"
    });
  }
}

export function logout(req, res) {
  res.clearCookie("jwt");
  res.status(200).json({
    success: true,
    message: "User logged out successfully"
  });
}

export async function onboard(req, res) {
  try 
  {
    const userId = req.user._id;

    const { fullName, bio, nativeLanguage, learningLanguage } = req.body;

    if (!fullName || !bio || !nativeLanguage || !learningLanguage) {
      return res.status(400).json({
        message: "All fields are required",
        missingfields: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage"
        ].filter(Boolean),
      });
    }

    // Update user information
    const updatedUser = await User.findByIdAndUpdate(userId, {
      ...req.body,
      isOnboarded: true,
    }, { new: true });

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    try 
    {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",
      });
      console.log("Stream user updated for", updatedUser.fullName);
    } 
    catch (error) 
    {
      console.error("Error updating User data during stream onboarding:", error);
    }

    res.status(200).json({ success: true, message: "User onboarding complete" });
  }
  catch (error) {
    console.error("Error in onboarding controller:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}