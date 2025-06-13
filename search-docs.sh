#!/bin/bash

# Check for sqlite3
if ! command -v sqlite3 &> /dev/null; then
    echo "Error: sqlite3 is required but not installed."
    exit 1
fi

# Check if docs.db exists
if [ ! -f "docs.db" ]; then
    echo "Error: Search database 'docs.db' not found!"
    exit 1
fi

# Show usage
show_usage() {
    echo "Usage: ./search-docs.sh [OPTIONS] <search_term>"
    echo
    echo "Options:"
    echo "  -h, --help          Show this help message"
    echo "  -e, --exact         Exact phrase matching"
}

# Parse arguments
SEARCH_TERM=""
EXACT_MATCH=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_usage
            exit 0
            ;;
        -e|--exact)
            EXACT_MATCH=true
            shift
            ;;
        *)
            SEARCH_TERM="$1"
            shift
            ;;
    esac
done

if [ -z "$SEARCH_TERM" ]; then
    echo "Error: No search term provided"
    show_usage
    exit 1
fi

# Exact match formatting
if [ "$EXACT_MATCH" = true ]; then
    SEARCH_TERM="\"$SEARCH_TERM\""
fi

echo "Using search database: docs.db"
echo "----------------------------------------"
echo "Searching for: $SEARCH_TERM"
echo "----------------------------------------"

# Best match
best_match=$(sqlite3 -separator '|' docs.db "
SELECT title, url, snippet(docs, 3, '', '', '...', 200)
FROM docs
WHERE docs MATCH '$SEARCH_TERM'
ORDER BY rank
LIMIT 1;
")

if [ -n "$best_match" ]; then
    IFS='|' read -r title url snippet <<< "$best_match"
    # Only print the content (title and snippet), not the URL
    echo -e "\033[1m$title\033[0m"
    echo
    echo "$snippet"
    echo
else
    echo "No matching documents found."
    echo
fi

echo "----------------------------------------"
echo -e "\033[1mRelated documents:\033[0m"
echo

sqlite3 -separator '|' docs.db "
SELECT title
FROM docs
WHERE docs MATCH '$SEARCH_TERM'
ORDER BY rank
LIMIT 10;
" | while IFS='|' read -r title; do
    echo -e "\033[0;36m$title\033[0m"
    echo
done
