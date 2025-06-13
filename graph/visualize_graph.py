from pyvis.network import Network
import json
import networkx as nx

# --- Load Data ---
with open('graph_titles.json', encoding='utf-8') as f:
    titles = json.load(f)

with open('graph_edges.json', encoding='utf-8') as f:
    toc_edges = json.load(f)


# --- Identify Gemini-Inferred Edges ---
toc_set = set((e["from"], e["to"]) for e in toc_edges)
# enriched_set = set((e["from"], e["to"]) for e in enriched_edges)
# gemini_only_edges = enriched_set - toc_set

# --- Build Graph ---
G = nx.DiGraph()
G.add_edges_from(toc_set)
nx.set_node_attributes(G, titles, name='title')

# --- Visualize with PyVis ---
net = Network(height="800px", width="100%", directed=True, notebook=False)
net.force_atlas_2based()  # For dynamic layout

# Add nodes
for node in G.nodes():
    title = G.nodes[node].get('title', '')
    net.add_node(
        node,
        label=title[:50] + '...' if len(title) > 50 else title,
        title=title,
        shape='dot',
        size=10,
        color="#1f78b4"
    )

# Add edges (color-coded)
for source, target in toc_set:
    net.add_edge(source, target, color='blue', dashes=False, title='TOC structure')

# Export
net.write_html("tp_graph.html", open_browser=True)
