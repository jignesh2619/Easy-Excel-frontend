# Typography System for Lazy Excel

This document outlines the typography system for Lazy Excel, an AI-powered Excel and dashboard SaaS.

## Primary Font

**Inter** is used throughout the entire application (web app, dashboards, and landing pages).

- Font weights: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)
- Avoid font weights above 600 inside the app UI
- Optimized for desktop-first usage

## Font Usage Rules

1. Use Inter for all UI text, tables, dashboards, and landing pages
2. Avoid decorative or display fonts
3. Avoid font weights above 600 inside the app UI
4. Optimize for desktop-first usage

## Typography Scale

### Web App / Dashboard

| Element | Size | Weight | Line Height | Usage |
|---------|------|--------|-------------|-------|
| Page Title | 22-24px | 600 | 1.2-1.3 | Main page headings |
| Section Header | 18-20px | 600 | 1.2-1.3 | Section titles |
| KPI / Metric | 26-32px | 600 | 1.2 | Dashboard numbers |
| Table Header | 13-14px | 500 | 1.5 | Table column headers |
| Table Cell | 14-15px | 400-500 | 1.5-1.6 | Table data cells |
| Sidebar Nav | 14-15px | 500 | 1.5 | Navigation items |
| Input Field | 14-16px | 400 | 1.5 | Form inputs |
| Button Text | 14-15px | 500 | 1.5 | Button labels |

### Landing Page / Marketing

| Element | Size | Weight | Line Height | Usage |
|---------|------|--------|-------------|-------|
| Hero Headline | 48-56px | 700 | 1.2-1.3 | Main hero title |
| Hero Subheadline | 18-20px | 400-500 | 1.5 | Hero description |
| Section Heading | 28-32px | 600 | 1.2-1.3 | Section titles |
| Feature Text | 16-17px | 400 | 1.5-1.6 | Feature descriptions |
| CTA Button | 16px | 600 | 1.5 | Call-to-action buttons |

## Line Height & Spacing

- **Body text**: 1.5-1.6
- **Headings**: 1.2-1.3
- **Tables**: Generous row spacing for scanability

## Implementation

### CSS Variables

All typography sizes are defined as CSS variables in `src/index.css`:

```css
/* Web App / Dashboard */
--text-page-title: 1.375rem; /* 22px */
--text-section-header: 1.125rem; /* 18px */
--text-kpi-metric: 1.625rem; /* 26px */
--text-table-header: 0.8125rem; /* 13px */
--text-table-cell: 0.875rem; /* 14px */
--text-sidebar-nav: 0.875rem; /* 14px */
--text-input: 0.875rem; /* 14px */
--text-button: 0.875rem; /* 14px */

/* Landing Page / Marketing */
--text-hero-headline: 3rem; /* 48px */
--text-hero-subheadline: 1.125rem; /* 18px */
--text-section-heading: 1.75rem; /* 28px */
--text-feature: 1rem; /* 16px */
--text-cta-button: 1rem; /* 16px */
```

### Utility Classes

Use these Tailwind-like utility classes:

```html
<!-- Web App -->
<h1 class="text-page-title">Page Title</h1>
<h2 class="text-section-header">Section Header</h2>
<div class="text-kpi-metric">1,234</div>
<th class="text-table-header">Column Name</th>
<td class="text-table-cell">Data</td>
<span class="text-sidebar-nav">Navigation</span>
<input class="text-input" />
<button class="text-button">Click</button>

<!-- Landing Page -->
<h1 class="text-hero-headline">Hero Title</h1>
<p class="text-hero-subheadline">Hero description</p>
<h2 class="text-section-heading">Section Title</h2>
<p class="text-feature">Feature description</p>
<button class="text-cta-button">Get Started</button>
```

### React Components

Import typography components from `src/components/typography.tsx`:

```tsx
import { 
  // Web App / Dashboard
  PageTitle,
  SectionHeader,
  KPIMetric,
  TableHeader,
  TableCell,
  SidebarNav,
  InputText,
  ButtonText,
  // Landing Page / Marketing
  HeroHeadline,
  HeroSubheadline,
  SectionHeading,
  FeatureText,
  CTAButton
} from './components/typography';

// Usage
<PageTitle>Dashboard</PageTitle>
<HeroHeadline>Transform Excel Chaos</HeroHeadline>
<KPIMetric>10,000+</KPIMetric>
```

## Design Principles

1. **High Readability**: Optimized for tables and numbers
2. **Clean SaaS Aesthetics**: Modern, minimal, professional
3. **Consistency**: Same system across web app, dashboards, and marketing pages
4. **Excel-like Clarity**: Clear without clutter
5. **Screenshot Ready**: Optimized for screenshots and hero images

## Responsive Behavior

Typography scales responsively:

- **Mobile**: Base sizes
- **Tablet (640px+)**: Slightly larger hero headlines and section headings
- **Desktop (768px+)**: Full sizes with larger KPIs and page titles

## Examples

### Dashboard Page Title
```tsx
<PageTitle>Sales Dashboard</PageTitle>
```

### Hero Section
```tsx
<HeroHeadline>Transform Excel Chaos Into Professional Dashboards</HeroHeadline>
<HeroSubheadline>Upload your Excel file and get clean data automatically</HeroSubheadline>
```

### KPI Card
```tsx
<KPIMetric className="text-gray-900">10,000+</KPIMetric>
```

### Table
```tsx
<table>
  <thead>
    <tr>
      <TableHeader>Name</TableHeader>
      <TableHeader>Value</TableHeader>
    </tr>
  </thead>
  <tbody>
    <tr>
      <TableCell>John Doe</TableCell>
      <TableCell>1,234</TableCell>
    </tr>
  </tbody>
</table>
```
