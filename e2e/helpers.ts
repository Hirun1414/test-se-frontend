import { Page, expect } from '@playwright/test';
import dayjs from 'dayjs';

// ─── credentials (update to match your test DB) ───────────────────────────────
export const USER_EMAIL = 'testuser@example.com';
export const USER_PASSWORD = 'password123';
export const ADMIN_EMAIL = 'admin@example.com';
export const ADMIN_PASSWORD = 'adminpass123';

// Known test data (update to IDs that actually exist in your test DB)
export const TEST_HOTEL_ID = process.env.TEST_HOTEL_ID ?? '6801234567890abcdef01234';
export const TEST_HOTEL_URL = `/hotel/${TEST_HOTEL_ID}`;

// ─── login helper ─────────────────────────────────────────────────────────────
export async function loginAs(page: Page, email: string, password: string) {
  // Use the custom sign-in page URL
  await page.goto('/auth/signin');

  // Use placeholders or input types since labels aren't linked via 'for' attributes
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  
  // Click the "เข้าสู่ระบบ" button
  await page.getByRole('button', { name: /เข้าสู่ระบบ/i }).click();

  // Wait until redirected away from the signin page
  await page.waitForURL((url) => !url.pathname.startsWith('/auth/signin'), {
    timeout: 20_000,
  });
}

export const loginAsUser = (page: Page) => loginAs(page, USER_EMAIL, USER_PASSWORD);
export const loginAsAdmin = (page: Page) => loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD);

/** Book a hotel for the logged-in user */
export async function bookHotel(page: Page, hotelId: string) {
  await page.goto(`/booking?id=${hotelId}`);
  
  // Wait for the booking page to load
  await expect(page.getByRole('heading', { name: /จองห้องพัก/i })).toBeVisible();

  // Pick a date (MUI DatePicker is tricky, let's try to fill the input)
  // The input usually has a placeholder or label
  const dateInput = page.locator('input[placeholder="MM/DD/YYYY"], input[placeholder="DD/MM/YYYY"]').first();
  // Set a date in the future
  const futureDate = dayjs().add(7, 'day').format('MM/DD/YYYY');
  await dateInput.fill(futureDate);

  // Click the confirm button "ยืนยันการจอง"
  const confirmBtn = page.getByRole('button', { name: /ยืนยันการจอง/i });
  await confirmBtn.click();

  // Wait for success message
  await expect(page.locator('text=จองสำเร็จ')).toBeVisible({ timeout: 15_000 });
}
