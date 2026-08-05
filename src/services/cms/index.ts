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
import { programsData } from "@/data/programmes";
import { projectsData } from "@/data/projects";
import { teamData } from "@/data/team";
import {
  downloadsData,
  eventsData,
  newsArticlesData,
  publicationsData,
  successStoriesData,
} from "@/data/content";
import { getHomepageContent } from "@/services/homepage";
import { getNewsArticles, getNewsArticleBySlug, createNewsArticle, updateNewsArticle, deleteNewsArticle, toggleNewsStatus } from "@/services/news";
import { getEvents, getUpcomingEvents, getPastEvents, createEvent, updateEvent, deleteEvent, archiveEvent, completeEvent } from "@/services/events";
import { getGalleryItems, getGalleryItemById, getFeaturedGalleryItems, getGalleryItemsByAlbum, createGalleryItem, updateGalleryItem, deleteGalleryItem, toggleGalleryFeatured, reorderGalleryItems } from "@/services/gallery";
import { getPartners, getActivePartners, getFeaturedPartners, getPartnerBySlug, getPartnerById, createPartner, updatePartner, deletePartner, togglePartnerActive, togglePartnerFeatured, reorderPartners } from "@/services/partners";
import { getPublications, getActivePublications, getPublicationsByType, getPublicationBySlug, getPublicationById, createPublication, updatePublication, deletePublication, archivePublication, restorePublication, togglePublicationArchive, reorderPublications } from "@/services/publications";

export async function getProgrammes(): Promise<Programme[]> {
  // Future: return await sanityClient.fetch(PROGRAMMES_QUERY);
  return programsData;
}

export async function getProgrammeBySlug(slug: string): Promise<Programme | null> {
  return programsData.find((p) => p.slug === slug) ?? null;
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

export async function getNewsArticles(limit?: number): Promise<NewsArticle[]> {
  return limit ? newsArticlesData.slice(0, limit) : newsArticlesData;
}

export async function getNewsArticleBySlug(_slug: string): Promise<NewsArticle | null> {
  return newsArticlesData.find((article) => article.slug === _slug) ?? null;
}

export async function getPublications(limit?: number): Promise<Publication[]> {
  return limit ? publicationsData.slice(0, limit) : publicationsData;
}

export async function getEvents(limit?: number): Promise<RharkEvent[]> {
  return limit ? eventsData.slice(0, limit) : eventsData;
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

export async function getHomepage(): Promise<Awaited<ReturnType<typeof getHomepageContent>>> {
  return getHomepageContent();
}

// ─── News CMS ────────────────────────────────────────────────────────────────

export { getNewsArticles as getNewsFromCMS, getNewsArticleBySlug as getNewsArticleBySlugFromCMS, createNewsArticle, updateNewsArticle, deleteNewsArticle, toggleNewsStatus };

// ─── Events CMS ──────────────────────────────────────────────────────────────

export { getEvents as getEventsFromCMS, getUpcomingEvents, getPastEvents, createEvent, updateEvent, deleteEvent, archiveEvent, completeEvent };

// ─── Gallery CMS ──────────────────────────────────────────────────────────────

export { getGalleryItems, getGalleryItemById, getFeaturedGalleryItems, getGalleryItemsByAlbum, createGalleryItem, updateGalleryItem, deleteGalleryItem, toggleGalleryFeatured, reorderGalleryItems };

// ─── Partners CMS ──────────────────────────────────────────────────────────────

export { getPartners, getActivePartners, getFeaturedPartners, getPartnerBySlug, getPartnerById, createPartner, updatePartner, deletePartner, togglePartnerActive, togglePartnerFeatured, reorderPartners };

// ─── Publications CMS ──────────────────────────────────────────────────────────

export { getPublications, getActivePublications, getPublicationsByType, getPublicationBySlug, getPublicationById, createPublication, updatePublication, deletePublication, archivePublication, restorePublication, togglePublicationArchive, reorderPublications };