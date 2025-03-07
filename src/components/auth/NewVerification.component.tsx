import { useSearchParams } from "next/navigation";
import { CardWrapper } from "../ui/CardWrapper.component";
import { ClipLoader } from "react-spinners";
import { useCallback, useEffect, useState } from "react";
import { newVerification } from "@/actions/new-verification";
import { FormSuccess } from "../popup/FormSuccess.component";
import { FormError } from "../popup/FormError.component";

export default function NewVerificationForm() {
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const onSubmit = useCallback(() => {
        if (!token) {
            setError("Sem solicitação de Verificação!");
            return;
        }
        newVerification(token)
            .then((data) => {
                setSuccess(data.success);
                setError(data.error);
            })
            .catch(() => {
                setError("Algo Esta errado!");
            });
    }, [token]);
    useEffect(() => {
        onSubmit();
    }, [onSubmit]);
    return (
        <CardWrapper
            headerLabel="Confirmando sua Verificação!"
            headerText=""
            backButtonLabel="Voltar Para o Login"
            backButtonHref="/auth/login"
        >
            <div className="flex items-center w-full justify-center">
                {!success && !error && <ClipLoader />}
            </div>
            <div className="flex items-center w-full justify-center">
                <FormSuccess message={success} />
                <FormError message={error} />
            </div>
        </CardWrapper>
    );
}
