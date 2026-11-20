<script setup>
import { productosCatalogo } from '~/data/productos';

const { cart, totalItems, totalPrice, addItem, removeItem, openWhatsAppCheckout } = useCart();

const route = useRoute();
const productoId = computed(() => Number(route.params.id));
const producto = computed(() =>
  (productosCatalogo.value || []).find((item) => Number(item.id) === Number(productoId.value)) ?? null,
);

const precioFormateado = computed(() => {
  if (!producto.value) {
    return 'Bs 0,00';
  }

  return new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(producto.value.precio ?? 0));
});

const estadoStock = computed(() => {
  if (!producto.value) {
    return 'Sin información';
  }

  return producto.value.stock > 0 ? 'Disponible ahora' : 'Sin stock';
});
</script>

<template>
  <div class="min-h-screen bg-[radial-gradient(circle_at_top,_#fff7fb_0%,_#fbe7f0_24%,_#f7efe8_100%)] px-4 py-10 md:px-0">
    <div class="container-shell">
      <div v-if="!producto" class="rounded-3xl border border-[#f0d2df] bg-white p-8 text-center text-[#64515a] shadow-sm">
        <p class="text-lg font-semibold text-[#3f2833]">Producto no encontrado</p>
        <p class="mt-2">El artículo que buscas no está disponible en este momento.</p>
        <NuxtLink to="/" class="mt-6 inline-flex rounded-full bg-gradient-to-r from-[#d85f8f] to-[#e7a3ba] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-200 hover:brightness-110">
          Volver al catálogo
        </NuxtLink>
      </div>

      <article v-else class="grid gap-8 rounded-[2rem] border border-[#f4d8e2] bg-white/80 p-5 shadow-[0_30px_80px_rgba(216,95,143,0.12)] backdrop-blur-sm lg:grid-cols-2 lg:gap-12 lg:p-8">
        <div class="overflow-hidden rounded-[2rem] border border-[#f4d8e2] bg-gradient-to-br from-[#fff1f7] to-[#fffdfd] p-4 shadow-sm">
          <img
            :src="producto.imagen_url || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80'"
            :alt="producto.nombre"
            class="h-[520px] w-full rounded-[1.5rem] object-cover"
          />
        </div>

        <div class="flex flex-col justify-center">
          <NuxtLink to="/" class="mb-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#b64f7d] transition hover:text-[#9a3a65]">
            <span aria-hidden="true">←</span>
            Volver al catálogo
          </NuxtLink>

          <p class="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#d66e96]">
            {{ producto.categoria }}
          </p>
          <h1 class="text-4xl font-black tracking-tight text-[#3f2833] md:text-5xl">
            {{ producto.nombre }}
          </h1>

          <div class="mt-6 flex items-end gap-3">
            <span class="text-4xl font-black text-[#3f2833]">{{ precioFormateado }}</span>
            <span class="mb-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              {{ estadoStock }}
            </span>
          </div>

          <p class="mt-6 text-base leading-8 text-[#6d5160]">
            {{ producto.descripcion || 'Descubre la mejor formulación para mantener una rutina de belleza elegante, cuidada y sofisticada.' }}
          </p>

          <div class="mt-8 space-y-4 rounded-2xl border border-[#f4d8e2] bg-[#fff4f8] p-5 shadow-sm">
            <div class="flex items-center justify-between text-sm text-[#6d5160]">
              <span>Estado del stock</span>
              <span class="font-semibold text-[#3f2833]">{{ producto.stock }} unidades</span>
            </div>
            <div class="flex items-center justify-between text-sm text-[#6d5160]">
              <span>Disponibilidad</span>
              <span class="font-semibold" :class="producto.stock > 0 ? 'text-emerald-600' : 'text-rose-600'">
                {{ estadoStock }}
              </span>
            </div>
          </div>

          <div class="mt-8 flex flex-wrap gap-4">
            <button
              type="button"
              @click="producto && addItem(producto)"
              class="rounded-full bg-gradient-to-r from-[#d85f8f] to-[#e7a3ba] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-200 transition hover:brightness-110"
            >
              Añadir al carrito
            </button>
            <button
              type="button"
              :disabled="totalItems === 0"
              @click="openWhatsAppCheckout"
              class="rounded-full border border-[#f0d2df] bg-white px-6 py-3 text-sm font-semibold text-[#b64f7d] transition hover:border-[#e6b3c8] hover:bg-[#fff2f8] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Comprar por WhatsApp
            </button>
          </div>

          <div v-if="cart.length > 0" class="mt-6 rounded-2xl border border-[#f4d8e2] bg-[#fff9fb] p-4 shadow-sm">
            <div class="mb-3 flex items-center justify-between">
              <p class="text-sm font-semibold uppercase tracking-[0.2em] text-[#b64f7d]">Carrito</p>
              <span class="text-sm font-bold text-[#3f2833]">{{ totalItems }} productos</span>
            </div>

            <ul class="space-y-3">
              <li v-for="item in cart" :key="item.id" class="flex items-center justify-between gap-3 rounded-xl bg-white p-2 shadow-sm">
                <div class="min-w-0">
                  <p class="truncate text-sm font-semibold text-[#3f2833]">{{ item.nombre }}</p>
                  <p class="text-xs text-[#6d5160]">{{ item.cantidad }} x Bs {{ Number(item.precio).toFixed(2) }}</p>
                </div>
                <button
                  type="button"
                  @click="removeItem(item.id)"
                  class="text-xs font-semibold text-[#b64f7d] underline decoration-dotted"
                >
                  Quitar
                </button>
              </li>
            </ul>

            <div class="mt-4 flex items-center justify-between border-t border-[#f2d7e2] pt-3">
              <span class="text-sm font-medium text-[#6d5160]">Total</span>
              <span class="text-lg font-black text-[#3f2833]">Bs {{ Number(totalPrice).toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>
