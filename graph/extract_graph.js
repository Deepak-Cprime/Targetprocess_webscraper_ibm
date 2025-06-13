import fs from 'fs';

const path = require('path');
const sidebar = JSON.parse(fs.readFileSync('sidebar_links_nested.json', 'utf8'));

function extractLinks(nodes, parent = null, edges = [], titles = {}) {
  for (const node of nodes) {
    titles[node.href] = node.title;
    if (parent) edges.push({ from: parent.href, to: node.href });
    if (node.subLinks) extractLinks(node.subLinks, node, edges, titles);
  }
  return { edges, titles };
}

const { edges, titles } = extractLinks(sidebar);
fs.writeFileSync('graph_edges.json', JSON.stringify(edges, null, 2));
fs.writeFileSync('graph_titles.json', JSON.stringify(titles, null, 2));
console.log('✅ Extracted graph_edges.json and graph_titles.json');
