import React from "react";
import { cn } from "./ui/utils";

/**
 * Typography Components for Lazy Excel
 * 
 * Web App / Dashboard Components:
 * - PageTitle: 22-24px, font-weight 600
 * - SectionHeader: 18-20px, font-weight 600
 * - KPIMetric: 26-32px, font-weight 600
 * - TableHeader: 13-14px, font-weight 500
 * - TableCell: 14-15px, font-weight 400-500
 * - SidebarNav: 14-15px, font-weight 500
 * - InputText: 14-16px, font-weight 400
 * - ButtonText: 14-15px, font-weight 500
 * 
 * Landing Page / Marketing Components:
 * - HeroHeadline: 48-56px, font-weight 700
 * - HeroSubheadline: 18-20px, font-weight 400-500
 * - SectionHeading: 28-32px, font-weight 600
 * - FeatureText: 16-17px, font-weight 400
 * - CTAButton: 16px, font-weight 600
 */

// Web App / Dashboard Typography

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
}

export function PageTitle({ children, className, ...props }: TypographyProps) {
  return (
    <h1 className={cn("text-page-title", className)} {...props}>
      {children}
    </h1>
  );
}

export function SectionHeader({ children, className, ...props }: TypographyProps) {
  return (
    <h2 className={cn("text-section-header", className)} {...props}>
      {children}
    </h2>
  );
}

export function KPIMetric({ children, className, ...props }: TypographyProps) {
  return (
    <div className={cn("text-kpi-metric", className)} {...props}>
      {children}
    </div>
  );
}

export function TableHeader({ children, className, ...props }: TypographyProps) {
  return (
    <th className={cn("text-table-header", className)} {...props}>
      {children}
    </th>
  );
}

export function TableCell({ children, className, ...props }: TypographyProps) {
  return (
    <td className={cn("text-table-cell", className)} {...props}>
      {children}
    </td>
  );
}

export function SidebarNav({ children, className, ...props }: TypographyProps) {
  return (
    <span className={cn("text-sidebar-nav", className)} {...props}>
      {children}
    </span>
  );
}

export function InputText({ children, className, ...props }: TypographyProps) {
  return (
    <span className={cn("text-input", className)} {...props}>
      {children}
    </span>
  );
}

export function ButtonText({ children, className, ...props }: TypographyProps) {
  return (
    <span className={cn("text-button", className)} {...props}>
      {children}
    </span>
  );
}

// Landing Page / Marketing Typography

export function HeroHeadline({ children, className, ...props }: TypographyProps) {
  return (
    <h1 className={cn("text-hero-headline", className)} {...props}>
      {children}
    </h1>
  );
}

export function HeroSubheadline({ children, className, ...props }: TypographyProps) {
  return (
    <p className={cn("text-hero-subheadline", className)} {...props}>
      {children}
    </p>
  );
}

export function SectionHeading({ children, className, ...props }: TypographyProps) {
  return (
    <h2 className={cn("text-section-heading", className)} {...props}>
      {children}
    </h2>
  );
}

export function FeatureText({ children, className, ...props }: TypographyProps) {
  return (
    <p className={cn("text-feature", className)} {...props}>
      {children}
    </p>
  );
}

export function CTAButton({ children, className, ...props }: TypographyProps) {
  return (
    <span className={cn("text-cta-button", className)} {...props}>
      {children}
    </span>
  );
}
