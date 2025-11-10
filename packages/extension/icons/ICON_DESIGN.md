# Icon Design

## Current Icons

The extension uses SVG icons with a routing/branching theme:

- **icon-16.svg** - Small toolbar icon (16×16)
- **icon-48.svg** - Medium extension page icon (48×48)
- **icon-128.svg** - Large Chrome Web Store icon (128×128)

## Design Concept

**Theme:** Routing / Branching / Decision-making

**Visual Elements:**
- Gradient background (purple/blue)
- Crossed arrows indicating routing
- Center dot representing the decision point
- AI indicator (top)
- SERP indicator (bottom)

**Colors:**
- Primary: #667eea (purple-blue)
- Secondary: #764ba2 (deep purple)
- Accent: White

## Browser Compatibility

**SVG Support:**
- ✅ Chrome 88+
- ✅ Edge 88+
- ✅ Brave
- ✅ Safari 14+

If older browser support is needed, convert to PNG:
```bash
./scripts/create-icons.sh
```

## Customization

To create custom icons:

1. Edit the SVG files directly
2. Maintain the same dimensions
3. Use web-safe colors
4. Test at small sizes (16px especially)
5. Ensure good contrast

## Alternative Tools

- [Figma](https://figma.com) - Professional design
- [GIMP](https://gimp.org) - Free image editor
- [Inkscape](https://inkscape.org) - SVG editor
- Online generators - Quick favicon creation

