import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextUIProvider } from "@nextui-org/react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html className='h-full' lang="en">
			<body className={`${inter.className} min-h-full`}>
				<main className="mx-auto max-w-[1440px] pt-[20px] pb-[50px] min-h-full">
					<NextUIProvider>{children}</NextUIProvider>
				</main>
			</body>
		</html>
	);
}
