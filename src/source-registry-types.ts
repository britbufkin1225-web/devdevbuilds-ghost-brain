export type SourceCategory =
  | "llm"
  | "code"
  | "image"
  | "music"
  | "video"
  | "audio"
  | "research"
  | "local"
  | "manual"
  | "unknown";

export type SourceRegistryEntry = {
  id: string;
  label: string;
  family: string;
  category: SourceCategory;
  color: string;
  enabled: boolean;
  aliases: string[];
};

export const SOURCE_CATEGORIES: SourceCategory[] = [
  "llm",
  "code",
  "image",
  "music",
  "video",
  "audio",
  "research",
  "local",
  "manual",
  "unknown"
];

