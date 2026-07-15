import rss from "@astrojs/rss";
import { SITE } from "@/config";
import { getLocalizedPosts, getPostSlug } from "@/utils/content";

export async function GET() {
  const posts = await getLocalizedPosts("en");

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: SITE.website,
    items: posts.map((post) => ({
      link: `/posts/${getPostSlug(post.id)}`,
      title: post.data.title,
      description: post.data.description,
      pubDate: new Date(post.data.modDatetime ?? post.data.pubDatetime),
    })),
  });
}
