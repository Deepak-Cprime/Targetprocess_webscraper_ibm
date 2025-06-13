import { chromium } from 'playwright';
import fs from 'fs';

const BASE_URL = 'https://www.ibm.com';
const TARGET_URL = 'https://www.ibm.com/docs/en/targetprocess/tp-dev-hub/saas';
const visited = new Set();

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('Navigating to IBM Docs...');
  await page.goto(TARGET_URL, { waitUntil: 'networkidle' });

  // Remove cookie banner if any
  await page.evaluate(() => {
    const banner = document.querySelector('#consent_blackbar');
    if (banner) banner.remove();
  });

  await page.waitForSelector('ul.ibmdocs-toc-links > li');

  // Recursively expand all expandable sections
async function expandAllTOCSections() {
  while (true) {
    const expandIcons = await page.$$('.ibmdocs-expand-icon');
    let clicked = false;

    for (const icon of expandIcons) {
      const parentLi = await icon.evaluateHandle(el => {
        let node = el;
        while (node && node.tagName !== 'LI') node = node.parentElement;
        return node;
      });

      const isValid = await parentLi.evaluate(node => node && node.isConnected);
      if (!isValid) continue;

      const hasLoadedChildren = await parentLi.evaluate(li => {
        const sub = li.querySelector('.ibmdocs-toc-children > ul > li');
        return !!sub;
      });

      if (!hasLoadedChildren) {
        try {
          await icon.scrollIntoViewIfNeeded();
          await icon.click({ force: true });
          await page.waitForTimeout(500);
          clicked = true;
        } catch (err) {
          console.warn('⚠️ Could not click an expander:', err.message);
        }
      }
    }

    if (!clicked) break;
  }
}



  // Extract tree after all expansions
  async function extractTreeFrom(liHandles) {
    const items = [];

    for (const li of liHandles) {
      const link = await li.$('a.ibmdocs-toc-link');
      if (!link) continue;

      const title = await link.innerText();
      const href = await link.getAttribute('href');
      const fullHref = href ? new URL(href, BASE_URL).href : null;
      if (!fullHref || visited.has(fullHref)) continue;
      visited.add(fullHref);

      const subLis = await li.$$('.ibmdocs-toc-children > ul > li');
      const subLinks = subLis.length ? await extractTreeFrom(subLis) : [];

      items.push({ title, href: fullHref, subLinks });
    }

    return items;
  }

  // Expand everything
  console.log('Expanding all TOC sections...');
  await expandAllTOCSections();

  console.log('Extracting TOC structure...');
  const topLevelLis = await page.$$('ul.ibmdocs-toc-links > li');
  const tocTree = await extractTreeFrom(topLevelLis);

  fs.writeFileSync('sidebar_links_nested.json', JSON.stringify(tocTree, null, 2));
  console.log(`✅ Done. Extracted ${tocTree.length} top-level sections.`);

  await browser.close();
})();
