import { NextResponse } from "next/server";

const USER_AGENT = "kuzeybati-haber/1.0 (onthisday-widget)";

function dayMonthNow() {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return { day, month };
}

export async function GET() {
  const { day, month } = dayMonthNow();
  const url = `https://api.wikimedia.org/feed/v1/wikipedia/tr/onthisday/events/${month}/${day}`;

  const res = await fetch(url, {
    headers: {
      accept: "application/json",
      "user-agent": USER_AGENT,
    },
  });

  if (!res.ok) {
    return NextResponse.json(
      { events: [] },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=3600",
        },
      }
    );
  }

  const json = (await res.json()) as any;
  const events = Array.isArray(json?.events) ? json.events : [];

  return NextResponse.json(
    { events: events.slice(0, 5) },
    {
      status: 200,
      headers: {
        // 1 saat cache – eski revalidate = 60*60 birebir karşılığı
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=3600",
      },
    }
  );
}
