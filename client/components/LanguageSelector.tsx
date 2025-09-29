import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SupportedLanguage, LanguageOption } from "@/types";
import { useLanguage } from "@/hooks/useLanguage";

const languages: LanguageOption[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇲🇽" },
];

export function LanguageSelector() {
  const { currentLanguage: currentLanguageCode, changeLanguage } =
    useLanguage();

  const handleLanguageChange = (language: SupportedLanguage) => {
    changeLanguage(language);
  };

  const currentLanguage =
    languages.find((lang) => lang.code === currentLanguageCode) || languages[0];

  return (
    <Select value={currentLanguage.code} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-32">
        <SelectValue>
          <div className="flex items-center gap-2">
            <span>{currentLanguage.flag}</span>
            <span className="hidden sm:inline">{currentLanguage.name}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {languages.map((language) => (
          <SelectItem key={language.code} value={language.code}>
            <div className="flex items-center gap-2">
              <span>{language.flag}</span>
              <span>{language.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
