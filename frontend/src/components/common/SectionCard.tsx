import React, { type ReactNode } from "react";
import { COLORS } from "../../constants/theme";

interface SectionCardProps {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  children: ReactNode;
}

export default function SectionCard({ title, subtitle, right, children }: SectionCardProps) {
  return (
    <div
      className="rounded-xl p-5"
      style={{ backgroundColor: COLORS.panel, border: `1px solid ${COLORS.border}` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-white">{title}</h2>
          {subtitle && (
            <p className="text-xs mt-0.5" style={{ color: COLORS.textSecondary }}>
              {subtitle}
            </p>
          )}
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}
