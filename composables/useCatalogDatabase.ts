import { actualizarStockProducto, defaultProductos, eliminarProducto, guardarProducto, productosCatalogo } from '~/data/productos'

export const useCatalogDatabase = () => {
  const supabase = useSupabase()

  const cargarProductos = async () => {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .order('id', { ascending: true })

    if (error) {
      console.warn('No se pudo cargar Supabase:', error.message)
      productosCatalogo.value = structuredClone(defaultProductos)
      return false
    }

    if (Array.isArray(data) && data.length > 0) {
      productosCatalogo.value = data.map((item) => ({
        id: Number(item.id),
        nombre: item.nombre,
        descripcion: item.descripcion || '',
        precio: Number(item.precio || 0),
        imagen_url: item.imagen_url || '/logo-empresa.jpeg',
        categoria: ['Belleza', 'Novedades'].includes(item.categoria) ? item.categoria : 'Belleza',
        stock: Math.max(0, Number(item.stock || 0)),
        created_at: item.created_at || new Date().toISOString(),
      }))
      return true
    }

    productosCatalogo.value = structuredClone(defaultProductos)
    return false
  }

  const guardarEnSupabase = async (producto) => {
    const payload = {
      id: Number(producto.id),
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      precio: Number(producto.precio || 0),
      imagen_url: producto.imagen_url || '/logo-empresa.jpeg',
      categoria: ['Belleza', 'Novedades'].includes(producto.categoria) ? producto.categoria : 'Belleza',
      stock: Math.max(0, Number(producto.stock || 0)),
    }

    const { error } = await supabase
      .from('productos')
      .upsert(payload, { onConflict: 'id' })

    if (error) {
      alert(`No se pudo guardar en Supabase: ${error.message}`)
      return false
    }

    guardarProducto(producto)
    return true
  }

  const eliminarDeSupabase = async (id) => {
    const { error } = await supabase
      .from('productos')
      .delete()
      .eq('id', Number(id))

    if (error) {
      alert(`No se pudo eliminar en Supabase: ${error.message}`)
      return false
    }

    eliminarProducto(id)
    return true
  }

  const actualizarStockEnSupabase = async (id, cantidadVendida) => {
    const item = productosCatalogo.value.find((producto) => Number(producto.id) === Number(id))
    if (!item) return false

    const nuevoStock = Math.max(0, Number(item.stock || 0) - Number(cantidadVendida || 0))
    const { error } = await supabase
      .from('productos')
      .update({ stock: nuevoStock })
      .eq('id', Number(id))

    if (error) {
      alert(`No se pudo actualizar el stock: ${error.message}`)
      return false
    }

    actualizarStockProducto(id, cantidadVendida)
    return true
  }

  return {
    cargarProductos,
    guardarEnSupabase,
    eliminarDeSupabase,
    actualizarStockEnSupabase,
  }
}
