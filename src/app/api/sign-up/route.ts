import dbconnect from "@/lib/dbconnection";
import UserModel from "@/models/user";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helper/sendverificationemail";

export async function POST(request: Request) {
    await dbconnect();
    try {
        const { username, email, password } = await request.json();
        if (!username || !email || !password) {
            return Response.json(
                {
                    success: false,
                    message: "All fields are required"
                },
                {
                    status: 400
                }
            );
        }
        const userVerifiedByUsername = await UserModel.findOne({ username, isverified: true });
        if (userVerifiedByUsername) {
            return Response.json(
                {
                    success: false,
                    message: "User already exists"
                },
                {
                    status: 400
                }
            );
        }
        const userVerifiedByEmail = await UserModel.findOne({ email, isverified: true });
        if (userVerifiedByEmail) {
            return Response.json(
                {
                    success: false,
                    message: "User already exists"
                },
                {
                    status: 400
                }
            );
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date(Date.now() + 60 * 60 * 1000);
            const verificationCode = Math.floor(100000 + Math.random() * 900000);
            const user = new UserModel({
                username,
                email,
                password: hashedPassword,
                verificationCode,
                isverified: false,
                verificationCodeExpiry: expiryDate,
                isReceivngMessages: true,
                messages: []
            });
            await user.save();
            await sendVerificationEmail(email, verificationCode, username);
            return Response.json(
                {
                    success: true,
                    message: "User registered successfully"
                },
                {
                    status: 201
                }
            );
        }
    } catch (error) {
        console.log("error registering user", error);
        return Response.json(
            {
                success: false,
                message: "Internal Server Error"
            },
            {
                status: 500
            }
        );
    }
}

