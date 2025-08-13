import {StreamChat} from 'stream-chat';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if(!apiKey | !apiSecret)
{
    console.error("Please set the STREAM_API_KEY and STREAM_API_SECRET environment variables.");
    process.exit(1);
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async  (userData)=> 
{
    try 
    {
        await streamClient.upsertUser(userData);
        return userData;
    } 
    catch (error) 
    {
        console.error("Error creating Stream user:", error);
        throw error;
    }
};

export const generateStreamToken = async (userId)=>{}