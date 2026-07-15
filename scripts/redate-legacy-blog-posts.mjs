import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const locales = ["en", "vi", "zh-cn"];
const baseDir = path.resolve("src/content/blog");

const slugToDate = {
  "ml-platform-uber-michelangelo": "2022-02-17T00:00:00.000Z",
  "airbnb-ranking-system-crm": "2022-03-08T00:00:00.000Z",
  "netflix-microservices-observability": "2022-03-24T00:00:00.000Z",
  "netflix-ml-streaming-quality": "2022-04-12T00:00:00.000Z",
  "discord-trillions-of-messages": "2022-05-03T00:00:00.000Z",
  "when-to-leave-mongodb-cassandra": "2022-05-26T00:00:00.000Z",
  "shopee-distributed-tracing-microservices": "2022-06-14T00:00:00.000Z",
  "lightsage-shopee-gnn-item-retrieval": "2022-07-07T00:00:00.000Z",
  "tiktok-style-recommendation-architecture": "2022-07-28T00:00:00.000Z",
  "tiktok-style-architecture-feed-ranking-pattern": "2022-08-16T00:00:00.000Z",
  "tiktok-kafka-flink-realtime-recommendation": "2022-09-06T00:00:00.000Z",
  "tesla-camera-only-vs-sensor-fusion": "2022-10-11T00:00:00.000Z",
  "feed-ranking-feedback-loop": "2022-11-03T00:00:00.000Z",
  "microservice-architecture-scalable-ml": "2022-12-01T00:00:00.000Z",

  "computer-vision-edge-device-mask-rcnn2go": "2023-01-17T00:00:00.000Z",
  "mask-rcnn-to-mask-rcnn2go-production": "2023-02-09T00:00:00.000Z",
  "vision-object-detection-segmentation-production": "2023-03-02T00:00:00.000Z",
  "cicd-pipeline-ai-computer-vision": "2023-03-23T00:00:00.000Z",
  "database-on-call-burnout": "2023-04-18T00:00:00.000Z",
  "discord-crm-activity-log-history": "2023-05-11T00:00:00.000Z",
  "monitoring-ai-workflow-netflix": "2023-06-08T00:00:00.000Z",
  "recsysops-operating-recommender-systems": "2023-07-13T00:00:00.000Z",
  "redis-cache-crm-dashboard": "2023-08-03T00:00:00.000Z",
  "api-design-crm-leads-deals": "2023-09-14T00:00:00.000Z",
  "evaluate-chatbot-ai-workflow": "2023-10-05T00:00:00.000Z",
  "migrate-ai-evaluation-pipeline": "2023-11-16T00:00:00.000Z",
  "websocket-dashboard-ai-agents": "2023-12-07T00:00:00.000Z",

  "onepiece-shopee-llm-reasoning-ranking": "2024-01-18T00:00:00.000Z",

  "operate-what-you-build": "2024-03-14T00:00:00.000Z",
  "good-models-vs-business-value": "2024-04-11T00:00:00.000Z",
  "optimizing-llm-reasoning": "2024-10-08T00:00:00.000Z",
  "reading-new-llm-papers-trends": "2024-11-21T00:00:00.000Z",

  "open-weight-model-review-process": "2025-02-06T00:00:00.000Z",
  "ai-engineer-business-workflow": "2025-04-17T00:00:00.000Z",
  "ai-agent-start-with-workflow": "2025-05-08T00:00:00.000Z",
};

let changed = 0;

for (const locale of locales) {
  const localeDir = path.join(baseDir, locale);
  for (const fileName of fs.readdirSync(localeDir)) {
    if (!fileName.endsWith(".md")) continue;

    const slug = fileName.replace(/\.md$/, "");
    const nextDate = slugToDate[slug];
    if (!nextDate) continue;

    const filePath = path.join(localeDir, fileName);
    const source = fs.readFileSync(filePath, "utf8");
    const parsed = matter(source);

    if (parsed.data.pubDatetime === nextDate) continue;

    parsed.data.pubDatetime = nextDate;
    fs.writeFileSync(filePath, matter.stringify(parsed.content, parsed.data), "utf8");
    changed += 1;
  }
}

console.log(`Updated ${changed} localized blog files.`);
