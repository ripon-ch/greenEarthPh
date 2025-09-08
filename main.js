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