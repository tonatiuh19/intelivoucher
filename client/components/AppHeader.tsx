import React from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { LanguageSelector } from "@/components/LanguageSelector";
import UserDropdown from "@/components/UserDropdown";
import { SignInModal } from "@/components/SignInModal";
import { Logo } from "@/components/Logo";
import { useScrollHeader } from "@/hooks/useScrollHeader";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectIsAuthenticated,
  selectUser,
} from "@/store/selectors/authSelectors";
import { openSignInModal } from "@/store/slices/authSlice";

export interface AppHeaderProps {
  variant?: "default" | "checkout" | "mobile-minimal" | "home";
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
  enableScrollEffect?: boolean; // New prop to enable/disable the scroll effect
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  variant = "default",
  mobileOpen = false,
  setMobileOpen,
  enableScrollEffect = true,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Use scroll detection hook
  const { isScrolled } = useScrollHeader();

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);

  // Determine if we should use scroll effects based on variant and enableScrollEffect prop
  const shouldUseScrollEffect =
    enableScrollEffect && (variant === "home" || variant === "default");

  const handleLogoClick = () => {
    if (variant !== "checkout") {
      navigate("/");
    }
  };

  const renderLogo = () => {
    // Determine logo size based on scroll state
    const isLargeState = shouldUseScrollEffect && !isScrolled;
    const logoWidth = isLargeState ? "320px" : "160px";
    const logoHeight = isLargeState ? "80px" : "40px";

    return (
      <div className="flex items-center space-x-3">
        <div
          className={`flex items-center transition-all duration-500 ease-out ${
            variant === "checkout" ? "cursor-default" : "cursor-pointer"
          } ${isLargeState ? "transform scale-110" : ""}`}
          onClick={handleLogoClick}
        >
          <Logo
            width={logoWidth}
            height={logoHeight}
            fillColor="#ffffffff"
            accentColor="var(--logo-accent, #ffffff)"
            className="transition-all duration-500 ease-out hover:scale-105"
            isDark={shouldUseScrollEffect && !isScrolled}
          />
        </div>
      </div>
    );
  };

  const renderDesktopNav = () => {
    if (variant === "checkout") return null;

    // Dynamic text color classes based on scroll state for better visibility
    const getNavTextClasses = () => {
      if (!shouldUseScrollEffect) {
        return "text-slate-700 dark:text-slate-300 hover:text-blue-500 transition-colors duration-300";
      }

      if (isScrolled) {
        // Crystallized state - normal text colors
        return "text-slate-700 dark:text-slate-300 hover:text-blue-500 transition-colors duration-300";
      } else {
        // Transparent state - white text for better contrast over hero background
        return "text-white hover:text-blue-200 transition-colors duration-300 drop-shadow-sm";
      }
    };

    return (
      <nav className="hidden md:flex items-center space-x-8">
        {variant === "home" ? (
          <>
            <a href="#events" className={getNavTextClasses()}>
              {t("common.events")}
            </a>
            <a href="#categories" className={getNavTextClasses()}>
              {t("common.categories")}
            </a>
          </>
        ) : (
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className={getNavTextClasses()}
          >
            {t("common.events")}
          </Button>
        )}
        {isAuthenticated ? (
          <UserDropdown user={user ? { ...user, id: String(user.id) } : null} />
        ) : (
          <Button
            variant={
              shouldUseScrollEffect && !isScrolled ? "secondary" : "outline"
            }
            size="sm"
            onClick={() => dispatch(openSignInModal())}
            className={`transition-all duration-300 ${
              shouldUseScrollEffect && !isScrolled
                ? "bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
                : ""
            }`}
          >
            {t("common.signIn")}
          </Button>
        )}
        <LanguageSelector />
      </nav>
    );
  };

  const renderMobileToggle = () => {
    if (variant === "checkout") return null;

    // Dynamic button classes based on scroll state
    const getButtonClasses = () => {
      const baseClasses =
        "md:hidden p-2 rounded-lg transition-all duration-300";

      if (!shouldUseScrollEffect) {
        return `${baseClasses} border border-slate-200 dark:border-slate-700`;
      }

      if (isScrolled) {
        // Crystallized state - normal button styling
        return `${baseClasses} border border-slate-200 dark:border-slate-700`;
      } else {
        // Transparent state - glass-like button
        return `${baseClasses} border border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20`;
      }
    };

    const getIconClasses = () => {
      if (shouldUseScrollEffect && !isScrolled) {
        return "w-6 h-6 text-white drop-shadow-sm";
      }
      return "w-6 h-6";
    };

    return (
      <button
        aria-label="Toggle menu"
        className={getButtonClasses()}
        onClick={() => setMobileOpen?.(!mobileOpen)}
      >
        {mobileOpen ? (
          <X className={getIconClasses()} />
        ) : (
          <Menu className={getIconClasses()} />
        )}
      </button>
    );
  };

  const renderMobileMenu = () => {
    if (variant === "checkout" || !mobileOpen) return null;

    // Dynamic mobile menu background based on scroll state
    const getMobileMenuClasses = () => {
      if (!shouldUseScrollEffect) {
        return "md:hidden border-t border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm";
      }

      if (isScrolled) {
        // Crystallized state - solid background
        return "md:hidden border-t border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl";
      } else {
        // Transparent state - glass-like effect
        return "md:hidden border-t border-white/20 bg-white/10 backdrop-blur-lg";
      }
    };

    return (
      <div className={getMobileMenuClasses()}>
        <div className="px-4 py-4 space-y-4">
          {variant === "mobile-minimal" ? (
            // Mobile minimal: only show user dropdown
            <div className="flex flex-col space-y-4">
              {isAuthenticated ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {user?.fullName || user?.email}
                  </span>
                  <UserDropdown
                    user={user ? { ...user, id: String(user.id) } : null}
                  />
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => dispatch(openSignInModal())}
                >
                  {t("common.signIn")}
                </Button>
              )}
            </div>
          ) : (
            // Default mobile menu: show everything
            <>
              {variant === "home" ? (
                <>
                  <a
                    href="#events"
                    className={`block transition-colors py-2 ${
                      shouldUseScrollEffect && !isScrolled
                        ? "text-white hover:text-blue-200 drop-shadow-sm"
                        : "text-slate-700 dark:text-slate-300 hover:text-blue-500"
                    }`}
                    onClick={() => setMobileOpen?.(false)}
                  >
                    {t("common.events")}
                  </a>
                  <a
                    href="#categories"
                    className={`block transition-colors py-2 ${
                      shouldUseScrollEffect && !isScrolled
                        ? "text-white hover:text-blue-200 drop-shadow-sm"
                        : "text-slate-700 dark:text-slate-300 hover:text-blue-500"
                    }`}
                    onClick={() => setMobileOpen?.(false)}
                  >
                    {t("common.categories")}
                  </a>
                </>
              ) : (
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    navigate("/");
                    setMobileOpen?.(false);
                  }}
                >
                  {t("common.events")}
                </Button>
              )}

              <div className="flex items-center justify-between">
                <span
                  className={`text-sm font-medium ${
                    shouldUseScrollEffect && !isScrolled
                      ? "text-white drop-shadow-sm"
                      : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {t("common.language")}
                </span>
                <LanguageSelector />
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                {isAuthenticated ? (
                  <UserDropdown
                    user={user ? { ...user, id: String(user.id) } : null}
                  />
                ) : (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      dispatch(openSignInModal());
                      setMobileOpen?.(false);
                    }}
                  >
                    {t("common.signIn")}
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  // Dynamic header classes based on scroll state
  const getHeaderClasses = () => {
    const baseClasses = shouldUseScrollEffect
      ? "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out"
      : "sticky top-0 z-50 transition-all duration-500 ease-out";

    // Debug logging
    console.log("Header state:", {
      shouldUseScrollEffect,
      isScrolled,
      variant,
    });

    if (!shouldUseScrollEffect) {
      // Default behavior for checkout, mobile-minimal variants
      return `${baseClasses} bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700`;
    }

    if (isScrolled) {
      // Crystallized state - solid background with blur and shadow
      return `${baseClasses} bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60 shadow-lg`;
    } else {
      // Fully transparent state - completely transparent, no background at all
      return `${baseClasses}`;
    }
  };

  // Dynamic padding based on scroll state
  const getPaddingClasses = () => {
    const isLargeState = shouldUseScrollEffect && !isScrolled;
    return isLargeState ? "py-6" : "py-4";
  };

  return (
    <>
      <header className={getHeaderClasses()}>
        <div
          className={`container mx-auto px-4 transition-all duration-500 ease-out ${getPaddingClasses()}`}
        >
          <div className="flex items-center justify-between">
            {renderLogo()}
            {renderDesktopNav()}
            {renderMobileToggle()}
          </div>
        </div>
        {renderMobileMenu()}
      </header>
      <SignInModal />
    </>
  );
};

export default AppHeader;
