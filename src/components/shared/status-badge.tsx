import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusColorMap: Record<string, string> = {
  // Green - success states
  success: 'bg-green-100 text-green-800 hover:bg-green-100',
  active: 'bg-green-100 text-green-800 hover:bg-green-100',
  paid: 'bg-green-100 text-green-800 hover:bg-green-100',
  approved: 'bg-green-100 text-green-800 hover:bg-green-100',
  done: 'bg-green-100 text-green-800 hover:bg-green-100',
  signed: 'bg-green-100 text-green-800 hover:bg-green-100',
  final: 'bg-green-100 text-green-800 hover:bg-green-100',

  // Yellow/Amber - warning states
  warning: 'bg-amber-100 text-amber-800 hover:bg-amber-100',
  pending: 'bg-amber-100 text-amber-800 hover:bg-amber-100',
  review: 'bg-amber-100 text-amber-800 hover:bg-amber-100',
  in_progress: 'bg-amber-100 text-amber-800 hover:bg-amber-100',
  sent: 'bg-amber-100 text-amber-800 hover:bg-amber-100',
  viewed: 'bg-amber-100 text-amber-800 hover:bg-amber-100',

  // Red - danger/error states
  danger: 'bg-red-100 text-red-800 hover:bg-red-100',
  overdue: 'bg-red-100 text-red-800 hover:bg-red-100',
  cancelled: 'bg-red-100 text-red-800 hover:bg-red-100',
  expired: 'bg-red-100 text-red-800 hover:bg-red-100',
  urgent: 'bg-red-100 text-red-800 hover:bg-red-100',
  revision_requested: 'bg-red-100 text-red-800 hover:bg-red-100',

  // Gray - neutral states
  neutral: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
  draft: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
  inactive: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
  lead: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
  archived: 'bg-gray-100 text-gray-800 hover:bg-gray-100',

  // Blue - info states
  info: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  briefing: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  pre_production: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  filming: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  editing: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  todo: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, '_');
  const colorClass = statusColorMap[normalizedStatus] || statusColorMap.neutral;

  // Format display text: convert underscores to spaces and capitalize
  const displayText = status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <Badge className={cn(colorClass, 'font-medium', className)} variant="secondary">
      {displayText}
    </Badge>
  );
}
