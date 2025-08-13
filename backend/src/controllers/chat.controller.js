import { generateStreamToken } from "../lib/stream.js";

export async function getStreamToken()
{
    try 
    {
        const token = await generateStreamToken(req.user.id);
        res.status(200).json({ token });
    }
    catch (error) 
    {
        console.log("Error in getStreamToken:", error);
        res.status(500).json({ error: "Failed to generate token" });
    }
}