import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const rootDir = path.resolve("src/content/blog");
const locales = ["en", "vi", "zh-cn"];
const allowedCategories = new Set([
  "Technical",
  "AI",
  "Product",
  "Experience",
  "Books",
  "Life",
]);

const categoryMap = {
  "ai-agent-start-with-workflow": ["AI", "Product"],
  "ai-companion-safe-memory": ["AI", "Product"],
  "ai-engineer-business-workflow": ["AI", "Product"],
  "airbnb-ranking-system-crm": ["Technical", "Product"],
  "api-design-crm-leads-deals": ["Technical", "Product"],
  "cicd-pipeline-ai-computer-vision": ["Technical", "AI"],
  "computer-vision-edge-device-mask-rcnn2go": ["Technical", "AI"],
  "database-on-call-burnout": ["Technical", "Experience"],
  "discord-crm-activity-log-history": ["Technical", "Product"],
  "discord-trillions-of-messages": ["Technical"],
  "evaluate-chatbot-ai-workflow": ["Technical", "AI"],
  "feed-ranking-feedback-loop": ["AI", "Product"],
  "good-models-vs-business-value": ["AI", "Product"],
  "lightsage-shopee-gnn-item-retrieval": ["Technical", "AI"],
  "mask-rcnn-to-mask-rcnn2go-production": ["Technical", "AI"],
  "microservice-architecture-scalable-ml": ["Technical", "AI"],
  "migrate-ai-evaluation-pipeline": ["Technical", "AI"],
  "ml-platform-uber-michelangelo": ["Technical", "AI"],
  "monitoring-ai-workflow-netflix": ["Technical", "AI"],
  "netflix-microservices-observability": ["Technical", "AI"],
  "netflix-ml-streaming-quality": ["Technical", "AI"],
  "onepiece-shopee-llm-reasoning-ranking": ["Technical", "AI", "Product"],
  "open-weight-model-review-process": ["AI", "Product"],
  "operate-what-you-build": ["Product", "Experience"],
  "optimizing-llm-reasoning": ["Technical", "AI"],
  "reading-new-llm-papers-trends": ["AI", "Books"],
  "recsysops-operating-recommender-systems": ["Technical", "AI"],
  "redis-cache-crm-dashboard": ["Technical", "Product"],
  "shopee-distributed-tracing-microservices": ["Technical"],
  "snow-ai-companion-safety": ["AI", "Product"],
  "tesla-camera-only-vs-sensor-fusion": ["Technical", "AI"],
  "tiktok-kafka-flink-realtime-recommendation": ["Technical", "AI"],
  "tiktok-style-architecture-feed-ranking-pattern": ["Technical", "AI"],
  "tiktok-style-recommendation-architecture": ["Technical", "AI"],
  "vision-object-detection-segmentation-production": ["Technical", "AI"],
  "websocket-dashboard-ai-agents": ["Technical", "AI"],
  "when-to-leave-mongodb-cassandra": ["Technical"],
};

function normalizeFile(filePath, categories) {
  const source = fs.readFileSync(filePath, "utf8");
  const parsed = matter(source);
  const currentTags = Array.isArray(parsed.data.tags) ? parsed.data.tags : [];
  const currentCategories = Array.isArray(parsed.data.categories)
    ? parsed.data.categories
    : [];

  const recoveredTags = [
    ...currentTags,
    ...currentCategories.filter(item => !allowedCategories.has(item)),
  ].filter((item, index, items) => items.indexOf(item) === index);

  const nextData = {
    title: parsed.data.title,
    description: parsed.data.description,
    pubDatetime: parsed.data.pubDatetime,
    locale: parsed.data.locale,
    author: parsed.data.author,
    tags: recoveredTags,
    categories,
    ...Object.fromEntries(
      Object.entries(parsed.data).filter(
        ([key]) =>
          ![
            "title",
            "description",
            "pubDatetime",
            "locale",
            "author",
            "tags",
            "categories",
          ].includes(key),
      ),
    ),
  };

  const updated = matter.stringify(parsed.content, nextData);
  if (updated === source) return false;
  fs.writeFileSync(filePath, updated, "utf8");
  return true;
}

let changed = 0;

for (const locale of locales) {
  const localeDir = path.join(rootDir, locale);
  for (const entry of fs.readdirSync(localeDir)) {
    if (!entry.endsWith(".md")) continue;
    const slug = entry.replace(/\.md$/, "");
    const categories = categoryMap[slug];
    if (!categories) {
      throw new Error(`Missing category mapping for slug: ${slug}`);
    }
    const filePath = path.join(localeDir, entry);
    if (normalizeFile(filePath, categories)) {
      changed += 1;
    }
  }
}

console.log(`Updated ${changed} blog files.`);
