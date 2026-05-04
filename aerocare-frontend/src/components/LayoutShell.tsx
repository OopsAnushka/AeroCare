'use client';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SOSButton from '@/components/SOSButton';
import InstallPrompt from '@/components/InstallPrompt';
import GlobalAlertListener from '@/components/GlobalAlertListener';

/**
 * LayoutShell — client component that reads the current pathname and
 * conditionally renders the public nav/SOS chrome.  Hospital dashboard
 * routes get a clean, chrome-free full-screen layout.
 */
export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHospitalDashboard = pathname?.startsWith('/hospital/dashboard');

  if (isHospitalDashboard) {
    // Hospital dashboard owns its entire viewport — no navbar, no SOS button
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow flex flex-col relative pt-[60px] md:pt-[68px]">
        {children}
      </main>
      <SOSButton />
      <InstallPrompt />
      <GlobalAlertListener />
    </>
  );
}
