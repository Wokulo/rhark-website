import type {
  DownloadAsset,
  NewsArticle,
  Publication,
  RharkEvent,
  SuccessStory,
} from "@/types";

export const newsArticlesData: NewsArticle[] = [];

export const eventsData: RharkEvent[] = [];

export const publicationsData: Publication[] = [];

export const successStoriesData: SuccessStory[] = [
  {
    id: "1",
    slug: "youth-peer-educators-in-siaya",
    title: "Youth peer educators creating safer conversations",
    excerpt:
      "Placeholder story showing how trained youth champions can improve SRHR awareness and service referrals.",
    content:
      "This placeholder success story is ready to be replaced with a verified RHARK beneficiary story when approved content is available.",
    programmeId: "1",
    publishedAt: "2026-07-08",
    image: {
      src: "/images/stories/youth-peer-educators.jpg",
      alt: "Youth peer educators participating in a community session",
    },
    tags: ["Youth", "SRHR", "Peer Education"],
    isFeatured: true,
  },
];

export const downloadsData: DownloadAsset[] = [
  {
    id: "1",
    slug: "rhark-organization-profile",
    title: "RHARK Organization Profile",
    description:
      "Placeholder download entry for RHARK's organization profile, ready for the final PDF file.",
    type: "media-kit",
    fileUrl: "/downloads/rhark-organization-profile.pdf",
    fileSizeKb: 0,
    publishedAt: "2026-07-08",
    tags: ["Profile", "Media Kit"],
  },
];
