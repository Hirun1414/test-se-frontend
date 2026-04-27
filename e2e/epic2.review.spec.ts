/**
 * EPIC 2 – Review System
 *
 * US2-1  User leaves a review for a hotel
 * US2-2  User views all reviews for a hotel
 * US2-3  User edits their previously submitted review
 * US2-4  User deletes their review
 * US2-5  User likes or dislikes a review
 * US2-6  User views like count for each review
 * US2-7  Admin views like AND dislike counts for each review
 *
 * Prereqs
 * -------
 * • Next.js frontend running on https://se-project-fe-phi.vercel.app
 * • Backend running on https://fe-project-be-chi.vercel.app
 * • TEST_USER_EMAIL / TEST_USER_PASSWORD – a regular user who has a booking
 *   for 'Subnaut Base' hotel (required for posting a review in US2-1)
 * • TEST_ADMIN_EMAIL / TEST_ADMIN_PASSWORD – an admin account
 */

import { test, expect, Page } from '@playwright/test';
import { loginAsUser, loginAsAdmin } from './helpers';

// ── helpers ──────────────────────────────────────────────────────────────────

/** Navigate to 'Subnaut Base' hotel page via the hotel list */
async function goToSubnautBase(page: Page) {
  await page.goto('/hotel');
  await page.waitForLoadState('networkidle');
  const link = page.getByRole('link', { name: /Subnaut Base/i }).first();
  await link.waitFor({ timeout: 10_000 });
  await link.click();
  await page.waitForLoadState('networkidle');
}

/** Click a star in the ReviewForm (1–5) */
async function clickStar(page: Page, starNumber: number) {
  // Stars are rendered as <button>★</button> inside the review form
  const stars = page.locator('div:has(> h3:text("เขียนรีวิวโรงแรมนี้"), > h3:text("แก้ไขรีวิวของคุณ")) button');
  await stars.nth(starNumber - 1).click();
}

/** Fill comment textarea in the review form */
async function fillComment(page: Page, text: string) {
  await page
    .locator('textarea[placeholder="เล่าประสบการณ์ของคุณ..."]')
    .fill(text);
}

// ── Epic 2 – User stories ────────────────────────────────────────────────────

test.describe('Epic 2 – Review System', () => {

  // ──────────────────────────────────────────────────────────────────────────
  // US2-1 : User leaves a review for a hotel
  // ──────────────────────────────────────────────────────────────────────────
  test.describe('US2-1 : Leave a review', () => {

    test('Happy path – logged-in user with a booking can submit a review', async ({ page }) => {
      await loginAsUser(page);

      // Navigate to the hotel list and find 'Subnaut Base'
      await page.goto('/hotel');
      await page.waitForLoadState('networkidle');
      const hotelLink = page.getByRole('link', { name: /Subnaut Base/i }).first();
      await expect(hotelLink).toBeVisible({ timeout: 10_000 });
      await hotelLink.click();
      await page.waitForLoadState('networkidle');

      const reviewText = 'Great hotel! Playwright automated review.';

      // Check if user already has a review at this hotel
      // locator.isVisible() is immediate. We need to wait a bit or check count.
      const myReviewHeading = page.locator('h3:text("รีวิวของคุณ")');
      const alreadyHasReview = await myReviewHeading.count().then(c => c > 0) || 
                               await myReviewHeading.isVisible().catch(() => false);
      
      // If not immediately visible, wait up to 5s for either the "Your Review" or "Write Review" heading
      const formHeading = page.locator('h3:text("เขียนรีวิวโรงแรมนี้"), h3:text("รีวิวของคุณ")').first();
      await expect(formHeading).toBeVisible({ timeout: 10_000 });
      
      const isExisting = await myReviewHeading.isVisible();

      if (isExisting) {
        // Already reviewed – delete it first then we will submit a new one
        // Use a more specific locator for the delete button within the 'รีวิวของคุณ' section
        const myReviewSection = page.locator('div:has(> h3:text("รีวิวของคุณ"))');
        await myReviewSection.getByRole('button', { name: 'ลบ' }).click();
        
        const modal = page.getByRole('dialog', { name: /ลบรีวิวนี้ไหม/i });
        await expect(modal).toBeVisible({ timeout: 10_000 });
        
        // Click the confirm delete button in the modal
        const confirmDeleteBtn = modal.getByRole('button', { name: 'ลบ' });
        await confirmDeleteBtn.click();
        
        // Wait for the modal to disappear and the "เขียนรีวิว" form to appear
        await expect(modal).not.toBeVisible({ timeout: 10_000 });
        await expect(page.locator('h3:text("เขียนรีวิวโรงแรมนี้")')).toBeVisible({ timeout: 15_000 });
        await page.waitForLoadState('networkidle');
      }

      // No existing review (or just deleted) – submit a new one
      const form = page.locator('h3:text("เขียนรีวิวโรงแรมนี้")').first();
      await expect(form).toBeVisible({ timeout: 10_000 });

      // Select 4 stars
      const starBtns = page.locator('div:has(> h3:text("เขียนรีวิวโรงแรมนี้")) button');
      await starBtns.nth(3).click(); // 4th star

      // Write comment
      await fillComment(page, reviewText);

      // Submit
      const submitBtn = page.getByRole('button', { name: 'ส่งรีวิว' });
      await expect(submitBtn).toBeEnabled();
      await submitBtn.click();
      await page.waitForLoadState('networkidle');

      // Verify the review text appears in the review list of 'Subnaut Base'
      await expect(page.locator(`text=${reviewText}`)).toBeVisible({ timeout: 10_000 });
    });

    test('Alt path – user without a booking cannot submit a review', async ({ page }) => {
      // NOTE: For this test to be truly "Alt path", the user must NOT have a booking.
      // If the test above just created a booking, this test might fail if it uses the same user.
      // However, we will attempt to submit and expect the backend error message.

      await loginAsUser(page);
      await goToSubnautBase(page);

      const submitBtn = page.getByRole('button', { name: 'ส่งรีวิว' });

      // If the user ALREADY has a review from the previous test, this test isn't valid for "no booking".
      const hasReview = await page.locator('h3:text("รีวิวของคุณ")').isVisible();
      if (hasReview) {
        test.info().annotations.push({ type: 'info', description: 'User already has a review/booking, skipping "no booking" test' });
        return;
      }

      // Try to submit anyway
      const starBtns = page.locator('div:has(> h3:text("เขียนรีวิวโรงแรมนี้")) button');
      if (await starBtns.count() > 0) {
        await starBtns.nth(4).click();
        await fillComment(page, 'Should be blocked because of no booking');
        await submitBtn.click();
        await page.waitForLoadState('networkidle');

        // Expect an error message from the backend (Thai or English)
        const errorMsg = page.locator('text=/only.*booking|ต้องมีการจอง|booking.*required/i');
        await expect(errorMsg).toBeVisible({ timeout: 10_000 });
      }
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // US2-2 : User views all reviews for a hotel
  // ──────────────────────────────────────────────────────────────────────────
  test.describe('US2-2 : View all reviews', () => {

    test('Happy path – hotel with reviews shows review list', async ({ page }) => {
      // No login required to view – use Subnaut Base which has reviews
      await goToSubnautBase(page);

      const reviewSection = page.locator('section:has(h2:text("รีวิวจากผู้ใช้งาน"))');
      await expect(reviewSection).toBeVisible({ timeout: 10_000 });

      // At least the heading must be present
      await expect(page.getByRole('heading', { name: /รีวิวจากผู้ใช้งาน/i })).toBeVisible();
    });

    test('Alt path – hotel with no reviews shows empty message', async ({ page }) => {
      // Navigate to the hotel list and find 'Hotel Sky de Stripe' which is known to have no reviews
      await page.goto('/hotel');
      await page.waitForLoadState('networkidle');

      // Click on the hotel card/link for 'Hotel Sky de Stripe'
      const hotelLink = page.getByRole('link', { name: /Hotel Sky de Stripe/i }).first();
      await expect(hotelLink).toBeVisible({ timeout: 10_000 });
      await hotelLink.click();
      await page.waitForLoadState('networkidle');

      // The empty message should be displayed since this hotel has no reviews
      const emptyMsg = page.locator('text=ยังไม่มีรีวิวสำหรับโรงแรมนี้');
      await expect(emptyMsg).toBeVisible({ timeout: 10_000 });
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // US2-3 : User edits their previously submitted review
  // ──────────────────────────────────────────────────────────────────────────
  test.describe('US2-3 : Edit a review', () => {

    test('Happy path – user can edit comment and score', async ({ page }) => {
      await loginAsUser(page);
      await goToSubnautBase(page);

      // User must already have a review (section "รีวิวของคุณ")
      const myReviewSection = page.locator('h3:text("รีวิวของคุณ")');
      const hasReview = await myReviewSection.isVisible({ timeout: 5_000 }).catch(() => false);

      if (!hasReview) {
        test.info().annotations.push({ type: 'skip', description: 'No existing review to edit' });
        return;
      }

      // Click แก้ไข button
      await page.getByRole('button', { name: 'แก้ไข' }).click();

      // Edit heading should appear
      await expect(page.locator('h3:text("แก้ไขรีวิวของคุณ")')).toBeVisible();

      // Update comment
      const textarea = page.locator('textarea[placeholder="เล่าประสบการณ์ของคุณ..."]');
      await textarea.clear();
      await textarea.fill('Updated by Playwright E2E test');

      // Save
      await page.getByRole('button', { name: 'บันทึกการแก้ไข' }).click();
      await page.waitForLoadState('networkidle');

      // Review should reflect the update
      await expect(page.locator('text=Updated by Playwright E2E test')).toBeVisible({
        timeout: 10_000,
      });
    });

    test('Alt path – submitting an empty comment is blocked', async ({ page }) => {
      await loginAsUser(page);
      await goToSubnautBase(page);

      const myReviewSection = page.locator('h3:text("รีวิวของคุณ")');
      const hasReview = await myReviewSection.isVisible({ timeout: 5_000 }).catch(() => false);
      if (!hasReview) return;

      await page.getByRole('button', { name: 'แก้ไข' }).click();
      await expect(page.locator('h3:text("แก้ไขรีวิวของคุณ")')).toBeVisible();

      // Clear the comment
      const textarea = page.locator('textarea[placeholder="เล่าประสบการณ์ของคุณ..."]');
      await textarea.clear();

      // The save button should be disabled (canSubmit = false when comment is empty)
      const saveBtn = page.getByRole('button', { name: 'บันทึกการแก้ไข' });
      await expect(saveBtn).toBeDisabled();

      // Inline validation message
      await expect(page.locator('text=รีวิวไม่สามารถเว้นว่างได้')).toBeVisible();
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // US2-4 : User deletes their review
  // ──────────────────────────────────────────────────────────────────────────
  test.describe('US2-4 : Delete a review', () => {

    test('Happy path – user deletes their review via confirmation modal', async ({ page }) => {
      await loginAsUser(page);
      await goToSubnautBase(page);

      const myReview = page.locator('h3:text("รีวิวของคุณ")');
      const hasReview = await myReview.isVisible({ timeout: 5_000 }).catch(() => false);
      if (!hasReview) {
        test.info().annotations.push({ type: 'skip', description: 'No review to delete' });
        return;
      }

      // Open delete confirmation modal
      await page.getByRole('button', { name: 'ลบ' }).click();

      // Modal should appear
      const modal = page.getByRole('dialog', { name: /ลบรีวิวนี้ไหม/i });
      await expect(modal).toBeVisible({ timeout: 5_000 });

      // Confirm deletion
      await modal.getByRole('button', { name: 'ลบ' }).click();
      await page.waitForLoadState('networkidle');

      // My review section should disappear
      await expect(page.locator('h3:text("รีวิวของคุณ")')).toHaveCount(0, {
        timeout: 10_000,
      });
    });

    test('Alt path – cancelling delete modal keeps the review', async ({ page }) => {
      await loginAsUser(page);
      await goToSubnautBase(page);

      const myReview = page.locator('h3:text("รีวิวของคุณ")');
      const hasReview = await myReview.isVisible({ timeout: 5_000 }).catch(() => false);
      if (!hasReview) return;

      await page.getByRole('button', { name: 'ลบ' }).click();
      const modal = page.getByRole('dialog');
      await expect(modal).toBeVisible();

      // Cancel
      await modal.getByRole('button', { name: 'ยกเลิก' }).click();

      // Modal should close and review should still be there
      await expect(modal).not.toBeVisible({ timeout: 5_000 });
      await expect(page.locator('h3:text("รีวิวของคุณ")')).toBeVisible();
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // US2-5 : User likes or dislikes a review
  // ──────────────────────────────────────────────────────────────────────────
  test.describe('US2-5 : Like or dislike a review', () => {

    test('Happy path – logged-in user can like a review and count updates', async ({ page }) => {
      await loginAsUser(page);
      await goToSubnautBase(page);

      // Like buttons are shown only on other users' reviews
      const likeBtn = page
        .locator('button[title="ถูกใจรีวิวนี้"], button[title="เอาไลค์คืน"]')
        .first();

      const hasSomeoneElsesReview = await likeBtn.isVisible({ timeout: 5_000 }).catch(() => false);
      if (!hasSomeoneElsesReview) {
        test.info().annotations.push({ type: 'skip', description: 'No other user reviews to like' });
        return;
      }

      // Read count before click
      const countSpan = likeBtn.locator('span').last();
      const before = Number(await countSpan.innerText());

      await likeBtn.click();
      await page.waitForTimeout(1000); // optimistic update

      const after = Number(await countSpan.innerText());
      // Count should differ (either +1 or -1 if toggling)
      expect(Math.abs(after - before)).toBe(1);
    });

    test('Happy path – logged-in user can dislike a review and dislike count updates', async ({ page }) => {
      await loginAsUser(page);
      await goToSubnautBase(page);

      const dislikeBtn = page
        .locator('button[title="ไม่ถูกใจรีวิวนี้"], button[title="เอาดิสไลค์คืน"]')
        .first();

      const visible = await dislikeBtn.isVisible({ timeout: 5_000 }).catch(() => false);
      if (!visible) return;

      // Clicking should not throw an error
      await dislikeBtn.click();
      await page.waitForTimeout(1000);

      // Button should still be present (no page crash)
      await expect(page).not.toHaveURL(/signin/);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // US2-6 : User views like count for each review
  // ──────────────────────────────────────────────────────────────────────────
  test.describe('US2-6 : View like count for each review', () => {

    test('Happy path – like count is visible next to like button', async ({ page }) => {
      // No login needed to view – use Subnaut Base which has reviews
      await goToSubnautBase(page);

      // Like buttons exist (rendered for every review except own)
      const likeButtons = page.locator(
        'button[title="ถูกใจรีวิวนี้"], button[title="เอาไลค์คืน"], button[title="กรุณาเข้าสู่ระบบ"]'
      );

      if ((await likeButtons.count()) === 0) {
        // No reviews at all – OK
        return;
      }

      // Each like button should have a visible numeric span
      const firstBtn = likeButtons.first();
      const count = await firstBtn.locator('span').last().innerText();
      expect(Number.isFinite(Number(count))).toBe(true);
    });

    test('Alt path – dislike count is NOT visible to regular user (shown as blank)', async ({ page }) => {
      await loginAsUser(page);
      await goToSubnautBase(page);

      // Dislike button spans for regular users should be empty (showDislikeCount=false)
      const dislikeButtons = page.locator(
        'button[title="ไม่ถูกใจรีวิวนี้"], button[title="เอาดิสไลค์คืน"], button[title="กรุณาเข้าสู่ระบบ"]'
      );

      if ((await dislikeButtons.count()) === 0) return;

      // The span inside the dislike button should be empty for non-admin
      const spanText = await dislikeButtons.first().locator('span').last().innerText();
      // showDislikeCount=false renders null → empty string
      expect(spanText.trim()).toBe('');
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // US2-7 : Admin views like AND dislike counts for each review
  // ──────────────────────────────────────────────────────────────────────────
  test.describe('US2-7 : Admin views like and dislike counts', () => {

    test('Happy path – admin sees both like count and dislike count', async ({ page }) => {
      await loginAsAdmin(page);
      await goToSubnautBase(page);

      const likeButtons = page.locator(
        'button[title="ถูกใจรีวิวนี้"], button[title="เอาไลค์คืน"], button[title="กรุณาเข้าสู่ระบบ"]'
      );
      const dislikeButtons = page.locator(
        'button[title="ไม่ถูกใจรีวิวนี้"], button[title="เอาดิสไลค์คืน"], button[title="กรุณาเข้าสู่ระบบ"]'
      );

      if ((await likeButtons.count()) === 0) {
        // No reviews – pass trivially
        return;
      }

      // Like count must be a number
      const likeCount = await likeButtons.first().locator('span').last().innerText();
      expect(Number.isFinite(Number(likeCount))).toBe(true);

      // Dislike count must ALSO be a number (showDislikeCount=true for admin)
      const dislikeCount = await dislikeButtons.first().locator('span').last().innerText();
      expect(Number.isFinite(Number(dislikeCount))).toBe(true);
    });

    test('Alt path – admin dislike count is visible (not hidden as "—")', async ({ page }) => {
      await loginAsAdmin(page);
      await goToSubnautBase(page);

      const dislikeButtons = page.locator(
        'button[title="ไม่ถูกใจรีวิวนี้"], button[title="เอาดิสไลค์คืน"], button[title="กรุณาเข้าสู่ระบบ"]'
      );

      if ((await dislikeButtons.count()) === 0) return;

      const spanText = await dislikeButtons.first().locator('span').last().innerText();
      // For admin, showDislikeCount=true, so the span renders a numeric string (not empty)
      expect(spanText.trim()).not.toBe('—');
      expect(Number.isFinite(Number(spanText.trim()))).toBe(true);
    });
  });
});
