import { auth, signOut } from "@/auth";

export default async function SettingsPage() {
    const session = await auth();
    const user = session?.user;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-bold text-center mb-4">Account Settings</h2>

                {user ? (
                    <div className="text-center">
                        <p className="text-lg font-medium">{user.name}</p>
                        <p className="text-gray-600">{user.email}</p>

                        {/* Exibe todos os dados do usuário */}
                        <pre className="bg-gray-200 p-4 rounded text-sm text-left overflow-auto">
                            {JSON.stringify(user, null, 2)}
                        </pre>

                        <form
                            action={async () => {
                                "use server";
                                await signOut();
                            }}
                            className="mt-6"
                        >
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
                            >
                                Sign Out
                            </button>
                        </form>
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No active session found.</p>
                )}
            </div>
        </div>
    );
}
