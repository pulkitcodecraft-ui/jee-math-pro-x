import type { Metadata } from 'next';
import AdminDashboard from './AdminDashboard';

export const metadata: Metadata = {
  title: 'Admin — JEE Math Pro',
  description: 'Admin review dashboard for community approach submissions.',
};

export default function AdminPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Page header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-light text-xs font-medium text-accent mb-4">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Admin only
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Review <span className="gradient-text">Dashboard</span>
        </h1>
        <p className="text-text-muted mt-2 text-sm">
          Approve or reject community approach submissions before they go live.
        </p>
      </div>

      <AdminDashboard />
    </div>
  );
}
