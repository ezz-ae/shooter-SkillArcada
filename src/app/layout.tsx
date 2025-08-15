
import type { Metadata } from "next";
import "./globals.css";
import { Inter, Lilita_One } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const lilitaOne = Lilita_One({ subsets: ["latin"], weight: "400", variable: "--font-lilita" });


export const metadata: Metadata = {
  title: {
    default: 'ShooterGun | Win Amazing Products at Unbelievable Prices',
    template: '%s | ShooterGun',
  },
  description: "Welcome to ShooterGun, the premier platform for taking a chance on amazing products at unbelievable prices. Play skill-based games, win prizes, and get your shot at a killer deal.",
  keywords: ['online games', 'discount shopping', 'skill games', 'win prizes', 'e-commerce', 'deal hunting'],
  authors: [{ name: 'ShooterGun' }],
  openGraph: {
    title: 'ShooterGun',
    description: 'Your shot at unbelievable prices.',
    url: 'https://shootersgun.com', // Replace with your actual domain
    siteName: 'ShooterGun',
    images: [
      {
        url: 'https://placehold.co/1200x630.png', // Replace with a real OG image
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShooterGun - Your Shot at Unbelievable Prices',
    description: 'Play games, win prizes, and get killer deals on the hottest products.',
    // creator: '@yourtwitterhandle', // Replace with your Twitter handle
    images: ['https://placehold.co/1200x630.png'], // Replace with a real OG image
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen font-sans antialiased",
          inter.variable,
          lilitaOne.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
