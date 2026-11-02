// components/GraficosProductosSection.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

export default function GraficosProductosSection() {
  const [datos, setDatos] = useState<any>(null);

  useEffect(() => {
    fetch('/api/graficos-productos')
      .then((res) => res.json())
      .then(setDatos)
      .catch(console.error);
  }, []);

  if (!datos) return <p className="text-gray-500">Cargando gráficos...</p>;

  const datosPorCategoria = Object.entries(datos?.productosPorCategoria || {}).map(
    ([nombre, cantidad]) => ({
      nombre,
      cantidad,
    })
  );

  return (
    <div className="mx-auto max-w-7xl px-4">
      <h2 className="mb-8 text-center text-2xl font-bold text-gray-800 sm:text-3xl">
        📊 Estadísticas de Productos
      </h2>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
        <p className="mb-4 text-lg font-semibold text-gray-700">
          Productos por categoría
        </p>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={datosPorCategoria}
            margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="nombre"
              tick={{ fontSize: 12 }}
              angle={-20}
              textAnchor="end"
            />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
              }}
            />
            <Bar dataKey="cantidad" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
