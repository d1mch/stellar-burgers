import { test, expect, Page } from '@playwright/test';

const BUN_NAME = 'Краторная булка N-200i';
const MAIN_NAME = 'Биокотлета из марсианской Магнолии';

const getIngredientsSection = (page: Page) =>
  page
    .locator('section')
    .filter({ hasText: 'Булки' })
    .filter({ hasText: 'Начинки' })
    .filter({ hasText: 'Соусы' })
    .first();

const getConstructor = (page: Page) =>
  page
    .locator('section')
    .filter({ has: page.getByRole('button', { name: 'Оформить заказ' }) })
    .first();

const getIngredientCard = (page: Page, name: string) =>
  getIngredientsSection(page).locator('li').filter({ hasText: name }).first();

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
    await page.routeFromHAR('tests/hars/constructor.har', {
      url: '**/api/**',
      notFound: 'fallback'
    });
  });

  test('should add bun and ingredient to constructor', async ({ page }) => {
    await page.goto('/');

    await addIngredient(page, BUN_NAME);
    await addIngredient(page, MAIN_NAME);

    const constructor = getConstructor(page);

    await expect(constructor.getByText(`${BUN_NAME} (верх)`)).toBeVisible();
    await expect(constructor.getByText(`${BUN_NAME} (низ)`)).toBeVisible();
    await expect(constructor.getByText(MAIN_NAME)).toBeVisible();
  });

  test('should open and close ingredient modal by close button', async ({
    page
  }) => {
    await page.goto('/');

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
    await page.context().addCookies([
      {
        name: 'accessToken',
        value: 'Bearer test-access-token',
        domain: 'localhost',
        path: '/'
      }
    ]);

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    await page.goto('/');

    await addIngredient(page, BUN_NAME);
    await addIngredient(page, MAIN_NAME);

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    const modal = page.locator('#modals');

    await expect(modal.getByText('12345')).toBeVisible();

    await closeModal(page);

    const constructor = getConstructor(page);

    await expect(constructor.getByText('Выберите булки').first()).toBeVisible();
    await expect(constructor.getByText('Выберите начинку')).toBeVisible();

    await expect(constructor.getByText(`${BUN_NAME} (верх)`)).not.toBeVisible();
    await expect(constructor.getByText(`${BUN_NAME} (низ)`)).not.toBeVisible();
  });
});