import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { NodeHtmlMarkdown } from 'node-html-markdown';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const OUTPUT_DIR = './docs';
const DB_FILE = './docs.db';
const SIDEBAR_JSON = './sidebar_links_with_sublinks.json';

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

async function initDatabase() {
  const db = await open({
    filename: DB_FILE,
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE VIRTUAL TABLE IF NOT EXISTS docs USING fts5(id, title, url, content);
    CREATE TABLE IF NOT EXISTS sections (doc_id TEXT, section TEXT, level INTEGER);
    CREATE TABLE IF NOT EXISTS relationships (source TEXT, target TEXT);
  `);

  return db;
}

async function scrapeAndSavePage(page, url, title, db) {
  try {
    await page.goto(url, { waitUntil: 'networkidle' });

    const html = await page.content();
    const markdown = NodeHtmlMarkdown.translate(html);

    const fileSafeTitle = title.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_');
    const filePath = path.join(OUTPUT_DIR, `${fileSafeTitle}.md`);
    fs.writeFileSync(filePath, markdown);

    const id = fileSafeTitle;
    await db.run(`INSERT INTO docs (id, title, url, content) VALUES (?, ?, ?, ?)`, [
      id, title, url, markdown
    ]);

    const headings = markdown.match(/^#+\s.+$/gm) || [];
    for (const heading of headings) {
      const level = heading.match(/^#+/)[0].length;
      const text = heading.replace(/^#+\s/, '');
      await db.run(`INSERT INTO sections (doc_id, section, level) VALUES (?, ?, ?)`, [
        id, text, level
      ]);
    }

    const internalLinks = [...markdown.matchAll(/\[.+?\]\((\/[^)]+)\)/g)];
    for (const match of internalLinks) {
      const target = new URL(match[1], url).href;
      await db.run(`INSERT INTO relationships (source, target) VALUES (?, ?)`, [url, target]);
    }

    console.log(`✅ Saved ${title}`);
  } catch (err) {
    console.warn(`⚠️ Failed to scrape ${url}: ${err.message}`);
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const db = await initDatabase();

  const sidebarLinks = JSON.parse(fs.readFileSync(SIDEBAR_JSON, 'utf-8'));

  for (const { title: mainTitle, href, subLinks } of sidebarLinks) {
    // await scrapeAndSavePage(page, href, mainTitle, db);
    for (const { title: subTitle, href: subHref } of subLinks) {
      await scrapeAndSavePage(page, subHref, `${mainTitle} - ${subTitle}`, db);
    }
  }

  await browser.close();
  await db.close();
  console.log('🎉 Done scraping all pages and building database.');
})();
