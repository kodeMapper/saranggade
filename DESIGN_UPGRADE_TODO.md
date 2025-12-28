# Design Upgrade Checklist

## 1. Typography & Branding
- [x] **Font Upgrade**: Import and configure `Cinzel` and `Kalam`.
- [x] **Logo Creation**: Add "सारंग" logo in `Hero.jsx` with `Kalam` font.

## 2. Component Refinement
- [x] **Contact Form Styling**: Optimize `Comments.jsx` for light mode (colors, buttons, hover states).

## 3. Visual Effects (Reference Adaptations)
- [x] **Hero Section - Light Rays**:
    - [x] Port `LightRays` component (or equivalent WebGL/Canvas effect).
    - [x] Integrate into `Hero.jsx` behind the main content.
    - [x] Tune colors to match our Green/Purple/Dark theme.
- [/] **Experience Section - Tracing Beam**:
    - [x] Implement `TracingBeam` component to follow the scroll position.
    - [ ] Wrap the current "free-floating" experience timeline with this beam (user reverted).
- [/] **Interactive Cards - Spotlight**:
    - [x] Create `SpotlightCard` wrapper component.
    - [ ] Apply to `Skills` and `Projects` items (requires layout refactoring).

## 3. Structural Components
- [x] **Footer**:
    - [x] Design a new `Footer.jsx` component.
    - [x] Include social links, copyright, and potentially a "contact me" call to action or site map.
    - [x] Style with `Orbitron` headers and consistent glassmorphism.

## 4. Refinement
- [x] Ensure all new effects are responsive (disable or simplify on mobile if needed).
- [x] Verify light/dark mode compatibility for new effects.
