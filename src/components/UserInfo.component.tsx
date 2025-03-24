import { ExtendedUser } from "@/next-auth";
import { Card, CardContent, CardHeader } from "./ui/card";

interface IUserInfoProps {
    user?: ExtendedUser;
    label: string;
}

const UserInfoRow = ({ label, value }: { label: string; value?: string }) => (
    <div className="flex items-center justify-between rounded-md border p-4 bg-gray-50 shadow-sm">
        <p className="font-medium text-gray-700">{label}</p>
        <p className="truncate text-sm max-w-[250px] font-mono px-2 py-1 bg-gray-100 rounded-md">
            {value || "N/A"}
        </p>
    </div>
);

export const UserInfo = ({ user, label }: IUserInfoProps) => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
            <Card className="w-full max-w-2xl shadow-lg">
                <CardHeader>
                    <p className="text-center text-xl font-semibold text-gray-800">{label}</p>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                    <UserInfoRow label="ID" value={user?.id} />
                    <UserInfoRow label="Nome" value={user?.name ?? "N/A"} />
                    <UserInfoRow label="E-mail" value={user?.email ?? "N/A"} />
                    <UserInfoRow label="Cargo" value={user?.role} />
                    <UserInfoRow
                        label="Autenticação 2FA"
                        value={user?.isTwoFactorEnabled ? "Ativada" : "Desativada"}
                    />
                </CardContent>
            </Card>
        </div>
    );
};
