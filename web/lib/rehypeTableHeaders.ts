/* Make matrix-style tables navigable by assistive technology.
 *
 * Several pages use a table whose first header cell is empty and whose first
 * column holds row labels ("When", "Cost", "Risk"). Markdown cannot express
 * that: the labels come through as plain <td>, leaving every data cell in
 * those rows without an associated header, which is what axe's `td-has-header`
 * flags. The original static site had the same markup, so this improves on it
 * rather than restoring it.
 *
 * The transform is deliberately narrow — it only fires when the first header
 * cell is genuinely empty, which is the signal that column one is labels
 * rather than data. Ordinary tables are left alone apart from `scope="col"`,
 * which is correct for them anyway.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

function isElement(node: any, tagName?: string): boolean {
  return (
    node && node.type === "element" && (tagName === undefined || node.tagName === tagName)
  );
}

function findChild(node: any, tagName: string): any {
  return (node?.children ?? []).find((c: any) => isElement(c, tagName));
}

function textOf(node: any): string {
  if (!node) return "";
  if (node.type === "text") return node.value ?? "";
  return (node.children ?? []).map(textOf).join("");
}

function transformTable(table: any): void {
  const thead = findChild(table, "thead");
  const tbody = findChild(table, "tbody");
  if (!thead || !tbody) return;

  const headRow = findChild(thead, "tr");
  if (!headRow) return;
  const headCells = (headRow.children ?? []).filter((c: any) => isElement(c, "th"));
  if (headCells.length < 2) return;

  // Column headers always benefit from an explicit scope.
  for (const cell of headCells) {
    cell.properties = { ...(cell.properties ?? {}), scope: "col" };
  }

  // Only promote the first column when the corner cell is blank.
  if (textOf(headCells[0]).trim() !== "") return;

  for (const row of tbody.children ?? []) {
    if (!isElement(row, "tr")) continue;
    const first = (row.children ?? []).find(
      (c: any) => isElement(c, "td") || isElement(c, "th"),
    );
    if (!first || first.tagName !== "td") continue;
    if (textOf(first).trim() === "") continue;
    first.tagName = "th";
    first.properties = { ...(first.properties ?? {}), scope: "row" };
  }
}

export function rehypeTableHeaders() {
  return (tree: any) => {
    const walk = (node: any) => {
      if (isElement(node, "table")) transformTable(node);
      for (const child of node?.children ?? []) walk(child);
    };
    walk(tree);
  };
}
