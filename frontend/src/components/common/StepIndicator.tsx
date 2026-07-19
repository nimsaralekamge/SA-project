import React from "react";
import { Check } from "lucide-react";
import { COLORS } from "../../constants/theme";
import { STEPS, type StepId } from "../../types/candidateProfile";

interface StepIndicatorProps {
  currentStep: StepId;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className="flex items-center mb-6">
      {STEPS.map((step, index) => {
        const isComplete = index < currentIndex;
        const isActive = index === currentIndex;
        const circleColor = isComplete || isActive ? COLORS.cyan : COLORS.border;
        const textColor = isComplete || isActive ? "#FFFFFF" : COLORS.textSecondary;

        return (
          <React.Fragment key={step.id}>
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0"
                style={{
                  backgroundColor: isComplete ? COLORS.cyan : "transparent",
                  border: `1.5px solid ${circleColor}`,
                  color: isComplete ? COLORS.bg : circleColor,
                }}
              >
                {isComplete ? <Check size={12} /> : index + 1}
              </div>
              <span className="text-xs font-medium hidden sm:inline" style={{ color: textColor }}>
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className="flex-1 h-px mx-3"
                style={{ backgroundColor: index < currentIndex ? COLORS.cyan : COLORS.border }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
