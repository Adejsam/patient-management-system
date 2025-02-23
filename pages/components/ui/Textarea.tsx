import React from 'react';
import { useTheme } from 'next-themes';
import { cn } from '../../../lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => {
  const { theme } = useTheme();

  return (
    <textarea
      ref={ref}
      className={cn(
        "flex h-32 w-full rounded-md border text-sm border-input px-3 py-2 text-black shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black",
        className
      )}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;