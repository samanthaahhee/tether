import type { Metadata } from 'next';
import DashboardV2 from './DashboardV2';

export const metadata: Metadata = {
  title: 'Research v2 dashboard',
  robots: { index: false, follow: false },
};

export default function AdminResearchV2Page() {
  return <DashboardV2 />;
}
