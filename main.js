// All API Link //

const API = {
    allPlants: "https://openapi.programming-hero.com/api/plants",
    categories: "https://openapi.programming-hero.com/api/categories",
    byCategory: id => `https://openapi.programming-hero.com/api/category/${id}`,
    detail: id => `https://openapi.programming-hero.com/api/plant/${id}`
};

// Get Element By ID //
const els = {
  categoryList: document.getElementById("categoryList"),
  grid: document.getElementById("cardGrid"),
  empty: document.getElementById("emptyMsg"),
  spinner: document.getElementById("gridSpinner"),
  cartList: document.getElementById("cartList"),
  cartTotal: document.getElementById("cartTotal"),
  modal: document.getElementById("modal"),
  modalImage: document.getElementById("modalImage"),
  modalTitle: document.getElementById("modalTitle"),
  modalDesc: document.getElementById("modalDesc"),
  modalCategory: document.getElementById("modalCategory"),
  modalPrice: document.getElementById("modalPrice"),
  modalAdd: document.getElementById("modalAdd"),
  modalClose: document.getElementById("modalClose"),
  year: document.getElementById("year"),
};

let categories = [];
let plants = [];
let selectedCategory = "all";
const cart = new Map();
let modalPlant = null;

// Navbar Button //
document.getElementById("menuBtn").addEventListener("click", () => {
  const m = document.getElementById("mobileMenu");
  m.classList.toggle("hidden");
});

els.year.textContent = new Date().getFullYear();

autoInit();

async function autoInit() {
  await Promise.all([loadCategories(), loadAllPlants()]);
}
function toLabel(v) {
  if (v == null) return "";
  if (typeof v === "string" || typeof v === "number") return String(v);
  if (typeof v === "object") {
    return (
      v.name ?? v.title ?? v.label ?? v.category ?? v.text ??
      (typeof v.value === "string" || typeof v.value === "number" ? v.value : "")
    ) ?? "";
  }
  return String(v);
}

function normalizeCategory(raw) {
  const id = raw?.id ?? raw?.category_id ?? raw?.categoryId ?? raw?.slug ?? raw?.value ?? toLabel(raw);
  const name = toLabel(raw?.name) || toLabel(raw?.category) || toLabel(raw?.title) || toLabel(raw?.label) || toLabel(raw);
  return { id, name };
}

function getArray(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.plants)) return payload.plants;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.categories)) return payload.categories;
  return [];
}

function normalizePlant(raw) {
  const id = raw?.id ?? raw?.plantId ?? raw?.plant_id ?? raw?._id ?? raw?.slug ?? raw?.uid ?? Math.random();
  const name = raw?.name ?? raw?.plant_name ?? raw?.title ?? raw?.common_name ?? "Plant";
  const image = raw?.image ?? raw?.img ?? raw?.image_url ?? raw?.imageUrl ?? raw?.thumbnail ?? undefined;
  const description = raw?.description ?? raw?.short_description ?? raw?.shortDescription ?? raw?.about ?? raw?.details ?? "";
  const category = raw?.category ?? raw?.type ?? raw?.group ?? "Tree";
  const price = Number(raw?.price ?? raw?.cost ?? raw?.amount ?? raw?.price_usd ?? 0) || 0;
  return { id, name, image, description, category, price };
}

async function loadCategories() {
  try {
    const res = await fetch(API.categories);
    const json = await res.json();
    categories = getArray(json).map(normalizeCategory);
    renderCategories();
  } catch (e) {
    console.error("Failed to load categories", e);
    categories = [];
    renderCategories();
  }
}

async function loadAllPlants() {
  await loadGridWith(async () => {
    const res = await fetch(API.allPlants);
    const json = await res.json();
    plants = getArray(json).map(normalizePlant);
  });
}

async function loadCategory(id) {
  selectedCategory = id;
  await loadGridWith(async () => {
    const res = await fetch(API.byCategory(id));
    const json = await res.json();
    plants = getArray(json).map(normalizePlant);
  });
}

async function loadGridWith(fn) {
  els.spinner.classList.remove("hidden");
  els.empty.classList.add("hidden");
  els.grid.innerHTML = "";
  try {
    await fn();
    renderGrid();
  } catch (e) {
    console.error(e);
    plants = [];
    renderGrid();
  } finally {
    els.spinner.classList.add("hidden");
  }
}

function renderCategories() {
  const frag = document.createDocumentFragment();
  const mkBtn = (label, active, onClick) => {
    const btn = document.createElement("button");
    btn.className = `w-full whitespace-nowrap rounded-md px-3 py-2 text-left transition-colors ${active ? "bg-[#15803D] text-white border-primary" : " hover:bg-green-100 hover:border-primary hover:text-white"}`;
    btn.textContent = label;
    btn.onclick = onClick;
    return btn;
  };
  frag.append(mkBtn("All Trees", selectedCategory === "all", () => loadAllPlants()))
  categories.forEach((c) => {
    frag.append(mkBtn(c.name, selectedCategory === c.id, () => loadCategory(c.id)));
  });
  els.categoryList.innerHTML = "";
  els.categoryList.append(frag);
}

function renderGrid() {
  const displayed = plants.slice(0, 6);
  els.grid.innerHTML = "";
  displayed.forEach((p) => {
    const card = document.createElement("article");
    card.className = "rounded-lg overflow-hidden shadow-sm bg-white";
    const img = document.createElement("div");
    img.className = "aspect-video bg-slate-200";
    if (p.image) {
      img.style.backgroundImage = `url(${p.image})`;
      img.style.backgroundSize = "cover";
      img.style.backgroundPosition = "center";
    }
    const body = document.createElement("div");
    body.className = "p-4 space-y-3";
    const title = document.createElement("h4");
    title.className = "font-semibold text-lg";
    const tbtn = document.createElement("button");
    tbtn.className = "hover:text-primary";
    tbtn.textContent = p.name;
    tbtn.onclick = () => openModal(p);
    title.append(tbtn);
    const desc = document.createElement("p");
    desc.className = "text-sm text-slate-600 line-clamp-2";
    desc.textContent = p.description || "";
    const meta = document.createElement("div");
    meta.className = "flex items-center justify-between";
    const chip = document.createElement("span");
    chip.className = "text-xs text-green-700 px-2 py-1 rounded-full bg-[#DCFCE7]";
    chip.textContent = p.category || "Tree";
    const price = document.createElement("span");
    price.className = "font-semibold";
    price.textContent = `$${(p.price || 0).toFixed(0)}`;
    meta.append(chip, price);
    const add = document.createElement("button");
    add.className = "w-full rounded-md bg-[#15803D] text-white py-2 font-medium";
    add.textContent = "Add to Cart";
    add.onclick = () => addToCart(p);
    body.append(title);
    if (p.description) body.append(desc);
    body.append(meta, add);
    card.append(img, body);
    els.grid.append(card);
  });
  els.empty.classList.toggle("hidden", plants.length !== 0);
  renderCategories();
}

function addToCart(p) {
  const ex = cart.get(p.id) || { id: p.id, name: p.name, price: p.price || 0, qty: 0 };
  ex.qty += 1;
  cart.set(p.id, ex);
  renderCart();
}

function removeFromCart(id) {
  const ex = cart.get(id);
  if (!ex) return;
  ex.qty -= 1;
  if (ex.qty <= 0) cart.delete(id);
  else cart.set(id, ex);
  renderCart();
}

function renderCart() {
  els.cartList.innerHTML = "";
  let total = 0;
  cart.forEach((it) => {
    total += it.price * it.qty;
    const row = document.createElement("div");
    row.className = "flex items-center justify-between gap-3 rounded-md px-3 py-2";
    row.innerHTML = `<div><p class="font-medium leading-tight">${it.name}</p><p class="text-xs text-slate-500">$${it.price.toFixed(0)} × ${it.qty}</p></div><button class="text-red-500 text-lg">❌</button>`;
    row.querySelector("button").onclick = () => removeFromCart(it.id);
    els.cartList.append(row);
  });
  if (cart.size === 0) {
    const p = document.createElement("p");
    p.className = "text-sm text-slate-500";
    p.textContent = "Your cart is empty.";
    els.cartList.append(p);
  }
  els.cartTotal.textContent = `$${total.toFixed(0)}`;
}

async function openModal(p) {
  modalPlant = p;
  els.modalTitle.textContent = p.name;
  els.modalDesc.textContent = p.description || "";
  els.modalCategory.textContent = p.category || "Tree";
  els.modalPrice.textContent = `$${(p.price || 0).toFixed(0)}`;
  els.modalImage.style.backgroundImage = p.image ? `url(${p.image})` : "";
  els.modalImage.style.backgroundSize = "cover";
  els.modalImage.style.backgroundPosition = "center";
  els.modal.classList.remove("hidden");
  try {
    const res = await fetch(API.detail(p.id));
    const json = await res.json();
    const obj = Array.isArray(json) ? json[0] : json?.data ?? json;
    const detailed = normalizePlant(Object.assign({}, p, obj));
    modalPlant = detailed;
    els.modalDesc.textContent = detailed.description || "";
    els.modalCategory.textContent = detailed.category || "Tree";
    els.modalPrice.textContent = `$${(detailed.price || 0).toFixed(0)}`;
    if (detailed.image) {
      els.modalImage.style.backgroundImage = `url(${detailed.image})`;
    }
  } catch {}
}

els.modalAdd.addEventListener("click", () => {
  if (modalPlant) addToCart(modalPlant);
  closeModal();
});
els.modalClose.addEventListener("click", closeModal);
els.modal.addEventListener("click", (e) => {
  if (e.target === els.modal) closeModal();
});

function closeModal() {
  els.modal.classList.add("hidden");
}

// Donate form
 document.getElementById("donateForm").addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Thank you for planting trees! 🌳");
});
