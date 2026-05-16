import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown
} from './burgerConstructorSlice';

import { TIngredient } from '../../utils/types';

const bun: TIngredient = {
  _id: 'bun-1',
  name: 'Булка',
  type: 'bun',
  proteins: 10,
  fat: 10,
  carbohydrates: 10,
  calories: 100,
  price: 100,
  image: 'bun.png',
  image_large: 'bun-large.png',
  image_mobile: 'bun-mobile.png'
};

const main: TIngredient = {
  _id: 'main-1',
  name: 'Начинка',
  type: 'main',
  proteins: 20,
  fat: 20,
  carbohydrates: 20,
  calories: 200,
  price: 200,
  image: 'main.png',
  image_large: 'main-large.png',
  image_mobile: 'main-mobile.png'
};

const sauce: TIngredient = {
  _id: 'sauce-1',
  name: 'Соус',
  type: 'sauce',
  proteins: 5,
  fat: 5,
  carbohydrates: 5,
  calories: 50,
  price: 50,
  image: 'sauce.png',
  image_large: 'sauce-large.png',
  image_mobile: 'sauce-mobile.png'
};

describe('burgerConstructorSlice', () => {
  test('should add bun', () => {
    const state = reducer(undefined, addIngredient(bun));

    expect(state.bun?._id).toBe('bun-1');
    expect(state.ingredients).toHaveLength(0);
  });

  test('should add ingredient', () => {
    const state = reducer(undefined, addIngredient(main));

    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]._id).toBe('main-1');
    expect(state.ingredients[0].id).toBeDefined();
  });

  test('should remove ingredient', () => {
    const stateWithIngredient = reducer(undefined, addIngredient(main));
    const ingredientId = stateWithIngredient.ingredients[0].id;

    const state = reducer(
      stateWithIngredient,
      removeIngredient(ingredientId)
    );

    expect(state.ingredients).toHaveLength(0);
  });

  test('should move ingredient up', () => {
    let state = reducer(undefined, addIngredient(main));
    state = reducer(state, addIngredient(sauce));

    const movedState = reducer(state, moveIngredientUp(1));

    expect(movedState.ingredients[0]._id).toBe('sauce-1');
    expect(movedState.ingredients[1]._id).toBe('main-1');
  });

  test('should move ingredient down', () => {
    let state = reducer(undefined, addIngredient(main));
    state = reducer(state, addIngredient(sauce));

    const movedState = reducer(state, moveIngredientDown(0));

    expect(movedState.ingredients[0]._id).toBe('sauce-1');
    expect(movedState.ingredients[1]._id).toBe('main-1');
  });
});