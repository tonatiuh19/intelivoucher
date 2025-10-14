import { useEffect, useState } from "react";

interface UseScrollHeaderResult {
  isScrolled: boolean;
  scrollY: number;
}

export const useScrollHeader = (): UseScrollHeaderResult => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      // For Eventos page, we want to trigger based on leaving the hero section
      // Look for the hero H1 element first, then fallback to H2 if needed
      const heroH1 = document.querySelector("h1");
      const targetElement = heroH1;

      if (targetElement) {
        const elementPosition =
          targetElement.getBoundingClientRect().top + window.scrollY;
        // Use a small offset to trigger when we start leaving the hero section
        // This should trigger around 400-500px scroll for better UX
        const offset = 100;
        const threshold = Math.max(elementPosition - offset, 400);

        setIsScrolled(currentScrollY > threshold);
      } else {
        // Fallback: use a reasonable fixed threshold for hero sections
        setIsScrolled(currentScrollY > 400);
      }
    };

    // Set initial values
    handleScroll();

    // Add scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return { isScrolled, scrollY };
};
