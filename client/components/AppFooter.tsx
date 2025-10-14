import React from "react";
import { Button } from "@/components/ui/button";
import { Ticket, Heart, Music, Trophy, Camera } from "lucide-react";
import { useTranslation } from "react-i18next";

export interface AppFooterProps {
  variant?: "default" | "minimal";
}

export const AppFooter: React.FC<AppFooterProps> = ({
  variant = "default",
}) => {
  const { t } = useTranslation();

  if (variant === "minimal") {
    return (
      <footer className="bg-slate-900 text-white py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Ticket className="w-4 h-4 text-white" />
            </div>
            <h4 className="text-lg font-bold">Intelivoucher</h4>
          </div>
          <p className="text-slate-400 text-sm">
            &copy; 2024 Intelivoucher. All rights reserved.
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-slate-900 text-white py-16 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Ticket className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-2xl font-bold">Intelivoucher</h4>
            </div>
            <p className="text-slate-400 mb-6">
              The ultimate event ticketing platform for concerts, sports, and
              cultural experiences.
            </p>
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white"
                aria-label="Follow us"
              >
                <Heart className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white"
                aria-label="Music events"
              >
                <Music className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white"
                aria-label="Sports events"
              >
                <Trophy className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white"
                aria-label="Photo gallery"
              >
                <Camera className="w-5 h-5" />
              </Button>
            </div>
          </div>
          <div>
            <h5 className="text-lg font-semibold mb-4">{t("footer.events")}</h5>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer.concerts")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer.sports")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer.theater")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer.festivals")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer.comedy")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer.family")}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="text-lg font-semibold mb-4">
              {t("footer.support")}
            </h5>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer.helpCenter")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer.contactUs")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer.refundPolicy")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer.safety")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer.accessibility")}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="text-lg font-semibold mb-4">
              {t("footer.company")}
            </h5>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer.about")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer.careers")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer.press")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer.privacy")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer.terms")}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
          <p>{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
