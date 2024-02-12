import "@/styles/globals.css";
import { Comfortaa } from "next/font/google";
import { AuthContextProvider } from "@/context/auth-context";
import NextTopLoader from "nextjs-toploader";

const comfortaa = Comfortaa({ subsets: ["latin"], preload: true, weight: ["600", "700"] });

export const metadata = {
  title: "Calendar",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0"></meta>
        <link rel="icon" type="image/x-icon" href="./favicon.ico?v=1" />
      </head>
      <body className={comfortaa.className}>
        <NextTopLoader showSpinner={false} color="var(--secondary)" />
        <AuthContextProvider>{children}</AuthContextProvider>
      </body>
    </html>
  );
}
