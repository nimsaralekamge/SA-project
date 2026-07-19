import React, { useRef, useState, type DragEvent } from "react";
import { UploadCloud, FileText, Trash2 } from "lucide-react";
import SectionCard from "../common/SectionCard";
import { COLORS } from "../../constants/theme";
import { formatBytes } from "../../utils/formatBytes";

const ACCEPTED_EXTENSIONS = [".pdf", ".doc", ".docx"];
const MAX_SIZE_MB = 5;

interface ResumeUploadStepProps {
  defaultFile: File | null;
  onBack: () => void;
  onNext: (file: File | null) => void;
}

export default function ResumeUploadStep({ defaultFile, onBack, onNext }: ResumeUploadStepProps) {
  const [file, setFile] = useState<File | null>(defaultFile);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSet = (candidate: File | null | undefined) => {
    if (!candidate) return;

    const ext = "." + candidate.name.split(".").pop()?.toLowerCase();
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      setError("Unsupported file type. Upload a PDF, DOC or DOCX file.");
      return;
    }
    if (candidate.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${MAX_SIZE_MB} MB.`);
      return;
    }

    setError("");
    setFile(candidate);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    validateAndSet(e.dataTransfer.files?.[0]);
  };

  const handleSkip = () => {
    setError("");
    onNext(null);
  };

  return (
    <SectionCard title="Resume / CV upload" subtitle="Recruiters use this to match you with roles">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className="flex flex-col items-center justify-center text-center gap-2 rounded-xl py-8 px-4 cursor-pointer transition-colors"
        style={{
          border: `1.5px dashed ${isDragging ? COLORS.cyan : COLORS.border}`,
          backgroundColor: isDragging ? "rgba(12,242,242,0.06)" : COLORS.panelAlt,
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS.join(",")}
          className="hidden"
          onChange={(e) => validateAndSet(e.target.files?.[0])}
        />
        <UploadCloud size={26} style={{ color: COLORS.teal }} />
        <p className="text-sm text-white font-medium">
          Drag and drop your resume here, or <span style={{ color: COLORS.cyan }}>browse</span>
        </p>
        <p className="text-xs" style={{ color: COLORS.textSecondary }}>
          PDF, DOC or DOCX &middot; Max {MAX_SIZE_MB} MB
        </p>
      </div>

      {error && (
        <p className="text-xs mt-2" style={{ color: COLORS.danger }}>
          {error}
        </p>
      )}

      {file && !error && (
        <div
          className="flex items-center justify-between mt-3 rounded-lg px-3 py-2.5"
          style={{ backgroundColor: COLORS.panelAlt, border: `1px solid ${COLORS.border}` }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
              style={{ backgroundColor: "rgba(217,184,85,0.15)" }}
            >
              <FileText size={15} style={{ color: COLORS.gold }} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-white truncate">{file.name}</p>
              <p className="text-[11px]" style={{ color: COLORS.textSecondary }}>
                {formatBytes(file.size)} &middot; Ready to upload
              </p>
            </div>
          </div>
          <Trash2
            size={15}
            className="cursor-pointer shrink-0"
            style={{ color: COLORS.textSecondary }}
            onClick={(e) => {
              e.stopPropagation();
              setFile(null);
            }}
          />
        </div>
      )}

      <div className="flex justify-between items-center pt-4">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium px-5 py-2 rounded-lg"
          style={{ border: `1px solid ${COLORS.border}`, color: COLORS.textSecondary }}
        >
          Back
        </button>
        <div className="flex items-center gap-4">
          {!file && (
            <button
              type="button"
              onClick={handleSkip}
              className="text-xs font-medium underline underline-offset-2"
              style={{ color: COLORS.textSecondary }}
            >
              Skip for now
            </button>
          )}
          <button
            type="button"
            disabled={!file}
            onClick={() => onNext(file)}
            className="text-sm font-semibold px-5 py-2 rounded-lg transition-opacity hover:opacity-90 disabled:opacity-40"
            style={{ backgroundColor: COLORS.teal, color: COLORS.bg }}
          >
            Continue to review
          </button>
        </div>
      </div>
    </SectionCard>
  );
}
