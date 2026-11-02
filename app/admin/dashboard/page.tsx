// app/admin/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import GraficosProductosSection from '@/components/GraficosProductosSection';
import { getDashboardResumen } from '@/actions/dashboard-actions';
import { Package, LayoutGrid, Tags } from 'lucide-react';

export default function AdminDashboard() {
  const [resumen, setResumen] = useState({
    totalProductos: 0,
    totalCategorias: 0,
    totalTipos: 0,
  });

  useEffect(() => {
    const fetchResumen = async () => {
      const data = await getDashboardResumen();
      setResumen(data);
    };
    fetchResumen();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black sm:text-3xl">
          Bienvenido al Panel de Administración
        </h1>
        <p className="mt-1 text-gray-700">
          Usa la barra lateral para navegar entre las secciones.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Card Productos */}
        <div className="flex items-center gap-4 rounded-xl border-l-4 border-blue-500 bg-blue-100 p-4 shadow-md transition-shadow hover:shadow-lg">
          <div className="rounded-full bg-blue-500 p-2 text-white">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-blue-700">Total Productos</p>
            <h2 className="text-2xl font-bold text-blue-900">
              {resumen.totalProductos}
            </h2>
          </div>
        </div>

        {/* Card Categorías */}
        <div className="flex items-center gap-4 rounded-xl border-l-4 border-green-500 bg-green-100 p-4 shadow-md transition-shadow hover:shadow-lg">
          <div className="rounded-full bg-green-500 p-2 text-white">
            <LayoutGrid className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-green-700">Total Categorías</p>
            <h2 className="text-2xl font-bold text-green-900">
              {resumen.totalCategorias}
            </h2>
          </div>
        </div>

        {/* Card Tipos */}
        <div className="flex items-center gap-4 rounded-xl border-l-4 border-purple-500 bg-purple-100 p-4 shadow-md transition-shadow hover:shadow-lg">
          <div className="rounded-full bg-purple-500 p-2 text-white">
            <Tags className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-purple-700">Total Tipos</p>
            <h2 className="text-2xl font-bold text-purple-900">
              {resumen.totalTipos}
            </h2>
          </div>
        </div>
      </div>

      <GraficosProductosSection />
    </div>
  );
}
