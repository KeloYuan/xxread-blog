function visit(node, callback, parent = null) {
  callback(node, parent);

  if (!Array.isArray(node?.children)) return;

  for (const child of node.children) {
    visit(child, callback, node);
  }
}

function getText(node) {
  if (!node || typeof node !== "object") return "";
  if (node.type === "text") return node.value || "";
  if (!Array.isArray(node.children)) return "";
  return node.children.map(getText).join("");
}

function trimLeadingWhitespace(children) {
  const nextChildren = children.map(child => structuredClone(child));

  while (nextChildren.length > 0) {
    const firstChild = nextChildren[0];

    if (firstChild.type === "text") {
      firstChild.value = firstChild.value.replace(/^\s+/, "");

      if (firstChild.value.length === 0) {
        nextChildren.shift();
        continue;
      }
    }

    break;
  }

  return nextChildren;
}

function splitParagraph(paragraph) {
  const headerChildren = [];
  const bodyChildren = [];
  let foundBreak = false;

  for (const child of paragraph.children || []) {
    if (foundBreak) {
      bodyChildren.push(child);
      continue;
    }

    if (child.type === "element" && child.tagName === "br") {
      foundBreak = true;
      continue;
    }

    if (child.type === "text") {
      const lineBreakIndex = child.value.indexOf("\n");

      if (lineBreakIndex === -1) {
        headerChildren.push(child);
        continue;
      }

      const headerText = child.value.slice(0, lineBreakIndex);
      const bodyText = child.value.slice(lineBreakIndex + 1);

      if (headerText.length > 0) {
        headerChildren.push({ ...child, value: headerText });
      }

      if (bodyText.length > 0) {
        bodyChildren.push({ ...child, value: bodyText });
      }

      foundBreak = true;
      continue;
    }

    headerChildren.push(child);
  }

  return {
    headerText: getText({ children: headerChildren }).trim(),
    bodyChildren: trimLeadingWhitespace(bodyChildren),
  };
}

export default function rehypeObsidianCallouts() {
  return tree => {
    visit(tree, node => {
      if (node.type !== "element" || node.tagName !== "blockquote") return;
      if (!Array.isArray(node.children) || node.children.length === 0) return;

      const firstParagraphIndex = node.children.findIndex(
        child => child.type === "element" && child.tagName === "p"
      );

      if (firstParagraphIndex === -1) return;

      const firstParagraph = node.children[firstParagraphIndex];
      const { headerText, bodyChildren } = splitParagraph(firstParagraph);
      const match = headerText.match(/^\[!([A-Za-z0-9_-]+)\][+-]?(?:\s+(.*))?$/);

      if (!match) return;

      const calloutType = match[1].toLowerCase();
      const title = (match[2] || "").trim() || calloutType;
      const remainingChildren = node.children.filter((_, index) => index !== firstParagraphIndex);

      node.tagName = "aside";
      node.properties = {
        ...(node.properties || {}),
        className: ["callout", `callout-${calloutType}`],
        dataCallout: calloutType,
      };
      node.children = [
        {
          type: "element",
          tagName: "p",
          properties: { className: ["callout-title"] },
          children: [{ type: "text", value: title }],
        },
        ...(bodyChildren.length > 0
          ? [
              {
                type: "element",
                tagName: "p",
                properties: {},
                children: bodyChildren,
              },
            ]
          : []),
        ...remainingChildren,
      ];
    });
  };
}
