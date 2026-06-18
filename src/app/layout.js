import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: '--font-outfit'
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: '--font-playfair'
});

export const metadata = {
  title: "Sarang Gade | Full Stack Developer",
  description: "Portfolio of Sarang Gade",
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body className={`${outfit.variable} ${playfair.variable}`} suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: `
          if (typeof window !== 'undefined') {
            if (!window.matchMedia) {
              window.matchMedia = function() {
                return { matches: false, addListener: function() {}, removeListener: function() {}, addEventListener: function() {}, removeEventListener: function() {} };
              };
            } else {
              var originalMatchMedia = window.matchMedia;
              window.matchMedia = function(query) {
                var result = originalMatchMedia(query);
                if (!result) return { matches: false, addListener: function(){}, removeListener: function(){} };
                if (!result.addListener) {
                  result.addListener = function(cb) { result.addEventListener('change', cb); };
                  result.removeListener = function(cb) { result.removeEventListener('change', cb); };
                }
                return result;
              };
            }
          }
        `}} />
        {/* Devicon for tech logos */}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css" />
        {children}
      </body>
    </html>
  );
}