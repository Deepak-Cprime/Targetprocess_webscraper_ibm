# Targetprocess IBM Docs Web Scraper

This project automates the scraping and searching of IBM Targetprocess Developer Hub documentation. It extracts hierarchical documentation from the [IBM Targetprocess Docs](https://www.ibm.com/docs/en/targetprocess/tp-dev-hub/saas), converts HTML content to Markdown, stores it locally, and builds a searchable SQLite database to query document content using full-text search.

---

## 🔍 Use Case

This scraper is designed to:
- Extract the structure and content from the Targetprocess documentation on IBM's site.
- Convert the scraped content to Markdown for offline readability.
- Build a full-text search index using SQLite for easy and quick querying.
- Provide a shell-based utility to query docs via CLI.
- Offer a FastAPI-based search API for programmatic access.

---


## 📁 Project Structure

```
deepak-cprime-targetprocess_webscraper_ibm/
├── README.md
├── docs.db # SQLite FTS5 database containing indexed documentation content
├── requirements.txt # Python dependencies for the search API
├── search-docs.sh # CLI tool for querying the SQLite FTS documentation DB
├── search_api.py # FastAPI-based search API
├── sidebar.js # Scrapes the sidebar navigation structure with titles and URLs
├── sidebar_links_nested.json # Stores the structured sidebar hierarchy (main + sub-links)
├── web_scraper.js # Scrapes individual pages and saves them as Markdown + DB
└── graph/ # Documentation relationship visualization
    ├── extract_graph.js # Extracts document relationships
    ├── graph_edges.json # Document relationship edges
    ├── graph_titles.json # Document titles mapping
    ├── tp_graph.html # Interactive graph visualization
    └── visualize_graph.py # Python script for graph visualization
```

---


## 📦 Required Libraries & Packages



### 🐍 Python Packages

Install via `pip install`:
```bash
pip install -r requirements.txt
```

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
- python (>= 3.7 recommended)

---

### 🛠 Setup Instructions
Clone the repository
```
git clone https://github.com/your-username/deepak-cprime-targetprocess_webscraper_ibm.git
cd deepak-cprime-targetprocess_webscraper_ibm
```
Install Python dependencies
```
pip install -r requirements.txt
```
Install Node.js dependencies
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
Start the search API 
```
uvicorn search_api:app --reload
```
---
## 🧾 Output
The following are generated on execution:
- **docs/**: Markdown files for each documentation page.
- **docs.db**: SQLite database with FTS5 index of the documentation.
- **sidebar_links_nested.json**: Hierarchical structure of the documentation.
- **graph/**: Visualization files showing document relationships.
---
## 🗝️ API Search
```
curl "http://localhost:8000/search?q=api&limit=10"
```
### Search Parameters
- `q`: Search query (required)
- `limit`: Number of results (default: 100)
- `offset`: Results offset (default: 0)
- `exact`: Exact phrase matching (default: false)
---
## 💡Example
```
$ ./search-docs.sh Automation
Using search database: docs.db
----------------------------------------
Searching for: Automation
----------------------------------------
Setting up Automation Rules - Automation Rules Overview

![GitHub](https://unpkg.com/simple-icons@v3/icons/github.svg)Contribute in GitHub: [Edit online](https://github.ibm.com/IBMPrivateCloud/apptio-docs/edit/main/source/content/targetprocess/dev-hub/automation-rules-overview.md)

----------------------------------------
Related documents:

Setting up Automation Rules - Automation Rules Overview

Import and Export data - Automation Rules for import and export

Setting up Automation Rules - Diagnostic and troubleshooting

Setting up Automation Rules - Setup - How to apply Raw JSON from Examples

Setting up Automation Rules - Diagnostic and troubleshooting - Automation Rule Logs

Setting up Automation Rules - Examples: Actions in Targetprocess - Create a Related Bug for new Requests

Setting up Automation Rules - Examples: Actions in Targetprocess - Create Bug and attach to User Story from incoming webhook

Setting up Automation Rules - Examples: Working with custom fields - Set custom field in UI action

Setting up Automation Rules - Diagnostic and troubleshooting - Limits and Timeouts

Setting up Automation Rules - Reusable automation rules via Named Triggers
```
