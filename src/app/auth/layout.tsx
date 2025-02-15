"use client"; // Adicionando a diretiva para marcar o componente como cliente

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-900">
            {/* Card de conteúdo */}
            <div>{children}</div>
        </div>
    );
};

export default AuthLayout;
