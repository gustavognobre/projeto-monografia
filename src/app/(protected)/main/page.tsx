import MainPage from "@/templates/MainPage.template";
import { auth } from "@/auth";

export default async function SettingsPage() {
    const session = await auth();
    const user = session?.user;

    return <MainPage user={user} session={session} />;
}
