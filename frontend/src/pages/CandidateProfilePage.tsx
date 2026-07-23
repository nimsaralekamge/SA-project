import React, { useEffect, useRef, useState } from "react";
import SideNav from "../components/common/SideNav";
import StepIndicator from "../components/common/StepIndicator";
import PersonalInfoStep from "../components/candidate-profile/PersonalInfoStep";
import SkillsStep from "../components/candidate-profile/SkillsStep";
import ResumeUploadStep from "../components/candidate-profile/ResumeUploadStep";
import ReviewStep from "../components/candidate-profile/ReviewStep";
import { loadDraft, saveDraft, clearDraft } from "../utils/localStorageDraft";
import {
  EMPTY_PROFILE,
  type CandidateProfileFormData,
  type PersonalInfoData,
  type SkillsData,
  type StepId,
} from "../types/candidateProfile";
import {
  Bell,
  Search,
  UserCheck,
  Loader2,
  Edit3,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  FileText,
  Award,
  CheckCircle2,
  PlusCircle,
} from "lucide-react";

const C = {
  bg: "#080c10",
  panel: "#0d1318",
  panelAlt: "#121922",
  border: "rgba(255,255,255,0.06)",
  borderStrong: "rgba(255,255,255,0.14)",
  text: "#FFFFFF",
  textDim: "#5c7086",
  teal: "#22d9d9",
  blue: "#27668C",
} as const;

const API_BASE = "http://localhost:5016";
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
  formData.append("skills", JSON.stringify(data.skills || []));

  if (data.photo) {
    formData.append("photo", data.photo);
  }

  if (data.file) {
    formData.append("resume", data.file);
  }

  const response = await fetch(`${API_BASE}/api/CandidateProfile`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to save: ${response.status} ${errorText}`);
  }

  return await response.json();
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
    if (isCheckingSavedProfile) return;
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
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const result = await saveProfile(profile);

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

  const handleEditProfile = () => {
    setIsSubmitted(false);
    setStep("personal");
  };

  const handleStartNewProfile = () => {
    localStorage.removeItem(SAVED_PROFILE_ID_KEY);
    setSavedPhotoUrl(null);
    setProfile(EMPTY_PROFILE);
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
    <div className="w-full min-h-screen flex flex-col font-sans" style={{ background: C.bg, color: C.text }}>
      
      {/* Top Application Nav Bar */}
      <nav
        className="w-full px-10 py-5 border-b sticky top-0 z-20 backdrop-blur-md shadow-lg flex justify-between items-center"
        style={{ borderColor: C.border, background: `${C.bg}EE` }}
      >
        <div className="flex items-center gap-3">
          <div
            className="h-9 w-9 rounded-xl flex items-center justify-center font-bold text-base shadow-lg"
            style={{ background: `linear-gradient(135deg, ${C.teal}, #0f5f5f)`, color: "#08101b" }}
          >
            TF
          </div>
          <span className="font-extrabold tracking-tight text-lg" style={{ color: C.text }}>
            Talent<span style={{ color: C.teal }}>Flow</span> AI
          </span>
        </div>

        <div className="flex-1 max-w-xl mx-8 relative hidden md:block">
          <input
            type="text"
            placeholder="Search candidates, skills, or records..."
            className="w-full border rounded-xl pl-11 pr-4 py-2.5 text-sm outline-none transition-all shadow-inner"
            style={{ background: C.panelAlt, borderColor: C.border, color: C.text }}
          />
          <div className="absolute left-3.5 top-3" style={{ color: C.textDim }}>
            <Search size={16} />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div
            className="relative p-2.5 rounded-xl shadow-inner shrink-0 cursor-pointer"
            style={{ background: C.panel, border: `1px solid ${C.border}` }}
          >
            <Bell size={18} style={{ color: C.textDim }} />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full" style={{ background: C.teal }}></span>
          </div>
          <div className="flex items-center gap-3 pl-3 border-l shrink-0" style={{ borderColor: C.border }}>
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold shadow-md overflow-hidden"
              style={{ background: `linear-gradient(135deg, #3c5a76, #1c2c3d)`, color: C.text }}
            >
              {savedPhotoUrl ? (
                <img src={savedPhotoUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <div className="text-right hidden sm:block leading-tight">
              <div className="text-xs font-bold" style={{ color: C.text }}>
                {profile.fullName || "Candidate"}
              </div>
              <div className="text-[10px] font-semibold tracking-wider mt-0.5" style={{ color: C.teal }}>
                {profile.title || "SOFTWARE ENGINEER"}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Layout Area */}
      <div className="flex flex-1 overflow-hidden">
        <SideNav />

        <main className="p-8 md:p-10 flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">

            {/* Page Title */}
            <div className="flex justify-between items-end pb-2">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3" style={{ color: C.text }}>
                  <UserCheck size={30} style={{ color: C.teal }} />
                  {isSubmitted ? "Candidate Profile Overview" : "Candidate Profile Setup"}
                </h1>
                <p className="mt-1.5 text-sm" style={{ color: C.textDim }}>
                  {isSubmitted
                    ? "Your profile is verified and active in the TalentFlow database."
                    : "Complete your profile information to sync with our AI parsing ecosystem."}
                </p>
              </div>
            </div>

            {/* Main Content Card */}
            <div
              className="rounded-2xl border p-6 md:p-8 shadow-2xl relative"
              style={{ background: C.panel, borderColor: C.border }}
            >
              {isCheckingSavedProfile ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3" style={{ color: C.teal }}>
                  <Loader2 size={32} className="animate-spin" />
                  <span className="text-xs font-semibold" style={{ color: C.textDim }}>
                    Retrieving your saved profile details...
                  </span>
                </div>
              ) : isSubmitted ? (
                /* ========================================================= */
                /* SUCCESSFUL / SAVED PROFILE VIEW WITH EDIT BUTTON          */
                /* ========================================================= */
                <div className="space-y-8">
                  {/* Top Status Banner */}
                  <div
                    className="p-4 rounded-xl flex items-center justify-between border"
                    style={{ background: "rgba(34,217,217,0.08)", borderColor: `${C.teal}40` }}
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 size={22} style={{ color: C.teal }} />
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: C.teal }}>
                          Profile Active & Synced
                        </h4>
                        <p className="text-[11px]" style={{ color: C.textDim }}>
                          All details are safely stored in your database record.
                        </p>
                      </div>
                    </div>

                    {/* EDIT PROFILE BUTTON */}
                    <button
                      onClick={handleEditProfile}
                      className="px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all hover:scale-105 shadow-md"
                      style={{
                        background: `linear-gradient(135deg, ${C.teal}, #0f5f5f)`,
                        color: "#08101b",
                      }}
                    >
                      <Edit3 size={15} /> Edit Profile
                    </button>
                  </div>

                  {/* Profile Header Info */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-xl border" style={{ background: C.panelAlt, borderColor: C.border }}>
                    <div
                      className="h-24 w-24 rounded-2xl flex items-center justify-center text-2xl font-extrabold shadow-xl border shrink-0 overflow-hidden"
                      style={{ background: `linear-gradient(135deg, #27668C, #121922)`, borderColor: C.border, color: C.text }}
                    >
                      {savedPhotoUrl ? (
                        <img src={savedPhotoUrl} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        initials
                      )}
                    </div>

                    <div className="space-y-2 text-center sm:text-left flex-1">
                      <h2 className="text-2xl font-extrabold" style={{ color: C.text }}>
                        {profile.fullName || "N/A"}
                      </h2>
                      <p className="text-xs font-bold uppercase tracking-wider" style={{ color: C.teal }}>
                        {profile.title || "Title Not Specified"}
                      </p>

                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs" style={{ color: C.textDim }}>
                        <span className="flex items-center gap-1.5"><Mail size={14} style={{ color: C.teal }} /> {profile.email}</span>
                        <span className="flex items-center gap-1.5"><Phone size={14} style={{ color: C.teal }} /> {profile.phone || "N/A"}</span>
                        <span className="flex items-center gap-1.5"><MapPin size={14} style={{ color: C.teal }} /> {profile.location || "N/A"}</span>
                        <span className="flex items-center gap-1.5"><Briefcase size={14} style={{ color: C.teal }} /> {profile.yearsExperience} Years Exp.</span>
                      </div>
                    </div>
                  </div>

                  {/* Summary & Skills Section */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Summary */}
                    <div className="md:col-span-2 p-5 rounded-xl border space-y-3" style={{ background: C.panelAlt, borderColor: C.border }}>
                      <h3 className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-2" style={{ color: C.text }}>
                        <FileText size={16} style={{ color: C.teal }} /> Professional Summary
                      </h3>
                      <p className="text-xs leading-relaxed" style={{ color: C.textDim }}>
                        {profile.summary || "No professional summary provided."}
                      </p>
                    </div>

                    {/* Skills */}
                    <div className="p-5 rounded-xl border space-y-3" style={{ background: C.panelAlt, borderColor: C.border }}>
                      <h3 className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-2" style={{ color: C.text }}>
                        <Award size={16} style={{ color: C.teal }} /> Key Skills
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {profile.skills.length > 0 ? (
                          profile.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold border"
                              style={{ background: `${C.teal}15`, borderColor: `${C.teal}30`, color: C.teal }}
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs" style={{ color: C.textDim }}>No skills listed</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className="flex justify-between items-center pt-4 border-t" style={{ borderColor: C.border }}>
                    <button
                      onClick={handleStartNewProfile}
                      className="px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all hover:opacity-80"
                      style={{ background: C.panelAlt, color: C.textDim, border: `1px solid ${C.border}` }}
                    >
                      <PlusCircle size={15} /> Create New Profile
                    </button>

                    <button
                      onClick={handleEditProfile}
                      className="px-6 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg hover:opacity-90"
                      style={{
                        background: `linear-gradient(135deg, ${C.teal}, #0f5f5f)`,
                        color: "#08101b",
                      }}
                    >
                      <Edit3 size={15} /> Edit Profile Details
                    </button>
                  </div>
                </div>
              ) : (
                /* ========================================================= */
                /* STEP-BY-STEP FORM WIZARD VIEW                            */
                /* ========================================================= */
                <>
                  <div className="mb-8">
                    <StepIndicator currentStep={step} />
                  </div>

                  <div className="mt-4">
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
                  </div>
                </>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}