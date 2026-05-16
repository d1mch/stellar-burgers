import { useParams } from 'react-router-dom';
import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';

import { useDispatch, useSelector } from '../../services/store';
import { selectIngredients } from '../../services/slices/ingredientsSlice';
import { selectFeedOrders } from '../../services/slices/feedSlice';

import {
  getOrderByNumber,
  selectOrderInfo,
  selectOrderInfoError,
  selectOrderInfoLoading
} from '../../services/slices/orderInfoSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const dispatch = useDispatch();
  /** TODO: взять переменные orderData и ingredients из стора */

  const ingredients: TIngredient[] = useSelector(selectIngredients);

  const feedOrders = useSelector(selectFeedOrders);

  const loadedOrder = useSelector(selectOrderInfo);
  const isLoading = useSelector(selectOrderInfoLoading);
  const error = useSelector(selectOrderInfoError);

  const orderNumber = Number(number);

  const orderFromFeed = feedOrders.find(
    (order) => order.number === orderNumber
  );

  const orderData = orderFromFeed || loadedOrder;

  useEffect(() => {
    if (!orderFromFeed && !loadedOrder && orderNumber) {
      dispatch(getOrderByNumber(orderNumber));
    }
  }, [dispatch, orderFromFeed, loadedOrder, orderNumber]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (error) {
    return <p className='text text_type_main-medium'>{error}</p>;
  }

  if (isLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
