import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./theme-provider";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import Footer from "./footer";
import Script from "next/script";
import { Toaster } from "@/components/ui/toaster";
export const metadata: Metadata = {
  applicationName: "Simple Text Editor",
  title: "Simple Text Editor",
  description: "Simple minimal text editor",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  manifest: "/manifest.json",
  authors: [{ name: "Gourav Ghosal", url: "https://devgg.me/" }],
  category: "Software Engineer",
  keywords: [
    "nextjs",
    "software",
    "web developer",
    "frontend developer",
    "Gourav Ghosal",
    "Gaurav Ghosal",
    "Gaurav",
    "Gourav",
  ],
  openGraph: {
    title: "Gourav Ghosal | Developer, designer, artist",
    description: "Passionate about creating amazing web experiences",
    images: [
      "https://res.cloudinary.com/djl46nj0r/image/upload/v1710252645/bBack_and_Yellow_Personal_Trainer_Linkedin_Banner_rhgakl.png",
    ],
    locale: "en_IN",
    alternateLocale: "en_US",
    authors: "https://devgg.me/",
  },
  twitter: {
    card: "summary_large_image",
    title: `Gourav Ghosal | Developer, designer, artist`,
    images: [
      "https://res.cloudinary.com/djl46nj0r/image/upload/v1710252645/bBack_and_Yellow_Personal_Trainer_Linkedin_Banner_rhgakl.png",
    ],
    description: "Passionate about creating amazing web experiences",
  },
};
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className='scroll-smooth'>
      <body className={cn(inter.className, "w-full mx-auto  ")}>
        <Script
          async
          src='https://www.googletagmanager.com/gtag/js?id=G-QD4WW87QJ1'
        />

        <Script id='google-analytics'>
          {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-QD4WW87QJ1');
          `}
        </Script>
        <ThemeProvider
          attribute='class'
          defaultTheme='dark'
          disableTransitionOnChange
        >
          <main className='flex min-h-screen flex-col relative px-2 lg:px-6'>
            <div className='px-2'>{children}</div>
            <Footer />
            <Toaster />
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
