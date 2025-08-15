"use client";

import { UserRole } from "@prisma/client";
import { FormError } from "../popup/FormError.component";
import { useCurrentRole } from "@/hooks/useAppRequest";

interface RoleGateProps {
    children: React.ReactNode;
    allowedRole: UserRole;
}

export const RoleGate = ({ children, allowedRole }: RoleGateProps) => {
    const role = useCurrentRole();

    if (role !== allowedRole) {
        return (
            <FormError message=" Infelizmente Você não possui permissão para ver este conteúdo!" />
        );
    }

    return <>{children}</>;
};
