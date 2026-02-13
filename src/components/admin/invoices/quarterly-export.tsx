'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { FileDown } from 'lucide-react';

interface QuarterlyExportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuarterlyExport({ open, onOpenChange }: QuarterlyExportProps) {
  const [quarter, setQuarter] = React.useState<string>('Q1');
  const [year, setYear] = React.useState<string>(new Date().getFullYear().toString());

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const handleExport = () => {
    toast.info('Quarterly export coming soon', {
      description: `Export for ${quarter} ${year} will be available soon`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Quarterly Export</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="quarter">Quarter</Label>
            <Select value={quarter} onValueChange={setQuarter}>
              <SelectTrigger id="quarter">
                <SelectValue placeholder="Select quarter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Q1">Q1 (Jan - Mar)</SelectItem>
                <SelectItem value="Q2">Q2 (Apr - Jun)</SelectItem>
                <SelectItem value="Q3">Q3 (Jul - Sep)</SelectItem>
                <SelectItem value="Q4">Q4 (Oct - Dec)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger id="year">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport}>
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
