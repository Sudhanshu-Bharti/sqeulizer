import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface SyntaxTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onValueChange?: (value: string) => void;
}

// Simple SQL syntax highlighting
const highlightSQL = (code: string) => {
  const keywords = [
    'CREATE', 'TABLE', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES',
    'NOT', 'NULL', 'DEFAULT', 'UNIQUE', 'INTEGER', 'VARCHAR',
    'TEXT', 'SERIAL', 'BOOLEAN', 'TIMESTAMP', 'DECIMAL', 'INT', 
    'DOUBLE', 'FLOAT', 'DATE', 'AUTO_INCREMENT', 'ON', 'DELETE',
    'CASCADE', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET',
    'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER', 'BY', 'GROUP',
    'HAVING', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER'
  ];

  // This is a simplified approach for illustration
  // A production version would use a proper tokenizer
  let highlighted = code;
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    highlighted = highlighted.replace(regex, match => `<span class="text-primary font-semibold">${match}</span>`);
  });

  // Highlight strings
  highlighted = highlighted.replace(/('.*?'|".*?")/g, '<span class="text-green-600 dark:text-green-400">$1</span>');
  
  // Highlight numbers
  highlighted = highlighted.replace(/\b(\d+)\b/g, '<span class="text-orange-600 dark:text-orange-400">$1</span>');
  
  // Highlight parentheses
  highlighted = highlighted.replace(/(\(|\))/g, '<span class="text-purple-600 dark:text-purple-400">$1</span>');

  return highlighted;
};

export function SyntaxTextarea({
  className,
  onValueChange,
  ...props
}: SyntaxTextareaProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onValueChange?.(e.target.value);
    props.onChange?.(e);
  };

  return (
    <Textarea
      {...props}
      onChange={handleChange}
      className={cn(
        "min-h-[350px] font-mono resize-none schema-input rounded-xl",
        className
      )}
    />
  );
} 