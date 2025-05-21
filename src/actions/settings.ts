"use server";

import { db } from "@/lib/db";

export default async function Settings(formData : FormData, id:string){
    await db.user.update(({
        where:{id},
        data:{
            name: formData.get("name") as string,
            email:formData.get("email") as string,
            gender:formData.get("gender") as string,
            dateBirth: formData.get("dateBirth") as string,
            image:formData.get("image") as string,
            isTwoFactorEnabled: formData.get("isTwoFactorEnabled") === "FALSE",
        }
    }))
}