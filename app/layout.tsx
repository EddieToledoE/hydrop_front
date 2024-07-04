import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/provider/provider";
export const metadata: Metadata = {
  title: "HydroP",
  description: "Bienvendio a HydroP",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
