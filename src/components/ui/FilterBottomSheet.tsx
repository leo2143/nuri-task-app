import { useState, useEffect } from "react";
import type { FilterConfig, FilterValues } from "../../interfaces";
import BottomSheet from "./BottomSheet";
import Button from "./Button";

interface FilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterConfig[];
  activeFilters: FilterValues;
  onApply: (values: FilterValues) => void;
}

export default function FilterBottomSheet({
  isOpen,
  onClose,
  filters,
  activeFilters,
  onApply,
}: FilterBottomSheetProps) {
  const [draft, setDraft] = useState<FilterValues>({ ...activeFilters });

  useEffect(() => {
    if (isOpen) setDraft({ ...activeFilters });
  }, [isOpen]);

  const handleChipToggle = (key: string, value: string) => {
    setDraft((prev) => ({
      ...prev,
      [key]: prev[key] === value ? undefined : value,
    }));
  };

  const handleDateChange = (key: string, value: string) => {
    setDraft((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const handleToggle = (key: string) => {
    setDraft((prev) => ({
      ...prev,
      [key]: prev[key] ? undefined : true,
    }));
  };

  const handleApply = () => {
    const cleaned: FilterValues = {};
    for (const [k, v] of Object.entries(draft)) {
      if (v !== undefined && v !== "") cleaned[k] = v;
    }
    onApply(cleaned);
    onClose();
  };

  const handleClear = () => {
    setDraft({});
  };

  const activeCount = Object.values(draft).filter(
    (v) => v !== undefined && v !== ""
  ).length;

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Filtros"
    >
      <div className="flex flex-col gap-6">
        {filters.map((filterCfg) => (
          <div key={filterCfg.key} className="flex flex-col gap-3">
            <h3 className="font-heading text-tertiary font-bold text-sm">
              {filterCfg.label}
            </h3>

            {filterCfg.type === "chips" && (
              <div className="flex flex-wrap gap-2">
                {filterCfg.options.map((opt) => {
                  const isActive = draft[filterCfg.key] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleChipToggle(filterCfg.key, opt.value)}
                      className={`rounded-full border px-4 py-2 font-body text-sm transition-colors duration-200 ${
                        isActive
                          ? "bg-brand text-white border-brand"
                          : "bg-white text-tertiary border-brand/30"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            )}

            {filterCfg.type === "date" && (
              <input
                type="date"
                value={(draft[filterCfg.key] as string) || ""}
                onChange={(e) =>
                  handleDateChange(filterCfg.key, e.target.value)
                }
                className="w-full px-4 py-3 rounded-lg bg-white border border-brand/30 font-body text-tertiary text-sm focus:outline-none focus:border-brand shadow-brand-glow"
              />
            )}

            {filterCfg.type === "toggle" && (
              <button
                type="button"
                onClick={() => handleToggle(filterCfg.key)}
                className={`self-start rounded-full border px-4 py-2 font-body text-sm transition-colors duration-200 ${
                  draft[filterCfg.key]
                    ? "bg-brand text-white border-brand"
                    : "bg-white text-tertiary border-brand/30"
                }`}
              >
                {draft[filterCfg.key] ? "Sí" : "No"}
              </button>
            )}
          </div>
        ))}

        <div className="flex flex-col gap-3 pt-4 border-t border-brand/10">
          <Button variant="primary" fullWidth onClick={handleApply}>
            Aplicar
          </Button>

          {activeCount > 0 && (
            <Button variant="ghost" fullWidth onClick={handleClear}>
              Limpiar filtros
            </Button>
          )}
        </div>
      </div>
    </BottomSheet>
  );
}
