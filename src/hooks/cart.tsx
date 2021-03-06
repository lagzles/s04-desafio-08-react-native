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

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // const dasdasdproductsString = await AsyncStorage.removeItem('@goMarketPlace:products')
      const productsString = await AsyncStorage.getItem('@goMarketPlace:products')

      if (productsString) {
        const products = JSON.parse(productsString);

        setProducts(products);
      }
    }

    loadProducts();
  }, []);

  // useEffect(() => {
  //   AsyncStorage.setItem('@goMarketPlace:products', JSON.stringify(products));
  // }, [products])

  const addToCart = useCallback(async (product: Product) => {
    const checkProduct = products.find(prod => prod.id === product.id);

    if (checkProduct) {
      checkProduct.quantity += 1;
      setProducts(products => [...products]);
    } else {
      setProducts(products => [...products, { ...product, quantity: 1 }]);
    }
    AsyncStorage.setItem('@goMarketPlace:products', JSON.stringify(products));
  }, [products]);

  // incremento de produtos
  const increment = useCallback(async id => {
    const productInCart = products.find(prod => prod.id === id);

    if (productInCart) {
      productInCart.quantity += 1;
      setProducts(products => [...products]);
      AsyncStorage.setItem('@goMarketPlace:products', JSON.stringify(products));
      return;
    }
  }, [products]);

  // retirada de produtos
  const decrement = useCallback(async id => {

    const productInCart = products.find(product => product.id === id);

    if (productInCart) {
      productInCart.quantity -= 1;

      if (productInCart.quantity <= 0) {
        setProducts(products => products.filter(product => product.id !== id))
      } else {
        setProducts(products => [...products]);
      }
    }

    AsyncStorage.setItem('@goMarketPlace:products', JSON.stringify(products));

  }, [products]);

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
