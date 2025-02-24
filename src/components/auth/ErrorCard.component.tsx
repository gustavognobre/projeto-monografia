import { Card, CardHeader, CardFooter } from "../ui/card";
import { BackButton } from "./BackButton.component";
import { Header } from "./Header.component";
import { AlertCircle } from "lucide-react";

export default function ErrorCard() {
    return (
        <Card className="w-full max-w-[400px] shadow-lg borde">
            <CardHeader className="flex flex-col items-center gap-2 text-red-600">
                <AlertCircle className="w-8 h-8" aria-hidden="true" />
                <Header label="Oops! Alguma coisa está errada!" />
            </CardHeader>
            <CardFooter className="flex justify-center">
                <BackButton label="Voltar para o login" href="/auth/login" />
            </CardFooter>
        </Card>
    );
}
