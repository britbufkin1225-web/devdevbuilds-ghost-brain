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

export type GraphNode = {
  id: string;
  title: string;
  type: string;
  source: Source | string;
  sourceFamily: string;
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
  source: Source | string;
  sourceFamily: string;
  color: string;
  count: number;
};

export type CountSummary = {
  name: string;
  count: number;
};

export type GraphData = {
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

export type ViewMode = "global" | "source" | "project" | "cleanup" | "dream";

export type Filters = {
  sources: Set<string>;
  categories: Set<string>;
  projects: Set<string>;
  types: Set<string>;
};
