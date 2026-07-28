interface DifficultyBadge {
  label: string;
  tagClass: string;
}

// Maps the ElixirDifficulty enum to a friendlier label and one of the
// existing tag color variants, so difficulty reads at a glance instead of
// as a raw enum string.
const DIFFICULTY_BADGES: Record<string, DifficultyBadge> = {
  Beginner: { label: "Beginner", tagClass: "tag-accent-2" },
  OrdinaryWizardingLevel: { label: "O.W.L.", tagClass: "tag-outline" },
  Moderate: { label: "Moderate", tagClass: "tag-neutral" },
  Advanced: { label: "Advanced", tagClass: "tag-accent" },
  OneOfAKind: { label: "One of a Kind", tagClass: "tag-accent" },
  Unknown: { label: "Unknown", tagClass: "tag-neutral" },
};

export function getDifficultyBadge(difficulty: string): DifficultyBadge {
  return DIFFICULTY_BADGES[difficulty] ?? { label: difficulty, tagClass: "tag-neutral" };
}
