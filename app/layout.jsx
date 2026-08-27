import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import RouteGuard from '@/components/RouteGuard';
import GlobalTaskReporter from '@/components/GlobalTaskReporter';

export const metadata = {
  title: 'ePay CRM - Enterprise Portal',
  description: 'Next.js ePay CRM Portal with Firebase & Role-Based Access Control',
  other: {
    google: 'notranslate',
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="notranslate" translate="no" suppressHydrationWarning>
      <head>
        <meta name="google" content="notranslate" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                window.addEventListener('unhandledrejection', function(event) {
                  var reason = event && event.reason;
                  if (reason && (reason.name === 'AbortError' || (reason.message && reason.message.indexOf('play()') !== -1))) {
                    event.preventDefault();
                  }
                });
                window.addEventListener('error', function(event) {
                  var filename = (event && event.filename) || '';
                  var msg = (event && event.message) || '';
                  if (filename.indexOf('content_main.js') !== -1 || msg.indexOf('isTriggerKey') !== -1 || (msg.indexOf('toLowerCase') !== -1 && filename.indexOf('content') !== -1)) {
                    event.preventDefault();
                    return true;
                  }
                });
              }
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className="bg-slate-950 text-slate-100 antialiased min-h-screen">
        <AuthProvider>
          <RouteGuard>
            {children}
          </RouteGuard>
          <GlobalTaskReporter />
        </AuthProvider>
      </body>
    </html>
  );
}
