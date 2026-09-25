import { auth } from "@/auth";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "./routes";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute =
    publicRoutes.includes(nextUrl.pathname) ||
    nextUrl.pathname.startsWith("/fix-this") ||
    (nextUrl.pathname.startsWith("/explore") && !nextUrl.pathname.endsWith("/apply"));
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  // Redirect logged-in users from the landing page ("/") to the dashboard page
  if (nextUrl.pathname === "/" && isLoggedIn) {
    const userRole = req.auth?.user?.role;
    if (userRole !== "ADMIN") {
      return Response.redirect(new URL("/auth/error?error=AccessDenied", nextUrl));
    }
    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  if (isLoggedIn && !isPublicRoute) {
    const userRole = req.auth?.user?.role;
    if (userRole !== "ADMIN") {
      return Response.redirect(new URL("/auth/error?error=AccessDenied", nextUrl));
    }
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/", nextUrl));
  }

  return;
});

// Optionally, don't run Middleware on some paths
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
