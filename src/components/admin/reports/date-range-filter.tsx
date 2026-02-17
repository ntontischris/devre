'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';

type DateRangePreset = 'this_month' | 'last_month' | 'this_quarter' | 'this_year' | 'custom';

export function DateRangeFilter() {
  const t = useTranslations('reports');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [preset, setPreset] = useState<DateRangePreset>('this_month');
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();

  const getPresetDates = (preset: DateRangePreset) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    switch (preset) {
      case 'this_month':
        return {
          from: new Date(year, month, 1),
          to: new Date(year, month + 1, 0),
        };
      case 'last_month':
        return {
          from: new Date(year, month - 1, 1),
          to: new Date(year, month, 0),
        };
      case 'this_quarter': {
        const quarter = Math.floor(month / 3);
        return {
          from: new Date(year, quarter * 3, 1),
          to: new Date(year, quarter * 3 + 3, 0),
        };
      }
      case 'this_year':
        return {
          from: new Date(year, 0, 1),
          to: new Date(year, 11, 31),
        };
      case 'custom':
        return { from: fromDate, to: toDate };
    }
  };

  const handlePresetChange = (value: DateRangePreset) => {
    setPreset(value);
    if (value !== 'custom') {
      const dates = getPresetDates(value);
      applyFilter(dates.from, dates.to);
    }
  };

  const applyFilter = (from?: Date, to?: Date) => {
    const params = new URLSearchParams(searchParams.toString());
    if (from) {
      params.set('from', format(from, 'yyyy-MM-dd'));
    } else {
      params.delete('from');
    }
    if (to) {
      params.set('to', format(to, 'yyyy-MM-dd'));
    } else {
      params.delete('to');
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <Select value={preset} onValueChange={handlePresetChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('selectPeriod')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this_month">This Month</SelectItem>
              <SelectItem value="last_month">Last Month</SelectItem>
              <SelectItem value="this_quarter">This Quarter</SelectItem>
              <SelectItem value="this_year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>

          {preset === 'custom' && (
            <>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[180px] justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fromDate ? format(fromDate, 'MMM dd, yyyy') : t('dateRange')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={fromDate}
                    onSelect={setFromDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[180px] justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {toDate ? format(toDate, 'MMM dd, yyyy') : t('dateRange')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={toDate}
                    onSelect={setToDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Button onClick={() => applyFilter(fromDate, toDate)}>Apply</Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
