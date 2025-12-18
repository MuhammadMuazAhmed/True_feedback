import dbconnect from "@/lib/dbconnection";
import usermodel from "@/models/user";
import { Message } from "@/models/user";

export async function POST(request: Request) {
    await dbconnect();
    const { username, content } = await request.json();
    try {
        const user = await usermodel.findOne({ username });
        if (!user) {
            return Response.json({ message: "User not found" }, { status: 404 });
        }
        if (!user.isReceivingMessages) {
            return Response.json({ message: "User is not receiving messages" }, { status: 400 });
        }
        const newmessage = ({
            content,
            createdAt: new Date(),
        });
        user.messages.push(newmessage as Message);
        await user.save();
        return Response.json({ message: "Message sent successfully" }, { status: 200 });
    }
    catch (error) {
        console.error(error);
        return Response.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function GET(request: Request) {
    await dbconnect();
    const { searchParams } = new URL(request.url)
    const username = searchParams.get("username")
    try {
        const user = await usermodel.findOne({ username });
        if (!user) {
            return Response.json({ message: "User not found" }, { status: 404 });
        }
        if (!user.isVerified) {
            return Response.json({ message: "User is not verified" }, { status: 400 });
        }
        if (!user.isReceivingMessages) {
            return Response.json({ message: "User is not receiving messages" }, { status: 400 });
        }
        return Response.json({ messages: user.username }, { status: 200 });
    }
    catch (error) {
        console.error(error);
        return Response.json({ message: "Internal server error" }, { status: 500 });
    }
}