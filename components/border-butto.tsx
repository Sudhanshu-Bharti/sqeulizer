import { ArrowRight } from "lucide-react";
import { BorderTrail } from "./motion-primitives/border-trail";
import { Button } from "./ui/button";
import { ReactNode } from "react";

interface BorderButtonProps {
  className?: string;
  size?: number;
  children?: ReactNode;
}

export function BorderButton({ children }: BorderButtonProps) {
  return (
    <div className="relative flex w-full flex-col items-center justify-center">
      <Button variant="outline" className="rounded-full text-lg px-8 py-4">
        {" "}
        <BorderTrail
          className="bg-linear-to-l from-orange-200 via-orange-500 to-red-200 dark:from-blue-400 dark:via-blue-500 dark:to-blue-700"
          size={50}
        />
        {children}
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
}
