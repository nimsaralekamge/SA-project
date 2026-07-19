import React, { forwardRef, type TextareaHTMLAttributes } from "react";
import { COLORS } from "../../constants/theme";

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  function TextAreaField({ label, error, rows = 3, ...props }, ref) {
    return (
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium" style={{ color: COLORS.textSecondary }}>
          {label}
        </span>
        <textarea
          ref={ref}
          rows={rows}
          {...props}
          className="text-sm rounded-lg px-3 py-2 outline-none resize-none transition-colors"
          style={{
            backgroundColor: COLORS.panelAlt,
            border: `1px solid ${error ? COLORS.danger : COLORS.border}`,
            color: COLORS.textPrimary,
          }}
          onFocus={(e) => {
            if (!error) e.currentTarget.style.borderColor = COLORS.teal;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error ? COLORS.danger : COLORS.border;
          }}
        />
        {error && (
          <span className="text-[11px]" style={{ color: COLORS.danger }}>
            {error}
          </span>
        )}
      </label>
    );
  }
);

export default TextAreaField;
