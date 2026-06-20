import type { Metadata } from 'next';
import HistoryList from './HistoryList';

export const metadata: Metadata = {
  title: 'History — JEE Math Pro',
  description: 'Revisit and re-run your past AI-explained questions.',
};

export default function HistoryPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Your <span className="gradient-text">History</span>
        </h1>
        <p className="text-text-muted mt-2 text-sm max-w-2xl">
          Every question you solve with AI Explain is saved here. Click one to load it back, or
          delete the ones you no longer need.
        </p>
      </div>

      <HistoryList />
    </div>
  );
}
