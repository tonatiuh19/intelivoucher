import React from "react";
import { createPortal } from "react-dom";
import { Loader2, Compass, RefreshCcw, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export type LoadingVariant =
  | "spinner"
  | "pulse"
  | "bounce"
  | "rotate"
  | "compass"
  | "zap";
export type LoadingSize = "sm" | "md" | "lg" | "xl";

interface LoadingMaskProps {
  /**
   * Whether the loading mask is visible
   */
  isLoading: boolean;
  /**
   * Loading animation variant
   */
  variant?: LoadingVariant;
  /**
   * Size of the loading icon
   */
  size?: LoadingSize;
  /**
   * Loading text to display
   */
  text?: string;
  /**
   * Background overlay opacity (0-100)
   */
  overlay?: number;
  /**
   * Custom className for the container
   */
  className?: string;
  /**
   * Custom className for the content area
   */
  contentClassName?: string;
  /**
   * Whether to blur the background
   */
  blur?: boolean;
  /**
   * Children to render behind the loading mask
   */
  children?: React.ReactNode;
}

const sizeClasses = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-12 h-12",
  xl: "w-16 h-16",
};

const textSizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
};

const LoadingIcon: React.FC<{
  variant: LoadingVariant;
  size: LoadingSize;
  className?: string;
}> = ({ variant, size, className }) => {
  const iconSize = sizeClasses[size];
  const baseClasses = cn(iconSize, className);

  switch (variant) {
    case "spinner":
      return (
        <Loader2 className={cn(baseClasses, "animate-spin text-primary")} />
      );

    case "pulse":
      return (
        <div className={cn(baseClasses, "relative")}>
          <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-75" />
          <div className="relative bg-primary rounded-full w-full h-full animate-pulse" />
        </div>
      );

    case "bounce":
      return (
        <div
          className={cn(
            "flex space-x-1",
            size === "sm" ? "space-x-0.5" : "space-x-1",
          )}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "bg-primary rounded-full animate-bounce",
                size === "sm"
                  ? "w-1.5 h-1.5"
                  : size === "md"
                    ? "w-2 h-2"
                    : size === "lg"
                      ? "w-3 h-3"
                      : "w-4 h-4",
              )}
              style={{
                animationDelay: `${i * 0.1}s`,
                animationDuration: "0.6s",
              }}
            />
          ))}
        </div>
      );

    case "rotate":
      return (
        <RefreshCcw
          className={cn(baseClasses, "animate-spin text-primary")}
          style={{ animationDuration: "1s" }}
        />
      );

    case "compass":
      return (
        <div className={cn(baseClasses, "relative")}>
          <Compass
            className={cn(baseClasses, "animate-spin text-primary")}
            style={{ animationDuration: "2s" }}
          />
          <div
            className="absolute inset-0 rounded-full border-2 border-accent border-t-transparent animate-spin"
            style={{ animationDuration: "1s" }}
          />
        </div>
      );

    case "zap":
      return (
        <div className={cn(baseClasses, "relative")}>
          <Zap className={cn(baseClasses, "text-primary animate-pulse")} />
          <div className="absolute -inset-2 bg-primary/20 rounded-full animate-ping" />
        </div>
      );

    default:
      return (
        <Loader2 className={cn(baseClasses, "animate-spin text-primary")} />
      );
  }
};

export const LoadingMask: React.FC<LoadingMaskProps> = ({
  isLoading,
  variant = "spinner",
  size = "md",
  text,
  overlay = 80,
  className,
  contentClassName,
  blur = false,
  children,
}) => {
  if (!isLoading && !children) return null;

  return (
    <div className={cn("relative", className)}>
      {children && (
        <div
          className={cn(
            isLoading && blur && "blur-sm transition-all duration-300",
          )}
        >
          {children}
        </div>
      )}

      {isLoading && (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            "z-[100]", // Higher than dialog z-50 but not excessive
            "backdrop-blur-sm",
          )}
          style={{
            backgroundColor: children
              ? `hsl(var(--background) / ${overlay / 100})`
              : "transparent",
          }}
        >
          <div
            className={cn(
              "flex flex-col items-center justify-center space-y-3 p-6",
              "bg-card text-card-foreground rounded-lg shadow-lg",
              "border border-border",
              "animate-in fade-in-0 zoom-in-95 duration-300",
              "backdrop-blur-md bg-card/95",
              contentClassName,
            )}
          >
            <LoadingIcon variant={variant} size={size} />

            {text && (
              <p
                className={cn(
                  "text-foreground font-medium text-center max-w-xs",
                  textSizeClasses[size],
                )}
              >
                {text}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Convenience components for specific use cases
export const FullPageLoading: React.FC<
  Omit<LoadingMaskProps, "children" | "isLoading">
> = (props) => (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm">
    <LoadingMask {...props} isLoading={true} />
  </div>
);

// Portal-based loading that renders above everything in the DOM
export const GlobalLoadingMask: React.FC<
  Omit<LoadingMaskProps, "children" | "isLoading"> & { isLoading: boolean }
> = ({ isLoading, ...props }) => {
  if (!isLoading) return null;

  const portalRoot = document.body;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-background/90 backdrop-blur-sm">
      <div
        className={cn(
          "flex flex-col items-center justify-center space-y-3 p-6",
          "bg-card/95 text-card-foreground rounded-lg shadow-xl border border-border",
          "animate-in fade-in-0 zoom-in-95 duration-300",
          "backdrop-blur-md",
          props.contentClassName,
        )}
      >
        <LoadingIcon
          variant={props.variant || "spinner"}
          size={props.size || "md"}
        />
        {props.text && (
          <p
            className={cn(
              "text-foreground font-medium text-center max-w-xs",
              textSizeClasses[props.size || "md"],
            )}
          >
            {props.text}
          </p>
        )}
      </div>
    </div>,
    portalRoot,
  );
};

export const InlineLoading: React.FC<
  Omit<LoadingMaskProps, "children" | "overlay" | "isLoading">
> = (props) => (
  <div className="flex items-center justify-center py-8">
    <LoadingMask
      {...props}
      isLoading={true}
      overlay={0}
      contentClassName="bg-transparent shadow-none border-none backdrop-blur-none"
    />
  </div>
);

// Hook for managing loading states
export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = React.useState(initialState);

  const startLoading = React.useCallback(() => setIsLoading(true), []);
  const stopLoading = React.useCallback(() => setIsLoading(false), []);
  const toggleLoading = React.useCallback(
    () => setIsLoading((prev) => !prev),
    [],
  );

  return {
    isLoading,
    startLoading,
    stopLoading,
    toggleLoading,
    setIsLoading,
  };
};
