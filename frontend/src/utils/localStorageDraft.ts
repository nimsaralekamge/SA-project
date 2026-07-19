import { EMPTY_PROFILE, type DraftableProfile } from "../types/candidateProfile";

const DRAFT_KEY = "talentflow.candidateProfile.draft";

/**
 * Loads a saved draft from localStorage, if one exists and is valid JSON.
 * The resume File itself is never persisted — browsers don't allow storing
 * File/Blob objects in localStorage, so users re-attach the resume each
 * session while the rest of the form is restored.
 */
export function loadDraft(): DraftableProfile {
  if (typeof window === "undefined") return stripFile(EMPTY_PROFILE);
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return stripFile(EMPTY_PROFILE);
    const parsed = JSON.parse(raw);
    return { ...stripFile(EMPTY_PROFILE), ...parsed };
  } catch {
    return stripFile(EMPTY_PROFILE);
  }
}

export function saveDraft(profile: DraftableProfile): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(profile));
  } catch {
    // localStorage can throw in private browsing / quota-exceeded cases —
    // failing silently is fine here since this is a convenience feature.
  }
}

export function clearDraft(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(DRAFT_KEY);
}

function stripFile(profile: typeof EMPTY_PROFILE): DraftableProfile {
  const { file, ...rest } = profile;
  return rest;
}
