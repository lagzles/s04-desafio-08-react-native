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
      const dart = await AsyncStorage.removeItem('@goMarketPlace:products')
      const productsString = await AsyncStorage.getItem('@goMarketPlace:products')

      if (productsString) {
        const products = JSON.parse(productsString);

        setProducts(products);
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(async (product: Product) => {
    const checkProductQuantity = products.map(prod => {
      if (prod.id === product.id) {
        return prod.quantity;
      } else {
        return 0;
      }
    });

    // console.log('check', checkProductQuantity, checkProductQuantity.length);

    let previousQuantity = Number(0);

    if (checkProductQuantity.length > 0) {
      const reducer = (accumulator: any, currentValue: any) => accumulator + currentValue || 0;
      previousQuantity = Number(checkProductQuantity.reduce(reducer));

      // console.log(previousQuantity);
    }
    previousQuantity = previousQuantity ? previousQuantity : 0;

    const quantity = 1 + previousQuantity;

    // console.log('new quantity', quantity)

    if (quantity > 1) {
      // console.log('se maior que 1');

      products.map(prod => {
        if (prod.id === product.id) {
          prod.quantity = prod.quantity + 1;
          const cantidade = prod.quantity;

          return cantidade;

        }
      }
      );

      setProducts(products);
    } else {
      // console.log('menor igual 1');
      const newProduct = {
        id: product.id,
        title: product.title,
        image_url: product.image_url,
        price: product.price,
        quantity
      };

      setProducts([...products, newProduct]);
      products.push(newProduct);

    }

    await AsyncStorage.setItem('@goMarketPlace:products', JSON.stringify(products));
    // console.log('products', products);
    // console.log('***************************');
  }, []);

  const increment = useCallback(async id => {
    products.map(prod => {
      if (prod.id === id) {
        prod.quantity = prod.quantity + 1;
        const cantidade = prod.quantity;

        return cantidade;

      }
    }
    );

    setProducts(products);
    await AsyncStorage.setItem('@goMarketPlace:products', JSON.stringify(products));

    return products

  }, []);

  const decrement = useCallback(async id => {
    // TODO DECREMENTS A PRODUCT QUANTITY IN THE CART
    const quantityList = products.map(prod => {
      if (prod.id === id) {
        prod.quantity = prod.quantity - 1;
        const cantidade = prod.quantity;
        return cantidade;
      } else { return 0; }
    });

    const reducer = (accu: number, current: number) => accu + current;
    const quantity = quantityList.reduce(reducer);
    if (quantity === 0) {
      const verifyQuantity = (product: Product) => product.quantity === 0 ? products.lastIndexOf(product) : '';

      const indexOfProduct = products.map(verifyQuantity).reduce(reducer);
      // console.log(lastIndexOf);

      // const indexOfProduct = lastIndexOf.reduce(reducer);
      console.log('index ', indexOfProduct);

      const productsNewList = products.splice(indexOfProduct, 1);
      console.log('nova lista ', productsNewList);

      setProducts(productsNewList);
      await AsyncStorage.setItem('@goMarketPlace:products', JSON.stringify(productsNewList));
      console.log(productsNewList);

    } else {
      console.log(products);
      setProducts(products);
      await AsyncStorage.setItem('@goMarketPlace:products', JSON.stringify(products));

    }


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
