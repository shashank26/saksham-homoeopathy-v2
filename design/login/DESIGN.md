---
name: Vitality Core
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#584238'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#8c7166'
  outline-variant: '#e0c0b3'
  surface-tint: '#a33f00'
  primary: '#a33f00'
  on-primary: '#ffffff'
  primary-container: '#f06b24'
  on-primary-container: '#501b00'
  inverse-primary: '#ffb595'
  secondary: '#006d36'
  on-secondary: '#ffffff'
  secondary-container: '#89f6a6'
  on-secondary-container: '#007238'
  tertiary: '#00658f'
  on-tertiary: '#ffffff'
  tertiary-container: '#399cd1'
  on-tertiary-container: '#003046'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbcd'
  primary-fixed-dim: '#ffb595'
  on-primary-fixed: '#360f00'
  on-primary-fixed-variant: '#7c2e00'
  secondary-fixed: '#8cf9a9'
  secondary-fixed-dim: '#70dc8f'
  on-secondary-fixed: '#00210c'
  on-secondary-fixed-variant: '#005227'
  tertiary-fixed: '#c7e7ff'
  tertiary-fixed-dim: '#85cfff'
  on-tertiary-fixed: '#001e2e'
  on-tertiary-fixed-variant: '#004c6c'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Manrope
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-margin: 24px
  gutter: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  section-gap: 64px
---

## Brand & Style

The design system is rooted in the intersection of traditional homeopathy and modern clinical precision. It targets health-conscious individuals seeking holistic yet scientifically-backed wellness solutions. The brand personality is **composed, empathetic, and exceptionally clear**.

The visual style follows a **Corporate Modern** aesthetic with a lean toward **Minimalism**. By utilizing high-quality whitespace and a structured layout, the system evokes a sense of "clinical calm"—reducing the cognitive load often associated with medical data. Visual elements are intentional, avoiding decorative clutter to prioritize readability and trust.

**Key Principles:**
- **Clarity over Complexity:** Information is organized into digestible modules.
- **Approachable Professionalism:** A balance of vibrant brand colors with a soft, neutral foundation.
- **Vitality:** Using the natural energy of the orange and green palette to signal recovery and health.

## Colors

The palette is directly derived from the core identity, representing energy (Orange), natural healing (Green), and clinical stability (Blue). 

- **Primary (Vibrant Orange):** Used for primary actions, progress indicators, and vital highlights. It signals warmth and human activity.
- **Secondary (Forest Green):** Used for success states, wellness metrics, and homeopathic category labeling.
- **Tertiary (Deep Cerulean):** Used for informational elements, medical records, and professional-grade data visualizations.
- **Neutrals:** A slate-based neutral scale is used for text and borders to maintain a cool, modern temperament, contrasting with the warm brand colors.

The default background is a clean white (`#FFFFFF`) with subtle off-white (`#F8FAFC`) sectioning to define content areas without using heavy lines.

## Typography

The design system utilizes **Manrope** across all touchpoints. Its geometric yet humanist qualities provide the "clinical-yet-approachable" balance required for a medical app.

- **Headlines:** Use Bold weights with slight negative letter-spacing for a modern, confident look.
- **Body Text:** Set with generous line height (1.5x+) to ensure medical descriptions and dosage instructions are easily readable by all age groups.
- **Labels:** Used for micro-copy, data labels, and button text, employing semi-bold weights for clear hierarchy at smaller scales.

Hierarchy is strictly enforced: color is used sparingly in type (primarily for links or success/error states), relying on weight and size to guide the eye.

## Layout & Spacing

This design system uses a **Fluid Grid** model to accommodate complex medical data across devices. 

- **Desktop:** 12-column grid with 24px gutters. Content is typically centered in a 1200px max-width container.
- **Tablet:** 8-column grid with 20px gutters.
- **Mobile:** 4-column grid with 16px gutters and 24px side margins.

**Rhythm:** An 8px linear scale governs all padding and margins. Vertical rhythm is "airy," utilizing large gaps (Section Gap) between distinct functional areas to prevent the UI from feeling "crowded" or stressful—an essential consideration for a wellness application.

## Elevation & Depth

To maintain a clean and trustworthy clinical aesthetic, this design system avoids heavy shadows. Instead, it utilizes **Tonal Layers** and **Low-Contrast Outlines**.

- **Surface Levels:** The primary background is white. Secondary cards or "wells" use a very light gray or a faint tint of the tertiary blue to create separation.
- **Shadows:** When necessary for interactivity (e.g., a floating action button or a modal), use "Ambient Shadows"—highly diffused, 10-15% opacity using a Slate tint (`#64748B`) rather than pure black.
- **Dividers:** Use 1px borders in a soft light-gray (`#E2E8F0`) to define list items and header sections.

## Shapes

The shape language is **Rounded (Level 2)**. This specific radius (0.5rem base) moves away from the "sharpness" of traditional institutional software, making the app feel more inviting and modern.

- **Standard Elements:** Buttons, input fields, and cards use the 0.5rem (8px) radius.
- **Large Containers:** Modals and feature cards use 1rem (16px) to emphasize their role as distinct content containers.
- **Interactive Indicators:** Elements like "Dosage Chips" or "Status Badges" may utilize the `rounded-xl` (1.5rem) setting to appear pill-like and distinct from structural containers.

## Components

### Buttons
- **Primary:** Solid Vibrant Orange with white text. High contrast for critical path actions (e.g., "Book Consultation").
- **Secondary:** Outlined Forest Green with green text. Used for secondary wellness actions.
- **Ghost:** Tertiary Blue text with no background, used for low-priority navigation.

### Input Fields
Clean, outlined boxes with the 0.5rem radius. The border color is light gray, shifting to Primary Orange on focus. Labels are always persistent above the field in `label-md` style.

### Cards
Cards are the primary container for remedies, appointments, and articles. They should feature a white background, a 1px light-gray border, and a subtle 4px vertical padding increase to enhance the feeling of "breathable" space.

### Chips & Badges
Used for categorizing homeopathic remedies (e.g., "Herbal," "Mineral," "Acute"). These should use a light-tinted background of the secondary or tertiary color with dark-colored text for high legibility.

### Progress Indicators
Used for treatment plans. Utilize the Primary Orange for "Active" progress and Secondary Green for "Completed" milestones to provide positive reinforcement.

### Lists
Lists should have generous vertical padding (16px - 24px per item) with a subtle bottom divider. High-priority information (like medication timing) should be bolded using `label-md`.