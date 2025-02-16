import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { DEFAULT_LOGIN_REDIRECT, apiAuthPrefix, authRoutes, publicRoutes } from "@/routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);
    const isAtRegister = nextUrl.pathname === "/auth/register"; // Permite acesso ao registro

    // Permite acesso às rotas de autenticação da API sem redirecionamento
    if (isApiAuthRoute) {
        return null;
    }

    // Se estiver logado e tentar acessar uma página de autenticação, redireciona para o destino padrão
    if (isLoggedIn && isAuthRoute) {
        return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.url));
    }

    // Se não estiver logado e tentar acessar uma rota protegida, redireciona para login
    if (!isLoggedIn && !isPublicRoute && !isAuthRoute && !isAtRegister) {
        return Response.redirect(new URL("/auth/login", req.url));
    }

    return null;
});

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
