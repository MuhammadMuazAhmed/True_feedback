import dbconnect from "@/lib/dbconnection";
import usermodel from "@/models/user";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";

export async function DELETE(request: Request, { params }: { params: { messageid: string } }) {
    const { messageid } = params;
    await dbconnect();
    const session = await getServerSession(options);
    if (!session || !session.user) {
        return Response.json({ message: "Unauthorized" }, { status: 401 });
    }
    try {
        const deletedMessage = await usermodel.updateOne(
            { _id: session.user.id },
            { $pull: { messages: { _id: messageid } } }
        );
        if (deletedMessage.modifiedCount === 0) {
            return Response.json({ message: "Message not found" }, { status: 404 });
        }
        return Response.json({ message: "Message deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return Response.json({ message: "Internal server error" }, { status: 500 });
    }
}
