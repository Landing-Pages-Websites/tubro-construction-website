import kitchenPlanning from "./blog-content/kitchen-remodel-planning-checklist.json";
import bathroomPlanning from "./blog-content/bathroom-remodel-planning-guide.json";
import contractorSelection from "./blog-content/choosing-remodeling-contractor-washington.json";
import estimatePreparation from "./blog-content/preparing-for-remodel-estimate.json";
import cabinetStorage from "./blog-content/kitchen-cabinet-storage-planning.json";
import bathroomLighting from "./blog-content/bathroom-lighting-planning.json";
import exteriorPreparation from "./blog-content/exterior-painting-preparation.json";
import deckPlanning from "./blog-content/deck-remodel-planning.json";
import additionPlanning from "./blog-content/home-addition-planning-checklist.json";
import materialSelections from "./blog-content/remodeling-material-selection-checklist.json";
import livingDuringRemodel from "./blog-content/living-at-home-during-remodel.json";
import paintingWeather from "./blog-content/exterior-painting-weather-window.json";
import stainVersusPaint from "./blog-content/exterior-stain-vs-paint.json";

export type BlogSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category: string;
  image: string;
  imageAlt: string;
  publishedDate: string;
  sections: BlogSection[];
  sources: { title: string; url: string }[];
};

export const blogPosts: BlogPost[] = [
  estimatePreparation, cabinetStorage, bathroomLighting, exteriorPreparation,
  deckPlanning, additionPlanning, materialSelections, livingDuringRemodel,
  paintingWeather, stainVersusPaint, kitchenPlanning, bathroomPlanning, contractorSelection,
];

const RELATED_ARTICLE_COUNT = 3;

export function relatedBlogPosts(post: BlogPost): BlogPost[] {
  return blogPosts.filter((item) => item.slug !== post.slug)
    .sort((first, second) => Number(second.category === post.category) - Number(first.category === post.category))
    .slice(0, RELATED_ARTICLE_COUNT);
}
