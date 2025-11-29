import { Calendar, Bell } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { format, subDays } from 'date-fns';
import { useState } from 'react';

export default function TopBar() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const startDate = format(dateRange.from, 'MMM d');
  const endDate = format(dateRange.to, 'MMM d, yyyy');

  return (
    <header className="fixed top-0 left-64 right-0 h-16 border-b border-border/50 bg-gradient-background/95 backdrop-blur-md flex items-center px-6 gap-4 z-10 shadow-sm">
      <div className="flex-1" />

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative hover:bg-muted">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="gap-2 border-border/50 hover:bg-muted/80 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">
                {startDate} - {endDate}
              </span>
              <span className="text-sm font-medium sm:hidden">
                {format(dateRange.from, 'MMM d')} - {format(dateRange.to, 'MMM d')}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <div className="p-4">
              <p className="text-sm font-medium mb-3">Select date range</p>
              <CalendarComponent
                mode="single"
                selected={dateRange.to}
                onSelect={(date) =>
                  setDateRange({
                    ...dateRange,
                    to: date || new Date(),
                  })
                }
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}
