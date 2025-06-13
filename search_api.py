from fastapi import FastAPI, Query
from typing import List
import subprocess

app = FastAPI(
    title="Web Scraper/Search API",
    version="1.0.0",
    description="API to search docs.db using keywords."
)


@app.get("/search", summary="Search docs.db by keyword")
def search_docs(q: str, limit: int = 100, offset: int = 0, exact: bool = False):
    import sqlite3
    results = []
    try:
        conn = sqlite3.connect("docs.db")
        cursor = conn.cursor()
        search_term = f'"{q}"' if exact else q
        try:
            cursor.execute("""
                SELECT title, snippet(docs, 3, '', '', '...', 200)
                FROM docs
                WHERE docs MATCH ?
                ORDER BY rank
                LIMIT ? OFFSET ?
            """, (search_term, limit, offset))
        except sqlite3.OperationalError:
            cursor.execute("""
                SELECT title, substr(content, 1, 200)
                FROM docs
                WHERE content LIKE ?
                ORDER BY rowid
                LIMIT ? OFFSET ?
            """, (f"%{q}%", limit, offset))
        for row in cursor.fetchall():
            title, snippet = row
            results.append({"title": title, "snippet": snippet})
        conn.close()
    except Exception as e:
        return {"results": [], "error": str(e)}
    return {"results": results}

    # import sqlite3
    # results = []
    # try:
    #     conn = sqlite3.connect("docs.db")
    #     cursor = conn.cursor()
    #     # Try to use FTS5/FTS4 MATCH if available, otherwise fallback to LIKE
    #     try:
    #         cursor.execute("""
    #             SELECT title, snippet(docs, 3, '', '', '...', 200)
    #             FROM docs
    #             WHERE docs MATCH ?
    #             ORDER BY rank
    #             LIMIT 10
    #         """, (q,))
    #     except sqlite3.OperationalError:
    #         # Fallback to LIKE if MATCH is not supported
    #         cursor.execute("""
    #             SELECT title, substr(content, 1, 200)
    #             FROM docs
    #             WHERE content LIKE ?
    #             ORDER BY rowid
    #             LIMIT 10
    #         """, (f"%{q}%",))
    #     for row in cursor.fetchall():
    #         title, snippet = row
    #         results.append({"title": title, "snippet": snippet})
    #     conn.close()
    # except Exception as e:
    #     return {"results": [], "error": str(e)}
    # return {"results": results}