import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Countries from "world-countries";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "libphonenumber-js";
import ReactCountryFlag from "react-country-flag";
import "react-phone-number-input/style.css";
import "./phone-input.css";

// Custom Flag Component for phone input
const CustomFlag = ({
  country,
  countryName,
}: {
  country: string;
  countryName?: string;
}) => {
  return (
    <ReactCountryFlag
      countryCode={country}
      svg
      style={{
        width: "1.2em",
        height: "1.2em",
      }}
      title={countryName || country}
    />
  );
};

// Try to import flags, fallback to ReactCountryFlag
let flags: any;
try {
  flags = require("react-phone-number-input/flags");
} catch {
  // Fallback to custom flags
  flags = {};
}

import { AppHeader } from "@/components/AppHeader";
import { AppFooter } from "@/components/AppFooter";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectProfile,
  selectIsLoadingProfile,
  selectIsUpdatingProfile,
  selectProfileError,
  selectUpdateProfileError,
  selectUpdateProfileSuccess,
} from "@/store/selectors/profileSelectors";
import { selectUser } from "@/store/selectors/authSelectors";
import {
  fetchUserProfile,
  updateUserProfile,
  clearProfileError,
  clearUpdateSuccess,
  clearProfile,
} from "@/store/slices/profileSlice";
import { SupportedLanguage } from "@/types";
import { cn } from "@/lib/utils";

// Custom PhoneInput wrapper for better styling with flags
const CustomPhoneInput = React.forwardRef<
  any,
  {
    value?: string;
    onChange?: (value: string | undefined) => void;
    placeholder?: string;
    className?: string;
    error?: boolean;
  }
>(({ value, onChange, placeholder, className, error, ...props }, ref) => {
  return (
    <PhoneInput
      ref={ref}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      international
      countryCallingCodeEditable={false}
      defaultCountry="MX" // Default to Mexico
      className={cn("phone-input", error && "phone-input-error", className)}
      {...props}
    />
  );
});

CustomPhoneInput.displayName = "CustomPhoneInput";

// Country list with names and codes
const countryOptions = Countries.map((country) => ({
  code: country.cca2,
  name: country.name.common,
  flag: country.flag,
})).sort((a, b) => a.name.localeCompare(b.name));

// Language options
const languageOptions = [
  { code: "en" as SupportedLanguage, name: "English" },
  { code: "es" as SupportedLanguage, name: "Español" },
];

// Country display component
const CountryOption: React.FC<{
  country: { code: string; name: string; flag: string };
}> = ({ country }) => (
  <div className="flex items-center gap-2">
    <ReactCountryFlag
      countryCode={country.code}
      svg
      style={{
        width: "1.2em",
        height: "1.2em",
      }}
      title={country.name}
    />
    <span>{country.name}</span>
  </div>
);

// Selected country display component
const SelectedCountry: React.FC<{ countryCode: string }> = ({
  countryCode,
}) => {
  const country = countryOptions.find((c) => c.code === countryCode);
  if (!country) return <span>Select country</span>;

  return (
    <div className="flex items-center gap-2">
      <ReactCountryFlag
        countryCode={country.code}
        svg
        style={{
          width: "1.2em",
          height: "1.2em",
        }}
        title={country.name}
      />
      <span>{country.name}</span>
    </div>
  );
};

export const MyProfile: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const profile = useAppSelector(selectProfile);
  const currentUser = useAppSelector(selectUser);
  const isLoadingProfile = useAppSelector(selectIsLoadingProfile);
  const isUpdatingProfile = useAppSelector(selectIsUpdatingProfile);
  const profileError = useAppSelector(selectProfileError);
  const updateError = useAppSelector(selectUpdateProfileError);
  const updateSuccess = useAppSelector(selectUpdateProfileSuccess);

  // Validation schema
  const validationSchema = Yup.object({
    fullName: Yup.string()
      .min(2, t("profile.validation.fullName.minLength"))
      .max(100, t("profile.validation.fullName.maxLength"))
      .required(t("profile.validation.fullName.required")),
    email: Yup.string()
      .email(t("profile.validation.email.invalid"))
      .required(t("profile.validation.email.required")),
    phone: Yup.string()
      .test("phone", t("profile.validation.phone.invalid"), (value) => {
        if (!value) return false;
        try {
          return isValidPhoneNumber(value);
        } catch {
          return false;
        }
      })
      .required(t("profile.validation.phone.required")),
    birthdate: Yup.date()
      .max(new Date(), t("profile.validation.dateOfBirth.invalid"))
      .required(t("profile.validation.dateOfBirth.required")),
    country: Yup.string().required(t("profile.validation.country.required")),
    languagePreference: Yup.string().oneOf(["en", "es"]),
  });

  // Initial values to detect changes
  const initialValues = {
    fullName: profile?.fullName || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    birthdate: profile?.birthdate ? profile.birthdate.split("T")[0] : "",
    country: profile?.country || "",
    languagePreference: profile?.languagePreference || "en",
  };

  // Formik setup
  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (!profile?.id) return;

      try {
        await dispatch(
          updateUserProfile({
            id: profile.id,
            email: values.email,
            fullName: values.fullName,
            phone: values.phone,
            birthdate: values.birthdate,
            country: values.country,
            languagePreference: values.languagePreference as SupportedLanguage,
          }),
        ).unwrap();
      } catch (error) {
        // Error handled by Redux
      }
    },
  });

  // Check if form has changes
  const hasChanges = React.useMemo(() => {
    return Object.keys(initialValues).some(
      (key) =>
        formik.values[key as keyof typeof initialValues] !==
        initialValues[key as keyof typeof initialValues],
    );
  }, [formik.values, initialValues]);

  // Check authentication and redirect if not authenticated
  useEffect(() => {
    if (!currentUser || !currentUser.isAuthenticated) {
      navigate("/");
      return;
    }
  }, [currentUser, navigate]);

  // Load profile data on mount and sync with auth user
  useEffect(() => {
    if (currentUser?.id) {
      // If we don't have profile data, fetch it
      if (!profile) {
        dispatch(fetchUserProfile(currentUser.id));
      } else {
        // If we have profile data but user IDs don't match, refetch
        if (profile.id !== currentUser.id) {
          dispatch(fetchUserProfile(currentUser.id));
        }
      }
    }
  }, [dispatch, currentUser?.id, profile]);

  // Sync profile with auth user when user data changes
  useEffect(() => {
    if (currentUser && profile && currentUser.id !== profile.id) {
      // Clear current profile and fetch new one for the correct user
      dispatch(clearProfile());
      dispatch(fetchUserProfile(currentUser.id));
    }
  }, [dispatch, currentUser, profile]);

  // Clear success message after 5 seconds
  useEffect(() => {
    if (updateSuccess) {
      const timeout = setTimeout(() => {
        dispatch(clearUpdateSuccess());
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [updateSuccess, dispatch]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearProfileError());
    };
  }, [dispatch]);

  // Force dark mode on component mount and maintain it
  useEffect(() => {
    const ensureDarkMode = () => {
      document.documentElement.classList.add("dark");
      try {
        localStorage.setItem("theme", "dark");
      } catch (e) {
        console.warn("localStorage not available");
      }
    };

    // Set dark mode immediately
    ensureDarkMode();

    // Set up interval to periodically check and maintain dark mode
    const interval = setInterval(ensureDarkMode, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Don't render anything if user is not authenticated
  if (!currentUser || !currentUser.isAuthenticated) {
    return null;
  }

  if (isLoadingProfile) {
    return (
      <>
        <AppHeader variant="default" />
        <main className="min-h-screen bg-background pt-20 dark:bg-slate-900">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">
                  {t("common.loading")}
                </p>
              </div>
            </div>
          </div>
        </main>
        <AppFooter />
      </>
    );
  }

  if (profileError) {
    return (
      <>
        <AppHeader variant="default" />
        <main className="min-h-screen bg-background pt-20 dark:bg-slate-900">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
              <Alert variant="destructive">
                <AlertDescription>{profileError}</AlertDescription>
              </Alert>
            </div>
          </div>
        </main>
        <AppFooter />
      </>
    );
  }

  return (
    <>
      <AppHeader variant="default" />
      <main className="min-h-screen bg-background pt-20 dark:bg-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">
                {t("profile.title")}
              </h1>
              <p className="text-muted-foreground mt-2">
                {t("profile.personalInfo")}
              </p>
            </div>

            {updateSuccess && (
              <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
                <AlertDescription>{t("profile.saved")}</AlertDescription>
              </Alert>
            )}

            {updateError && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{updateError}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* Personal Information Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {t("profile.personalInfo")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName">
                      {t("profile.fields.fullName")} *
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder={t("profile.placeholders.fullName")}
                      value={formik.values.fullName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={cn(
                        formik.touched.fullName && formik.errors.fullName
                          ? "border-red-500"
                          : "",
                      )}
                    />
                    {formik.touched.fullName && formik.errors.fullName && (
                      <p className="text-sm text-red-600">
                        {formik.errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-2">
                    <Label htmlFor="birthdate">
                      {t("profile.fields.dateOfBirth")} *
                    </Label>
                    <Input
                      id="birthdate"
                      name="birthdate"
                      type="date"
                      value={formik.values.birthdate}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={cn(
                        formik.touched.birthdate && formik.errors.birthdate
                          ? "border-red-500"
                          : "",
                      )}
                    />
                    {formik.touched.birthdate && formik.errors.birthdate && (
                      <p className="text-sm text-red-600">
                        {formik.errors.birthdate}
                      </p>
                    )}
                  </div>

                  {/* Country */}
                  <div className="space-y-2">
                    <Label htmlFor="country">
                      {t("profile.fields.country")} *
                    </Label>
                    <Select
                      value={formik.values.country}
                      onValueChange={(value) =>
                        formik.setFieldValue("country", value)
                      }
                    >
                      <SelectTrigger
                        className={cn(
                          formik.touched.country && formik.errors.country
                            ? "border-red-500"
                            : "",
                        )}
                      >
                        <SelectValue
                          placeholder={t("profile.placeholders.country")}
                        >
                          {formik.values.country ? (
                            <SelectedCountry
                              countryCode={formik.values.country}
                            />
                          ) : (
                            t("profile.placeholders.country")
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {countryOptions.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            <CountryOption country={country} />
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formik.touched.country && formik.errors.country && (
                      <p className="text-sm text-red-600">
                        {formik.errors.country}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {t("profile.contactInfo")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("profile.fields.email")} *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder={t("profile.placeholders.email")}
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={cn(
                        formik.touched.email && formik.errors.email
                          ? "border-red-500"
                          : "",
                      )}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <p className="text-sm text-red-600">
                        {formik.errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t("profile.fields.phone")} *</Label>
                    <CustomPhoneInput
                      value={formik.values.phone}
                      onChange={(value) =>
                        formik.setFieldValue("phone", value || "")
                      }
                      placeholder={t("profile.placeholders.phone")}
                      error={!!(formik.touched.phone && formik.errors.phone)}
                    />
                    {formik.touched.phone && formik.errors.phone && (
                      <p className="text-sm text-red-600">
                        {formik.errors.phone}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Settings Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {t("profile.settings")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Language Preference */}
                  <div className="space-y-2">
                    <Label htmlFor="languagePreference">
                      {t("profile.fields.languagePreference")}
                    </Label>
                    <Select
                      value={formik.values.languagePreference}
                      onValueChange={(value) =>
                        formik.setFieldValue("languagePreference", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languageOptions.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Separator />

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <Button
                  type="submit"
                  disabled={isUpdatingProfile || !formik.isValid || !hasChanges}
                  className="min-w-32"
                >
                  {isUpdatingProfile ? t("profile.saving") : t("profile.save")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <AppFooter />
    </>
  );
};

export default MyProfile;
