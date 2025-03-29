import React from "react";
import { cn } from "@/lib/utils";

/* DATABASE SCHEMA NODE ------------------------------------------------------- */
/**
 * The main DatabaseSchemaNode component that wraps the header and body.
 * It maps over the provided schema data to render rows and cells.
 */
export const DatabaseSchemaNode = ({
  children,
  selected,
  className,
}: {
  children: React.ReactNode;
  selected?: boolean;
  className?: string;
}) => (
  <div
    className={cn(
      "bg-background/95 backdrop-blur-sm border-2 rounded-lg shadow-lg transition-colors",
      selected ? "border-primary" : "border-border",
      className
    )}
  >
    {children}
  </div>
);

/* DATABASE SCHEMA NODE HEADER ------------------------------------------------ */
/**
 * A container for the database schema node header.
 */
export const DatabaseSchemaNodeHeader = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <div className="px-4 py-3 border-b bg-muted/50 rounded-t-lg font-semibold text-foreground">
    {children}
  </div>
);

/* DATABASE SCHEMA NODE BODY -------------------------------------------------- */
/**
 * A container for the database schema node body that wraps the table.
 */
export const DatabaseSchemaNodeBody = ({
  children,
}: {
  children: React.ReactNode;
}) => <div className="p-4 space-y-2">{children}</div>;

/* DATABASE SCHEMA TABLE ROW -------------------------------------------------- */
/**
 * A wrapper for individual table rows in the database schema node.
 */
export const DatabaseSchemaTableRow = ({
  children,
}: {
  children: React.ReactNode;
}) => <div className="flex items-center justify-between py-1">{children}</div>;

/* DATABASE SCHEMA TABLE CELL ------------------------------------------------- */
/**
 * A simplified table cell for the database schema node.
 * Renders static content without additional dynamic props.
 */
export const DatabaseSchemaTableCell = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={cn("relative", className)}>{children}</div>;
