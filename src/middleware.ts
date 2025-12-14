import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// export { default } from "next-auth/middleware";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req: req});
    const url = req.nextUrl;

    // Redirect authenticated users to dashboard if they visit auth pages or home
    if (
        token &&
        (url.pathname === "/sign-in" ||
            url.pathname === "/sign-up" ||
            url.pathname === "/verify" ||
            url.pathname === "/")
    ) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Redirect unauthenticated users to sign-in if they try to access dashboard
    if (!token && url.pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/sign-in", "/sign-up", "/verify", "/", "/dashboard/:path*"],
};