import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const uf = req.nextUrl.searchParams.get("uf");
  const crm = req.nextUrl.searchParams.get("crm");

  if (!uf || !crm) {
    return NextResponse.json({ error: "Parâmetros inválidos" }, { status: 400 });
  }

  try {
    const response = await fetch(`https://portal.cfm.org.br/api/medicos/crm/${uf}/${crm}`);

    if (!response.ok) {
      return NextResponse.json({ error: "Médico não encontrado" }, { status: 404 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Erro na requisição externa" }, { status: 500 });
  }
}
