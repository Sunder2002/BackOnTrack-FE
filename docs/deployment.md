# Deployment and release checklist

## Supported paths

### Managed Next.js host

1. Connect the GitHub repository.
2. Use Node.js 24 and pnpm.
3. Build with `pnpm build`.
4. Start with the platform's standard Next.js runtime.

No runtime secrets are required for the demo client.

### Container

```bash
docker build -t back-on-track .
docker run --rm -p 3000:3000 back-on-track
```

The container runs as a non-root user and serves the Next.js standalone build.

## Before release

- Install with `pnpm install --frozen-lockfile`.
- Run formatting, lint, type-check, interaction tests and production build.
- Verify the demo journey at 1440×900, 1366×768, 1024×768 and 390×844.
- Check keyboard-only navigation and reduced-motion mode.
- Confirm no secrets, `.env` files, build output or dependencies are committed.
- Confirm source labels still match the actual approved dataset.
- Replace the mock client only with an implementation of the existing `LearningApi` contract.

## Environment policy

Browser-safe values may use `NEXT_PUBLIC_*`. Credentials must remain server-only and must never be placed in client components or committed files. `.env.example` documents supported keys without containing secrets.
