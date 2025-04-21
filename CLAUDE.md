# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Test Commands
- Build: `npm run build`
- Lint: `npm run lint`
- Test (all): `npm run test`
- Test (single): `npm test -- -t "test name"`

## Code Style Guidelines
- Imports: Group imports by external/internal, sort alphabetically
- Formatting: Use Prettier with 2-space indentation
- Types: TypeScript strict mode, explicit return types on functions
- Naming: camelCase for variables/functions, PascalCase for classes/components
- Error handling: Use try/catch with specific error types
- Components: Functional components with hooks, avoid class components
- State management: Use hooks API (useState, useContext, useReducer)
- Prefer async/await over promise chains
- Document public APIs with JSDoc comments