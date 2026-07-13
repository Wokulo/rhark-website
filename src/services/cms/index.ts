/**
 * CMS Service — Content abstraction layer.
 *
 * All components fetch content through this interface.
 * Currently returns static data from /src/data/.
 * Swap the implementation here when a headless CMS (Sanity/Contentful) is integrated —
 * zero changes required in any component.
 */

import type {
  DownloadAsset,
  Programme,
  Project,
  NewsArticle,
  Publication,
  RharkEvent,
  SuccessStory,
  TeamMember,
} from "@/types";

// These will be replaced with CMS API calls
import { programmesData } from "@/data/programmes";
import { projectsData } from "@/data/projects";
import { teamData } from "@/data/team";
import {
  downloadsData,
  eventsData,
  newsArticlesData,
  publicationsData,
  successStoriesData,
} from "@/data/content";

export async function getProgrammes(): Promise<Programme[]> {
  // Future: return await sanityClient.fetch(PROGRAMMES_QUERY);
  return programmesData;
}

export async function getProgrammeBySlug(slug: string): Promise<Programme | null> {
  return programmesData.find((p) => p.slug === slug) ?? null;
}

export async function getProjects(limit?: number): Promise<Project[]> {
  const data = projectsData;
  return limit ? data.slice(0, limit) : data;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return projectsData.find((p) => p.slug === slug) ?? null;
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  return teamData;
}

// ─── Stubs for future CMS content types ──────────────────────────────────────

export async function getNewsArticles(_limit?: number): Promise<NewsArticle[]> {
  return _limit ? newsArticlesData.slice(0, _limit) : newsArticlesData;
}

export async function getNewsArticleBySlug(_slug: string): Promise<NewsArticle | null> {
  return newsArticlesData.find((article) => article.slug === _slug) ?? null;
}

export async function getPublications(_limit?: number): Promise<Publication[]> {
  return _limit ? publicationsData.slice(0, _limit) : publicationsData;
}

export async function getEvents(_limit?: number): Promise<RharkEvent[]> {
  return _limit ? eventsData.slice(0, _limit) : eventsData;
}

export async function getSuccessStories(limit?: number): Promise<SuccessStory[]> {
  return limit ? successStoriesData.slice(0, limit) : successStoriesData;
}

export async function getSuccessStoryBySlug(slug: string): Promise<SuccessStory | null> {
  return successStoriesData.find((story) => story.slug === slug) ?? null;
}

export async function getDownloads(limit?: number): Promise<DownloadAsset[]> {
  return limit ? downloadsData.slice(0, limit) : downloadsData;
}
