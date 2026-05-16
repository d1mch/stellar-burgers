import reducer, { getIngredients } from './ingredientsSlice';
import { TIngredient } from '../../utils/types';

const ingredients: TIngredient[] = [
  {
    _id: 'ingredient-1',
    name: 'Булка',
    type: 'bun',
    proteins: 10,
    fat: 10,
    carbohydrates: 10,
    calories: 100,
    price: 100,
    image: 'image.png',
    image_large: 'image-large.png',
    image_mobile: 'image-mobile.png'
  }
];

describe('ingredientsSlice', () => {
  test('should set isLoading true on pending', () => {
    const state = reducer(undefined, getIngredients.pending(''));

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('should save ingredients on fulfilled', () => {
    const state = reducer(
      undefined,
      getIngredients.fulfilled(ingredients, '')
    );

    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(ingredients);
    expect(state.error).toBeNull();
  });

  test('should save error on rejected', () => {
    const state = reducer(
      undefined,
      getIngredients.rejected(
        new Error('Ошибка загрузки'),
        ''
      )
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });
});