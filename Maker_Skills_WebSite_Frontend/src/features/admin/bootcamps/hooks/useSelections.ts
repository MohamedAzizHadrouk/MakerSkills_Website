import { useState, useEffect } from "react";
import { categoryService } from "../../categories/services/category.service";
import { productService } from "../../products/services/product.service";
import { Category } from "../../categories/types/category";
import { Product } from "../../products/types/product";

interface SelectionOption {
  id: string;
  label: string;
  color?: string;
}

export const useSelections = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSelections = async () => {
    setLoading(true);
    setError(null);
    try {
      const [categoriesData, productsData] = await Promise.all([
        categoryService.getCategories(),
        productService.getProducts(),
      ]);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors du chargement"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSelections();
  }, []);

  const generateColor = (name: string): string => {
    const colors = [
      "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
      "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
      "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400",
      "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getCategoriesForComponents = (): SelectionOption[] => {
    return categories.map((category) => ({
      id: category._id,
      label: category.name,
      color: generateColor(category.name),
    }));
  };

  const getCategoriesForForms = (): SelectionOption[] => {
    return categories.map((category) => ({
      id: category._id,
      label: category.name,
    }));
  };

  const getProductsForForms = (): SelectionOption[] => {
    return products.map((product) => ({
      id: product._id,
      label: product.name,
    }));
  };

  return {
    categories,
    products,
    loading,
    error,
    loadSelections,
    getCategoriesForComponents,
    getCategoriesForForms,
    getProductsForForms,
    generateColor,
  };
};
