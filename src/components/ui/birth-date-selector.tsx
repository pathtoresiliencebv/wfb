import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface BirthDateSelectorProps {
  value: string;
  onChange: (date: string) => void;
  error?: string;
}

const months = [
  "Januari", "Februari", "Maart", "April", "Mei", "Juni",
  "Juli", "Augustus", "September", "Oktober", "November", "December"
];

export function BirthDateSelector({ value, onChange, error }: BirthDateSelectorProps) {
  const currentYear = new Date().getFullYear();
  const minYear = 1900;
  const maxYear = currentYear - 18;

  // Parse existing value or use defaults
  const parseDate = (dateStr: string) => {
    if (!dateStr) return { day: "", month: "", year: "" };
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return { day: "", month: "", year: "" };
    return {
      day: date.getDate().toString(),
      month: (date.getMonth() + 1).toString(),
      year: date.getFullYear().toString()
    };
  };

  const { day, month, year } = parseDate(value);

  const handleChange = (field: 'day' | 'month' | 'year', newValue: string) => {
    const current = parseDate(value);
    const updated = { ...current, [field]: newValue };
    
    if (updated.day && updated.month && updated.year) {
      const date = new Date(
        parseInt(updated.year),
        parseInt(updated.month) - 1,
        parseInt(updated.day)
      );
      if (!isNaN(date.getTime())) {
        onChange(date.toISOString().split('T')[0]);
      }
    }
  };

  const getDaysInMonth = (m: string, y: string) => {
    if (!m || !y) return 31;
    return new Date(parseInt(y), parseInt(m), 0).getDate();
  };

  const daysInMonth = getDaysInMonth(month, year);

  return (
    <div className="space-y-2">
      <Label>Geboortedatum *</Label>
      <div className="grid grid-cols-3 gap-2">
        <Select value={day} onValueChange={(v) => handleChange('day', v)}>
          <SelectTrigger className="bg-background/50 border-border/50 focus:ring-2 focus:ring-primary/30 focus:border-primary">
            <SelectValue placeholder="Dag" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
              <SelectItem key={d} value={d.toString()}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={month} onValueChange={(v) => handleChange('month', v)}>
          <SelectTrigger className="bg-background/50 border-border/50 focus:ring-2 focus:ring-primary/30 focus:border-primary">
            <SelectValue placeholder="Maand" />
          </SelectTrigger>
          <SelectContent>
            {months.map((m, i) => (
              <SelectItem key={i + 1} value={(i + 1).toString()}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={year} onValueChange={(v) => handleChange('year', v)}>
          <SelectTrigger className="bg-background/50 border-border/50 focus:ring-2 focus:ring-primary/30 focus:border-primary">
            <SelectValue placeholder="Jaar" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i).map((y) => (
              <SelectItem key={y} value={y.toString()}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {error && <p className="text-sm text-destructive animate-shake">{error}</p>}
    </div>
  );
}
