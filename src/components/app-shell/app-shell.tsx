"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpenCheck,
  BrainCircuit,
  ChevronRight,
  CircleHelp,
  Command,
  GraduationCap,
  LayoutDashboard,
  Map,
  MessageSquareText,
  RotateCcw,
  Settings,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { BrandMark } from "@/components/brand/brand-mark";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { demoCourse, demoNudges } from "@/data/demo/riya";
import { cn } from "@/lib/utils";
import { useDemo } from "@/state/demo-provider";

const studentNav = [
  { href: "/student", label: "Overview", icon: LayoutDashboard },
  { href: "/student/plan", label: "My plan", icon: Map },
  { href: "/student/mastery", label: "Mastery", icon: BrainCircuit },
  { href: "/student/ask", label: "Ask", icon: MessageSquareText },
  { href: "/student/sources", label: "Sources", icon: BookOpenCheck },
];

const commands = [
  ...studentNav,
  { href: "/faculty", label: "Faculty view", icon: GraduationCap },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { student, resetDemo, startFocus, plan } = useDemo();
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "?" && !event.metaKey && !event.ctrlKey) {
        const target = event.target as HTMLElement;
        if (target.matches("input, textarea, [contenteditable='true']")) return;
        event.preventDefault();
        setShortcutsOpen(true);
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const filteredCommands = useMemo(
    () =>
      commands.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );
  const nextBlock = plan.blocks.find((block) => block.id === plan.nextBlockId);

  return (
    <div className="app-frame">
      <aside className="sidebar">
        <Link href="/student" className="sidebar-brand focus-ring rounded-lg">
          <BrandMark />
        </Link>
        <nav className="sidebar-nav" aria-label="Primary navigation">
          {studentNav.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/student"
                ? pathname === href
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn("nav-item", active && "nav-item-active")}
              >
                <Icon aria-hidden="true" size={19} strokeWidth={1.9} />
                <span>{label}</span>
              </Link>
            );
          })}
          <div className="nav-divider" />
          <Link
            href="/faculty"
            className={cn(
              "nav-item",
              pathname === "/faculty" && "nav-item-active",
            )}
          >
            <GraduationCap aria-hidden="true" size={19} strokeWidth={1.9} />
            <span>Faculty view</span>
            <span className="demo-tag">Demo</span>
          </Link>
        </nav>
        <div className="sidebar-bottom">
          <button
            className="nav-item"
            type="button"
            onClick={() => setShortcutsOpen(true)}
          >
            <CircleHelp aria-hidden="true" size={19} />
            <span>Shortcuts</span>
          </button>
          <button className="nav-item" type="button" onClick={resetDemo}>
            <RotateCcw aria-hidden="true" size={19} />
            <span>Reset demo</span>
          </button>
          <div className="profile-row">
            <span className="avatar">{student.initials}</span>
            <div>
              <strong>{student.name}</strong>
              <span>Student</span>
            </div>
            <Settings aria-hidden="true" size={16} />
          </div>
        </div>
      </aside>

      <div className="main-column">
        <header className="status-bar">
          <div className="mobile-brand">
            <BrandMark compact />
          </div>
          <div className="course-identity">
            <strong>{demoCourse.title}</strong>
            <span>{demoCourse.code}</span>
          </div>
          <div className="status-context">
            <span>{demoCourse.examLabel}</span>
            <span className="status-separator" aria-hidden="true" />
            <span className="mono">
              {student.studyBudgetHours}h study budget
            </span>
          </div>
          <button
            className="command-trigger"
            onClick={() => setCommandOpen(true)}
            type="button"
          >
            <Command aria-hidden="true" size={16} />
            <span>Jump to</span>
            <kbd>⌘K</kbd>
          </button>
          <span className="top-avatar">{student.initials}</span>
        </header>

        <div className="workspace-grid">
          <main className="workspace" id="main-content">
            {children}
          </main>
          <aside className="coach-rail" aria-label="Coach">
            <div className="rail-heading">
              <div>
                <span className="eyebrow">Context, not noise</span>
                <h2>Coach</h2>
              </div>
              <span className="coach-state">
                <span /> On route
              </span>
            </div>
            <div className="coach-stack">
              {demoNudges.map((nudge, index) => (
                <article
                  className={cn("coach-card", index === 0 && "coach-card-now")}
                  key={nudge.id}
                >
                  <span className="eyebrow">{nudge.eyebrow}</span>
                  <h3>
                    {index === 0 && nextBlock
                      ? `${nextBlock.minutes} min · ${nextBlock.title}`
                      : nudge.title}
                  </h3>
                  <p>{nudge.body}</p>
                  {nudge.action ? (
                    <Button variant="secondary" size="sm" onClick={startFocus}>
                      {nudge.action}{" "}
                      <ChevronRight aria-hidden="true" size={16} />
                    </Button>
                  ) : null}
                </article>
              ))}
            </div>
          </aside>
        </div>
      </div>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        {studentNav.slice(0, 5).map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(pathname === href && "active")}
          >
            <Icon aria-hidden="true" size={20} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <Dialog open={shortcutsOpen} onOpenChange={setShortcutsOpen}>
        <DialogContent>
          <span className="eyebrow">Keyboard</span>
          <DialogTitle className="dialog-title">
            Move without hunting
          </DialogTitle>
          <DialogDescription className="dialog-copy">
            Shortcuts pause while you are typing in a field.
          </DialogDescription>
          <dl className="shortcut-list">
            <div>
              <dt>
                <kbd>S</kbd>
              </dt>
              <dd>Start the selected block</dd>
            </div>
            <div>
              <dt>
                <kbd>P</kbd>
              </dt>
              <dd>Open the current plan</dd>
            </div>
            <div>
              <dt>
                <kbd>?</kbd>
              </dt>
              <dd>Show keyboard shortcuts</dd>
            </div>
            <div>
              <dt>
                <kbd>⌘ / Ctrl</kbd> + <kbd>K</kbd>
              </dt>
              <dd>Open command palette</dd>
            </div>
            <div>
              <dt>
                <kbd>Esc</kbd>
              </dt>
              <dd>Close context first</dd>
            </div>
            <div>
              <dt>
                <kbd>⌘ / Ctrl</kbd> + <kbd>⇧</kbd> + <kbd>R</kbd>
              </dt>
              <dd>Reset demo to initial state</dd>
            </div>
          </dl>
        </DialogContent>
      </Dialog>

      <Dialog open={commandOpen} onOpenChange={setCommandOpen}>
        <DialogContent className="command-dialog">
          <DialogTitle className="sr-only">Jump to a screen</DialogTitle>
          <DialogDescription className="sr-only">
            Search the available product screens.
          </DialogDescription>
          <div className="command-input-wrap">
            <Command aria-hidden="true" size={18} />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Jump to a screen…"
              aria-label="Search screens"
            />
          </div>
          <div className="command-results">
            {filteredCommands.map(({ href, label, icon: Icon }) => (
              <button
                type="button"
                key={href}
                onClick={() => {
                  setCommandOpen(false);
                  setQuery("");
                  router.push(href);
                }}
              >
                <Icon aria-hidden="true" size={18} />
                <span>{label}</span>
                <ChevronRight aria-hidden="true" size={16} />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
