// app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "Admin | Punto Padel LF",
  description: "Panel de administración",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="text-gray-800">
        {children}
      </body>
    </html>
  );
}
