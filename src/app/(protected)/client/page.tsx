import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function SettingsPage() {
  const users = await db.user.findMany();

  if (!users?.length) {
    return (
      <h1 className="text-center mt-10 text-muted-foreground">
        Nenhum usuário encontrado.
      </h1>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Usuários</h1>

      <div className="flex flex-col gap-6">
        {users.map((user) => (
          <Card
            key={user.id}
            className="w-full shadow-sm hover:shadow-md transition-all border-muted"
          >
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-primary">
                    {user.name ?? "Sem nome"}
                  </h2>

                  <p className="text-sm text-muted-foreground">{user.email ?? "Sem e-mail"}</p>
                </div>
                <Badge variant="secondary" className="h-fit">
                  {user.role ?? "Sem função"}
                </Badge>
              </div>

              <details className="text-sm">
                <summary className="cursor-pointer font-medium text-primary mb-2">
                  Ver mais informações
                </summary>
                <div className="mt-2 space-y-1 text-muted-foreground max-h-[300px] overflow-y-auto pr-2">
                  {Object.entries(user).map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b pb-1">
                      <span className="capitalize">{key.replace(/_/g, " ")}</span>
                      <span>
                        {typeof value === "boolean"
                          ? value
                            ? "Sim"
                            : "Não"
                          : value === null || value === undefined
                          ? "-"
                          : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </details>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
