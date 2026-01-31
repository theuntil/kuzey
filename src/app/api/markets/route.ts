import { NextResponse } from "next/server";

/**
 * EVDS (TCMB) - Döviz Kurları
 * - Son 15 gün tarama (hafta sonu / tatil fallback)
 * - Son 2 geçerli günü bulur -> diff / pct hesaplar
 * - cache: no-store (EVDS için ideal)
 */

// 10+ para birimi (istediğin kadar arttır)
const SERIES: Record<string, string> = {
  USD: "TP.DK.USD.A",
  EUR: "TP.DK.EUR.A",
  GBP: "TP.DK.GBP.A",
  CHF: "TP.DK.CHF.A",
  DKK: "TP.DK.DKK.A",
  JPY: "TP.DK.JPY.A",

  // ekstra
  CAD: "TP.DK.CAD.A",
  AUD: "TP.DK.AUD.A",
  SEK: "TP.DK.SEK.A",
  NOK: "TP.DK.NOK.A",
  SAR: "TP.DK.SAR.A",
  RUB: "TP.DK.RUB.A",
  CNY: "TP.DK.CNY.A",
};

function format(d: Date) {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

type EvdsRow = Record<string, string | null> & { Tarih?: string };

export async function GET() {
  try {
    const key = process.env.TCMB_EVDS_KEY;
    if (!key) {
      return NextResponse.json(
        { success: false, error: "EVDS key missing" },
        { status: 500 }
      );
    }

    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 15);

    const seriesParam = Object.values(SERIES).join("-");

    const url =
      `https://evds2.tcmb.gov.tr/service/evds/` +
      `series=${seriesParam}` +
      `&startDate=${format(start)}` +
      `&endDate=${format(end)}` +
      `&type=json`;

    const res = await fetch(url, {
      headers: { key },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ success: false }, { status: 500 });
    }

    const json = await res.json();
    const rows: EvdsRow[] = json.items ?? [];

    if (rows.length < 2) {
      return NextResponse.json({
        success: true,
        data: [],
        updatedAt: new Date().toISOString(),
      });
    }

    // helper: geçerli numeric değer mi
    function pickNum(raw: unknown) {
      if (raw === null || raw === undefined) return null;
      if (raw === "") return null;
      const n = Number(raw);
      if (!Number.isFinite(n) || n <= 0) return null;
      return n;
    }

    const data = Object.entries(SERIES)
      .map(([code, serie]) => {
        const field = serie.replaceAll(".", "_"); // TP.DK.USD.A -> TP_DK_USD_A

        let latest: number | null = null;
        let previous: number | null = null;

        // sondan geriye 2 geçerli değer bul
        for (let i = rows.length - 1; i >= 0; i--) {
          const val = pickNum(rows[i]?.[field]);
          if (val === null) continue;

          if (latest === null) {
            latest = val;
          } else {
            previous = val;
            break;
          }
        }

        if (latest === null || previous === null) return null;

        const diff = latest - previous;
        const pct = (diff / previous) * 100;

        return { code, value: latest, diff, pct };
      })
      .filter(Boolean);

    return NextResponse.json({
      success: true,
      data,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("MARKETS ROUTE ERROR:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
