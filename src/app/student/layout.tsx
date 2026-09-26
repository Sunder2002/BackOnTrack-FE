"use client";

import { AppShell } from "@/components/app-shell/app-shell";
import { usePathname } from "next/navigation";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (pathname === "/student/focus") return children;
  return <AppShell>{children}</AppShell>;
}
