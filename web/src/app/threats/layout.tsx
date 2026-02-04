import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Threat Database | HiveFence',
  description: 'Comprehensive reference of prompt injection attack types. 8 categories, 349+ patterns. Role override, jailbreaks, data exfiltration, and more.',
};

export default function ThreatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
