/**
 * An array of routes that can be accessed publicly without authentication.
 * @type {string[]}
 */
export const publicRoutes = ["/", "/auth/new-verification"];

/**
 * An array of authentication-related routes.
 * @type {string[]}
 */
export const authRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/error",
    "/auth/reset",
    "/auth/new-password",
];

/**
 * Prefix for authentication API routes.
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * Default redirect route after login.
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/main";
