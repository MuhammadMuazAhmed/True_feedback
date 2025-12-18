import dbconnect from "@/lib/dbconnection";
import usermodel from "@/models/user";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";

export async function POST(request: Request) {
    try {
        await dbconnect();
        const session = await getServerSession(options);
        const { acceptMessages } = await request.json();
        if (!session) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }
        const user = await usermodel.findByIdAndUpdate(
            session.user.id,
            { isReceivingMessages: acceptMessages },
            { new: true }
        );
        return Response.json({ message: "User updated successfully" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return Response.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        await dbconnect();
        const session = await getServerSession(options);
        if (!session) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }
        const user = await usermodel.findById(session.user.id);
        if (!user) {
            return Response.json({ message: "User not found" }, { status: 404 });
        }
        return Response.json({ isReceivingMessages: user.isReceivingMessages }, { status: 200 });
    } catch (error) {
        console.error(error);
        return Response.json({ message: "Internal server error" }, { status: 500 });
    }
}