"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  return (
    <main className="error-state">
      <span>Plan update paused</span>
      <h1>We couldn&apos;t update the plan.</h1>
      <p>Your previous plan is still available.</p>
      <div>
        <Button onClick={reset}>Try again</Button>
        <Button variant="secondary" onClick={() => router.push("/student")}>
          Use previous plan
        </Button>
      </div>
    </main>
  );
}
