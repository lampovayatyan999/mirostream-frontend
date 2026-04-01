import { NextResponse, type NextRequest } from "next/server";

export default function middleware(request: NextRequest) {
    const {url, cookies, nextUrl} = request 
    const session = cookies.get('session')?.value;
    const { pathname } = nextUrl;

    const isAuthRoute = pathname.startsWith('/account');
    const isDeactivateRoute = nextUrl.pathname === '/account/deactivate'
    const isDashboardRoute = pathname.startsWith('/dashboard');

    if (!session && isDashboardRoute) {
        return NextResponse.redirect(new URL('/account/login', url));
    }

    if (!session && isDeactivateRoute) {
        if (pathname !== '/account/login') {
            return NextResponse.redirect(new URL('/account/login', url));
        }
    }

    if(session && isAuthRoute && !isDeactivateRoute) {
        return NextResponse.redirect(new URL('/dashboard/settings', url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/account/:path*', '/dashboard/:path*']
};