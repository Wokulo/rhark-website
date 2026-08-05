import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type EventRow = Database["public"]["Tables"]["events"]["Row"];

export interface Event {
  id: string;
  posterUrl: string | null;
  title: string;
  venue: string | null;
  eventDate: string;
  eventTime: string | null;
  description: string | null;
  registrationLink: string | null;
  googleMapUrl: string | null;
  capacity: number | null;
  status: "upcoming" | "ongoing" | "completed" | "archived";
  featuredImage: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

function mapEventRow(row: EventRow): Event {
  return {
    id: row.id,
    posterUrl: row.poster_url ?? null,
    title: row.title,
    venue: row.venue ?? null,
    eventDate: row.event_date,
    eventTime: row.event_time ?? null,
    description: row.description ?? null,
    registrationLink: row.registration_link ?? null,
    googleMapUrl: row.google_map_url ?? null,
    capacity: row.capacity ?? null,
    status: row.status as Event["status"],
    featuredImage: row.featured_image ?? null,
    tags: row.tags ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getEvents(limit?: number): Promise<Event[]> {
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error || !data) return [];
  return data.map(mapEventRow);
}

export async function getUpcomingEvents(limit?: number): Promise<Event[]> {
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("events")
    .select("*")
    .in("status", ["upcoming", "ongoing"])
    .order("event_date", { ascending: true });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error || !data) return [];
  return data.map(mapEventRow);
}

export async function getPastEvents(limit?: number): Promise<Event[]> {
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("events")
    .select("*")
    .in("status", ["completed", "archived"])
    .order("event_date", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error || !data) return [];
  return data.map(mapEventRow);
}

export async function getEventById(id: string): Promise<Event | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return mapEventRow(data);
}

export async function createEvent(input: {
  title: string;
  venue?: string;
  description?: string;
  eventDate: string;
  eventTime?: string;
  posterUrl?: string;
  registrationLink?: string;
  googleMapUrl?: string;
  capacity?: number;
  featuredImage?: string;
  tags?: string[];
}): Promise<Event> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("events")
    .insert({
      title: input.title,
      venue: input.venue ?? null,
      description: input.description ?? null,
      event_date: input.eventDate,
      event_time: input.eventTime ?? null,
      poster_url: input.posterUrl ?? null,
      registration_link: input.registrationLink ?? null,
      google_map_url: input.googleMapUrl ?? null,
      capacity: input.capacity ?? null,
      featured_image: input.featuredImage ?? null,
      tags: input.tags ?? [],
      status: "upcoming",
    })
    .select()
    .single();

  if (error || !data) throw error;
  return mapEventRow(data);
}

export async function updateEvent(
  id: string,
  input: Partial<{
    title: string;
    venue: string;
    description: string;
    eventDate: string;
    eventTime: string;
    posterUrl: string;
    registrationLink: string;
    googleMapUrl: string;
    capacity: number;
    featuredImage: string;
    tags: string[];
    status: "upcoming" | "ongoing" | "completed" | "archived";
  }>
): Promise<Event> {
  const supabase = await createServerSupabaseClient();

  const updateData: Record<string, unknown> = {};
  if (input.title !== undefined) updateData.title = input.title;
  if (input.venue !== undefined) updateData.venue = input.venue;
  if (input.description !== undefined) updateData.description = input.description;
  if (input.eventDate !== undefined) updateData.event_date = input.eventDate;
  if (input.eventTime !== undefined) updateData.event_time = input.eventTime;
  if (input.posterUrl !== undefined) updateData.poster_url = input.posterUrl;
  if (input.registrationLink !== undefined) updateData.registration_link = input.registrationLink;
  if (input.googleMapUrl !== undefined) updateData.google_map_url = input.googleMapUrl;
  if (input.capacity !== undefined) updateData.capacity = input.capacity;
  if (input.featuredImage !== undefined) updateData.featured_image = input.featuredImage;
  if (input.tags !== undefined) updateData.tags = input.tags;
  if (input.status !== undefined) updateData.status = input.status;

  const { data, error } = await supabase
    .from("events")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error || !data) throw error;
  return mapEventRow(data);
}

export async function deleteEvent(id: string): Promise<void> {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function archiveEvent(id: string): Promise<Event> {
  return updateEvent(id, { status: "archived" });
}

export async function completeEvent(id: string): Promise<Event> {
  return updateEvent(id, { status: "completed" });
}