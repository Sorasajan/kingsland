"use client";

import { COUNTRIES, flagEmoji } from "@/lib/countries";

export default function CountrySelect({
  value,
  onChange,
  label = "Country",
}: {
  value: string; // flagCode, e.g. "au"
  onChange: (next: { flagCode: string; flag: string; countryName: string }) => void;
  label?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
      <select
        value={value.toLowerCase()}
        onChange={(e) => {
          const code = e.target.value;
          const country = COUNTRIES.find((c) => c.code === code);
          onChange({
            flagCode: code,
            flag: flagEmoji(code),
            countryName: country?.name ?? "",
          });
        }}
        className="input bg-white"
      >
        <option value="">Select a country…</option>
        {COUNTRIES.map((c) => (
          <option key={c.code} value={c.code}>
            {flagEmoji(c.code)} {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
