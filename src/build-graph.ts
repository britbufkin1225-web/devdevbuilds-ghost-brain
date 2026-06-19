import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { parseFrontmatter } from "./parse-frontmatter.ts";
import { parseWikiLinks } from "./parse-links.ts";
import { getSourceColor, SOURCE_BY_ID } from "./source-config.ts";
import type { CountSummary, GraphEdge, GraphJson, GraphNode, Source, SourceGroup } from "./types.ts";

const VAULT_DIR = path.join("examples", "sample-vault");
const OUTPUT_FILE = path.join("data", "graph.json");

async function main(): Promise<void> {
  const markdownFiles = await findMarkdownFiles(VAULT_DIR);
  const parsedNotes = await Promise.all(
    markdownFiles.map(async (filePath) => {
      const markdown = await readFile(filePath, "utf8");
      const parsed = parseFrontmatter(markdown, normalizePath(filePath));
      const links = parseWikiLinks(parsed.body);
      const id = slugify(parsed.frontmatter.title);

      return {
        filePath: normalizePath(filePath),
        id,
        frontmatter: parsed.frontmatter,
        links
      };
    })
  );

  parsedNotes.sort((a, b) => a.filePath.localeCompare(b.filePath));

  const titleToId = new Map(parsedNotes.map((note) => [normalizeTitle(note.frontmatter.title), note.id]));

  const nodes: GraphNode[] = parsedNotes.map((note) => ({
    id: note.id,
    title: note.frontmatter.title,
    type: note.frontmatter.type,
    source: note.frontmatter.source,
    sourceFamily: note.frontmatter.source_family,
    project: note.frontmatter.project,
    status: note.frontmatter.status,
    path: note.filePath,
    tags: note.frontmatter.tags,
    dateCreated: note.frontmatter.date_created,
    linkCount: note.links.length
  }));

  const edges: GraphEdge[] = parsedNotes.flatMap((note) =>
    note.links.map((link) => {
      const resolvedId = titleToId.get(normalizeTitle(link.targetTitle));
      const target = resolvedId ?? slugify(link.targetTitle);

      return {
        id: `${note.id}-${target}`,
        source: note.id,
        target,
        targetTitle: link.targetTitle,
        type: "wikilink",
        resolved: resolvedId !== undefined
      };
    })
  );

  const sourceGroups = buildSourceGroups(nodes);
  const projects = buildCounts(nodes.map((node) => node.project));
  const types = buildCounts(nodes.map((node) => node.type));

  const graph: GraphJson = {
    generatedAt: new Date().toISOString(),
    summary: {
      nodeCount: nodes.length,
      edgeCount: edges.length,
      sourceCount: sourceGroups.length,
      projectCount: projects.length,
      typeCount: types.length
    },
    sourceGroups,
    projects,
    types,
    nodes,
    edges
  };

  await mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  await writeFile(OUTPUT_FILE, `${JSON.stringify(graph, null, 2)}\n`, "utf8");

  console.log(`Generated ${OUTPUT_FILE}`);
  console.log(`Nodes: ${graph.summary.nodeCount}`);
  console.log(`Edges: ${graph.summary.edgeCount}`);
  console.log(`Sources: ${sourceGroups.map((group) => group.source).join(", ")}`);
  console.log(`Projects: ${projects.map((project) => project.name).join(", ")}`);
}

async function findMarkdownFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return findMarkdownFiles(fullPath);
      }

      if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
        return [fullPath];
      }

      return [];
    })
  );

  return files.flat().sort((a, b) => a.localeCompare(b));
}

function buildSourceGroups(nodes: GraphNode[]): SourceGroup[] {
  const counts = new Map<Source, number>();

  for (const node of nodes) {
    counts.set(node.source, (counts.get(node.source) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([source, count]) => ({
      source,
      sourceFamily: SOURCE_BY_ID.get(source)?.sourceFamily ?? "unknown",
      color: getSourceColor(source),
      count
    }));
}

function buildCounts(values: string[]): CountSummary[] {
  const counts = new Map<string, number>();

  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, count]) => ({ name, count }));
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeTitle(value: string): string {
  return value.trim().toLowerCase();
}

function normalizePath(filePath: string): string {
  return filePath.split(path.sep).join("/");
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

