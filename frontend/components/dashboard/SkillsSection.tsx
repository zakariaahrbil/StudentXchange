"use client";

import { useState } from "react";
import { Plus, Trash2, Loader2, AlertCircle, Star } from "lucide-react";
import { useGetMySkills, useCreateSkill, useDeleteSkill } from "@/lib/hooks/useSkills";
import { getApiErrorMessage } from "@/lib/errors";

export default function SkillsSection() {
  const { data: skills, isLoading: isLoadingSkills } = useGetMySkills();
  const { mutate: createSkill, isPending: isCreatingSkill } = useCreateSkill();
  const { mutate: deleteSkill, isPending: isDeletingSkill } = useDeleteSkill();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("10");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  function resetForm() {
    setName("");
    setPrice("10");
    setDescription("");
    setError(null);
    setIsFormOpen(false);
  }

  function handleAddSkill(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Please provide a skill or service name.");
      return;
    }

    if (trimmedName.length > 255) {
      setError("Skill name cannot exceed 255 characters.");
      return;
    }

    const parsedPrice = parseInt(price, 10);
    if (isNaN(parsedPrice) || parsedPrice < 1) {
      setError("Token rate must be at least 1 token.");
      return;
    }

    const trimmedDesc = description.trim();
    if (trimmedDesc.length > 2000) {
      setError("Description cannot exceed 2000 characters.");
      return;
    }

    createSkill(
      {
        name: trimmedName,
        price: parsedPrice,
        description: trimmedDesc || undefined,
      },
      {
        onSuccess: () => {
          resetForm();
        },
        onError: (err: unknown) => {
          setError(getApiErrorMessage(err, "Failed to add skill. Please try again."));
        },
      }
    );
  }

  return (
    <section className="bg-white border border-border p-6 sm:p-8">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-ink">Skills &amp; Services Offered</h2>
          <p className="text-xs text-muted mt-1">
            Practical skills, repair services, peer tutoring, and tasks you offer to campus peers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-muted bg-[#FAFAFA] px-2.5 py-1 border border-border">
            {skills?.length ?? 0} {skills?.length === 1 ? "Offering" : "Offerings"}
          </span>

          {!isFormOpen && (
            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-ink text-white px-3.5 py-1.5 hover:bg-ink/85 transition-colors cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>Add Offering</span>
            </button>
          )}
        </div>
      </div>

      {/* ── ADD SKILL EXPANDABLE FORM ── */}
      {isFormOpen && (
        <form
          onSubmit={handleAddSkill}
          className="mb-6 p-5 bg-[#FAFAFA] border border-border flex flex-col gap-4 animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink">
              New Skill or Service Offering
            </h3>
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-muted hover:text-ink cursor-pointer"
            >
              Cancel
            </button>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="size-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-ink mb-1.5">
                Service / Skill Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                maxLength={255}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="e.g. Plumbing Leak Fix, Next.js Architecture, Moving Assistance"
                className="w-full px-3 py-2 text-xs border border-border bg-white text-ink placeholder:text-muted/60 outline-none focus:border-ink transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">
                Rate (Tokens) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  if (error) setError(null);
                }}
                className="w-full px-3 py-2 text-xs border border-border bg-white text-ink placeholder:text-muted/60 outline-none focus:border-ink transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-ink">
                Service Description &amp; Scope (Optional)
              </label>
              <span className="text-[11px] text-muted">
                {description.length} / 2000
              </span>
            </div>
            <textarea
              rows={3}
              maxLength={2000}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Describe what help you provide, equipment/tools you bring, or topics you cover..."
              className="w-full px-3 py-2 text-xs border border-border bg-white text-ink placeholder:text-muted/60 outline-none focus:border-ink resize-none transition-colors"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/80">
            <button
              type="button"
              onClick={resetForm}
              disabled={isCreatingSkill}
              className="text-xs font-semibold text-muted hover:text-ink px-3 py-1.5 cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreatingSkill || !name.trim()}
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-ink text-white px-4 py-2 hover:bg-ink/85 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isCreatingSkill && <Loader2 className="size-3.5 animate-spin" />}
              <span>{isCreatingSkill ? "Saving…" : "Save Offering"}</span>
            </button>
          </div>
        </form>
      )}

      {/* ── SKILLS LIST ── */}
      {isLoadingSkills ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-mint border-t-transparent rounded-full animate-spin" />
        </div>
      ) : skills && skills.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="p-4 bg-[#FAFAFA] border border-border flex flex-col justify-between gap-2.5 transition-colors hover:border-border/80"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-mint shrink-0" />
                    <h4 className="text-xs font-bold text-ink truncate">
                      {skill.name}
                    </h4>
                  </div>

                  {skill.description ? (
                    <p className="text-xs text-muted mt-1.5 line-clamp-2 leading-relaxed">
                      {skill.description}
                    </p>
                  ) : (
                    <p className="text-[11px] text-muted/60 italic mt-1">
                      No service description provided
                    </p>
                  )}
                </div>

                <div className="text-right shrink-0 flex flex-col items-end gap-1">
                  <span className="text-xs font-bold text-ink">
                    {skill.price ?? 10}{" "}
                    <span className="text-[10px] text-purple font-semibold">Tokens</span>
                  </span>
                  {typeof skill.averageRating === "number" && skill.averageRating > 0 ? (
                    <div className="inline-flex items-center gap-1 text-[11px] font-bold text-ink bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded">
                      <Star className="size-3 fill-amber-400 text-amber-500" />
                      <span>{skill.averageRating.toFixed(1)}</span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-muted">No reviews yet</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end pt-2 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => deleteSkill(skill.id)}
                  disabled={isDeletingSkill}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-600 hover:text-rose-700 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Trash2 className="size-3" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center border border-dashed border-border p-6">
          <p className="text-sm font-medium text-ink">No skills added yet</p>
          <p className="text-xs text-muted mt-1 max-w-sm mx-auto">
            Add your first skill or service above to start offering sessions and earning exchange tokens.
          </p>
          {!isFormOpen && (
            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold bg-mint text-ink px-4 py-2 hover:bg-mint/80 transition-colors cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>Add First Skill</span>
            </button>
          )}
        </div>
      )}
    </section>
  );
}
