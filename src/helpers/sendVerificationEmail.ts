import { resend } from "@/lib/resend";
import VerificationEmail from "../../email/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Silent Voices | Verification Code',
            react: VerificationEmail({username, otp:verifyCode}),
          });        
        return {success: true, message: "Verification Email send Successdully"}
    } catch (emailError) {
        console.error("Error Sending verification email", emailError)
        return {success: false, message: "Failed to send verification email"}
    }
}