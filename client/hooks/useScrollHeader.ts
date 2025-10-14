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

      // Find the first h2 element in the hero section
      const firstH2 = document.querySelector("h2");

      if (firstH2) {
        const h2Position = firstH2.getBoundingClientRect().top + window.scrollY;
        // Add some offset to trigger the crystallized state a bit before reaching the h2
        const threshold = h2Position - 100;
        setIsScrolled(currentScrollY > threshold);
      } else {
        // Fallback: use a fixed scroll threshold if no h2 is found
        setIsScrolled(currentScrollY > 80);
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
