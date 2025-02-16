/**
 * An array of routes that can be accessed publicly without authentication.
 * @type {string[]}
 */
export const publicRoutes = ["/"];

/**
 * An array of authentication-related routes.
 * @type {string[]}
 */
export const authRoutes = ["/auth/login", "/auth/register"];

/**
 * Prefix for authentication API routes.
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * Default redirect route after login.
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/settings";
