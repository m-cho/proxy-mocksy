# JSR Publishing Setup for proxy-mocksy

## Overview

This setup allows dual publishing to both npm and JSR (JavaScript Registry) for Deno compatibility.

## Package Configuration

### Core Package (`@proxy-mocksy/core`)
- JSR configuration: `packages/core/jsr.json`
- Exports TypeScript source directly from `src/index.ts`
- No build step required for JSR

### CLI Package (`@proxy-mocksy/cli`)
- JSR configuration: `packages/cli/jsr.json`
- Exports TypeScript source directly from `src/cli.ts`
- Uses JSR import mapping for the core dependency

## Publishing to JSR

### Prerequisites
1. Install JSR CLI: `npm install -g @jsr/cli` (optional, npx can be used)
2. Authenticate with JSR: `npx jsr auth` (one time setup)

### Commands

**Publish individual packages:**
```bash
npm run jsr:publish:core    # Publish core package
npm run jsr:publish:cli     # Publish CLI package
```

**Publish all packages:**
```bash
npm run jsr:publish:all     # Publish both packages
```

**Dry run (test before publishing):**
```bash
cd packages/core && npx jsr publish --dry-run
cd packages/cli && npx jsr publish --dry-run
```

## Usage with Deno

Once published to JSR, users can run the CLI with Deno:

```bash
# Run directly from JSR
deno run jsr:@proxy-mocksy/cli
```

## Key Benefits

1. **No build step needed**: JSR works directly with TypeScript source files
2. **Dual publishing**: Maintain npm compatibility while adding Deno support
3. **Automatic type definitions**: JSR generates .d.ts files automatically
4. **Better performance**: JSR provides faster installs and better caching

## Important Notes

- JSR requires explicit return types for all public API functions
- The `jsr.json` files control what gets published to JSR
- Import mapping in CLI's `jsr.json` ensures proper dependency resolution
- Keep version numbers in sync between `package.json` and `jsr.json`
