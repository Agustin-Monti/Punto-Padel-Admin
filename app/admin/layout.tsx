// app/admin/layout.tsx
import './admin.css';

export const metadata = {
  title: 'Admin | Punto Padel LF',
  description: 'Panel de administración',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="admin-main-container">
      {children}
    </main>
  );
}
