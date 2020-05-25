import React, { useState, useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  Container,
  CartPricing,
  CartButton,
  CartButtonText,
  CartTotalPrice,
} from './styles';

import formatValue from '../../utils/formatValue';

import { useCart } from '../../hooks/cart';

// Calculo do total
// Navegação no clique do TouchableHighlight

const FloatingCart: React.FC = () => {
  const { products } = useCart();

  const navigation = useNavigation();


  const cartTotal = useMemo(() => {
    try {
      const priceList: number[] = products.map(product => product.price * product.quantity)
      const reducer = (accu: number, current: number) => accu + current;
      const totalPrice = priceList.reduce(reducer);

      return formatValue(totalPrice);
    } catch (err) {
      return formatValue(0);
    }
  }, [products]);

  const totalItensInCart = useMemo(() => {
    try {
      const itemsList: number[] = products.map(product => 1 * product.quantity)
      const reducer = (accu: number, current: number) => accu + current;
      const totalItems = itemsList.reduce(reducer);

      return totalItems;
    } catch (err) {
      return 0;
    }
  }, [products]);

  return (
    <Container>
      <CartButton
        testID="navigate-to-cart-button"
        onPress={() => navigation.navigate('Cart')}
      >
        <FeatherIcon name="shopping-cart" size={24} color="#fff" />
        <CartButtonText>{`${totalItensInCart} itens`}</CartButtonText>
      </CartButton>

      <CartPricing>
        <CartTotalPrice>{cartTotal}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;
