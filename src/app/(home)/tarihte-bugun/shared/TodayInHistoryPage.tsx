import TodayInHistoryClient from "./TodayInHistoryClient";
import type { OnThisDayResponse, OnThisDayEvent } from "./types";
import { dayMonthNow, formatDateLabelTR, onThisDayUrlTR } from "./utils";

async function fetchTodayTR(): Promise<{
  events: OnThisDayEvent[];
  dateLabel: string;
}> {
  const { day, month, date } = dayMonthNow();
  const url = onThisDayUrlTR(month, day);

  const res = await fetch(url, {
    next: { revalidate: 60 * 60 }, // 1 saat
    headers: { accept: "application/json" },
  });

  if (!res.ok) {
    return { events: [], dateLabel: formatDateLabelTR(date) };
  }

  const json = (await res.json()) as OnThisDayResponse;
  const events = Array.isArray(json?.events) ? json.events.slice(0, 24) : [];

  return { events, dateLabel: formatDateLabelTR(date) };
}

export default async function TodayInHistoryPage() {
  const { events, dateLabel } = await fetchTodayTR();
  return <TodayInHistoryClient initialEvents={events} dateLabel={dateLabel} />;
}
