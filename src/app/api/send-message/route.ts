import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {Message} from '@/model/User'

export async function POST(request: Request){
    await dbConnect();

    const {username, content} = await request.json();
    
    try {
        const user = await UserModel.findOne({username});
        if(!user){
            return Response.json({
                success: false,
                message: "User Not Found"
            }, {status: 404})
        }

        // Check User Accept Message OR Not
        if(!user.isAcceptingMessage){
            return Response.json({
                success: false,
                message: "User is not accepting messages"
            }, {status: 403})
        }

        const newMessage = {content, createdAt: new Date()}
        
        user.messages.push(newMessage as Message)
        user.save()

        return Response.json({
            success: true,
            message: "Message Sent Successfully"
        }, {status: 200})
        
    } catch (error) {
        console.log('Error adding messages: ', error)
        return Response.json({
            success: false,
            message: "Error in message send"
        }, {status: 500})
    }
}
