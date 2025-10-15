import React from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User } from "lucide-react";
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
    // Determine logo size based on scroll state and screen size
    const isLargeState = shouldUseScrollEffect && !isScrolled;

    return (
      <div className="flex items-center space-x-3">
        <div
          className={`flex items-center transition-all duration-500 ease-out ${
            variant === "checkout" ? "cursor-default" : "cursor-pointer"
          }`}
          onClick={handleLogoClick}
        >
          <Logo
            fillColor="#ffffffff"
            accentColor="var(--logo-accent, #ffffff)"
            className={`transition-all duration-500 ease-out hover:scale-105 w-[2000px] h-auto ${
              isLargeState ? "md:w-[320px]" : "md:w-[160px]"
            }`}
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
            {/* <a href="#categories" className={getNavTextClasses()}>
              {t("common.categories")}
            </a> */}
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              onClick={() => navigate("/eventos")}
              className={getNavTextClasses()}
            >
              {t("common.events")}
            </Button>
          </>
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
    // Remove burger menu button entirely for mobile
    // Only show sign-in/user dropdown on mobile (language selector moved to footer)
    if (variant === "checkout") return null;

    return (
      <div className="md:hidden flex items-center gap-2">
        {isAuthenticated && user ? (
          <div className="flex items-center gap-1">
            {/* Show user icon on mobile for logged-in users */}
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                shouldUseScrollEffect && !isScrolled
                  ? "bg-white/20 border border-white/30"
                  : "bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              }`}
            >
              <User
                className={`w-4 h-4 ${
                  shouldUseScrollEffect && !isScrolled
                    ? "text-white"
                    : "text-slate-700 dark:text-slate-300"
                }`}
              />
            </div>
            <UserDropdown
              user={user ? { ...user, id: String(user.id) } : null}
            />
          </div>
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
      </div>
    );
  };

  const renderMobileMenu = () => {
    // Mobile menu is no longer needed since we removed the burger button
    // All mobile controls are now in the header itself
    return null;
  };

  // Dynamic header classes based on scroll state
  const getHeaderClasses = () => {
    const baseClasses = shouldUseScrollEffect
      ? "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out"
      : "sticky top-0 z-50 transition-all duration-500 ease-out";

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
