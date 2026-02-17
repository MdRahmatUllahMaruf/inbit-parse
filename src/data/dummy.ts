export interface Document {
  id: string;
  title: string;
  type: "pdf" | "image_set";
  status: "uploaded" | "parsing" | "parsed" | "entities_ready" | "failed";
  pages: PageData[];
  createdAt: string;
  updatedAt: string;
}

export interface PageData {
  pageNumber: number;
}

export interface MarkdownBlock {
  blockId: string;
  markdown: string;
  confidence: number;
  sourceRef: {
    page: number;
    bbox: [number, number, number, number];
    type: "text_block" | "table_region" | "image_region";
  };
}

export interface ExtractedTable {
  tableId: string;
  page: number;
  bbox: [number, number, number, number];
  asMarkdown: string;
  gridData: { columns: string[]; rows: string[][] };
  confidence: number;
}

export interface ExtractedImage {
  imageId: string;
  page: number;
  bbox: [number, number, number, number];
  thumbnailColor: string;
  llmExplanation: string;
  tags: string[];
}

export interface Entity {
  entityId: string;
  type: string;
  value: string;
  confidence: number;
  evidence: { blockId: string; page: number; snippet: string };
  status: "accepted" | "rejected" | "pending";
}

export interface ChatMessage {
  messageId: string;
  role: "user" | "assistant";
  content: string;
  citations?: { blockId: string; page: number; label: string }[];
}

export const documents: Document[] = [
  {
    id: "doc-1",
    title: "Q3 2024 Financial Report — Acme Corp",
    type: "pdf",
    status: "parsed",
    pages: [{ pageNumber: 1 }, { pageNumber: 2 }, { pageNumber: 3 }, { pageNumber: 4 }],
    createdAt: "2024-10-15",
    updatedAt: "2024-10-16",
  },
  {
    id: "doc-2",
    title: "NDA Agreement — Globex Industries",
    type: "pdf",
    status: "entities_ready",
    pages: [{ pageNumber: 1 }, { pageNumber: 2 }],
    createdAt: "2024-10-10",
    updatedAt: "2024-10-12",
  },
  {
    id: "doc-3",
    title: "Product Specification v2.1",
    type: "pdf",
    status: "parsing",
    pages: [{ pageNumber: 1 }, { pageNumber: 2 }, { pageNumber: 3 }],
    createdAt: "2024-10-18",
    updatedAt: "2024-10-18",
  },
  {
    id: "doc-4",
    title: "Invoice Scans — October Batch",
    type: "image_set",
    status: "uploaded",
    pages: [{ pageNumber: 1 }, { pageNumber: 2 }, { pageNumber: 3 }, { pageNumber: 4 }, { pageNumber: 5 }],
    createdAt: "2024-10-19",
    updatedAt: "2024-10-19",
  },
  {
    id: "doc-5",
    title: "Board Meeting Minutes — Sep 2024",
    type: "pdf",
    status: "failed",
    pages: [{ pageNumber: 1 }],
    createdAt: "2024-10-05",
    updatedAt: "2024-10-05",
  },
];

export const markdownBlocks: MarkdownBlock[] = [
  {
    blockId: "block-1",
    markdown: "# Q3 2024 Financial Report",
    confidence: 0.98,
    sourceRef: { page: 1, bbox: [10, 5, 80, 8], type: "text_block" },
  },
  {
    blockId: "block-2",
    markdown:
      "This report presents the consolidated financial results for Acme Corporation for the third quarter ending September 30, 2024. Overall performance exceeded market expectations with revenue growth of 12% year-over-year.",
    confidence: 0.94,
    sourceRef: { page: 1, bbox: [10, 16, 80, 18], type: "text_block" },
  },
  {
    blockId: "block-3",
    markdown: "## Revenue Overview",
    confidence: 0.97,
    sourceRef: { page: 1, bbox: [10, 40, 50, 6], type: "text_block" },
  },
  {
    blockId: "block-4",
    markdown:
      "Total revenue for Q3 2024 reached **$142.5 million**, up from $127.2 million in Q3 2023. The Enterprise Solutions segment contributed $89.3 million, while Consumer Products generated $53.2 million. APAC expansion drove 34% of new revenue.",
    confidence: 0.91,
    sourceRef: { page: 2, bbox: [10, 5, 80, 22], type: "text_block" },
  },
  {
    blockId: "block-5",
    markdown:
      "| Segment | Q3 2024 | Q3 2023 | Change |\n|---------|---------|---------|--------|\n| Enterprise Solutions | $89.3M | $78.1M | +14.3% |\n| Consumer Products | $53.2M | $49.1M | +8.4% |",
    confidence: 0.88,
    sourceRef: { page: 2, bbox: [10, 32, 80, 25], type: "table_region" },
  },
  {
    blockId: "block-6",
    markdown: "## Key Performance Indicators",
    confidence: 0.96,
    sourceRef: { page: 3, bbox: [10, 5, 55, 6], type: "text_block" },
  },
  {
    blockId: "block-7",
    markdown:
      "Customer retention rate improved to **94.2%** from 91.8% in the prior quarter. Monthly active users grew to 2.1 million, with average session duration increasing by 18%. Net Promoter Score reached an all-time high of 72.",
    confidence: 0.89,
    sourceRef: { page: 3, bbox: [10, 14, 80, 28], type: "text_block" },
  },
  {
    blockId: "block-8",
    markdown: "## Risk Factors",
    confidence: 0.95,
    sourceRef: { page: 4, bbox: [10, 5, 40, 6], type: "text_block" },
  },
  {
    blockId: "block-9",
    markdown:
      "The company faces several material risks including market volatility affecting currency exchange rates, evolving regulatory requirements in EU data protection (GDPR amendments), potential supply chain disruptions in semiconductor procurement, and competitive pressure from emerging market players with lower cost structures.",
    confidence: 0.87,
    sourceRef: { page: 4, bbox: [10, 14, 80, 32], type: "text_block" },
  },
];

export const extractedTables: ExtractedTable[] = [
  {
    tableId: "table-1",
    page: 2,
    bbox: [10, 32, 80, 25],
    asMarkdown:
      "| Segment | Q3 2024 | Q3 2023 | Change |\n|---------|---------|---------|--------|\n| Enterprise Solutions | $89.3M | $78.1M | +14.3% |\n| Consumer Products | $53.2M | $49.1M | +8.4% |",
    gridData: {
      columns: ["Segment", "Q3 2024", "Q3 2023", "Change"],
      rows: [
        ["Enterprise Solutions", "$89.3M", "$78.1M", "+14.3%"],
        ["Consumer Products", "$53.2M", "$49.1M", "+8.4%"],
      ],
    },
    confidence: 0.92,
  },
  {
    tableId: "table-2",
    page: 3,
    bbox: [10, 48, 80, 22],
    asMarkdown:
      "| KPI | Q3 2024 | Q2 2024 | Trend |\n|-----|---------|---------|-------|\n| Retention Rate | 94.2% | 91.8% | ↑ |\n| MAU | 2.1M | 1.9M | ↑ |\n| NPS | 72 | 68 | ↑ |",
    gridData: {
      columns: ["KPI", "Q3 2024", "Q2 2024", "Trend"],
      rows: [
        ["Retention Rate", "94.2%", "91.8%", "↑"],
        ["MAU", "2.1M", "1.9M", "↑"],
        ["NPS", "72", "68", "↑"],
      ],
    },
    confidence: 0.9,
  },
];

export const extractedImages: ExtractedImage[] = [
  {
    imageId: "image-1",
    page: 2,
    bbox: [15, 65, 70, 28],
    thumbnailColor: "hsl(172 30% 90%)",
    llmExplanation:
      "Bar chart comparing Q3 2024 vs Q3 2023 revenue across Enterprise Solutions and Consumer Products segments. Enterprise shows stronger growth trajectory.",
    tags: ["chart", "bar-graph", "revenue"],
  },
  {
    imageId: "image-2",
    page: 4,
    bbox: [20, 52, 60, 38],
    thumbnailColor: "hsl(220 20% 90%)",
    llmExplanation:
      "Market positioning quadrant diagram showing Acme Corp in the 'Leaders' quadrant, with competitors plotted across Innovation and Market Share axes.",
    tags: ["diagram", "quadrant", "competitive-analysis"],
  },
];

export const dummyEntities: Entity[] = [
  {
    entityId: "ent-1",
    type: "Organization",
    value: "Acme Corporation",
    confidence: 0.97,
    evidence: { blockId: "block-2", page: 1, snippet: "consolidated financial results for Acme Corporation" },
    status: "pending",
  },
  {
    entityId: "ent-2",
    type: "Amount",
    value: "$142.5 million",
    confidence: 0.95,
    evidence: { blockId: "block-4", page: 2, snippet: "Total revenue for Q3 2024 reached $142.5 million" },
    status: "pending",
  },
  {
    entityId: "ent-3",
    type: "Date",
    value: "Q3 2024 (Sep 30, 2024)",
    confidence: 0.98,
    evidence: { blockId: "block-2", page: 1, snippet: "third quarter ending September 30, 2024" },
    status: "pending",
  },
  {
    entityId: "ent-4",
    type: "Amount",
    value: "$89.3 million",
    confidence: 0.93,
    evidence: { blockId: "block-4", page: 2, snippet: "Enterprise Solutions segment contributed $89.3 million" },
    status: "pending",
  },
  {
    entityId: "ent-5",
    type: "Metric",
    value: "94.2% retention rate",
    confidence: 0.88,
    evidence: { blockId: "block-7", page: 3, snippet: "Customer retention rate improved to 94.2%" },
    status: "pending",
  },
  {
    entityId: "ent-6",
    type: "Location",
    value: "APAC",
    confidence: 0.82,
    evidence: { blockId: "block-4", page: 2, snippet: "APAC expansion drove 34% of new revenue" },
    status: "pending",
  },
];

export const dummyChatMessages: ChatMessage[] = [];
