import React from "react";
import { cn } from "@/lib/utils";


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


export const DatabaseSchemaNodeHeader = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <div className="px-4 py-3 border-b bg-muted/50 rounded-t-lg font-semibold text-foreground">
    {children}
  </div>
);

export const DatabaseSchemaNodeBody = ({
  children,
}: {
  children: React.ReactNode;
}) => <div className="p-4 space-y-2">{children}</div>;


export const DatabaseSchemaTableRow = ({
  children,
}: {
  children: React.ReactNode;
}) => <div className="flex items-center justify-between py-1">{children}</div>;


export const DatabaseSchemaTableCell = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={cn("relative", className)}>{children}</div>;
