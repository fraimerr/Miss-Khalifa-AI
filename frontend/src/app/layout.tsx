import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import Logo from "../../public/miss_khalifa_ai.png";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Miss Khalifa AI",
	description: "Breaking Barriers, Building Confidence",
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
