import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  fromYear?: number;
  toYear?: number;
};

function Calendar({ 
  className, 
  classNames, 
  showOutsideDays = true,
  fromYear = 1940,
  toYear = new Date().getFullYear(),
  ...props 
}: CalendarProps) {
  const [month, setMonth] = React.useState(props.defaultMonth || props.selected as Date || new Date());

  const years = React.useMemo(() => {
    const yearList: number[] = [];
    for (let year = toYear; year >= fromYear; year--) {
      yearList.push(year);
    }
    return yearList;
  }, [fromYear, toYear]);

  const months = React.useMemo(() => [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ], []);

  // Handle year change - use native select to prevent focus issues
  const handleYearChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    e.preventDefault();
    const year = parseInt(e.target.value);
    const newMonth = new Date(month);
    newMonth.setFullYear(year);
    setMonth(newMonth);
  }, [month]);

  // Handle month change - use native select to prevent focus issues
  const handleMonthChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    e.preventDefault();
    const monthIndex = parseInt(e.target.value);
    const newMonth = new Date(month);
    newMonth.setMonth(monthIndex);
    setMonth(newMonth);
  }, [month]);

  return (
    <DayPicker
      month={month}
      onMonthChange={setMonth}
      showOutsideDays={showOutsideDays}
      className={cn("p-3 pointer-events-auto bg-background", className)}
      classNames={{
        months: "flex flex-col space-y-4",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "hidden",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-accent"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] flex-1 text-center",
        row: "flex w-full mt-2",
        cell: cn(
          "relative h-9 w-9 flex-1 text-center text-sm p-0",
          "focus-within:relative focus-within:z-20",
          "[&:has([aria-selected])]:bg-accent",
          "[&:has([aria-selected].day-outside)]:bg-accent/50",
          "[&:has([aria-selected].day-range-end)]:rounded-r-md",
          "first:[&:has([aria-selected])]:rounded-l-md",
          "last:[&:has([aria-selected])]:rounded-r-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground"
        ),
        day_range_end: "day-range-end",
        day_selected: cn(
          "bg-primary text-primary-foreground",
          "hover:bg-primary hover:text-primary-foreground",
          "focus:bg-primary focus:text-primary-foreground"
        ),
        day_today: "bg-accent text-accent-foreground font-semibold",
        day_outside: cn(
          "day-outside text-muted-foreground opacity-50",
          "aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30"
        ),
        day_disabled: "text-muted-foreground opacity-50 cursor-not-allowed",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
        Caption: ({ displayMonth }) => {
          return (
            <div 
              className="flex items-center justify-between w-full px-1 mb-2"
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              {/* Left Nav Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const newMonth = new Date(displayMonth);
                  newMonth.setMonth(newMonth.getMonth() - 1);
                  setMonth(newMonth);
                }}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-accent"
                )}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* Month and Year dropdowns centered - using native selects for stability */}
              <div 
                className="flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
              >
                {/* Native Month Select */}
                <select
                  value={displayMonth.getMonth().toString()}
                  onChange={handleMonthChange}
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  className={cn(
                    "h-7 px-2 text-xs font-medium rounded-md border",
                    "bg-background text-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-ring",
                    "cursor-pointer appearance-none"
                  )}
                  style={{ paddingRight: '1.5rem' }}
                >
                  {months.map((monthName, index) => (
                    <option key={monthName} value={index.toString()}>
                      {monthName}
                    </option>
                  ))}
                </select>

                {/* Native Year Select */}
                <select
                  value={displayMonth.getFullYear().toString()}
                  onChange={handleYearChange}
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  className={cn(
                    "h-7 px-2 text-xs font-medium rounded-md border",
                    "bg-background text-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-ring",
                    "cursor-pointer appearance-none"
                  )}
                  style={{ paddingRight: '1.5rem' }}
                >
                  {years.map((year) => (
                    <option key={year} value={year.toString()}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Right Nav Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const newMonth = new Date(displayMonth);
                  newMonth.setMonth(newMonth.getMonth() + 1);
                  setMonth(newMonth);
                }}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-accent"
                )}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          );
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
