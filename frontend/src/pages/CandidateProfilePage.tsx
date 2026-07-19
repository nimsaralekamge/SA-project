import React, { useEffect, useRef, useState } from "react";
import TopBar from "../components/common/TopBar";
import SideNav from "../components/common/SideNav";
import StepIndicator from "../components/common/StepIndicator";
import PersonalInfoStep from "../components/candidate-profile/PersonalInfoStep";
import SkillsStep from "../components/candidate-profile/SkillsStep";
import ResumeUploadStep from "../components/candidate-profile/ResumeUploadStep";
import ReviewStep from "../components/candidate-profile/ReviewStep";
import { COLORS } from "../constants/theme";
import { loadDraft, saveDraft, clearDraft } from "../utils/localStorageDraft";
import {
  EMPTY_PROFILE,
  type CandidateProfileFormData,
  type PersonalInfoData,
  type SkillsData,
  type StepId,
} from "../types/candidateProfile";

/**
 * Swap this for a real API call, e.g.:
 *   const fd = new FormData();
 *   if (data.file) fd.append("resume", data.file);
 *   fd.append("profile", JSON.stringify({ ...rest }));
 *   await fetch("/api/candidates/profile", { method: "POST", body: fd });
 */
async function saveProfile(data: CandidateProfileFormData): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 900));
  console.log("Saving candidate profile:", data);
}

export default function CandidateProfilePage() {
  const [step, setStep] = useState<StepId>("personal");
  const [profile, setProfile] = useState<CandidateProfileFormData>(EMPTY_PROFILE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const hasLoadedDraft = useRef(false);

  // Restore a saved draft on first mount (resume file itself can't be
  // persisted — see utils/localStorageDraft.ts).
  useEffect(() => {
    const draft = loadDraft();
    setProfile((prev) => ({ ...prev, ...draft }));
    hasLoadedDraft.current = true;
  }, []);

  // Persist the draft whenever the profile changes, once the initial
  // load has completed (avoids immediately re-saving the empty default).
  useEffect(() => {
    if (!hasLoadedDraft.current || isSubmitted) return;
    const { file, ...draftable } = profile;
    saveDraft(draftable);
  }, [profile, isSubmitted]);

  const handlePersonalInfoNext = (data: PersonalInfoData) => {
    setProfile((prev) => ({ ...prev, ...data }));
    setStep("skills");
  };

  const handleSkillsNext = (data: SkillsData) => {
    setProfile((prev) => ({ ...prev, ...data }));
    setStep("resume");
  };

  const handleResumeNext = (file: File | null) => {
    setProfile((prev) => ({ ...prev, file }));
    setStep("review");
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      await saveProfile(profile);
      setIsSubmitted(true);
      clearDraft();
    } finally {
      setIsSubmitting(false);
    }
  };

  // "Edit profile" from the success screen — keeps the entered data,
  // just drops back into edit mode instead of wiping the form.
  const handleStartNewProfile = () => {
    setIsSubmitted(false);
    setStep("personal");
  };

  const initials =
    profile.fullName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "SP";

  return (
    <div className="min-h-screen w-full flex flex-col" style={{ backgroundColor: COLORS.bg }}>
      <TopBar userName={profile.fullName || "Sarah Perera"} userInitials={initials} />
      <div className="flex flex-1">
        <SideNav />
        <main className="flex-1 p-6">
          <div className="max-w-xl mx-auto">
            {!isSubmitted && <StepIndicator currentStep={step} />}

            {step === "personal" && (
              <PersonalInfoStep
                defaultValues={{
                  fullName: profile.fullName,
                  title: profile.title,
                  email: profile.email,
                  phone: profile.phone,
                  location: profile.location,
                  yearsExperience: profile.yearsExperience,
                }}
                onNext={handlePersonalInfoNext}
              />
            )}

            {step === "skills" && (
              <SkillsStep
                defaultValues={{ summary: profile.summary, skills: profile.skills }}
                onNext={handleSkillsNext}
                onBack={() => setStep("personal")}
              />
            )}

            {step === "resume" && (
              <ResumeUploadStep
                defaultFile={profile.file}
                onBack={() => setStep("skills")}
                onNext={handleResumeNext}
              />
            )}

            {step === "review" && (
              <ReviewStep
                profile={profile}
                onEditStep={(target) => setStep(target)}
                onBack={() => setStep("resume")}
                onSubmit={handleFinalSubmit}
                isSubmitting={isSubmitting}
                isSubmitted={isSubmitted}
                onStartNewProfile={handleStartNewProfile}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
