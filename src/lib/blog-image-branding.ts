/**
 * Blog images that must not get the Tubro logo stamp (app/blog/BrandStamp.tsx):
 * photos that already carry a Tubro logo burned into their lower-right corner,
 * where a second badge would collide with it, and graphics that are not photos.
 */
const UNSTAMPED_BLOG_IMAGES = new Set([
  // Already branded with a Tubro logo in the lower-right corner.
  "/images/blog/legacy-0595fa6708d59cf5.jpg",
  "/images/blog/legacy-1ac0ad02f6396d10.jpg",
  "/images/blog/legacy-1b5775587033441c.jpg",
  "/images/blog/legacy-468bd559a8979185.jpg",
  "/images/blog/legacy-9ef2af83348918a5.jpg",
  "/images/blog/legacy-ab8e9d8d82103bef.jpg",
  "https://zleague-public-prod.s3.us-east-2.amazonaws.com/article_images/b002784f-9543-4362-8814-b7da19078f23/how-much-do-upper-kitchen-cabinets-weigh-766193.webp",
  // Blank decorative graphic and line icons, not photos.
  "/images/blog/legacy-23e50d70eadffc2b.png",
  "/images/blog/legacy-4bacecac1bc46d98.png",
  "/images/blog/legacy-aac0476b5a0fb6b9.png",
  "/images/blog/legacy-e24715d2ef123f0f.png",
]);

/** Whether a blog image should carry the lower-right Tubro logo stamp. */
export function takesBrandStamp(src: string): boolean {
  return Boolean(src) && !UNSTAMPED_BLOG_IMAGES.has(src);
}
