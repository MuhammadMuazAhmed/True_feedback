import dbconnect from "@/lib/dbconnection";
import usermodel from "@/models/user";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";

export async function GET(request: Request) {
    try {
        await dbconnect();
        const session = await getServerSession(options);
        if (!session) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }
        const user = await usermodel.findById(session.user.id);
        try {
            const user = await usermodel.aggregate([
                { $match: { _id: session.user.id } },
                { $unwind: "$messages" },
                { $sort: { "messages.createdAt": -1 } },
                { $group: { _id: "$id", messages: { $push: "$messages" } } }
            ])
            return Response.json({ success: true, messages: user[0]?.messages }, { status: 200 });
        } catch (error) {
            console.error(error);
            return Response.json({ message: "Internal server error" }, { status: 500 });
        }

    } catch (error) {
        console.error(error);
        return Response.json({ message: "Internal server error" }, { status: 500 });
    }
}
