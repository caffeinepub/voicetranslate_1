import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { LANGUAGES } from "../services/translationService";

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  id: string;
}

export function LanguageSelector({ value, onChange, label, id }: LanguageSelectorProps) {
  return (
    <div className="flex flex-col gap-1.5 flex-1">
      <Label htmlFor={id} className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          id={id}
          className="bg-secondary/60 border-border text-foreground h-11"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border">
          {LANGUAGES.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <span className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
