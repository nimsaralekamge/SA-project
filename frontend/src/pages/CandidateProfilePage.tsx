import { useEffect, useRef, useState } from "react";
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

const API_BASE = "http://localhost:5016"; // Update if your backend port is different
const SAVED_PROFILE_ID_KEY = "candidateProfileId";

async function saveProfile(data: CandidateProfileFormData): Promise<any> {
  const formData = new FormData();

  formData.append("fullName", data.fullName || "");
  formData.append("title", data.title || "");
  formData.append("email", data.email || "");
  formData.append("phone", data.phone || "");
  formData.append("location", data.location || "");
  formData.append("yearsExperience", data.yearsExperience.toString());
  formData.append("summary", data.summary || "");

  formData.append("skills",
    JSON.stringify(data.skills || [])
  );

  if (data.photo) {
    formData.append("photo", data.photo);
  }

  if (data.file) {
    formData.append("resume", data.file);
  }

  console.log("Calling API:", `${API_BASE}/api/CandidateProfile`);
  const response = await fetch(`${API_BASE}/api/CandidateProfile`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to save: ${response.status} ${errorText}`);
  }

  const result = await response.json();

  console.log("✅ Profile saved successfully!");
  console.log(result);

  return result;
}

function parseSkills(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

export default function CandidateProfilePage() {
  const [step, setStep] = useState<StepId>("personal");
  const [profile, setProfile] = useState<CandidateProfileFormData>(EMPTY_PROFILE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [savedPhotoUrl, setSavedPhotoUrl] = useState<string | null>(null);
  const [isCheckingSavedProfile, setIsCheckingSavedProfile] = useState<boolean>(
    () => typeof window !== "undefined" && !!localStorage.getItem(SAVED_PROFILE_ID_KEY)
  );
  const hasLoadedDraft = useRef(false);

  // On mount: if we already have a saved profile (submitted previously, even on a
  // different visit/page), fetch it and show the saved view instead of the form.
  useEffect(() => {
    const savedId = localStorage.getItem(SAVED_PROFILE_ID_KEY);
    if (!savedId) {
      setIsCheckingSavedProfile(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const response = await fetch(`${API_BASE}/api/CandidateProfile/${savedId}`);
        if (!response.ok) throw new Error("Saved profile not found");

        const data = await response.json();
        if (cancelled) return;

        setProfile((prev) => ({
          ...prev,
          fullName: data.fullName ?? "",
          title: data.title ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          location: data.location ?? "",
          yearsExperience: data.yearsExperience ?? 0,
          summary: data.summary ?? "",
          skills: parseSkills(data.skills),
          file: null,
          photo: null,
        }));
        setSavedPhotoUrl(data.photoUrl ? `${API_BASE}${data.photoUrl}` : null);
        setIsSubmitted(true);
        setStep("review");
      } catch (error) {
        console.error("Could not load saved profile:", error);
        localStorage.removeItem(SAVED_PROFILE_ID_KEY);
      } finally {
        if (!cancelled) {
          setIsCheckingSavedProfile(false);
          hasLoadedDraft.current = true;
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (isCheckingSavedProfile) return; // don't load a draft over a profile we're about to show as saved
    const draft = loadDraft();
    setProfile((prev) => ({ ...prev, ...draft }));
    hasLoadedDraft.current = true;
  }, [isCheckingSavedProfile]);

  useEffect(() => {
    if (!hasLoadedDraft.current || isSubmitted) return;
    const { file, photo, ...draftable } = profile;
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
    console.log("PROFILE:", profile);

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const result = await saveProfile(profile);

      console.log("SUCCESS");

      if (result?.id) {
        localStorage.setItem(SAVED_PROFILE_ID_KEY, String(result.id));
      }
      setSavedPhotoUrl(result?.photoUrl ? `${API_BASE}${result.photoUrl}` : null);
      setIsSubmitted(true);
      clearDraft();
    } catch (error) {
      console.error("SUBMIT ERROR:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong while saving your profile. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartNewProfile = () => {
    localStorage.removeItem(SAVED_PROFILE_ID_KEY);
    setSavedPhotoUrl(null);
    setIsSubmitted(false);
    setStep("personal");
  };

  const initials = profile.fullName
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
            {isCheckingSavedProfile ? (
              <div className="flex justify-center py-16 text-sm" style={{ color: COLORS.textSecondary }}>
                Loading your profile...
              </div>
            ) : (
              <>
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
                      photo: profile.photo,
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
                    submitError={submitError}
                    savedPhotoUrl={savedPhotoUrl}
                  />
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}