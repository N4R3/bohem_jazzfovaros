import { ReactNode, AnchorHTMLAttributes } from "react";
import Link from "next/link";

type Variant = "primary" | "secondary" | "outline";

interface ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: Variant;
  children: ReactNode;
  className?: string;
  external?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "inline-flex items-center justify-center rounded-lg bg-[var(--color-gold-500)] text-[var(--color-navy-900)] px-6 py-3 text-sm font-semibold hover:bg-[var(--color-gold-600)] transition-colors",
  secondary:
    "inline-flex items-center justify-center rounded-lg bg-[var(--color-navy-900)] text-[var(--color-gold-500)] px-6 py-3 text-sm font-semibold hover:bg-[var(--color-navy-800)] transition-colors",
  outline:
    "inline-flex items-center justify-center rounded-lg border border-[var(--color-gold-500)] text-[var(--color-gold-500)] px-6 py-3 text-sm font-semibold hover:bg-[var(--color-gold-500)] hover:text-[var(--color-navy-900)] transition-colors",
};

export default function Button({
  href,
  variant = "primary",
  children,
  className = "",
  external = false,
  ...rest
}: ButtonProps) {
  const classes = `${variants[variant]} ${className}`;

  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
