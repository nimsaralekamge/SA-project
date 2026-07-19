import React, { forwardRef, type InputHTMLAttributes } from "react";
import { COLORS } from "../../constants/theme";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

/**
 * forwardRef lets this be used directly with react-hook-form:
 *   <Field label="Full name" {...register("fullName", { required: true })} />
 */
const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, error, ...props },
  ref
) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium" style={{ color: COLORS.textSecondary }}>
        {label}
      </span>
      <input
        ref={ref}
        {...props}
        className="text-sm rounded-lg px-3 py-2 outline-none transition-colors"
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
});

export default Field;
