import React from "react";
import { useForm } from "react-hook-form";
import Field from "../common/Field";
import SectionCard from "../common/SectionCard";
import ProfileHeader from "./ProfileHeader";
import { COLORS } from "../../constants/theme";
import type { PersonalInfoData } from "../../types/candidateProfile";

interface PersonalInfoStepProps {
  defaultValues: PersonalInfoData;
  onNext: (data: PersonalInfoData) => void;
}

export default function PersonalInfoStep({ defaultValues, onNext }: PersonalInfoStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalInfoData>({ defaultValues });

  const submit = (data: PersonalInfoData) => onNext(data);

  const initials =
    defaultValues.fullName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "SP";

  return (
    <SectionCard title="Personal profile" subtitle="A streamlined profile recruiters see first">
      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
        <ProfileHeader initials={initials} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Full name"
            placeholder="Enter your full name"
            error={errors.fullName?.message}
            {...register("fullName", { required: "Full name is required" })}
          />
          <Field
            label="Professional title"
            placeholder="e.g. Senior AI Developer"
            {...register("title")}
          />
          <Field
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
            })}
          />
          <Field label="Phone" type="tel" placeholder="+94 7X XXX XXXX" {...register("phone")} />
          <Field label="Location" placeholder="City, Country" {...register("location")} />
          <Field
            label="Years of experience"
            type="number"
            min={0}
            placeholder="e.g. 3"
            {...register("yearsExperience", { valueAsNumber: true, min: 0 })}
          />
        </div>

        <div className="flex justify-end pt-2">
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
