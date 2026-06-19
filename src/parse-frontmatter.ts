import type { Frontmatter, ParsedMarkdown } from "./types.ts";

const REQUIRED_FIELDS = [
  "title",
  "type",
  "source",
  "source_family",
  "project",
  "status",
  "date_created",
  "tags"
] as const;

type RawFrontmatter = Record<string, string | string[]>;

export function parseFrontmatter(markdown: string, filePath: string): ParsedMarkdown {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);

  if (!match) {
    throw new Error(`Missing YAML frontmatter in ${filePath}`);
  }

  const raw = parseSimpleYaml(match[1]);
  const missingFields = REQUIRED_FIELDS.filter((field) => raw[field] === undefined);

  if (missingFields.length > 0) {
    throw new Error(`Missing frontmatter fields in ${filePath}: ${missingFields.join(", ")}`);
  }

  const tags = raw.tags;

  if (!Array.isArray(tags)) {
    throw new Error(`Frontmatter field "tags" must be a list in ${filePath}`);
  }

  return {
    frontmatter: {
      title: String(raw.title),
      type: String(raw.type) as Frontmatter["type"],
      source: String(raw.source) as Frontmatter["source"],
      source_family: String(raw.source_family) as Frontmatter["source_family"],
      project: String(raw.project),
      status: String(raw.status),
      date_created: String(raw.date_created),
      tags
    },
    body: match[2]
  };
}

function parseSimpleYaml(yaml: string): RawFrontmatter {
  const result: RawFrontmatter = {};
  let activeListKey: string | null = null;

  for (const line of yaml.split(/\r?\n/)) {
    if (line.trim() === "") {
      continue;
    }

    const listItem = line.match(/^\s*-\s+(.*)$/);

    if (listItem && activeListKey) {
      const existing = result[activeListKey];

      if (!Array.isArray(existing)) {
        result[activeListKey] = [];
      }

      (result[activeListKey] as string[]).push(unquote(listItem[1].trim()));
      continue;
    }

    const field = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);

    if (!field) {
      continue;
    }

    const [, key, value] = field;

    if (value.trim() === "") {
      result[key] = [];
      activeListKey = key;
      continue;
    }

    result[key] = unquote(value.trim());
    activeListKey = null;
  }

  return result;
}

function unquote(value: string): string {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

