import dbconnect from "@/lib/dbconnection";
import usermodel from "@/models/user";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";

export async function DELETE(request: Request, { params }: { params: { messageid: string } }) {
    try {
        await dbconnect();
        const session = await getServerSession(options);
        if (!session) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }
        const { messageid } = request.query;

    } catch (error) {
        console.error(error);
        return Response.json({ message: "Internal server error" }, { status: 500 });
    }
}
