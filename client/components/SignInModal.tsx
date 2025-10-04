import React from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Mail,
  User,
  Phone,
  Calendar,
  Shield,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { LoadingMask } from "@/components/ui/loading-mask";

// Redux imports
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  closeSignInModal,
  setModalStep,
  setEmail,
  setFullName,
  setPhone,
  setBirthdate,
  setVerificationCode,
  clearError,
  checkUserEmail,
  createNewUser,
  sendCode,
  verifyCode,
} from "@/store/slices/authSlice";
import {
  selectIsSignInModalOpen,
  selectModalStep,
  selectEmail,
  selectFullName,
  selectPhone,
  selectBirthdate,
  selectVerificationCode,
  selectIsCheckingEmail,
  selectIsCreatingUser,
  selectIsSendingCode,
  selectIsVerifyingCode,
  selectAuthError,
  selectCanProceedFromEmail,
  selectCanProceedFromRegistration,
  selectCanProceedFromVerification,
  selectUser,
} from "@/store/selectors/authSelectors";

export const SignInModal: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  // Selectors
  const isOpen = useAppSelector(selectIsSignInModalOpen);
  const modalStep = useAppSelector(selectModalStep);
  const email = useAppSelector(selectEmail);
  const fullName = useAppSelector(selectFullName);
  const phone = useAppSelector(selectPhone);
  const birthdate = useAppSelector(selectBirthdate);
  const verificationCode = useAppSelector(selectVerificationCode);
  const isCheckingEmail = useAppSelector(selectIsCheckingEmail);
  const isCreatingUser = useAppSelector(selectIsCreatingUser);
  const isSendingCode = useAppSelector(selectIsSendingCode);
  const isVerifyingCode = useAppSelector(selectIsVerifyingCode);
  const error = useAppSelector(selectAuthError);
  const user = useAppSelector(selectUser);
  const canProceedFromEmail = useAppSelector(selectCanProceedFromEmail);
  const canProceedFromRegistration = useAppSelector(
    selectCanProceedFromRegistration,
  );
  const canProceedFromVerification = useAppSelector(
    selectCanProceedFromVerification,
  );

  // Get current language
  const currentLanguage = useAppSelector(
    (state) => state.language.currentLanguage,
  );

  // Handle email check
  const handleEmailCheck = async () => {
    if (!canProceedFromEmail) return;

    const result = await dispatch(checkUserEmail(email));

    // If user exists and email check was successful, send verification code automatically
    if (
      checkUserEmail.fulfilled.match(result) &&
      result.payload.exists &&
      result.payload.user
    ) {
      await dispatch(sendCode({ userId: result.payload.user.id, email }));
    }
  };

  // Handle user creation
  const handleUserCreation = async () => {
    if (!canProceedFromRegistration) return;

    const result = await dispatch(
      createNewUser({
        email,
        fullName,
        phone,
        birthdate,
        currentLanguage,
      }),
    );

    // If user creation was successful, send verification code automatically
    if (createNewUser.fulfilled.match(result)) {
      await dispatch(sendCode({ userId: result.payload.id, email }));
    }
  };

  // Handle sending verification code
  const handleSendCode = async (userId: number) => {
    await dispatch(sendCode({ userId, email }));
  };

  // Handle code verification
  const handleCodeVerification = async () => {
    if (!canProceedFromVerification || !user) return;

    await dispatch(verifyCode({ userId: user.id, code: verificationCode }));
  };

  // Handle back navigation
  const handleBack = () => {
    if (modalStep === "registration" || modalStep === "verification") {
      dispatch(setModalStep("email"));
    }
  };

  // Handle close
  const handleClose = () => {
    dispatch(closeSignInModal());
  };

  // Clear error when user starts typing
  const handleInputChange = (field: string, value: string) => {
    if (error) dispatch(clearError());

    switch (field) {
      case "email":
        dispatch(setEmail(value));
        break;
      case "fullName":
        dispatch(setFullName(value));
        break;
      case "phone":
        dispatch(setPhone(value));
        break;
      case "birthdate":
        dispatch(setBirthdate(value));
        break;
      case "verificationCode":
        dispatch(setVerificationCode(value));
        break;
    }
  };

  // Get step title
  const getStepTitle = () => {
    switch (modalStep) {
      case "email":
        return t("auth.enterEmail");
      case "registration":
        return t("auth.completeProfile");
      case "verification":
        return t("auth.verifyEmail");
      default:
        return t("auth.signIn");
    }
  };

  // Get loading configuration based on current state
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
        text: t("auth.sendingVerificationCode"),
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
  const isAnyLoading =
    isCheckingEmail || isCreatingUser || isSendingCode || isVerifyingCode;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            {modalStep !== "email" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                disabled={isAnyLoading}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <DialogTitle className="flex-1">{getStepTitle()}</DialogTitle>
          </div>
        </DialogHeader>

        <LoadingMask
          isLoading={isAnyLoading}
          variant={loadingConfig?.variant || "spinner"}
          size="md"
          text={loadingConfig?.text}
          overlay={85}
          blur={true}
        >
          <div className="space-y-6">
            {/* Progress indicator */}
            <div className="flex items-center justify-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${modalStep === "email" ? "bg-brand-blue" : "bg-gray-300"}`}
              />
              <div
                className={`w-3 h-3 rounded-full ${modalStep === "registration" || modalStep === "verification" ? "bg-brand-blue" : "bg-gray-300"}`}
              />
              <div
                className={`w-3 h-3 rounded-full ${modalStep === "verification" ? "bg-brand-blue" : "bg-gray-300"}`}
              />
            </div>

            {/* Error display */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Step 1: Email Input */}
            {modalStep === "email" && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-400">
                    {t("auth.enterEmailDescription")}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("auth.emailAddress")}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("auth.placeholders.email")}
                      value={email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="pl-10"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && canProceedFromEmail) {
                          handleEmailCheck();
                        }
                      }}
                    />
                  </div>
                </div>
                <Button
                  onClick={handleEmailCheck}
                  disabled={!canProceedFromEmail || isAnyLoading}
                  className="w-full bg-gradient-to-r from-brand-blue to-brand-cyan hover:from-brand-cyan hover:to-brand-blue"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  {t("common.continue")}
                </Button>
              </div>
            )}

            {/* Step 2: Registration */}
            {modalStep === "registration" && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-400">
                    {t("auth.newUserDescription")}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">{t("auth.fullName")}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder={t("auth.placeholders.fullName")}
                        value={fullName}
                        onChange={(e) =>
                          handleInputChange("fullName", e.target.value)
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">{t("auth.phoneNumber")}</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder={t("auth.placeholders.phone")}
                        value={phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthdate">{t("auth.birthdate")}</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="birthdate"
                        type="date"
                        value={birthdate}
                        onChange={(e) =>
                          handleInputChange("birthdate", e.target.value)
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleUserCreation}
                  disabled={!canProceedFromRegistration || isAnyLoading}
                  className="w-full bg-gradient-to-r from-brand-blue to-brand-cyan hover:from-brand-cyan hover:to-brand-blue"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  {t("auth.createAccount")}
                </Button>
              </div>
            )}

            {/* Step 3: Verification */}
            {modalStep === "verification" && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-brand-blue" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t("auth.verificationDescription")} <br />
                    <span className="font-medium">{email}</span>
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="verificationCode">
                    {t("auth.verificationCode")}
                  </Label>
                  <Input
                    id="verificationCode"
                    type="text"
                    placeholder={t("auth.placeholders.verificationCode")}
                    value={verificationCode}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6);
                      handleInputChange("verificationCode", value);
                    }}
                    className="text-center text-2xl tracking-wider"
                    maxLength={6}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && canProceedFromVerification) {
                        handleCodeVerification();
                      }
                    }}
                  />
                </div>

                <Button
                  onClick={handleCodeVerification}
                  disabled={!canProceedFromVerification || isAnyLoading}
                  className="w-full bg-gradient-to-r from-brand-blue to-brand-cyan hover:from-brand-cyan hover:to-brand-blue"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  {t("auth.verifyAccount")}
                </Button>

                <div className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-brand-blue hover:text-brand-cyan"
                    onClick={() => {
                      if (user) {
                        handleSendCode(user.id);
                      }
                    }}
                    disabled={isAnyLoading || !user}
                  >
                    {t("auth.resendCode")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </LoadingMask>
      </DialogContent>
    </Dialog>
  );
};
