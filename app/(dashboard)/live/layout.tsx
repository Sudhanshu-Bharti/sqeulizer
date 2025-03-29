import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Database Schema Visualizer',
  description: 'Generate visual diagrams from your database schema',
};

export default function LiveLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col min-h-[calc(100vh-80px)]">
      
      {children}
    </div>
  );
} 