import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public paths that don't need authentication
  const isPublicPath = 
    path === "/" ||
    path === "/data-usage" ||
    path === "/contact-us" ||
    path === "/patient/login" || 
    path === "/patient/register" || 
    path === "/admin/login";

  // Get auth data from cookies
  const userToken = request.cookies.get("user")?.value;
  const userRole = request.cookies.get("userRole")?.value;

  // If the path is public (login/register pages), don't check authentication
  if (isPublicPath) {
    // Only redirect if user is already authenticated
    if (userToken && userRole) {
      // Check if trying to access login pages while already authenticated
      if (path === "/patient/login" || path === "/patient/register") {
        return NextResponse.redirect(new URL("/patient/dashboard", request.url));
      }
      if (path === "/admin/login") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
    }
    // Allow access to public paths
    return NextResponse.next();
  }

  // For protected routes
  if (!userToken) {
    // Redirect to appropriate login page based on the path
    if (path.startsWith("/admin/")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    if (path.startsWith("/patient/")) {
      return NextResponse.redirect(new URL("/patient/login", request.url));
    }
  }

  // Role-based access control for protected routes
  if (path.startsWith("/patient/") && userRole !== "patient") {
    return NextResponse.redirect(new URL("/patient/login", request.url));
  }

  if (path.startsWith("/admin/") && !["admin", "receptionist", "pharmacist", "billing_officer", "doctor"].includes(userRole || '')) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

// Configure which routes should be handled by the middleware
export const config = {
    matcher: [
      /*
       * Match all request paths except for the ones starting with:
       * - api (API routes)
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico (favicon file)
       */
      '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
  };