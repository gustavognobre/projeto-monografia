"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface IBackButtonProps {
    href: string;
    label: string;
}

export const BackButton = ({ href, label }: IBackButtonProps) => {
    return (
        <Button
            variant="link"
            size="sm"
            className="font-normal w-full transition duration-300 ease-in-out transform hover:scale-105"
            asChild
        >
            <Link href={href}>{label}</Link>
        </Button>
    );
};
