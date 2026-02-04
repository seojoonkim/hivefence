import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community Governance | HiveFence',
  description: 'Vote on attack patterns. Shape collective immunity. Democratic validation for AI agent security.',
};

export default function ValidationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
