import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs'
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { pages } from "next/dist/build/templates/app-page";


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any>{
                await dbConnect()
                try {
                    const user = await UserModel.findOne({
                        $or:[
                            {email: credentials.identifier},
                            {username: credentials.identifier}
                        ]
                    })

                    if(!user){
                        throw new Error("User not found")
                    }

                    if(!user.isVerified){
                        throw new Error("Please Verify your account first before login")
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                    
                    if(isPasswordCorrect){
                        return user;
                    }else{
                        throw new Error('Incorrect Password')
                    }

                } catch (err: any) {
                    throw new Error(err)
                }
            }
        })
    ],
    callbacks:{
        async session({ session, user, token }) {
            return session
        },
        async jwt({ token, user, account, profile, isNewUser }) {
        return token
        }      
    }
    ,
    pages:{
        signIn: '/signin'
    },
    session:{
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
}
