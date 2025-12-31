import { apiInstance, brevo } from "@/lib/brevo";
import { render } from "@react-email/render";
import VerificationEmail from "../../emails/verificationemail";

export async function sendVerificationEmail(
    email: string,
    otp: number,
    username: string,
): Promise<void> {
    try {
        const emailHtml = await render(VerificationEmail({ otp, username }));

        const sendSmtpEmail = new brevo.SendSmtpEmail();

        sendSmtpEmail.subject = "Verification Code";
        sendSmtpEmail.htmlContent = emailHtml;
        sendSmtpEmail.sender = { "name": "Feedback App", "email": "onboarding@brevo.com" }; // Replace with verified sender
        sendSmtpEmail.to = [{ "email": email, "name": username }];

        await apiInstance.sendTransacEmail(sendSmtpEmail);

    } catch (error) {
        console.error("Brevo error:", error);
        throw error;
    }
}