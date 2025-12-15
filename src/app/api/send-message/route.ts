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
        if (!user.isReceivngMessages) {
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