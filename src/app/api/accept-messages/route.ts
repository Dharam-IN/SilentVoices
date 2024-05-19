import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";


export async function POST(request: Request){
    await dbConnect()

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User

    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, {status: 500})
    }

    const userId = user._id;
    const {acceptMessages} = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage: acceptMessages},
            {new: true}
        )

        if(!updatedUser){
            return Response.json({
                success: false,
                message: "Failed to update user status to accept message"
            }, {status: 401})
        }

        return Response.json({
            success: true,
            message: "Message Acceptance status updated successfully",
            updatedUser
        }, {status: 201})
        
    } catch (error) {
        console.log('Failed to update user status to accept message');
        return Response.json({
            success: false,
            message: "Failed to update user status to accept message"
        }, {status: 500})
    }

}

export async function GET(request: Request){
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if(!session || !session.user){
        return Response.json({
            success: false,
            messgae: "Not Authorized"
        }, {status: 500})
    }

    const userId = user._id;

    try {
        const foundUser = await UserModel.findById(userId);
        if(!foundUser){
            return Response.json({
                sucess: false,
                message: "User Not Found"
            }, {status: 404})
        }
    
        return Response.json({
            success: true,
            isAcceptingMessage: foundUser.isAcceptingMessage
        }, {status: 200})
    } catch (error) {
        console.log('Error in getting messgae acceptance status');
        return Response.json({
            success: false,
            message: "Error in getting messgae acceptance status"
        }, {status: 500})
    }

}