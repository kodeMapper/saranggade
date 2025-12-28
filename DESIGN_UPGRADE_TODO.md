# Design Upgrade Checklist

## 1. Typography & Branding
- [x] **Font Upgrade**: Import and configure `Cinzel` and `Kalam`.
- [x] **Logo Creation**: Add "सारंग" logo in `Hero.jsx` with `Kalam` font.

## 2. Component Refinement
- [x] **Contact Form Styling**: Optimize `Comments.jsx` for light mode (colors, buttons, hover states).

## 3. Visual Effects (Reference Adaptations)
- [ ] **Hero Section - Light Rays**:
    - [ ] Port `LightRays` component (or equivalent WebGL/Canvas effect).
    - [ ] Integrate into `Hero.jsx` behind the main content.
    - [ ] Tune colors to match our Green/Purple/Dark theme.
- [ ] **Experience Section - Tracing Beam**:
    - [ ] Implement `TracingBeam` component to follow the scroll position.
    - [ ] Wrap the current "free-floating" experience timeline with this beam.
- [ ] **Interactive Cards - Spotlight**:
    - [ ] Create `SpotlightCard` wrapper.
    - [ ] Apply to `Skills` and `Projects` items for hover illumination.

## 3. Structural Components
- [ ] **Footer**:
    - [ ] Design a new `Footer.jsx` component.
    - [ ] Include social links, copyright, and potentially a "contact me" call to action or site map.
    - [ ] Style with `Orbitron` headers and consistent glassmorphism.

## 4. Refinement
- [ ] Ensure all new effects are responsive (disable or simplify on mobile if needed).
- [ ] Verify light/dark mode compatibility for new effects.
