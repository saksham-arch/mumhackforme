import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface ChatBubbleProps {
  type: 'income' | 'expense' | 'advice' | 'voice' | 'sms' | 'risk';
  content: string;
  amount?: number;
  timestamp: string;
  category?: string;
}

export default function ChatBubble({
  type,
  content,
  amount,
  timestamp,
  category,
}: ChatBubbleProps) {
  const isIncome = type === 'income';
  const isExpense = type === 'expense';
  const isAdvice = type === 'advice';
  const isRisk = type === 'risk';

  return (
    <div
      className={cn(
        'flex gap-3 mb-4',
        (isIncome || isExpense) && 'flex-row',
        (isAdvice || isRisk) && 'flex-row-reverse'
      )}
    >
      <div
        className={cn(
          'max-w-[70%] rounded-lg p-4 space-y-1',
          isIncome && 'bg-accent border border-border',
          isExpense && 'bg-muted border border-border',
          isAdvice && 'bg-secondary border border-border',
          isRisk && 'bg-destructive/10 border border-destructive/20'
        )}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {type}
          </span>
          {category && (
            <span className="text-xs text-muted-foreground">• {category}</span>
          )}
        </div>

        <p className="text-sm">{content}</p>

        {amount !== undefined && (
          <p
            className={cn(
              'text-lg font-semibold',
              isIncome && 'text-foreground',
              isExpense && 'text-foreground'
            )}
          >
            {isIncome ? '+' : '-'}${Math.abs(amount).toFixed(2)}
          </p>
        )}

        <p className="text-xs text-muted-foreground">
          {format(new Date(timestamp), 'MMM d, h:mm a')}
        </p>
      </div>
    </div>
  );
}
