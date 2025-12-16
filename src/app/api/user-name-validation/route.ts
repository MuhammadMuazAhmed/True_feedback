import dbconnect from "@/lib/dbconnection";
import usermodel from "@/models/user";
import { z } from "zod";
import { validateusername } from "@/schemas/signupSchema";


const userQuerySchema = z.object({
    username: validateusername
})

export async function GET(request: Request) {
    try {
        await dbconnect();
        const { searchParams } = new URL(request.url)
        const queryParams = {
            username: searchParams.get('username')
        }
        const result = userQuerySchema.safeParse(queryParams);
        if (!result.success) {
            return Response.json(
                {
                    message: "username is not available",
                    success: false
                },
                { status: 400 }
            )
        }
        const user = await usermodel.findOne({ username: queryParams.username });
        if (user) {
            return Response.json({ message: "Username already exists" }, { status: 400 });
        }
        return Response.json({ message: "Username is available" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return Response.json({ message: "Internal server error" }, { status: 500 });
    }
}
