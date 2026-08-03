import Link from "next/link";
import type { MDXComponents } from "mdx/types";
import {
  ButtonLink,
  Card,
  CardGrid,
  CardLink,
  Center,
  Chip,
  Divider,
  Note,
  Panel,
  Realm,
  RealmTrack,
  Tag,
} from "./Blocks";
import { MermaidStatic } from "./MermaidStatic";

/** Pull the plain text out of a fenced-code child, however MDX nested it. */
function codeText(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(codeText).join("");
  if (node && typeof node === "object" && "props" in node) {
    const props = (node as { props?: { children?: React.ReactNode } }).props;
    return codeText(props?.children);
  }
  return "";
}

function codeLanguage(node: React.ReactNode): string | null {
  if (node && typeof node === "object" && "props" in node) {
    const props = (node as { props?: { className?: string } }).props;
    const match = /language-([\w-]+)/.exec(props?.className ?? "");
    return match ? match[1] : null;
  }
  return null;
}

export const mdxComponents: MDXComponents = {
  // --- theme components, addressed by name from the MDX itself -------------
  Note,
  Card,
  CardLink,
  CardGrid,
  Panel,
  Divider,
  Mermaid: MermaidStatic,
  Chip,
  Tag,
  RealmTrack,
  Realm,
  ButtonLink,
  Center,

  // --- element overrides ---------------------------------------------------

  /**
   * A ```mermaid fence becomes a real diagram; everything else stays a code
   * block. Doing it here means the MDX source keeps ordinary Markdown fences
   * rather than every diagram being hand-wrapped in a component.
   */
  pre(props) {
    const { children, ...rest } = props as { children?: React.ReactNode };
    if (codeLanguage(children) === "mermaid") {
      return <MermaidStatic chart={codeText(children).replace(/\n$/, "")} />;
    }
    return <pre {...rest}>{children}</pre>;
  },

  /** Wide tables scroll inside their own box; the page body never does. */
  table(props) {
    return (
      <div className="table-wrap">
        <table {...props} />
      </div>
    );
  },

  /**
   * Internal links go through next/link so navigation is client-side and the
   * target route is prefetched; external ones get the usual safety rel.
   */
  a(props) {
    const { href = "", children, ...rest } = props as {
      href?: string;
      children?: React.ReactNode;
    };
    const external = /^https?:/i.test(href);
    if (external) {
      return (
        <a href={href} rel="noopener noreferrer" target="_blank" {...rest}>
          {children}
        </a>
      );
    }
    if (href.startsWith("#")) {
      return (
        <a href={href} {...rest}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  },
};
