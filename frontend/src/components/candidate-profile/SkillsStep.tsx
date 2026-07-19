import React, { useState, type KeyboardEvent } from "react";
import { useForm } from "react-hook-form";
import { Plus, X } from "lucide-react";
import TextAreaField from "../common/TextAreaField";
import SectionCard from "../common/SectionCard";
import { COLORS } from "../../constants/theme";
import type { SkillsData } from "../../types/candidateProfile";

interface SkillsStepProps {
  defaultValues: SkillsData;
  onNext: (data: SkillsData) => void;
  onBack: () => void;
}

export default function SkillsStep({ defaultValues, onNext, onBack }: SkillsStepProps) {
  const { register, handleSubmit } = useForm<{ summary: string }>({
    defaultValues: { summary: defaultValues.summary },
  });
  const [skills, setSkills] = useState<string[]>(defaultValues.skills);
  const [skillInput, setSkillInput] = useState("");

  const addSkill = () => {
    const value = skillInput.trim();
    if (value && !skills.includes(value)) {
      setSkills((prev) => [...prev, value]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => setSkills((prev) => prev.filter((s) => s !== skill));

  const handleSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const submit = ({ summary }: { summary: string }) => onNext({ summary, skills });

  return (
    <SectionCard title="Summary and skills" subtitle="Tell recruiters what you're good at">
      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
        <TextAreaField
          label="Professional summary"
          placeholder="A short summary of your experience and goals"
          {...register("summary")}
        />

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium" style={{ color: COLORS.textSecondary }}>
            Key skills
          </span>
          <div className="flex flex-wrap gap-2 mb-1">
            {skills.map((skill) => (
              <span
                key={skill}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full"
                style={{ backgroundColor: "rgba(39,102,140,0.25)", color: "#8FCBEF" }}
              >
                {skill}
                <X size={11} className="cursor-pointer" onClick={() => removeSkill(skill)} />
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              placeholder="Add a skill and press Enter"
              className="flex-1 text-sm rounded-lg px-3 py-2 outline-none"
              style={{
                backgroundColor: COLORS.panelAlt,
                border: `1px solid ${COLORS.border}`,
                color: COLORS.textPrimary,
              }}
            />
            <button
              type="button"
              onClick={addSkill}
              className="flex items-center gap-1 px-3 rounded-lg text-xs font-medium"
              style={{ backgroundColor: COLORS.panelAlt, border: `1px solid ${COLORS.border}`, color: COLORS.teal }}
            >
              <Plus size={13} /> Add
            </button>
          </div>
        </div>

        <div className="flex justify-between pt-2">
          <button
            type="button"
            onClick={onBack}
            className="text-sm font-medium px-5 py-2 rounded-lg"
            style={{ border: `1px solid ${COLORS.border}`, color: COLORS.textSecondary }}
          >
            Back
          </button>
          <button
            type="submit"
            className="text-sm font-semibold px-5 py-2 rounded-lg transition-opacity hover:opacity-90"
            style={{ backgroundColor: COLORS.cyan, color: COLORS.bg }}
          >
            Continue
          </button>
        </div>
      </form>
    </SectionCard>
  );
}
