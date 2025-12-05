import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { homeTeam, awayTeam } = await req.json();

    if (!homeTeam || !awayTeam) {
      return NextResponse.json(
        { error: "Times inválidos. Envie homeTeam e awayTeam." },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_FOOTBALL_API_KEY;
    const apiUrl = process.env.NEXT_PUBLIC_FOOTBALL_API_URL;

    if (!apiKey || !apiUrl) {
      return NextResponse.json(
        { error: "Variáveis de ambiente ausentes." },
        { status: 500 }
      );
    }

    const homeRes = await fetch(`${apiUrl}teams?search=${homeTeam}`, {
      headers: { "x-apisports-key": apiKey },
    });

    const homeData = await homeRes.json();

    if (!homeData.response?.length) {
      return NextResponse.json(
        { error: "Time mandante não encontrado." },
        { status: 404 }
      );
    }

    const homeId = homeData.response[0].team.id;

    const awayRes = await fetch(`${apiUrl}teams?search=${awayTeam}`, {
      headers: { "x-apisports-key": apiKey },
    });

    const awayData = await awayRes.json();

    if (!awayData.response?.length) {
      return NextResponse.json(
        { error: "Time visitante não encontrado." },
        { status: 404 }
      );
    }

    const awayId = awayData.response[0].team.id;

    const statsRes = await fetch(`${apiUrl}fixtures/headtohead?h2h=${homeId}-${awayId}`, {
      headers: { "x-apisports-key": apiKey },
    });

    const statsData = await statsRes.json();

    if (!statsData.response?.length) {
      return NextResponse.json(
        { error: "Nenhum dado de confrontos encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Análise realizada com sucesso!",
      confronto: statsData.response,
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Erro interno ao analisar jogo.",
        detalhes: error.message,
      },
      { status: 500 }
    );
  }
}


