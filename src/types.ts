export type SourceFamily =
  | "openai"
  | "anthropic"
  | "google"
  | "midjourney"
  | "local"
  | "github"
  | "manual"
  | "unknown";

export type Source =
  | "chatgpt"
  | "codex"
  | "claude"
  | "claude-code"
  | "gemini"
  | "midjourney"
  | "ollama"
  | "github"
  | "manual"
  | "unknown";

export type NoteType =
  | "planning-session"
  | "build-session"
  | "strategy-session"
  | "agent-session"
  | "research-note"
  | "prompt-note"
  | "local-llm-note"
  | "repo-note"
  | "project-note"
  | "unknown-note";

export type Frontmatter = {
  title: string;
  type: NoteType;
  source: Source;
  source_family: SourceFamily;
  project: string;
  status: string;
  date_created: string;
  tags: string[];
};

export type ParsedMarkdown = {
  frontmatter: Frontmatter;
  body: string;
};

export type GraphNode = {
  id: string;
  title: string;
  type: NoteType;
  source: Source;
  sourceFamily: SourceFamily;
  project: string;
  status: string;
  path: string;
  tags: string[];
  dateCreated: string;
  linkCount: number;
};

export type GraphEdge = {
  id: string;
  source: string;
  target: string;
  targetTitle: string;
  type: "wikilink";
  resolved: boolean;
};

export type SourceGroup = {
  source: Source;
  sourceFamily: SourceFamily;
  color: string;
  count: number;
};

export type CountSummary = {
  name: string;
  count: number;
};

export type GraphJson = {
  generatedAt: string;
  summary: {
    nodeCount: number;
    edgeCount: number;
    sourceCount: number;
    projectCount: number;
    typeCount: number;
  };
  sourceGroups: SourceGroup[];
  projects: CountSummary[];
  types: CountSummary[];
  nodes: GraphNode[];
  edges: GraphEdge[];
};

