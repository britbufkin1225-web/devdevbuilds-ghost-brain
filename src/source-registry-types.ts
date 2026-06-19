export type SourceCategory =
  | "LLM"
  | "Code"
  | "Image"
  | "Music"
  | "Video"
  | "Audio"
  | "Research"
  | "Local"
  | "Manual"
  | "Unknown";

export type SourceRegistryEntry = {
  id: string;
  name: string;
  category: SourceCategory;
  description: string;
  enabled: boolean;
  color: string;
  createdAt: string;
  updatedAt: string;
};

export const SOURCE_CATEGORIES: SourceCategory[] = [
  "LLM",
  "Code",
  "Image",
  "Music",
  "Video",
  "Audio",
  "Research",
  "Local",
  "Manual",
  "Unknown"
];

