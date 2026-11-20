import { actualizarStockProducto, productosCatalogo } from '~/data/productos';

export type CartItem = {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen_url?: string;
};

const CART_STORAGE_KEY = 'fabellas-cart-v1';

export const useCart = () => {
  const cart = useState<CartItem[]>('fabellas-cart', () => []);

  const syncFromStorage = () => {
    if (!import.meta.client || typeof window === 'undefined') {
      return;
    }

    try {
      const saved = window.localStorage.getItem(CART_STORAGE_KEY);
      if (!saved) {
        return;
      }

      const parsed = JSON.parse(saved) as CartItem[];
      if (Array.isArray(parsed)) {
        cart.value = parsed;
      }
    } catch (error) {
      console.warn('No se pudo cargar el carrito', error);
    }
  };

  onMounted(() => {
    syncFromStorage();
  });

  watch(
    cart,
    (value) => {
      if (!import.meta.client || typeof window === 'undefined') {
        return;
      }

      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(value));
    },
    { deep: true },
  );

  const totalItems = computed(() => cart.value.reduce((sum, item) => sum + item.cantidad, 0));

  const totalPrice = computed(() =>
    cart.value.reduce((sum, item) => sum + Number(item.precio) * Number(item.cantidad), 0),
  );

  const addItem = (producto: { id: number; nombre: string; precio: number | string; imagen_url?: string; stock?: number | string }) => {
    const productoActual = (productosCatalogo.value || []).find((item) => Number(item.id) === Number(producto.id));
    const stockDisponible = Number(productoActual?.stock ?? producto.stock ?? 0);
    const cantidadActual = cart.value.find((item) => item.id === producto.id)?.cantidad ?? 0;

    if (stockDisponible <= 0) {
      alert('Este producto ya no tiene stock disponible.');
      return;
    }

    if (cantidadActual + 1 > stockDisponible) {
      alert(`Solo quedan ${stockDisponible} unidades disponibles de ${producto.nombre}.`);
      return;
    }

    const index = cart.value.findIndex((item) => item.id === producto.id);

    if (index >= 0) {
      cart.value[index].cantidad += 1;
      return;
    }

    cart.value.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: Number(producto.precio ?? 0),
      cantidad: 1,
      imagen_url: producto.imagen_url,
    });
  };

  const removeItem = (id: number) => {
    cart.value = cart.value.filter((item) => item.id !== id);
  };

  const clearCart = () => {
    cart.value = [];
  };

  const confirmarPedido = async (items = [...cart.value]) => {
    if (!items.length) {
      return [];
    }

    for (const item of items) {
      const producto = (productosCatalogo.value || []).find((productoActual) => Number(productoActual.id) === Number(item.id));
      const stockDisponible = Number(producto?.stock ?? 0);
      const cantidadSolicitada = Number(item.cantidad ?? 0);

      if (!producto) {
        alert(`El producto ${item.nombre} ya no existe en el inventario.`);
        return [];
      }

      if (cantidadSolicitada <= 0 || stockDisponible < cantidadSolicitada) {
        alert(`No hay suficiente stock de ${item.nombre}. Disponible: ${stockDisponible}.`);
        return [];
      }
    }

    const supabase = useSupabase();
    for (const item of items) {
      const productoActual = (productosCatalogo.value || []).find((producto) => Number(producto.id) === Number(item.id));
      const nuevoStock = Math.max(0, Number(productoActual?.stock ?? 0) - Number(item.cantidad));

      const { error } = await supabase
        .from('productos')
        .update({ stock: nuevoStock })
        .eq('id', Number(item.id));

      if (error) {
        alert(`No se pudo actualizar el stock en Supabase: ${error.message}`);
        return [];
      }

      actualizarStockProducto(item.id, item.cantidad);
    }

    clearCart();
    return items;
  };

  const openWhatsAppCheckout = async () => {
    if (totalItems.value === 0 || !import.meta.client || typeof window === 'undefined') {
      return;
    }

    const pedidoActual = await confirmarPedido();
    if (!pedidoActual.length) {
      return;
    }

    const runtimeConfig = useRuntimeConfig();
    const whatsappNumber = runtimeConfig.public.whatsappNumber || '59176590871';

    const message = [
      'Hola, quiero hacer mi pedido.',
      '',
      ...pedidoActual.map(
        (item) => `- ${item.nombre} x${item.cantidad} - Bs ${Number(item.precio * item.cantidad).toFixed(2)}`,
      ),
      '',
      `Total: Bs ${Number(pedidoActual.reduce((sum, item) => sum + Number(item.precio) * Number(item.cantidad), 0)).toFixed(2)}`,
      '',
      'Quiero confirmar mi compra.',
    ].join('\n');

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return {
    cart,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    clearCart,
    confirmarPedido,
    openWhatsAppCheckout,
  };
};
