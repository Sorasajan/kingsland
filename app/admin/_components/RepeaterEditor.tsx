"use client";

import { Plus, X } from "lucide-react";

export interface RepeaterField {
  key: string;
  label: string;
  type?: "text" | "number" | "list"; // "list" = comma-separated array field
  placeholder?: string;
}

export default function RepeaterEditor({
  label,
  description,
  fields,
  rows,
  onChange,
}: {
  label: string;
  description?: string;
  fields: RepeaterField[];
  rows: Record<string, any>[];
  onChange: (rows: Record<string, any>[]) => void;
}) {
  function updateRow(idx: number, key: string, value: unknown) {
    const next = [...rows];
    next[idx] = { ...next[idx], [key]: value };
    onChange(next);
  }

  function addRow() {
    const blank: Record<string, any> = {};
    for (const f of fields) blank[f.key] = f.type === "list" ? [] : "";
    onChange([...rows, blank]);
  }

  function removeRow(idx: number) {
    onChange(rows.filter((_, i) => i !== idx));
  }

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
      {description && <p className="text-xs text-slate-400 mb-2">{description}</p>}

      <div className="space-y-3">
        {rows.map((row, idx) => (
          <div key={idx} className="border border-slate-200 rounded-xl p-3 relative bg-slate-50/50">
            <button
              type="button"
              onClick={() => removeRow(idx)}
              className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
              title="Remove row"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="grid grid-cols-2 gap-3 pr-8">
              {fields.map((f) => (
                <div key={f.key} className={f.type === "list" ? "col-span-2" : ""}>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">{f.label}</label>
                  <input
                    type={f.type === "number" ? "number" : "text"}
                    value={
                      f.type === "list"
                        ? (row[f.key] || []).join(", ")
                        : row[f.key] ?? ""
                    }
                    onChange={(e) =>
                      updateRow(
                        idx,
                        f.key,
                        f.type === "list"
                          ? e.target.value.split(",").map((v) => v.trim()).filter(Boolean)
                          : e.target.value
                      )
                    }
                    placeholder={f.placeholder}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent bg-white"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {rows.length === 0 && (
        <p className="text-xs text-slate-400 italic mb-2">Nothing added yet.</p>
      )}

      <button
        type="button"
        onClick={addRow}
        className="mt-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg inline-flex items-center gap-1 transition-colors"
      >
        <Plus className="w-3.5 h-3.5" /> Add
      </button>
    </div>
  );
}
