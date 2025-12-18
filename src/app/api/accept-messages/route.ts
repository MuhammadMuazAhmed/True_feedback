import dbconnect from "@/lib/dbconnection";
import usermodel from "@/models/user";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";

export async function POST(request: Request) {
    await dbconnect();
    const session = await getServerSession(options);
    if (!session || !session.user) {
        return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { acceptMessages } = await request.json();
        const user = await usermodel.findById(session.user.id);

        if (!user) {
            return Response.json({ message: "User not found" }, { status: 404 });
        }

        user.isReceivingMessages = acceptMessages;
        await user.save();

        return Response.json({
            success: true,
            message: "Acceptance status updated"
        }, { status: 200 });
    } catch (error) {
        console.error("POST /api/accept-messages error:", error);
        return Response.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function GET(request: Request) {
    await dbconnect();
    const session = await getServerSession(options);
    if (!session || !session.user) {
        return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const user = await usermodel.findById(session.user.id);
        if (!user) {
            return Response.json({ message: "User not found" }, { status: 404 });
        }
        return Response.json({
            isReceivingMessages: !!user.isReceivingMessages
        }, { status: 200 });
    } catch (error) {
        console.error("GET /api/accept-messages error:", error);
        return Response.json({ message: "Internal server error" }, { status: 500 });
    }
}