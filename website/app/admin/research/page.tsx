import type { Metadata } from 'next';
import Dashboard from './Dashboard';

export const metadata: Metadata = {
  title: 'Research dashboard',
  // Don't index this page.
  robots: { index: false, follow: false },
};

export default function AdminResearchPage() {
  return <Dashboard />;
}
