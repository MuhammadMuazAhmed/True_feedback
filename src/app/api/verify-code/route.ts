import dbconnect from "@/lib/dbconnection";
import usermodel from "@/models/user";
import { z } from "zod";
import { validateusername } from "@/schemas/signupSchema";

export async function POST(request: Request) {
    try {
        await dbconnect();
        const { username, code } = await request.json();
        const user = await usermodel.findOne({ username });
        if (!user) {
            return Response.json({ message: "User not found" }, { status: 404 });
        }
        if (user.verificationCode !== code) {
            return Response.json({ message: "Invalid code" }, { status: 400 });
        }
        const codenotexpired = new Date(user.verificationCodeExpiry) > new Date();
        if (!codenotexpired) {
            return Response.json({ message: "Code expired" }, { status: 400 });
        }
        user.isVerified = true;
        await user.save();
        return Response.json({ message: "User verified successfully" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return Response.json({ message: "Internal server error" }, { status: 500 });
    }
}