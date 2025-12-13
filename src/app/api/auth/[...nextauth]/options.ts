import { NextAuthOptions } from "next-auth";
import dbconnect from "@/lib/dbconnection";
import UserModel from "@/models/user";
import bcrypt from "bcryptjs";

import Credentials from "next-auth/providers/credentials";

export const options: NextAuthOptions = {
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                username: {
                    label: "Username",
                    type: "text",
                    placeholder: "username"
                },
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "email"
                },
                password: {
                    label: "Password",
                    type: "password",
                    placeholder: "password"
                }
            },
            async authorize(credentials): Promise<any> {
                await dbconnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials?.email },
                            { username: credentials?.username }
                        ]
                    });
                    if (!user) {
                        throw new Error("No user found");
                    }
                    const isPasswordValid = await bcrypt.compare(String(credentials?.password), user.password);
                    if (!isPasswordValid) {
                        throw new Error("Invalid password");
                    }
                    return user;
                } catch (error) {
                    console.log("error authorizing user", error);
                    throw new Error("Internal Server Error");
                }

            }
        })
    ]
}
