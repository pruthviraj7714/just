import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "./_components/Footer";
import Appbar from "./_components/Appbar";
import Providers from "./_components/Providers";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CourseForge - Empower Your Learning Journey",
  description: " Start your learning journey today with CourseForge and unlock the potential of knowledge at your fingertips.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <body className={inter.className}>
            <Appbar />
            {children}
            <Toaster />
          </body>
          <Footer />
        </ThemeProvider>
      </Providers>
    </html>
  );
}
