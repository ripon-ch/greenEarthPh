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
