# Ansl Supernova Foundations Blueprint v1.1

This blueprint turns the chosen MP225 palette and the selected shadcn/ui Maia structural style into a documented foundation layer for Supernova.

## Scope completed now
- Color foundations
- Semantic color system
- **Gradient foundations**
- **Semantic gradient system**
- Light + dark theme mappings
- shadcn-compatible theme variable mapping
- Space scale
- Size scale
- Radius scale
- Border width tokens
- Border composite tokens
- Shadow scale
- Blur scale
- Opacity scale
- Motion duration tokens
- Z-index tokens
- Easing string tokens
- Supernova collections / groups / page IA
- Custom token property recommendations

## Deferred until you choose fonts
- Primary UI sans family
- Mono family
- Concrete typography tokens
- Final type specimen pages
- Type-to-component mapping

## Design-token architecture
Use four tiers:
1. Raw primitives
2. Semantic tokens
3. Component tokens
4. Themes

## Supernova collections
- 01-foundations
- 02-semantic
- 03-components
- 04-themes
- 05-metadata

## Radius scale locked from shadcn CSS
- none: 0rem
- sm: 0.375rem
- md: 0.5rem
- lg: 0.625rem
- xl: 0.875rem
- 2xl: 1.125rem
- 3xl: 1.375rem
- 4xl: 1.625rem
- full: 9999px

## Space scale recommendation
4px-based:
0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128

## Shadow scale recommendation
Use subtle, product-grade elevation. Treat shadows as reinforcement, not decoration.
- none
- xs
- sm
- md
- lg
- xl
- focus

## Color system
### Raw palette anchors
- Bobcat Whiskers: #EADFD0
- Aurora Green: #6ADC99
- Illuminating: #EEEE77
- Persian Pink: #F77FBE
- Sagat Purple: #6A31CA
- Siyâh Black: #1C1B1A

### Color role principles
- Structure: cream + ink
- Brand signature: purple
- Spark: yellow
- Emotional support: green + pink
- Danger: derived raspberry scale
- Do not let all six hero colors lead equally in UI

## Gradient system
The MP225 palette comes with an intrinsic gradient language and it should be documented as tokens, not left as loose moodboard-only art.

### Raw gradients
- `gradient.raw.hero.light`
- `gradient.raw.hero.dark`
- `gradient.raw.aura.brand.light`
- `gradient.raw.aura.brand.dark`
- `gradient.raw.signal.support`
- `gradient.raw.twilight.brand`

### Semantic gradients
- `gradient.surface.hero`
- `gradient.surface.canvasAccent`
- `gradient.brand.aura`
- `gradient.signal.support`

### Gradient usage rules
- Hero gradients are for large-format surfaces only.
- Aura gradients are for decorative focal use behind logo, illustration, mascot, or a single feature highlight.
- Support gradients are for charts, ribbons, feature stripes, and illustration accents.
- Do not place dense body text directly on the expressive parts of gradients.
- Do not use gradients as the default fill for core controls like primary buttons, inputs, or badges.
- Treat gradients as **atmosphere**, not as the primary information layer.

## Documentation IA
### Getting Started
- Overview
- Brand Intent
- Token Architecture
- Naming Convention
- How to Use Themes

### Foundations
- Color
- Color Ramps
- Semantic Colors
- Gradients
- Gradient Usage
- Typography (placeholder)
- Space
- Size
- Radius
- Border Width
- Border Tokens
- Shadows
- Blur
- Opacity
- Motion
- Z-Index
- Accessibility

### Themes
- Light Theme
- Dark Theme
- High Contrast Theme

### Patterns
- Color Usage Rules
- Decorative Gradient Rules
- Data Viz Usage
- Status & Feedback
- Elevation & Layering
- Layout & Density
- States & Interaction

### Components
- Component Inventory
- Buttons
- Inputs
- Selections
- Feedback
- Navigation
- Data Display
- Overlays
- Inbox Patterns
- Agent Patterns

### Implementation
- shadcn/Tailwind Mapping
- Export Strategy
- Custom Properties
- Code Naming
- Change Log

## Typography to document now (without choosing fonts)
Create the documentation skeleton for:
- Display
- Heading
- Title
- Body
- Label
- Caption
- Legal
- Code/mono

Document:
- intended use
- content length expectations
- hierarchy rules
- capitalization rules
- density rules
- contrast expectations
- responsive behavior

Do not create actual typography tokens until the font family decision is made.

## Files included in this package
- ansl_supernova_foundations_v1_gradients.json
- ansl_shadcn_theme_v1_gradients.css
- ansl_gradient_preview_candidates.png
- ansl_gradient_preview_uicheck.png
