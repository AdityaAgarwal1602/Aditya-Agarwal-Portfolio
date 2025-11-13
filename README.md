# Clean & Analytical — Fresher Data Analyst Portfolio

A clean, single-page portfolio built with HTML, Tailwind CSS, and JavaScript. It showcases an analytical mindset with a tidy layout, clear navigation, and room for interactive project case studies.

## What’s included

- Sticky top Navigation Bar with active link highlighting
- Hero section with headline, tagline, and CTAs
- Placeholders for About, Skills, Projects, and Contact sections
- Lightweight JS for smooth scrolling, mobile menu, and active link state
- Tailwind via CDN and Inter font from Google Fonts (no build step needed)

## Quick start

1. Open `index.html` directly in your browser, or use a local server.
2. Replace placeholders:
   - Update your name in the brand and hero headline.
   - Replace the hero image placeholder with an `<img>` tag.
   - Drop your resume at `assets/resume.pdf` and the "Download Resume" button will use it.
3. Fill out the sections in order: About, Skills, Projects (with filters and case study modals), and Contact.

Optional: If using VS Code, install the "Live Server" extension to auto-reload on changes.

## Customize theme

Tailwind’s CDN config adds a small palette extension:

- Primary (blue): `#2563EB`
- Accent (green): `#059669`
- Text: `#1F2937`
- Background: `#F9FAFB`
- Dividers: `#E5E7EB`

Adjust these in the inline `tailwind.config` in `index.html`.

## Add your headshot

Replace the placeholder in the hero with an image tag, e.g.:

```html
<img src="assets/images/headshot.jpg" alt="[Your Name] headshot" class="h-full w-full object-cover rounded-2xl" />
```

## Roadmap (next steps)

- About: Add two short paragraphs (professional + personal).
- Skills: Grid with icons and hover tooltips per skill.
- Projects: Filter buttons, project cards, and a modal-based case study view; embed dashboards where possible.
- Contact: Mailto link and social icons (LinkedIn/GitHub).
- Footer: Final sign-off and year.

## License

This project is free to use and modify for your personal portfolio.
