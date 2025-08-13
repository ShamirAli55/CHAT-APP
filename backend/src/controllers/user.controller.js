import User from '../models/user.js';
import FriendRequest from '../models/friendRequest.js';

export async function getMyFriends(req, res) {
    try 
    {
        const userId = req.user.id;
        const users = await User.findById(userId).select("friends")
        .populate("friends","fullName nativeLanguage learningLanguage profilePic");

        res.status(200).json(users.friends);
    } 
    catch (error) 
    {
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function getRecommendedUsers(req, res) 
{
    try 
    {
        const userId = req.user.id;
        const users = await User.find({  
            $and: [
                { _id: { $ne: userId } },
                { friends: { $nin: [userId] } },
                {isOnboarded: true}
            ]
         });

        res.status(200).json(users);
    } 
    catch (error) 
    {
        console.log("Error in fetching recommended users:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function sendFriendRequest(req, res) {
    try {
        const userId = req.user.id;
        const recipientId = req.params.id;

        if(userId === recipientId) return res.status(400).json({ success: false, message: "You cannot send a friend request to yourself" });
        
        // Check if the recipient exists
        const recipient = await User.findById(recipientId);
        if (!recipient) 
        {
            return res.status(404).json({ success: false, message: "Recepient not found" });
        }

        if(recipient.friends.includes(userId)) return res.status(400).json({ success: false, message: "You are already friends with this user" });

        // Check if a friend request already exists
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: userId, recipient: recipientId },
                { sender: recipientId, recipient: userId },
            ],
        });

        if (existingRequest) 
        {
            return res.status(400).json({ success: false, message: "Friend request already exists" });
        }
        // Create a new friend request
        const friendRequest = await FriendRequest.create({
            sender: userId,
            recipient: recipientId,
        });

        res.status(201).json( friendRequest);
    } 
    catch (error) 
    {
        console.error("Error in user controller for sending friend request:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function acceptFriendRequest(req, res) {
    try {
        const{id:requestId} = req.params;

        const friendRequest = await FriendRequest.findById(requestId);

        if(!friendRequest) return res.status(404).json({ success: false, message: "Friend request not found" });

        if(friendRequest.recepient.toString() !== req.user.id) 
        {
            return res.status(401).json({ success: false, message: "You are not authorized to accept this friend request" });
        }

        friendRequest.status = "accepted";
        await friendRequest.save();

        await User.findByIdAndUpdate(friendRequest.sender,{
             $addToSet: { friends: friendRequest.recipient } 
        });
        await User.findByIdAndUpdate(friendRequest.recipient,{
             $addToSet: { friends: friendRequest.sender }
        });

        res.status(200).json({ success: true, message: "Friend request accepted successfully" });
    } 
    catch (error)
    {
        console.error("Error in user controller for accepting friend request:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function getFriendRequests(req,res) {
    try 
    {
        const friendRequests = await FriendRequest.find({ recipient: req.user.id ,status:"pending"}).populate("sender","fullName nativeLanguage learningLanguage profilePic");
        const acceptedReqs = await FriendRequest.find({ 
            recipient: req.user.id ,
            status:"accepted"
        }).populate("recipient","fullName profilePic");

        res.status(200).json({ friendRequests, acceptedReqs });
    } 
    catch (error) 
    {
        console.error("Error in user controller for getting friend requests:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function getOutgoingFriendRequests(req,res) {
    try 
    {
        const outgoingRequests = await FriendRequest.find({ sender: req.user.id, status:"pending" })
        .populate("recipient","fullName nativeLanguage learningLanguage profilePic");
        res.status(200).json(outgoingRequests);
    } 
    catch (error) 
    {
        console.error("Error in user controller for getting outgoing friend requests:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}
