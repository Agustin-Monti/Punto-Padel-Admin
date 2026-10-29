// app/api/eliminar-producto/route.ts
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { productoId } = await request.json();

    if (!productoId) {
      return NextResponse.json(
        { error: 'ID del producto requerido' },
        { status: 400 }
      );
    }

    console.log(`🔄 Iniciando eliminación del producto: ${productoId}`);

    // 1. Obtener el producto para tener información de sus imágenes
    const { data: producto, error: fetchError } = await supabase
      .from('productos')
      .select('imagen, grupo_variantes')
      .eq('id', productoId)
      .single();

    if (fetchError || !producto) {
      console.error('❌ Producto no encontrado:', fetchError);
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    // 2. Eliminar imágenes de la galería (carpeta galerias/[productoId])
    console.log('🗑️ Eliminando imágenes de galería...');
    
    // Primero obtenemos las imágenes de la galería
    const { data: galeriaImagenes, error: galeriaError } = await supabase
      .from('galeria_productos')
      .select('imagen_galeria')
      .eq('producto_id', productoId);

    if (galeriaError) {
      console.error('❌ Error al obtener imágenes de galería:', galeriaError);
    } else if (galeriaImagenes && galeriaImagenes.length > 0) {
      // Extraer nombres de archivo de las URLs para eliminarlos del storage
      const archivosAEliminar = galeriaImagenes.map(img => {
        const url = img.imagen_galeria;
        if (url.includes('/storage/v1/object/public/productos/')) {
          // Extraer la ruta después de 'productos/'
          const partes = url.split('productos/');
          if (partes.length > 1) {
            return partes[1];
          }
        }
        return null;
      }).filter(Boolean);

      console.log('📁 Archivos de galería a eliminar:', archivosAEliminar);

      // Eliminar del storage si hay archivos
      if (archivosAEliminar.length > 0) {
        const { error: deleteStorageError } = await supabase.storage
          .from('productos')
          .remove(archivosAEliminar as string[]);

        if (deleteStorageError) {
          console.warn('⚠️ Advertencia al eliminar imágenes del storage:', deleteStorageError.message);
        } else {
          console.log(`✅ ${archivosAEliminar.length} imágenes eliminadas del storage`);
        }
      }

      // Eliminar la carpeta completa de galería (opcional, pero limpio)
      try {
        const { data: folderList } = await supabase.storage
          .from('productos')
          .list(`galerias/${productoId}`);

        if (folderList && folderList.length > 0) {
          // Si quieres eliminar toda la carpeta
          const filesInFolder = folderList.map(file => `galerias/${productoId}/${file.name}`);
          await supabase.storage
            .from('productos')
            .remove(filesInFolder);
        }
      } catch (folderError) {
        console.warn('⚠️ No se pudo limpiar la carpeta de galería:', folderError);
      }
    }

    // 3. Eliminar registros de la tabla galeria_productos
    console.log('🗑️ Eliminando registros de galeria_productos...');
    const { error: deleteGaleriaError } = await supabase
      .from('galeria_productos')
      .delete()
      .eq('producto_id', productoId);

    if (deleteGaleriaError) {
      console.error('❌ Error al eliminar registros de galería:', deleteGaleriaError);
    } else {
      console.log('✅ Registros de galería eliminados de la BD');
    }

    // 4. Eliminar imagen principal del producto
    console.log('🗑️ Verificando imagen principal...');
    if (producto.imagen && producto.imagen.includes('/storage/v1/object/public/productos/')) {
      try {
        const urlParts = producto.imagen.split('productos/');
        if (urlParts.length > 1) {
          const filePath = urlParts[1];
          console.log('📁 Imagen principal a eliminar:', filePath);
          
          const { error: deleteMainImageError } = await supabase.storage
            .from('productos')
            .remove([filePath]);

          if (deleteMainImageError) {
            console.warn('⚠️ No se pudo eliminar la imagen principal:', deleteMainImageError.message);
          } else {
            console.log('✅ Imagen principal eliminada del storage');
          }
        }
      } catch (imageError) {
        console.warn('⚠️ Error al procesar imagen principal:', imageError);
      }
    }

    // 5. Verificar si hay variantes del mismo producto (mismo grupo_variantes)
    if (producto.grupo_variantes) {
      console.log('🔍 Verificando variantes del producto...');
      const { data: variantes, error: variantesError } = await supabase
        .from('productos')
        .select('id, nombre')
        .eq('grupo_variantes', producto.grupo_variantes);

      if (!variantesError && variantes) {
        const otrasVariantes = variantes.filter(v => v.id !== productoId);
        if (otrasVariantes.length === 0) {
          console.log('ℹ️ Este era el último producto del grupo de variantes');
        } else {
          console.log(`ℹ️ Quedan ${otrasVariantes.length} variantes del mismo grupo`);
        }
      }
    }

    // 6. Finalmente, eliminar el producto de la tabla productos
    console.log('🗑️ Eliminando producto de la tabla principal...');
    const { error: deleteProductError } = await supabase
      .from('productos')
      .delete()
      .eq('id', productoId);

    if (deleteProductError) {
      console.error('❌ Error al eliminar producto:', deleteProductError);
      return NextResponse.json(
        { error: 'Error al eliminar el producto de la base de datos', details: deleteProductError.message },
        { status: 500 }
      );
    }

    console.log(`✅ Producto ${productoId} eliminado exitosamente`);
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Producto eliminado correctamente',
        productoId: productoId
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('❌ Error en API eliminar-producto:', error);
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}