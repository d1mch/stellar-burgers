import { rootReducer } from './store';

describe('rootReducer', () => {
  test('should initialize correctly', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      ingredients: {
        ingredients: [],
        isLoading: false,
        error: null
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      feed: {
        orders: [],
        total: 0,
        totalToday: 0,
        isLoading: false,
        error: null
      },
      orderInfo: {
        order: null,
        isLoading: false,
        error: null
      },
      user: {
        user: null,
        isAuthChecked: false,
        isLoading: false,
        error: null
      },
      order: {
        orderRequest: false,
        orderModalData: null,
        error: null
      },
      profileOrders: {
        orders: [],
        isLoading: false,
        error: null
      }
    });
  });
});