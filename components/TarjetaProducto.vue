<script setup>
const props = defineProps({
  producto: {
    type: Object,
    required: true,
  },
});

const precioFormateado = computed(() => {
  const valor = Number(props.producto.precio ?? 0);
  return new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);
});
</script>

<template>
  <article class="group overflow-hidden rounded-[1.75rem] border border-[#f4d9e5] bg-white/90 shadow-[0_18px_45px_rgba(210,117,161,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(210,117,161,0.18)]">
    <div class="relative h-72 overflow-hidden">
      <img
        :src="producto.imagen_url || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80'"
        :alt="producto.nombre"
        class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />
      <span class="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b9497a]">
        {{ producto.categoria }}
      </span>
    </div>

    <div class="space-y-4 p-5">
      <div class="flex items-start justify-between gap-3">
        <h3 class="text-lg font-bold text-[#3f2833]">
          {{ producto.nombre }}
        </h3>
        <span
          v-if="producto.stock <= 0"
          class="rounded-full bg-rose-50 px-2 py-1 text-[10px] font-semibold text-rose-600"
        >
          Sin stock
        </span>
      </div>

      <p class="text-sm leading-6 text-[#735a64]">
        {{ producto.descripcion || 'Producto premium para una rutina de belleza cuidada y elegante.' }}
      </p>

      <div class="flex items-center justify-between gap-3">
        <span class="text-2xl font-black text-[#3f2833]">{{ precioFormateado }}</span>
        <span class="text-xs text-[#7a5b65]">{{ producto.stock }} disponibles</span>
      </div>

      <NuxtLink
        :to="`/productos/${producto.id}`"
        class="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#d85f8f] to-[#e7a3ba] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-200 transition hover:brightness-110"
      >
        Ver detalle
      </NuxtLink>
    </div>
  </article>
</template>
