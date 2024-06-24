import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./theme-provider";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import Footer from "./footer";
import Script from "next/script";
import { Toaster } from "@/components/ui/toaster";
import { EditorConfigProvider } from "./config-provider";
import Head from "next/head";
import { THEMES } from "@/lib/constants";

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
      <Head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin=''
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&family=Gentium+Plus:ital,wght@0,400;0,700;1,400;1,700&family=Inter:wght@100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&family=Pacifico&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Playwrite+AU+NSW:wght@100..400&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap'
          rel='stylesheet'
        ></link>
      </Head>
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
        <EditorConfigProvider>
          <ThemeProvider
            attribute='class'
            defaultTheme='dark'
            disableTransitionOnChange
            themes={THEMES}
          >
            <main className='flex min-h-screen flex-col relative '>
              <div>{children}</div>
              <Footer />
              <Toaster />
            </main>
          </ThemeProvider>
        </EditorConfigProvider>
      </body>
    </html>
  );
}
