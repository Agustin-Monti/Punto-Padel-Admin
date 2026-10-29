// app/layout.tsx
import "./globals.css";
import { Poppins, Roboto } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-poppins" });
const roboto = Roboto({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-roboto" });

export const metadata = {
  title: "Admin | Punto Padel LF",
  description: "Panel de administración",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${poppins.variable} ${roboto.variable}`}>
      <body className="font-poppins text-gray-800">
        {children}
      </body>
    </html>
  );
}