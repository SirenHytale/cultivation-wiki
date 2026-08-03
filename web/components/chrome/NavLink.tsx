"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * A nav link that knows whether it is the page you are on.
 *
 * This is a client component only because `usePathname` is a hook — but it
 * still renders on the server during SSR, so the active state is present in
 * the initial HTML rather than being painted in after hydration.
 */
export function NavLink({
  href,
  className = "",
  activeClassName,
  markCurrent = false,
  children,
}: {
  href: string;
  className?: string;
  activeClassName: string;
  /** Emit aria-current="page" as well as the active class. */
  markCurrent?: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const norm = (p: string) => (p.endsWith("/") ? p : `${p}/`);
  const active = norm(pathname) === norm(href);

  return (
    <Link
      href={href}
      className={`${className}${active ? ` ${activeClassName}` : ""}`.trim()}
      aria-current={active && markCurrent ? "page" : undefined}
    >
      {children}
    </Link>
  );
}
