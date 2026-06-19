export type WikiLink = {
  raw: string;
  targetTitle: string;
  alias?: string;
};

export function parseWikiLinks(markdownBody: string): WikiLink[] {
  const links: WikiLink[] = [];
  const wikiLinkPattern = /\[\[([^\]]+)\]\]/g;

  for (const match of markdownBody.matchAll(wikiLinkPattern)) {
    const rawTarget = match[1].trim();
    const [targetTitle, alias] = rawTarget.split("|").map((part) => part.trim());

    if (!targetTitle) {
      continue;
    }

    links.push({
      raw: match[0],
      targetTitle,
      alias: alias || undefined
    });
  }

  return links;
}

