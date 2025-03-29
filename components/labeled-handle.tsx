import { Handle, Position } from "reactflow";
import { cn } from "@/lib/utils";

interface LabeledHandleProps {
  type: "source" | "target";
  position: Position;
  id: string;
  title: string;
  className?: string;
  handleClassName?: string;
  labelClassName?: string;
}

export function LabeledHandle({
  type,
  position,
  id,
  title,
  className,
  handleClassName,
  labelClassName,
}: LabeledHandleProps) {
  return (
    <div className={cn("flex items-center gap-2 group", className)}>
      <Handle
        type={type}
        position={position}
        id={id}
        className={cn(
          "w-4 h-4 bg-background border-2 border-primary transition-all",
          "hover:bg-primary hover:scale-110",
          "group-hover:border-primary/80",
          handleClassName
        )}
      />
      <span className={cn(
        "text-sm text-muted-foreground transition-colors",
        "group-hover:text-primary",
        labelClassName
      )}>
        {title}
      </span>
    </div>
  );
}

