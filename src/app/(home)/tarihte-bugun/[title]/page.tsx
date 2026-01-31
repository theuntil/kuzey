import { notFound } from "next/navigation";
import TodayInHistoryDetail from "../shared/TodayInHistoryDetailPage";
import { decodeWikiTitle, stripHtml } from "../shared/utils";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ title: string }>;
  searchParams?: Promise<{ year?: string; event?: string }>;
}) {
  const { title: raw } = await params;
  const sp = (await searchParams) ?? {};

  const title = decodeWikiTitle(raw);
  if (!title) notFound();

  const year = typeof sp.year === "string" ? sp.year : undefined;
  const eventText =
    typeof sp.event === "string"
      ? stripHtml(decodeURIComponent(sp.event))
      : undefined;

  return <TodayInHistoryDetail title={title} year={year} eventText={eventText} />;
}
