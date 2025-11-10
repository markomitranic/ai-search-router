# Contributing to AI Search Router

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `pnpm install`
3. Build the project: `pnpm build`
4. Load the extension in your browser for testing

## Project Structure

- `packages/core/` - Classification library (framework-agnostic)
- `packages/extension/` - Browser extension code (WebExtensions API)
- `platforms/` - Platform-specific build configurations

## Making Changes

### Code Style

- We use TypeScript with strict mode
- Follow the existing code style (Prettier will format automatically)
- Write meaningful commit messages
- Add tests for new classification rules

### Testing

Before submitting changes:

```bash
# Run tests
cd packages/core
pnpm test

# Build to ensure no TypeScript errors
pnpm build

# Test manually in browser
cd packages/extension
pnpm build
# Load unpacked in chrome://extensions/
```

### Commit Guidelines

- Use clear, descriptive commit messages
- Reference issues if applicable
- Keep commits focused and atomic

Examples:
```
feat: add new classification rule for comparison queries
fix: handle empty search queries correctly
docs: update setup instructions
```

## Adding New Features

### New Classification Rules

To add a new classification rule:

1. Edit `packages/core/src/classifier.ts`
2. Add test cases in `packages/core/src/classifier.test.ts`
3. Update documentation in `.cursor/rules/projectrules.mdc`
4. Ensure tests pass and performance remains fast (< 1ms)

### New Search Providers

To add a new predefined provider:

1. Edit `packages/core/src/providers.ts`
2. Add to either `AI_PROVIDERS` or `SERP_PROVIDERS`
3. Include proper URL template with `{query}` placeholder
4. Add test case in `packages/core/src/providers.test.ts`

### UI Changes

For extension UI changes:

1. Maintain consistency with existing design
2. Test on different screen sizes
3. Ensure dark mode compatibility (if applicable)
4. Update screenshots if needed

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes with tests
3. Ensure all tests pass
4. Update documentation if needed
5. Submit a pull request with clear description

### PR Checklist

- [ ] Tests pass
- [ ] Code follows existing style
- [ ] Documentation updated
- [ ] Tested manually in browser
- [ ] No TypeScript errors
- [ ] Performance is not degraded

## Code Review

- Be respectful and constructive
- Focus on the code, not the person
- Explain reasoning for suggestions
- Be open to feedback

## Questions?

Open an issue for:
- Bug reports
- Feature requests
- Questions about usage or development

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

