/**
 * SkipToContent — First focusable element on every page.
 * Visually hidden until focused via keyboard (Tab key).
 * Required for WCAG 2.2 AA compliance (Success Criterion 2.4.1).
 */
export function SkipToContent() {
  return (
    <a href="#main-content" className="skip-link">
      Skip to main content
    </a>
  );
}
