import React from "react";
import { Pencil } from "lucide-react";
import { COLORS } from "../../constants/theme";

interface ProfileHeaderProps {
  initials: string;
  onChangePhoto?: () => void;
}

export default function ProfileHeader({ initials, onChangePhoto }: ProfileHeaderProps) {
  return (
    <div className="flex items-center gap-4 mb-1">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-semibold"
        style={{ backgroundColor: COLORS.blue, color: "white" }}
      >
        {initials}
      </div>
      <button
        type="button"
        onClick={onChangePhoto}
        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg"
        style={{
          border: `1px solid ${COLORS.border}`,
          color: COLORS.textSecondary,
          backgroundColor: COLORS.panelAlt,
        }}
      >
        <Pencil size={12} /> Change photo
      </button>
    </div>
  );
}
