import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import Logo from "../../public/miss_khalifa_ai.png";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Miss Khalifa AI | Breaking Barriers, Building Confidence",
  description: "Empower yourself with Miss Khalifa AI, your trusted companion for sexual health education and advice. Get accurate, judgment-free information tailored to your needs.",
  keywords: ["AI", "Sexual Health", "Education", "Confidential Advice", "STI Awareness"],
  authors: [{ name: "Pink Panthers", url: "https://misskhalifa.com#team" }],
  openGraph: {
    title: "Miss Khalifa AI | Your Sexual Health Companion",
    description: "Get confidential, accurate sexual health information and advice from Miss Khalifa AI.",
    url: "https://misskhalifa.com",
    siteName: "Miss Khalifa AI",
    images: [
      {
        url: "/public/miss_khalifa_ai.png", // Replace with your actual image URL
        width: 1200,
        height: 630,
        alt: "Miss Khalifa AI - Sexual Health Education Chatbot",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Miss Khalifa AI | Breaking Barriers in Sexual Health Education",
    description: "Empowering conversations about sexual health with AI-driven, confidential advice.",
    images: ["/miss_khalifa_ai.png"], // Replace with your actual image URL
  },
  icons: {
    icon: "/miss_khalifa_ai.png",
    apple: "/pmiss_khalifa_ai.png",
  },
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>{children}</body>
			<Toaster />
		</html>
	);
}
