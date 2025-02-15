"use client";

import { HeaderLogin } from "@/components/auth/HeaderLogin.component";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Social } from "@/components/auth/SocialLogin.components";
import { BackButton } from "../auth/BackButton.component";

interface ICardWrapperProps {
    children: React.ReactNode;
    headerLabel: string;
    headerText: string;
    backButtonLabel: string;
    backButtonHref: string;
    showSocial?: boolean;
}

export const CardWrapper = ({
    children,
    headerLabel,
    headerText,
    backButtonLabel,
    backButtonHref,
    showSocial,
}: ICardWrapperProps) => {
    return (
        <Card className=" w-[500px] shadow-md">
            <CardHeader>
                <HeaderLogin label={headerLabel} headerText={headerText} />
            </CardHeader>
            {showSocial && (
                <CardFooter>
                    <Social />
                </CardFooter>
            )}
            <CardContent>
                {children}
                <CardFooter>
                    <BackButton label={backButtonLabel} href={backButtonHref} />
                </CardFooter>
            </CardContent>
        </Card>
    );
};
