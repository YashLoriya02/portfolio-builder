"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function RouteTransition() {
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // simple "wipe" on navigation
    const el = overlayRef.current;
    if (!el) return;

    gsap.killTweensOf(el);
    gsap.set(el, { yPercent: -100, opacity: 1 });

    gsap.to(el, { yPercent: 0, duration: 0.35, ease: "power3.out" });
    gsap.to(el, {
      yPercent: 100,
      duration: 0.45,
      ease: "power3.inOut",
      delay: 0.15,
    });
  }, [pathname]);

  return (
    <div
      ref={overlayRef}
      className="pointer-events-none fixed inset-0 z-9999 bg-white/10 backdrop-blur-md"
      style={{ transform: "translateY(-100%)" }}
    />
  );
}
