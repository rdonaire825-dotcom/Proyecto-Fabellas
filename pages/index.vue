<script setup>
import { productosCatalogo } from '~/data/productos';
import { onMounted, ref, computed } from 'vue';
import { useCart } from '~/composables/useCart';
import { useCatalogDatabase } from '~/composables/useCatalogDatabase';

const { totalItems, openWhatsAppCheckout } = useCart();

const categoriaSeleccionada = ref('Todos');
const productos = computed(() => productosCatalogo.value || []);

const categorias = ['Todos', 'Belleza', 'Novedades'];

onMounted(async () => {
  const { cargarProductos } = useCatalogDatabase();
  await cargarProductos();
});

const productosFiltrados = computed(() => {
  if (categoriaSeleccionada.value === 'Todos') {
    return productos.value;
  }

  return productos.value.filter((producto) => producto.categoria === categoriaSeleccionada.value);
});
</script>

<template>
  <div class="min-h-screen bg-[radial-gradient(circle_at_top,_#fff7fb_0%,_#fceaf3_25%,_#f9f1ec_100%)] text-[#4f2d37]">
    <header class="sticky top-0 z-20 border-b border-pink-100 bg-white/80 backdrop-blur-md">
      <div class="container-shell flex items-center justify-between py-3.5">
        <NuxtLink to="/" class="flex items-center gap-3">
          <div class="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-[#f3dfe9] bg-white p-1 shadow-md shadow-pink-100 md:h-20 md:w-20">
            <img src="/logo-empresa.jpeg" alt="Logo de FABELLAS BEAUTY BRAND" class="h-full w-full rounded-full object-cover" />
          </div>
          <div>
            <p class="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#d66e96]">Beauty Brand</p>
            <h1 class="text-xl font-black tracking-tight text-[#4b2b38] md:text-2xl">FABELLAS</h1>
          </div>
        </NuxtLink>

        <div class="flex items-center gap-2">
          <NuxtLink
            to="/admin"
            class="text-[9px] font-bold uppercase tracking-[0.2em] text-[#d39ab1] opacity-25 transition duration-200 hover:opacity-100"
            aria-label="Acceso administrativo"
          >
            Admin
          </NuxtLink>

          <button
            type="button"
            :disabled="totalItems === 0"
            @click="openWhatsAppCheckout"
            class="rounded-full border border-[#f4d4df] bg-[#fff1f7] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-[#b64f7d] transition hover:bg-[#fce8f2] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Carrito {{ totalItems > 0 ? `(${totalItems})` : '' }}
          </button>
        </div>
      </div>
    </header>

    <main>
      <section class="container-shell py-10 md:py-16">
        <div class="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <span class="brand-pill mb-4">Cosméticos premium</span>
            <h2 class="max-w-xl text-4xl font-black tracking-tight text-[#3f2833] md:text-5xl">
              Belleza con glamour, cuidado y esencia femenina.
            </h2>
            <p class="mt-5 max-w-lg text-base leading-7 text-[#6f5360] md:text-lg">
              Descubre fórmulas elegantes, tonos irresistibles y productos que realzan tu belleza con estilo, confianza y brillo natural.
            </p>
             <p class="mt-5 max-w-lg text-base leading-7 text-[#6f5360] md:text-lg">
              Contáctanos por WhatsApp al 76590871
            </p>
            <div class="mt-8 flex flex-wrap gap-4">
              <a href="#catalogo" class="rounded-full bg-gradient-to-r from-[#d85f8f] to-[#e7a3ba] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-200 transition hover:brightness-110">
                Ver catálogo
              </a>
              <a href="#destacados" class="rounded-full border border-[#f1d4df] bg-white px-6 py-3 text-sm font-semibold text-[#b64f7d] transition hover:border-[#e6b3c8] hover:bg-[#fff2f8]">
                Ver destacados
              </a>
            </div>
          </div>

          <div class="flex justify-center lg:justify-end">
            <div class="relative w-full max-w-md rounded-[2rem] border border-white/80 bg-white/60 p-4 shadow-[0_25px_60px_-20px_rgba(206,112,150,0.35)] backdrop-blur-sm">
              <div class="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-[#fff3f8] via-white to-[#f7e6ee]" />
              <div class="relative flex flex-col items-center gap-4 rounded-[1.5rem] bg-[#fffafc] p-6">
                <div class="flex h-52 w-52 items-center justify-center overflow-hidden rounded-full border-4 border-[#f6dfe9] bg-white p-3 shadow-lg shadow-pink-100 md:h-64 md:w-64">
                  <img src="/logo-empresa.jpeg" alt="Logo de FABELLAS BEAUTY BRAND" class="h-full w-full rounded-full object-cover" />
                </div>
                <div class="text-center">
                  <p class="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#d66e96]">Beauty Brand</p>
                  <h3 class="mt-2 text-3xl font-black tracking-tight text-[#4b2b38] md:text-4xl">FABELLAS</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="destacados" class="container-shell pb-6 pt-2">
        <div class="mb-8 flex items-end justify-between gap-4">
          <div>
            <p class="text-sm font-medium uppercase tracking-[0.22em] text-slate-500">Destacados</p>
            <h3 class="mt-2 text-3xl font-bold text-slate-900">Lo más querido esta semana</h3>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          <TarjetaProducto v-for="producto in productos.slice(0, 4)" :key="producto.id" :producto="producto" />
        </div>
      </section>

      <section id="catalogo" class="container-shell pb-16 pt-4">
        <div class="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p class="text-sm font-medium uppercase tracking-[0.22em] text-slate-500">Catálogo</p>
            <h3 class="mt-2 text-3xl font-bold text-slate-900">Descubre tus favoritos</h3>
          </div>

          <div class="flex flex-col gap-3">
            <div class="flex flex-wrap gap-2">
              <button
                v-for="categoria in categorias"
                :key="categoria"
                type="button"
                @click="categoriaSeleccionada = categoria"
                :class="[
                  'rounded-full px-4 py-2 text-sm font-medium transition',
                  categoriaSeleccionada === categoria
                    ? 'bg-[#f3d7d1] text-slate-900 shadow-md'
                    : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:text-slate-900'
                ]"
              >
                {{ categoria === 'Todos' ? 'Todos' : categoria }}
              </button>
            </div>
          </div>
        </div>

        <div v-if="productosFiltrados.length === 0" class="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-600">
          No hay productos disponibles en esta categoría en este momento.
        </div>

        <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          <TarjetaProducto v-for="producto in productosFiltrados" :key="producto.id" :producto="producto" />
        </div>
      </section>
    </main>
  </div>
</template>
