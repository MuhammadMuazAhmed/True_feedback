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
        return Response.json({ message: "User updated successfully" }, { status: 200 });
        try {
            const user = await usermodel.aggregate
        } catch (error) {

        }

    } catch (error) {
        console.error(error);
        return Response.json({ message: "Internal server error" }, { status: 500 });
    }
}
