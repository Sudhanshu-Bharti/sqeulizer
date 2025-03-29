import { GlowEffect } from "@/components/motion-primitives/glow-effect";
import Image from "next/image";

export function GlowEffectCardBackground() {
  return (
    <div className="relative  w-2xl h-full mx-auto">
      {/* <GlowEffect
        colors={["#0894FF", "#C959DD", "#FF2E54", "#FF9004"]}
        mode="static"
        blur="medium"
      /> */}
      <div className="absolute inset-0 rounded-lg shadow-lg overflow-hidden">
        <Image
          alt="productimage"
          src="/image.png"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 256px"
          quality={90}
        />
      </div>
    </div>
  );
}
