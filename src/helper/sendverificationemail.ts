import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationemail";

export async function sendVerificationEmail(
    email: string,
    otp: number,
    username: string,
): Promise<void> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verification Code',
            react: VerificationEmail({ otp, username }),
        });

    } catch {
        console.log("Error sending verification email");
        throw new Error("Error sending verification email");
    }
}