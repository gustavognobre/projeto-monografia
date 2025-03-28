import { getUser } from "@/lib/get-user"; // Importa a função que busca o usuário

export default async function SettingsPage() {
    const user = await getUser(); // Obtém todas as informações do usuário

    if (!user) {
        return <h1>Usuário não autenticado ou não encontrado</h1>;
    }

    return (
        <div>
            <h1>Informações do Usuário</h1>
            <ul>
                {Object.entries(user).map(([key, value]) => (
                    <li key={key}>
                        <strong>{key}:</strong> {String(value)}
                    </li>
                ))}
            </ul>
        </div>
    );
}
