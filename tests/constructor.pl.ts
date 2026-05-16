import { test, expect, Page } from '@playwright/test';

import ingredients from './fixtures/ingredients.json';
import user from './fixtures/user.json';
import order from './fixtures/order.json';

const BUN_NAME = 'Краторная булка N-200i';
const MAIN_NAME = 'Биокотлета из марсианской Магнолии';

const getIngredientCard = (page: Page, name: string) =>
  page.locator('li').filter({ hasText: name }).first();

const addIngredient = async (page: Page, name: string) => {
  await getIngredientCard(page, name)
    .getByRole('button', { name: 'Добавить' })
    .click();
};

const closeModal = async (page: Page) => {
  await page.locator('#modals').getByRole('button').first().click();
};

test.describe('constructor page', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/ingredients', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(ingredients)
      });
    });

    await page.goto('/');
  });

  test('should add bun and ingredient to constructor', async ({ page }) => {
    await addIngredient(page, BUN_NAME);
    await addIngredient(page, MAIN_NAME);

    await expect(page.getByText(`${BUN_NAME} (верх)`)).toBeVisible();
    await expect(page.getByText(`${BUN_NAME} (низ)`)).toBeVisible();

    await expect(page.getByText(MAIN_NAME)).toHaveCount(2);
  });

  test('should open and close ingredient modal by close button', async ({
    page
  }) => {
    await getIngredientCard(page, BUN_NAME).click();

    const modal = page.locator('#modals');

    await expect(modal.getByText('Детали ингредиента')).toBeVisible();

    await expect(
      modal.getByRole('heading', {
        name: BUN_NAME
      })
    ).toBeVisible();

    await closeModal(page);

    await expect(modal.getByText('Детали ингредиента')).not.toBeVisible();
  });

  test('should create order and clear constructor', async ({ page }) => {
    await page.route('**/api/auth/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(user)
      });
    });

    await page.route('**/api/orders', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(order)
      });
    });

    await page.context().addCookies([
      {
        name: 'accessToken',
        value: 'Bearer test-access-token',
        domain: 'localhost',
        path: '/'
      }
    ]);

    await page.evaluate(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    await page.reload();

    await addIngredient(page, BUN_NAME);
    await addIngredient(page, MAIN_NAME);

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    const modal = page.locator('#modals');

    await expect(modal.getByText('12345')).toBeVisible();

    await closeModal(page);

    await expect(page.getByText('Выберите булки').first()).toBeVisible();
    await expect(page.getByText('Выберите начинку')).toBeVisible();

    await expect(page.getByText(`${BUN_NAME} (верх)`)).not.toBeVisible();
    await expect(page.getByText(`${BUN_NAME} (низ)`)).not.toBeVisible();
  });
});