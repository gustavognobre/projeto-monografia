interface IUserPage {
    user: any;
    session: any;
}
export default function UsersPage({ user, session }: IUserPage) {
    return (
        <div className="flex flex-col h-full">
            <main className="flex-grow p-6">
                <h2 className="text-lg font-semibold">Dados do usuário</h2>
                {JSON.stringify(user, null, 2)}
            </main>
        </div>
    );
}
