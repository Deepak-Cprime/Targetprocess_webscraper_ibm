# Targetprocess IBM Docs Web Scraper

This project automates the scraping and searching of IBM Targetprocess Developer Hub documentation. It extracts hierarchical documentation from the [IBM Targetprocess Docs](https://www.ibm.com/docs/en/targetprocess/tp-dev-hub/saas), 
converts HTML content to Markdown, stores it locally, and builds a searchable SQLite database to query document content using full-text search.

---

## 🔍 Use Case

This scraper is designed to:
- Extract the structure and content from the Targetprocess documentation on IBM's site.
- Convert the scraped content to Markdown for offline readability.
- Build a full-text search index using SQLite for easy and quick querying.
- Provide a shell-based utility to query docs via CLI.

---

## 📁 Project Structure

├── sidebar.js # Scrapes the sidebar menu structure with titles and URLs.
├── sidebar_links_with_sublinks.json # Stores the parsed sidebar structure with main links and sub-links.
├── web_scraper.js # Scrapes each documentation page and builds the local doc DB.
├── search-docs.sh # CLI utility to search the local SQLite doc DB.
├── docs/ # Output folder for Markdown files (created on run).
├── docs.db # SQLite FTS5 database for searching content (created on run).

## 📦 Required Libraries & Packages

### 🧩 Node.js Packages

Install via `npm install`:

```
npm install playwright fs node-html-markdown sqlite3 sqlite
```
### 🧰System Requirements
Ensure the following system tools are available:
sqlite3: Command-line SQLite3 tool
bash: For running search-docs.sh
node (>= v14 recommended)
playwright (Chromium installed)
To install Playwright browsers:
```
npx playwright install
```
### 🛠 Setup Instructions

Clone the repository
```
git clone https://github.com/your-username/deepak-cprime-targetprocess_webscraper_ibm.git
cd deepak-cprime-targetprocess_webscraper_ibm
```
Install dependencies
```
npm install
npx playwright install
```
Run sidebar scraper
```
node sidebar.js
```
Run the main web scraper
```
node web_scraper.js
```
Search the documentation
```
chmod +x search-docs.sh
./search-docs.sh "authentication"
```
Example
```
./search-docs.sh -e "automation rule"

//Response:
Using search database: docs.db
----------------------------------------
Searching for: "automation rule"
----------------------------------------
https://www.ibm.com/docs/en/targetprocess/tp-dev-hub/saas?topic=rules-diagnostic-troubleshooting
Setting up Automation Rules - Diagnostic and troubleshooting

![GitHub](https://unpkg.com/simple-icons@v3/icons/github.svg)Contribute in GitHub: [Edit online](https://github.ibm.com/IBMPrivateCloud/apptio-docs/edit/main/source/content/targetprocess/dev-hub/diagnostic-and-troubleshooting.md)

----------------------------------------
Related documents:

Setting up Automation Rules - Diagnostic and troubleshooting
  https://www.ibm.com/docs/en/targetprocess/tp-dev-hub/saas?topic=rules-diagnostic-troubleshooting

Import and Export data - Automation Rules for import and export
  https://www.ibm.com/docs/en/targetprocess/tp-dev-hub/saas?topic=data-automation-rules-import-export   

Setting up Automation Rules - Examples: Working with custom fields
  https://www.ibm.com/docs/en/targetprocess/tp-dev-hub/saas?topic=rules-examples-working-custom-fields  

Entity View Customization - Limitations of Entity detailed view customization
  https://www.ibm.com/docs/en/targetprocess/tp-dev-hub/saas?topic=customization-limitations-entity-detailed-view

Setting up Automation Rules - Reusable automation rules via Named Triggers
  https://www.ibm.com/docs/en/targetprocess/tp-dev-hub/saas?topic=rules-reusable-automation-via-named-triggers
```
