import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AskScreen } from "@/components/ask/ask-screen";
import { FocusScreen } from "@/components/focus/focus-screen";
import { OverviewScreen } from "@/components/overview/overview-screen";
import { PlanScreen } from "@/components/plan/plan-screen";
import { DemoProvider } from "@/state/demo-provider";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => "/student",
}));

function renderWithDemo(component: React.ReactNode) {
  return render(<DemoProvider>{component}</DemoProvider>);
}

beforeEach(() => {
  push.mockReset();
});

describe("BackOnTrack deterministic demo", () => {
  it("renders the Operating Systems recovery mission with Riya's six-hour context", () => {
    renderWithDemo(<OverviewScreen />);
    expect(
      screen.getByRole("heading", { name: "Let's get you back on track." }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/You have 6 hours before Operating Systems/),
    ).toBeInTheDocument();
    expect(screen.getByText("Weeks 4–6")).toBeInTheDocument();
  });

  it("starts the next block and exposes recommendation evidence", async () => {
    const user = userEvent.setup();
    renderWithDemo(<OverviewScreen />);
    await user.click(screen.getByRole("button", { name: "Why this?" }));
    expect(
      screen.getByRole("heading", { name: "Why CPU Scheduling first?" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Operating Systems syllabus")).toBeInTheDocument();
    expect(screen.getByText("Week 4 lecture notes")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Start this block/ }));
    expect(push).toHaveBeenCalledWith("/student/focus");
  });

  it("opens the honest exit dialog on Escape and lets the student remain", async () => {
    const user = userEvent.setup();
    renderWithDemo(<FocusScreen />);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(await screen.findByRole("alertdialog")).toBeInTheDocument();
    expect(
      screen.getByText("12 minutes left in this block."),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Finish the 12 min" }));
    await waitFor(() =>
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument(),
    );
    expect(screen.getAllByText("CPU Scheduling").length).toBeGreaterThan(0);
  });

  it("genuinely pauses and leaves focus mode", async () => {
    const user = userEvent.setup();
    renderWithDemo(<FocusScreen />);
    await user.click(screen.getByRole("button", { name: /Pause/ }));
    await user.click(screen.getByRole("button", { name: "Pause & leave" }));
    expect(push).toHaveBeenCalledWith("/student");
  });

  it("updates mastery from 38% to 72% and reroutes released time", async () => {
    const user = userEvent.setup();
    renderWithDemo(<FocusScreen />);
    await user.click(
      screen.getByRole("button", { name: /Continue to example/ }),
    );
    await user.click(screen.getByRole("button", { name: /Try one yourself/ }));
    await user.click(
      screen.getByRole("button", { name: /Check and continue/ }),
    );
    await user.click(
      screen.getByRole("button", { name: /Submit mastery check/ }),
    );
    expect((await screen.findAllByText("Plan updated")).length).toBeGreaterThan(
      0,
    );
    expect(screen.getByText("+18 min")).toBeInTheDocument();
    expect(screen.getByText(/72% mastery/)).toBeInTheDocument();
  });

  it("treats a three-hour message as structured plan input", async () => {
    const user = userEvent.setup();
    renderWithDemo(<AskScreen />);
    await user.type(
      screen.getByLabelText("Ask about your plan"),
      "I only have 3 hours now.",
    );
    await user.click(screen.getByRole("button", { name: "Send message" }));
    expect(
      await screen.findByText("Study budget changed: 6h → 3h"),
    ).toBeInTheDocument();
    expect(screen.getByText("timeBudgetHours: 3")).toBeInTheDocument();
    expect(
      screen.getByText(/Deadlocks is now the next 35-minute block/),
    ).toBeInTheDocument();
  });

  it("shows the recalculated plan after mastery changes", async () => {
    const user = userEvent.setup();
    function Flow() {
      return (
        <>
          <FocusScreen />
          <PlanScreen />
        </>
      );
    }
    renderWithDemo(<Flow />);
    await user.click(
      screen.getByRole("button", { name: /Continue to example/ }),
    );
    await user.click(screen.getByRole("button", { name: /Try one yourself/ }));
    await user.click(
      screen.getByRole("button", { name: /Check and continue/ }),
    );
    await user.click(
      screen.getByRole("button", { name: /Submit mastery check/ }),
    );
    expect(await screen.findAllByText("Deadlocks")).not.toHaveLength(0);
    expect((await screen.findAllByText("1h 13m")).length).toBeGreaterThan(0);
  });
});
