const API = {
    allPlants: "https://openapi.programming-hero.com/api/plants",
    categories: "https://openapi.programming-hero.com/api/categories",
    byCategory: id => `https://openapi.programming-hero.com/api/category/${id}`,
    detail: id => `https://openapi.programming-hero.com/api/plant/${id}`
};
