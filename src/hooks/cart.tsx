import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

interface Quantity {
  id: string;
  value: number
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<Quantity[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const productsString = await AsyncStorage.getItem('@goMarketPlace:product')

      if (productsString) {
        const products = JSON.parse(productsString);

        setProducts(products);
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(async (product: Product) => {
    // TODO ADD A NEW ITEM TO THE CART
    const checkProductQuantity = products.map(prod => {
      if (prod.id === product.id) {
        return prod.quantity;
      }
    });

    console.log(checkProductQuantity);
    // let quantity = 1
    if (checkProductQuantity) {
      const quantity = Number(checkProductQuantity) + 1;
      await AsyncStorage.setItem('@goMarketPlace:product', JSON.stringify({ product, quantity: quantity }))
    } else {
      const quantity = 1;
      await AsyncStorage.setItem('@goMarketPlace:product', JSON.stringify({ ...product, quantity: quantity }))
    }

  }, []);

  const increment = useCallback(async id => {
    // TODO INCREMENTS A PRODUCT QUANTITY IN THE CART
  }, []);

  const decrement = useCallback(async id => {
    // TODO DECREMENTS A PRODUCT QUANTITY IN THE CART
  }, []);

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
