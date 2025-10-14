// Example: Enhanced SignInModal with LoadingMask
// This shows how you could integrate the LoadingMask into your existing SignInModal

import React from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoadingMask } from "@/components/ui/loading-mask";
import { useAppSelector } from "@/store/hooks";
import {
  selectIsCheckingEmail,
  selectIsCreatingUser,
  selectIsSendingCode,
  selectIsVerifyingCode,
} from "@/store/selectors/authSelectors";

export const EnhancedSignInModalExample: React.FC = () => {
  const { t } = useTranslation();

  // Get loading states from Redux
  const isCheckingEmail = useAppSelector(selectIsCheckingEmail);
  const isCreatingUser = useAppSelector(selectIsCreatingUser);
  const isSendingCode = useAppSelector(selectIsSendingCode);
  const isVerifyingCode = useAppSelector(selectIsVerifyingCode);

  // Determine which operation is currently running
  const getLoadingConfig = () => {
    if (isCheckingEmail) {
      return {
        variant: "spinner" as const,
        text: t("auth.checkingEmail"),
      };
    }
    if (isCreatingUser) {
      return {
        variant: "zap" as const,
        text: t("auth.creatingAccount"),
      };
    }
    if (isSendingCode) {
      return {
        variant: "compass" as const,
        text: t("auth.sendingCode"),
      };
    }
    if (isVerifyingCode) {
      return {
        variant: "rotate" as const,
        text: t("auth.verifyingCode"),
      };
    }
    return null;
  };

  const loadingConfig = getLoadingConfig();
  const isLoading = !!(
    isCheckingEmail ||
    isCreatingUser ||
    isSendingCode ||
    isVerifyingCode
  );

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("auth.signIn")}</DialogTitle>
        </DialogHeader>

        <LoadingMask
          isLoading={isLoading}
          variant={loadingConfig?.variant || "spinner"}
          size="md"
          text={loadingConfig?.text}
          overlay={85}
          blur={true}
          className="min-h-[400px]"
        >
          <div className="space-y-6 p-4">
            {/* Your existing SignInModal content here */}
            <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Sign In Form</h3>
              <p className="text-gray-600 dark:text-gray-400">
                This is where your actual sign-in form would go. The LoadingMask
                will overlay this content during async operations.
              </p>
            </div>
          </div>
        </LoadingMask>
      </DialogContent>
    </Dialog>
  );
};

/*
Usage examples for different scenarios:

1. AUTHENTICATION FLOW:
<LoadingMask
  isLoading={isAuthenticating}
  variant="compass"
  text="Authenticating..."
  overlay={90}
  blur={true}
>
  <AuthForm />
</LoadingMask>

2. DATA FETCHING:
<LoadingMask
  isLoading={isLoadingTrips}
  variant="bounce"
  text="Loading your trips..."
  overlay={70}
>
  <TripsList />
</LoadingMask>

3. CHECKOUT PROCESS:
<LoadingMask
  isLoading={isProcessingPayment}
  variant="zap"
  text="Processing payment..."
  overlay={95}
  blur={true}
>
  <CheckoutForm />
</LoadingMask>

4. FULL PAGE LOADING (App initialization):
{isInitializing && (
  <FullPageLoading
    variant="compass"
    size="lg"
    text="Initializing InteliVoucher..."
  />
)}

5. INLINE LOADING (Lists, cards):
<InlineLoading
  variant="pulse"
  size="sm"
  text="Loading..."
/>
*/
