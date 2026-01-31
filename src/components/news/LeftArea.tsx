"use client";

import Market from "./Market";
import WeatherWidget from "./WeatherBox";
import PrayerTimesBox from "./PrayerTimesBox";

type Props = {
  city: string;
};

export default function LeftInfoPanel({ city }: Props) {
  return (
    <div className="animate-soft-in">
      
      {/* MOBİL: YATAY (MARKET YOK) */}
      <div className="flex flex-row gap-1 lg:hidden">
        <PrayerTimesBox city={city} />
        <WeatherWidget city={city} />
        {/* Market BURADA YOK */}
      </div>

      {/* DESKTOP: DİKEY (HEPSİ VAR) */}
      <div className="hidden lg:block space-y-6">
        <PrayerTimesBox city={city} />
        <WeatherWidget city={city} />
        <Market />
      </div>

    </div>
  );
}
