import { auth, signOut } from "@/auth";
import { Header } from "@/components/layout/Header";

export default async function SettingsPage() {
    const session = await auth();
    const user = session?.user;

    return (
        <div className="flex flex-col h-full">
            <main className="flex-grow p-6">
                <h2 className="text-lg font-semibold">Account Settings</h2>
                {user ? (
                    <div>
                        <p>{user.name}</p>
                        <p>{user.email}</p>
                        {JSON.stringify(user, null, 2)}

                        <form
                            action={async () => {
                                "use server";
                                await signOut();
                            }}
                            className="mt-6"
                        >
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Sign Out
                            </button>
                        </form>
                    </div>
                ) : (
                    <p>No active session found.</p>
                )}
            </main>
        </div>
    );
}
