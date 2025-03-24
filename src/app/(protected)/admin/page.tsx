"use client";

import { RoleGate } from "@/components/auth/RoleGate";
import { FormSuccess } from "@/components/popup/FormSuccess.component";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserRole } from "@prisma/client";
import { toast } from "sonner";

export default function AdminPage() {
    const onApiRouteClick = () => {
        fetch("/api/admin")
        .then((response) => {
            if(response.ok){
                toast.success("Allowed API Route!")
            }else{
                console.error("FORBIDEN")
            }
        })
    }
    return (
        <Card className="w-[600px]">
            <CardHeader>
                <p className=" text-2xl font-semibold text-center">Admin Page</p>
            </CardHeader>
            <CardContent className="space-y-4">
                <RoleGate allowedRole={UserRole.ADMIN}>
                    <FormSuccess message="Você tem permissão para ver esse conteúdo!"/>
                </RoleGate>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
                    <p className=" text-sm font-medium">Admin-only API route</p>
                    <Button onClick={onApiRouteClick}>Click to test</Button>
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
                    <p className=" text-sm font-medium">Admin-only Server ACtion</p>
                    <Button>Click to test</Button>
                </div>
            </CardContent>
        </Card>
    );
}
