import { ExtendedUser } from "@/next-auth";
import { Card, CardContent, CardHeader } from "./ui/card";

interface IUserInfoProps {
    user?: ExtendedUser;
    label: string;
}

const UserInfoRow = ({ label, value }: { label: string; value?: string }) => {
    return (
        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm bg-gray-50">
            <p className="font-medium text-gray-700">{label}</p>
            <p className="truncate text-xs max-w-[200px] font-mono p-1 bg-slate-100 rounded-md">
                {value || "N/A"}
            </p>
        </div>
    );
};
export const UserInfo = ({ user, label }: IUserInfoProps) => {
    return (
        <Card className="w-full max-w-lg shadow-md">
            <CardHeader>
                <p className="text-center text-lg font-semibold">{label}</p>
            </CardHeader>
            <CardContent className="space-y-3">
                <UserInfoRow label="ID" value={user?.id ?? "N/A"} />
                <UserInfoRow label="Nome" value={user?.name ?? "N/A"} />
                <UserInfoRow label="E-mail" value={user?.email ?? "N/A"} />
                <UserInfoRow label="Cargo" value={user?.role ?? "N/A"} />
                <UserInfoRow
                    label="Autentificação de dois Fatores"
                    value={user?.isTwoFactorEnabled ? "ON" : "OFF"}
                />
            </CardContent>
        </Card>
    );
};
