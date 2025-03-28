import { db } from "@/lib/db"; 
import { currentUser } from "@/lib/auth"; 

export async function getUser() {
    const Thisuser = await currentUser(); 

    if (!Thisuser) return null; 
    const user = await db.user.findUnique({
        where: { id: Thisuser.id },
    });

    return user; 
}

