import React from "react";
import { COLORS } from "../../constants/theme";
import { NAV_ITEMS } from "../../constants/navigation";

export default function SideNav() {
  return (
    <div
      className="hidden md:flex flex-col w-48 py-4 px-3 gap-1 shrink-0"
      style={{ backgroundColor: COLORS.bg, borderRight: `1px solid ${COLORS.border}` }}
    >
      {NAV_ITEMS.map(({ icon: Icon, label, active }) => (
        <div
          key={label}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors"
          style={{
            backgroundColor: active ? "rgba(12,242,242,0.08)" : "transparent",
            color: active ? COLORS.cyan : COLORS.textSecondary,
            borderLeft: active ? `2px solid ${COLORS.cyan}` : "2px solid transparent",
          }}
        >
          <Icon size={16} />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
