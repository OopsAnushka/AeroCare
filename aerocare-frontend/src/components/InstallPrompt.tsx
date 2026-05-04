'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, ArrowDown, X, Smartphone, Share } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already installed
    const standalone = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    // Check if iOS
    const ua = navigator.userAgent;
    const ios = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(ios);

    // Check if user previously dismissed
    const prevDismissed = sessionStorage.getItem('pwa-install-dismissed');
    if (prevDismissed) setDismissed(true);

    // Listen for browser install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (!prevDismissed) setShowBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // Show iOS banner after a delay if not installed
    if (ios && !standalone && !prevDismissed) {
      const timer = setTimeout(() => setShowBanner(true), 3000);
      return () => { clearTimeout(timer); window.removeEventListener('beforeinstallprompt', handler); };
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  const handleDismiss = () => {
    setShowBanner(false);
    setDismissed(true);
    sessionStorage.setItem('pwa-install-dismissed', '1');
  };

  // Don't render if already installed or dismissed
  if (isStandalone || dismissed || !showBanner) return null;

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 24, stiffness: 260 }}
          className="fixed bottom-20 left-3 right-3 sm:left-auto sm:right-4 sm:bottom-4 sm:w-[380px] z-[800] bg-white rounded-2xl shadow-[0_12px_48px_-8px_rgba(0,0,0,0.2)] border border-gray-100 overflow-hidden"
        >
          {/* Top bar accent */}
          <div className="h-1 bg-gradient-to-r from-red-500 via-orange-400 to-red-500" />

          <div className="p-4 sm:p-5">
            {/* Header */}
            <div className="flex items-start gap-3 mb-3">
              <div className="w-11 h-11 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl flex items-center justify-center font-black text-lg shadow-md shrink-0">
                A
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-extrabold text-[15px] leading-tight">Install AeroCare</h3>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  Add to your home screen for instant access
                </p>
              </div>
              <button
                onClick={handleDismiss}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors shrink-0 -mt-0.5"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Benefits */}
            <div className="flex gap-2 mb-4">
              {[
                { icon: '⚡', text: 'Instant launch' },
                { icon: '📴', text: 'Works offline' },
                { icon: '🔔', text: 'Alert ready' },
              ].map((b) => (
                <div key={b.text} className="flex-1 bg-gray-50 rounded-xl py-2 px-2.5 text-center border border-gray-100">
                  <span className="text-base block mb-0.5">{b.icon}</span>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{b.text}</span>
                </div>
              ))}
            </div>

            {/* iOS instructions */}
            {isIOS ? (
              <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <Share className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-bold text-gray-700">How to install on iOS:</span>
                </div>
                <ol className="text-xs text-gray-500 font-medium space-y-1 pl-1">
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-gray-200 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                    Tap the <Share className="w-3.5 h-3.5 text-blue-500 inline mx-0.5" /> Share button in Safari
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-gray-200 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                    Scroll down and tap &quot;Add to Home Screen&quot;
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-gray-200 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                    Tap &quot;Add&quot; to confirm
                  </li>
                </ol>
              </div>
            ) : (
              /* Chrome / Edge / Android install button */
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleInstall}
                  className="flex-1 bg-black text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:bg-gray-900 transition-colors"
                >
                  <Monitor className="w-4 h-4" />
                  <ArrowDown className="w-3.5 h-3.5 -ml-1.5" />
                  Install App
                </motion.button>
                <button
                  onClick={handleDismiss}
                  className="px-4 py-3 rounded-xl font-bold text-sm text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Not now
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
