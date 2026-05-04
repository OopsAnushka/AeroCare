import { Suspense } from 'react';
import EmergencyClient from './EmergencyClient';

export default function EmergencyPage() {
  return (
    <Suspense fallback={<div className="flex-1 w-full h-[calc(100vh-60px)] md:h-[calc(100vh-68px)] bg-gray-50 flex items-center justify-center"><div className="w-8 h-8 border-3 border-gray-200 border-t-red-500 rounded-full animate-spin" /></div>}>
      <EmergencyClient />
    </Suspense>
  );
}
