"use client";

import { useState } from "react";
import { useGetSkills, useCreateSkill, useDeleteSkill } from "@/lib/hooks/useSkills";
import { getApiErrorMessage } from "@/lib/errors";

export default function SkillsSection() {
  const { data: skills, isLoading: isLoadingSkills } = useGetSkills();
  const { mutate: createSkill, isPending: isCreatingSkill } = useCreateSkill();
  const { mutate: deleteSkill, isPending: isDeletingSkill } = useDeleteSkill();
  const [newSkillName, setNewSkillName] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleAddSkill(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmed = newSkillName.trim();
    if (!trimmed) return;

    if (trimmed.length > 50) {
      setError("Skill name cannot exceed 50 characters.");
      return;
    }

    createSkill(trimmed, {
      onSuccess: () => {
        setNewSkillName("");
        setError(null);
      },
      onError: (err: unknown) => {
        setError(getApiErrorMessage(err, "Failed to add skill. Please try again."));
      },
    });
  }

  return (
    <section className="bg-white border border-border p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-ink">Skills Offered</h2>
          <p className="text-xs text-muted mt-1">
            Skills you can teach, mentor, or exchange with other students.
          </p>
        </div>
        <span className="text-xs font-semibold text-muted bg-[#FAFAFA] px-2.5 py-1 border border-border">
          {skills?.length ?? 0} {skills?.length === 1 ? "Skill" : "Skills"}
        </span>
      </div>

      <form onSubmit={handleAddSkill} className="mb-6 max-w-md">
        <div className="flex gap-2">
          <input
            type="text"
            value={newSkillName}
            onChange={(e) => {
              setNewSkillName(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Add a skill (e.g. Python, UI Design)"
            className={`flex-1 px-3 py-2 text-xs border bg-white text-ink placeholder:text-faint outline-none transition-colors ${
              error ? "border-rose-500 focus:border-rose-500" : "border-border focus:border-purple"
            }`}
          />
          <button
            type="submit"
            disabled={isCreatingSkill || !newSkillName.trim()}
            className="text-xs font-semibold bg-ink text-white px-4 py-2 hover:bg-ink/80 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isCreatingSkill ? "Adding…" : "+ Add Skill"}
          </button>
        </div>
        {error && <p className="text-[11px] text-rose-600 mt-1.5">{error}</p>}
      </form>

      {isLoadingSkills ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-mint border-t-transparent rounded-full animate-spin" />
        </div>
      ) : skills && skills.length > 0 ? (
        <div className="flex flex-wrap gap-2.5">
          {skills.map((skill) => (
            <span
              key={skill.id}
              className="group inline-flex items-center gap-2 px-3 py-1.5 bg-[#FAFAFA] border border-border text-xs font-medium text-ink hover:border-purple transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-mint" />
              <span>{skill.name}</span>
              <button
                type="button"
                onClick={() => deleteSkill(skill.id)}
                disabled={isDeletingSkill}
                title="Remove skill"
                className="opacity-40 group-hover:opacity-100 hover:text-rose-600 transition-opacity ml-1 cursor-pointer font-bold text-sm"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center border border-dashed border-border p-6">
          <p className="text-sm font-medium text-ink">No skills added yet</p>
          <p className="text-xs text-muted mt-1 max-w-sm mx-auto">
            Add your first skill above to start offering sessions and earning exchange tokens.
          </p>
        </div>
      )}
    </section>
  );
}
