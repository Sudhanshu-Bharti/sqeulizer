import { Button } from "@/components/cta-button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export function GetStartedButton() {
  return (
    <Button className="group relative rounded-3xl overflow-hidden" size="default">
        <Link href="/live">  
        <span className="mr-8 transition-opacity duration-500 group-hover:opacity-0">
        Generate ERD
      </span>
      <i className="absolute right-1 top-1 bottom-1 rounded-3xl z-10 grid w-1/4 place-items-center transition-all duration-500 bg-primary-foreground/15 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95 text-black-500">
        <ChevronRight size={12} strokeWidth={1} aria-hidden="true" />
      </i>
        </Link>
    </Button>
  );
}
