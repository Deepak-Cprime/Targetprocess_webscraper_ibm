# Targetprocess IBM Docs Web Scraper

This project automates the scraping and searching of IBM Targetprocess Developer Hub documentation. 
It extracts hierarchical documentation from the [IBM Targetprocess Docs](https://www.ibm.com/docs/en/targetprocess/tp-dev-hub/saas), converts HTML content to Markdown, 
stores it locally, and builds a searchable SQLite database to query document content using full-text search.

---

## 🔍 Use Case

This scraper is designed to:
- Extract the structure and content from the Targetprocess documentation on IBM's site.
- Convert the scraped content to Markdown for offline readability.
- Build a full-text search index using SQLite for easy and quick querying.
- Provide a shell-based utility to query docs via CLI.

---

## 📁 Project Structure

```
deepak-cprime-targetprocess_webscraper_ibm/
├── sidebar.js                 # Scrapes the sidebar navigation structure with titles and URLs
├── sidebar_links_nested.json # Stores the structured sidebar hierarchy (main + sub-links)
├── web_scraper.js            # Scrapes individual pages and saves them as Markdown + DB
├── search-docs.sh            # CLI tool for querying the SQLite FTS documentation DB
├── docs/                     # Folder where Markdown files are saved
├── docs.db                   # SQLite FTS5 database containing indexed documentation content
```

---


## 📦 Required Libraries & Packages

### 🧩 Node.js Packages

Install via `npm install`:

```bash
npm install playwright fs node-html-markdown sqlite3 sqlite
```
### 🧰 System Requirements
Ensure the following system tools are available:
- sqlite3: Command-line SQLite3 tool
- bash: For running search-docs.sh
- node (>= v14 recommended)
- playwright (Chromium installed)

---

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
Use --exact flag for exact phrase matching:
```
./search-docs.sh --exact "REST API V2"
```
---
## 🧾 Output
The following are generated on execution:
- docs/: Markdown files for each documentation page.
- docs.db: SQLite database with FTS index of the documentation.

---

## 💡Example
```
./search-docs.sh api
Using search database: docs.db
----------------------------------------
Searching for: api
----------------------------------------
https://www.ibm.com/docs/en/targetprocess/tp-dev-hub/saas?topic=v2-filtering-by-releases-iterations-team-iterations
Targetprocess REST API V2 - Filtering by Releases, Iterations and Team Iterations

...To pull the items which belong to the current Release, Iteration or Team Iteration you need to use boolean `IsCurrent` field:

----------------------------------------
Related documents:

Targetprocess REST API V2 - Filtering by Releases, Iterations and Team Iterations
  https://www.ibm.com/docs/en/targetprocess/tp-dev-hub/saas?topic=v2-filtering-by-releases-iterations-team-iterations

Historical Record - Simple history
  https://www.ibm.com/docs/en/targetprocess/tp-dev-hub/saas?topic=record-simple-history

Metrics and Calculated Custom Fields - Custom Fields
  https://www.ibm.com/docs/en/targetprocess/tp-dev-hub/saas?topic=fields-custom

Historical Record - Full history
  https://www.ibm.com/docs/en/targetprocess/tp-dev-hub/saas?topic=record-full-history

Historical Record - Examples
  https://www.ibm.com/docs/en/targetprocess/tp-dev-hub/saas?topic=record-examples

Working with Other APIs - Conversion API
  https://www.ibm.com/docs/en/targetprocess/tp-dev-hub/saas?topic=apis-conversion-api

Working with Other APIs - Undelete API
  https://www.ibm.com/docs/en/targetprocess/tp-dev-hub/saas?topic=apis-undelete-api

Targetprocess REST API V1 - Appends and Calculations
  https://www.ibm.com/docs/en/targetprocess/tp-dev-hub/saas?topic=v1-appends-calculations

Targetprocess REST API V1 - Paging
  https://www.ibm.com/docs/en/targetprocess/tp-dev-hub/saas?topic=v1-paging

Targetprocess REST API V1 - Partial response (includes and excludes)
  https://www.ibm.com/docs/en/targetprocess/tp-dev-hub/saas?topic=v1-partial-response-includes-excludes
```
