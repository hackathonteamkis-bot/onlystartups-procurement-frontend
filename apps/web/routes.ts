/**
 * An array of routes that are accessable to public
 * these routes doesnt require auth
 * @type {string[]}
 */
export const publicRoutes = [
  "/", 
  "/auth/new-verification", 
  "/os-daily", 
  "/fix-this",
  "/explore",
  "/explore/gov-departments",
  "/explore/funding-opportunities",
  "/explore/events",
  "/explore/resources",
  "/about",
  "/terms",
  "/cookie",
  "/privacy",
  "/auth/error"
];

/**
 * An array of routes that are accessable to private
 * these routes require auth
 * @type {string[]}
 */
export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/reset",
  "/auth/new-password",
];

/**
 * The onboarding route for new users
 * @type {string}
 */
export const onboardingRoute = "/onboarding";

/**
 * the prefix for api authentication routes
 * Routes that start with prefix are used for API auth purposes
 * @type {string}
 */

export const apiAuthPrefix = "/api/auth";
export const DEFAULT_LOGIN_REDIRECT = "/explore";


