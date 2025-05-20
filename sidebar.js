import { chromium } from 'playwright';
import fs from 'fs';

const BASE_URL = 'https://www.ibm.com';
const TARGET_URL = 'https://www.ibm.com/docs/en/targetprocess/tp-dev-hub/saas';

(async () => {
  const browser = await chromium.launch({ headless: false }); // Use headless for debug
  const page = await browser.newPage();

  console.log('Navigating to IBM Docs main page...');
  await page.goto(TARGET_URL, { waitUntil: 'networkidle' });

  // Remove cookie banner if present
  await page.evaluate(() => {
    const banner = document.querySelector('#consent_blackbar');
    if (banner) banner.remove();
  });

  // Wait for sidebar TOC
  await page.waitForSelector('ul.ibmdocs-toc-links > li');

  const results = [];

  // Get all list items (TOC sections)
  const liHandles = await page.$$('ul.ibmdocs-toc-links > li');

  for (let i = 0; i < liHandles.length; i++) {
    try {
      // Re-fetch the list item (important to avoid stale handles)
      const li = (await page.$$('ul.ibmdocs-toc-links > li'))[i];
      if (!li) continue;

      const mainLinkEl = await li.$('a.ibmdocs-toc-link');
      const mainTitle = await mainLinkEl?.innerText() ?? '';
      const mainHref = await mainLinkEl?.getAttribute('href') ?? '';
      const fullMainHref = new URL(mainHref, BASE_URL).href;

      // Try to expand this section
      const expandIcon = await li.$('.ibmdocs-expand-icon');
      if (expandIcon) {
        await expandIcon.scrollIntoViewIfNeeded();
        await expandIcon.click({ force: true });
        await page.waitForTimeout(500); // wait for children to load
      }

      // Extract any sub-links
      const subLinks = await li.$$eval('.ibmdocs-toc-children a.ibmdocs-toc-link', anchors =>
        anchors.map(a => ({
          title: a.textContent.trim(),
          href: new URL(a.getAttribute('href'), 'https://www.ibm.com').href
        }))
      );

      results.push({
        title: mainTitle,
        href: fullMainHref,
        subLinks
      });
    } catch (err) {
      console.warn(`⚠️ Error processing item ${i}: ${err.message}`);
    }
  }

  // Write results
  fs.writeFileSync('sidebar_links_with_sublinks.json', JSON.stringify(results, null, 2));
  console.log(`✅ Done! Extracted ${results.length} main sections with sub-links.`);

  await browser.close();
})();
