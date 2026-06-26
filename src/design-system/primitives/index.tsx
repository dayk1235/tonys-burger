/**
 * Design System — Primitives
 *
 * Low-level React components that form the foundation of every interface.
 * These primitives have no business logic, no restaurant-specific assumptions,
 * and no page-specific styling.
 *
 * They are the closest thing to HTML elements in the design system.
 * Every component in the system is built from these primitives.
 */

"use client";

import { forwardRef, type ElementType, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ─── Box ────────────────────────────────────── */

export interface BoxProps extends HTMLAttributes<HTMLDivElement> {
  /** HTML element to render as */
  as?: ElementType;
  children: ReactNode;
}

/**
 * Box — The lowest-level primitive. A generic container with no default styles.
 * Use Box when no other primitive fits. Use it as the base for all other components.
 *
 * @example
 * <Box as="section" className="p-6">
 *   <p>Content</p>
 * </Box>
 */
export const Box = forwardRef<HTMLDivElement, BoxProps>(
  ({ as: Component = "div", className, children, ...props }, ref) => {
    return (
      <Component ref={ref} className={cn(className)} {...props}>
        {children}
      </Component>
    );
  },
);
Box.displayName = "Box";

/* ─── Flex ───────────────────────────────────── */

export interface FlexProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Direction of the flex container */
  direction?: "row" | "col" | "row-reverse" | "col-reverse";
  /** How to align items along the cross-axis */
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  /** How to distribute items along the main-axis */
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  /** Gap between flex items */
  gap?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "8" | "10" | "12";
  /** Whether to wrap items */
  wrap?: boolean;
  /** Whether to use inline-flex */
  inline?: boolean;
}

/**
 * Flex — A flexbox container.
 * Use Flex for 90% of layouts. It is the most common layout primitive.
 *
 * @example
 * <Flex direction="row" gap="4" align="center">
 *   <span>Label</span>
 *   <span>Value</span>
 * </Flex>
 */
export const Flex = forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      children,
      direction = "row",
      align = "stretch",
      justify = "start",
      gap = "0",
      wrap = false,
      inline = false,
      className,
      ...props
    },
    ref,
  ) => {
    const directionClass = `flex-${direction}`;
    const alignMap: Record<string, string> = {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
      baseline: "items-baseline",
    };
    const justifyMap: Record<string, string> = {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    };

    return (
      <div
        ref={ref}
        className={cn(
          inline ? "inline-flex" : "flex",
          directionClass,
          alignMap[align],
          justifyMap[justify],
          gap !== "0" && `gap-${gap}`,
          wrap && "flex-wrap",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Flex.displayName = "Flex";

/* ─── Center ─────────────────────────────────── */

export interface CenterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Whether to center vertically as well */
  vertically?: boolean;
  /** Maximum width constraint */
  maxWidth?: "narrow" | "medium" | "wide";
}

/**
 * Center — Centers its children horizontally (and optionally vertically).
 * Use for centering content within its parent container.
 *
 * @example
 * <Center maxWidth="narrow">
 *   <p>Centered content</p>
 * </Center>
 */
export const Center = forwardRef<HTMLDivElement, CenterProps>(
  ({ children, vertically = false, maxWidth, className, ...props }, ref) => {
    const widthMap: Record<string, string> = {
      narrow: "max-w-container-narrow",
      medium: "max-w-container-max",
      wide: "max-w-container-wide",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "mx-auto",
          maxWidth && widthMap[maxWidth],
          vertically && "flex flex-col justify-center",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Center.displayName = "Center";

/* ─── VisuallyHidden ─────────────────────────── */

export interface VisuallyHiddenProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

/**
 * VisuallyHidden — Hides content visually but keeps it accessible to screen readers.
 * Use for accessibility labels, descriptions, and skip links.
 *
 * @example
 * <VisuallyHidden>
 *   <span>Close dialog</span>
 * </VisuallyHidden>
 */
export const VisuallyHidden = forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "absolute -m-px size-px overflow-hidden whitespace-nowrap border-0 p-0",
          "[clip:rect(0,0,0,0)]",
          className,
        )}
        {...props}
      >
        {children}
      </span>
    );
  },
);
VisuallyHidden.displayName = "VisuallyHidden";

/* ─── Divider ────────────────────────────────── */

export interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  /** Whether the divider is vertical */
  vertical?: boolean;
  /** Optional label text */
  label?: string;
}

/**
 * Divider — A visual separator between sections or elements.
 * Use to create visual breathing room between distinct content blocks.
 *
 * @example
 * <Divider />
 * <Divider label="or" />
 */
export const Divider = forwardRef<HTMLHRElement, DividerProps>(
  ({ vertical = false, label, className, ...props }, ref) => {
    if (vertical) {
      return (
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          className={cn("mx-2 h-full w-px bg-border", className)}
          role="separator"
          aria-orientation="vertical"
          {...props}
        />
      );
    }

    if (label) {
      return (
        <div className={cn("flex items-center gap-3", className)} role="separator">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-medium text-text-muted">{label}</span>
          <div className="h-px flex-1 bg-border" />
        </div>
      );
    }

    return (
      <hr
        ref={ref}
        className={cn("h-px w-full border-0 bg-border", className)}
        role="separator"
        aria-orientation="horizontal"
        {...props}
      />
    );
  },
);
Divider.displayName = "Divider";
