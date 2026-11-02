// components/Sidebar.tsx
"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface User {
  id: string;
  superadmin: boolean;
  admin: boolean;
}

interface NavItemProps {
  href: string;
  icon: string;
  label: string;
  disabled?: boolean;
}

function NavItem({ href, icon, label, disabled = false }: NavItemProps) {
  if (disabled) {
    return (
      <li>
        <div className="flex items-center justify-between rounded p-2 text-gray-500 opacity-60 cursor-not-allowed">
          <span className="flex items-center space-x-2">
            <span>{icon}</span>
            <span>{label}</span>
          </span>
          <span className="rounded-full bg-gray-700 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
            Pronto
          </span>
        </div>
      </li>
    );
  }

  return (
    <li>
      <Link
        href={href}
        className="flex items-center space-x-2 rounded p-2 transition-colors hover:bg-gray-700"
      >
        <span>{icon}</span>
        <span>{label}</span>
      </Link>
    </li>
  );
}

export default function Sidebar() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id, superadmin, admin')
            .eq('id', authUser.id)
            .single();

          setCurrentUser(profile);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener usuario:', error);
        setLoading(false);
      }
    };

    getCurrentUser();
  }, []);

  if (loading) {
    return (
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 font-bold text-center border-b border-gray-700">
          Punto Padel LF
        </div>
        <div className="p-4 text-center">Cargando...</div>
      </aside>
    );
  }

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col">
      {/* Logo */}
      <div className="p-4 font-bold text-center border-b border-gray-700">
        Punto Padel LF
      </div>

      {/* Enlaces */}
      <nav className="flex-1 p-4">
        <ul className="space-y-4">
          <NavItem href="/admin/dashboard" icon="🏠" label="Inicio" />
          <NavItem href="/admin/dashboard/productos" icon="📦" label="Productos" />
          <NavItem href="/admin/dashboard/categorias" icon="📂" label="Categorías" />
          <NavItem href="/admin/dashboard/marcas" icon="🏷️" label="Marcas" />

          {/* Desactivados */}
          <NavItem href="/admin/dashboard/tipos" icon="💼" label="Tipos Productos" disabled />
          <NavItem href="/admin/dashboard/pedidos" icon="🛒" label="Pedidos" disabled />
          <NavItem href="/admin/dashboard/metodos" icon="📬" label="Métodos de Envíos" disabled />

          {/* Activos */}
          <NavItem href="/admin/dashboard/usuarios" icon="👥" label="Usuarios" />

          {/* Solo mostrar "Admins" a superadmins */}
          {currentUser?.superadmin && (
            <NavItem href="/admin/dashboard/admins" icon="👤" label="Admins" />
          )}
        </ul>
      </nav>

      {/* Info del usuario actual */}
      <div className="p-4 border-t border-gray-700 text-xs">
        <p>Usuario: {currentUser?.superadmin ? 'SuperAdmin' : currentUser?.admin ? 'Admin' : 'Usuario'}</p>
      </div>
    </aside>
  );
}
