<script setup>
import { actualizarStockProducto, eliminarProducto, guardarProducto, productosCatalogo } from '~/data/productos';
import { useCatalogDatabase } from '~/composables/useCatalogDatabase';

const runtimeConfig = useRuntimeConfig();
const password = ref('');
const isAuthenticated = ref(false);
const formMode = ref('new');
const stockToDecrease = ref({});

const defaultForm = () => ({
  id: '',
  nombre: '',
  descripcion: '',
  categoria: 'Belleza',
  precio: 0,
  stock: 0,
  imagen_url: '/logo-empresa.jpeg',
});

const form = ref(defaultForm());
const currentProducts = computed(() => [...(productosCatalogo.value || [])].sort((a, b) => Number(a.id) - Number(b.id)));

const authKey = 'fabellas-admin-auth';

const procesarImagen = (event) => {
  const file = event?.target?.files?.[0];

  if (!file) {
    return;
  }

  if (!file.type.startsWith('image/')) {
    alert('Selecciona un archivo de imagen válido.');
    event.target.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    form.value.imagen_url = String(reader.result || '/logo-empresa.jpeg');
  };
  reader.readAsDataURL(file);
};

onMounted(async () => {
  if (import.meta.client && typeof window !== 'undefined') {
    isAuthenticated.value = window.localStorage.getItem(authKey) === '1';
  }

  const { cargarProductos } = useCatalogDatabase();
  await cargarProductos();
});

const resetForm = () => {
  formMode.value = 'new';
  form.value = defaultForm();
};

const login = () => {
  if (!import.meta.client || typeof window === 'undefined') {
    return;
  }

  if (password.value === runtimeConfig.public.adminPassword) {
    isAuthenticated.value = true;
    window.localStorage.setItem(authKey, '1');
    password.value = '';
    return;
  }

  alert('Contraseña incorrecta.');
};

const logout = () => {
  if (!import.meta.client || typeof window === 'undefined') {
    return;
  }

  isAuthenticated.value = false;
  window.localStorage.removeItem(authKey);
  resetForm();
};

const editarProducto = (producto) => {
  formMode.value = 'edit';
  form.value = {
    id: String(producto.id),
    nombre: producto.nombre,
    descripcion: producto.descripcion,
    categoria: producto.categoria,
    precio: Number(producto.precio || 0),
    stock: Number(producto.stock || 0),
    imagen_url: producto.imagen_url || '/logo-empresa.jpeg',
  };
};

const guardar = () => {
  if (!form.value.nombre.trim()) {
    alert('El nombre del producto es obligatorio.');
    return;
  }

  const payload = {
    ...form.value,
    id: Number(form.value.id || Date.now()),
    nombre: form.value.nombre.trim(),
    descripcion: form.value.descripcion.trim(),
    categoria: ['Belleza', 'Novedades'].includes(form.value.categoria) ? form.value.categoria : 'Belleza',
    precio: Number(form.value.precio || 0),
    stock: Number(form.value.stock || 0),
    imagen_url: form.value.imagen_url.trim() || '/logo-empresa.jpeg',
  };

  const { guardarEnSupabase } = useCatalogDatabase();
  guardarEnSupabase(payload).then((saved) => {
    if (saved) resetForm();
  });
};

const reducirStock = (id) => {
  const cantidad = Number(stockToDecrease.value[id] ?? 1);
  if (!cantidad || cantidad <= 0) {
    alert('Ingresa una cantidad válida para descontar del stock.');
    return;
  }

  const producto = productosCatalogo.value.find((item) => Number(item.id) === Number(id));
  if (!producto) {
    return;
  }

  if (cantidad > Number(producto.stock || 0)) {
    alert(`No puedes vender ${cantidad} unidades porque solo hay ${producto.stock} disponibles.`);
    return;
  }

  const { actualizarStockEnSupabase } = useCatalogDatabase();
  actualizarStockEnSupabase(id, cantidad).then((updated) => {
    if (updated) stockToDecrease.value[id] = 1;
  });
};

const eliminar = (id) => {
  const ok = window.confirm('¿Deseas eliminar este producto del inventario?');
  if (!ok) {
    return;
  }

  const { eliminarDeSupabase } = useCatalogDatabase();
  eliminarDeSupabase(id).then((deleted) => {
    if (deleted && String(form.value.id) === String(id)) {
      resetForm();
    }
  });
};

const formatearPrecio = (value) =>
  new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
</script>

<template>
  <div class="min-h-screen bg-[radial-gradient(circle_at_top,_#fff7fb_0%,_#f5e7ef_25%,_#f8f3ec_100%)] px-4 py-10 text-[#3d2b34] md:px-6">
    <div class="mx-auto max-w-7xl">
      <div v-if="!isAuthenticated" class="mx-auto max-w-md rounded-[2rem] border border-[#f3d9e5] bg-white p-8 shadow-[0_25px_80px_rgba(216,95,143,0.12)]">
        <div class="mb-6 text-center">
          <p class="text-xs font-semibold uppercase tracking-[0.32em] text-[#d66e96]">Panel oculto</p>
          <h1 class="mt-3 text-3xl font-black text-[#3f2833]">Administración</h1>
        </div>

        <div class="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Esta sección es exclusiva para el administrador. Para volver al catálogo público, usa el botón de abajo.
        </div>

        <label class="block text-sm font-semibold text-[#5a3c45]">Contraseña</label>
        <input
          v-model="password"
          type="password"
          class="mt-2 w-full rounded-2xl border border-[#f0cedd] bg-[#fffafc] px-4 py-3 outline-none ring-0 transition focus:border-[#d98cae]"
          placeholder="Ingresa la contraseña"
          @keyup.enter="login"
        />

        <button
          type="button"
          @click="login"
          class="mt-5 w-full rounded-full bg-gradient-to-r from-[#d85f8f] to-[#e7a3ba] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-200 transition hover:brightness-110"
        >
          Entrar al inventario
        </button>

        <NuxtLink
          to="/"
          class="mt-4 inline-flex w-full items-center justify-center rounded-full border border-[#f0d2df] bg-white px-6 py-3 text-sm font-semibold text-[#b64f7d] transition hover:bg-[#fff3f8]"
        >
          Volver al catálogo público
        </NuxtLink>
      </div>

      <div v-else class="space-y-8">
        <header class="flex flex-col gap-4 rounded-[2rem] border border-[#f2dfe8] bg-white/80 p-5 shadow-[0_22px_70px_rgba(216,95,143,0.10)] backdrop-blur-md md:flex-row md:items-center md:justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.28em] text-[#d66e96]">Inventario</p>
            <h1 class="mt-2 text-3xl font-black text-[#3f2833]">Productos FABELLAS</h1>
          </div>

          <div class="flex items-center gap-3">
            <NuxtLink to="/" class="rounded-full border border-[#f0d2df] bg-white px-4 py-2 text-sm font-semibold text-[#b64f7d] transition hover:bg-[#fff3f8]">
              Ver catálogo
            </NuxtLink>
            <button
              type="button"
              @click="logout"
              aria-label="Salir del administrador"
              class="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Salir del administrador
            </button>
          </div>
        </header>

        <div class="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
          <section class="rounded-[2rem] border border-[#f4d8e2] bg-white p-5 shadow-sm md:p-6">
            <div class="mb-5 flex items-center justify-between">
              <h2 class="text-2xl font-bold text-[#3f2833]">Productos activos</h2>
              <span class="rounded-full bg-[#fdf1f7] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#b64f7d]">
                {{ currentProducts.length }} artículos
              </span>
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-full text-left text-sm">
                <thead>
                  <tr class="border-b border-[#f3dfe9] text-[#6a4b56]">
                    <th class="px-3 py-3 font-semibold">Nombre</th>
                    <th class="px-3 py-3 font-semibold">Categoría</th>
                    <th class="px-3 py-3 font-semibold">Precio</th>
                    <th class="px-3 py-3 font-semibold">Stock</th>
                    <th class="px-3 py-3 font-semibold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="producto in currentProducts" :key="producto.id" class="border-b border-[#f9eaf1] align-top">
                    <td class="px-3 py-3">
                      <div class="flex items-center gap-3">
                        <img :src="producto.imagen_url || '/logo-empresa.jpeg'" :alt="producto.nombre" class="h-12 w-12 rounded-xl object-cover ring-1 ring-[#f3dfe9]" />
                        <div>
                          <p class="font-semibold text-[#3f2833]">{{ producto.nombre }}</p>
                          <p class="text-xs text-[#7c5864]">{{ producto.categoria }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-3 py-3 text-[#5d4048]">{{ producto.categoria }}</td>
                    <td class="px-3 py-3 font-semibold text-[#3f2833]">{{ formatearPrecio(producto.precio) }}</td>
                    <td class="px-3 py-3">
                      <div class="flex items-center gap-2">
                        <span :class="producto.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'" class="inline-flex rounded-full px-2.5 py-1 text-xs font-bold">
                          {{ producto.stock }}
                        </span>
                        <div class="flex items-center gap-2 rounded-full border border-[#f0d2df] bg-[#fff8fb] px-2 py-1">
                          <input
                            v-model.number="stockToDecrease[producto.id]"
                            type="number"
                            min="1"
                            class="w-12 border-0 bg-transparent text-center text-xs font-semibold text-[#5a3c45] outline-none"
                          />
                          <button type="button" @click="reducirStock(producto.id)" class="text-[10px] font-bold uppercase tracking-[0.15em] text-[#b64f7d]">
                            - stock
                          </button>
                        </div>
                      </div>
                    </td>
                    <td class="px-3 py-3">
                      <div class="flex justify-end gap-2">
                        <button type="button" @click="editarProducto(producto)" class="rounded-full bg-[#fdf2f7] px-3 py-1.5 text-xs font-semibold text-[#b64f7d]">
                          Editar
                        </button>
                        <button type="button" @click="eliminar(producto.id)" class="rounded-full bg-[#fdecec] px-3 py-1.5 text-xs font-semibold text-[#b54a5d]">
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <aside class="rounded-[2rem] border border-[#f3dfe9] bg-[#fffafc] p-5 shadow-sm md:p-6">
            <div class="mb-5 flex items-center justify-between">
              <h2 class="text-2xl font-bold text-[#3f2833]">{{ formMode === 'edit' ? 'Editar producto' : 'Nuevo producto' }}</h2>
            </div>

            <div class="space-y-4">
              <div>
                <label class="mb-1 block text-sm font-semibold text-[#5a3c45]">Nombre</label>
                <input v-model="form.nombre" type="text" class="w-full rounded-2xl border border-[#f0cedd] bg-white px-3 py-2.5 outline-none focus:border-[#d98cae]" />
              </div>

              <div>
                <label class="mb-1 block text-sm font-semibold text-[#5a3c45]">Descripción</label>
                <textarea v-model="form.descripcion" rows="4" class="w-full rounded-2xl border border-[#f0cedd] bg-white px-3 py-2.5 outline-none focus:border-[#d98cae]" />
              </div>

              <div>
                <label class="mb-1 block text-sm font-semibold text-[#5a3c45]">Categoría</label>
                <select v-model="form.categoria" class="w-full rounded-2xl border border-[#f0cedd] bg-white px-3 py-2.5 outline-none focus:border-[#d98cae]">
                  <option value="Belleza">Belleza</option>
                  <option value="Novedades">Novedades</option>
                </select>
              </div>

              <div class="grid gap-4 sm:grid-cols-2">
                <div>
                  <label class="mb-1 block text-sm font-semibold text-[#5a3c45]">Precio (Bs)</label>
                  <input v-model.number="form.precio" type="number" min="0" step="0.01" class="w-full rounded-2xl border border-[#f0cedd] bg-white px-3 py-2.5 outline-none focus:border-[#d98cae]" />
                </div>
                <div>
                  <label class="mb-1 block text-sm font-semibold text-[#5a3c45]">Stock</label>
                  <input v-model.number="form.stock" type="number" min="0" class="w-full rounded-2xl border border-[#f0cedd] bg-white px-3 py-2.5 outline-none focus:border-[#d98cae]" />
                </div>
              </div>

              <div>
                <label class="mb-1 block text-sm font-semibold text-[#5a3c45]">Imagen del producto</label>
                <div class="flex items-center gap-3">
                  <img :src="form.imagen_url || '/logo-empresa.jpeg'" alt="Previsualización del producto" class="h-16 w-16 rounded-2xl object-cover ring-1 ring-[#f3dfe9]" />
                  <label class="flex-1 cursor-pointer rounded-2xl border border-dashed border-[#e7bfce] bg-[#fffafc] px-3 py-2.5 text-center text-sm font-medium text-[#b64f7d] transition hover:bg-[#fff3f8]">
                    <span>Subir imagen</span>
                    <input type="file" accept="image/*" class="hidden" @change="procesarImagen" />
                  </label>
                </div>
                <input v-model="form.imagen_url" type="text" class="mt-3 w-full rounded-2xl border border-[#f0cedd] bg-white px-3 py-2.5 outline-none focus:border-[#d98cae]" placeholder="/logo-empresa.jpeg o URL" />
              </div>

              <div class="flex gap-3 pt-2">
                <button
                  type="button"
                  @click="guardar"
                  class="flex-1 rounded-full bg-gradient-to-r from-[#d85f8f] to-[#e7a3ba] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-200 transition hover:brightness-110"
                >
                  {{ formMode === 'edit' ? 'Guardar cambios' : 'Agregar producto' }}
                </button>
                <button
                  type="button"
                  @click="resetForm"
                  class="rounded-full border border-[#f0d2df] bg-white px-5 py-3 text-sm font-semibold text-[#b64f7d] transition hover:bg-[#fff3f8]"
                >
                  Limpiar
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  </div>
</template>
