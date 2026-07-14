/**
 * In-memory data store for RHARK communication and donation system.
 *
 * In production, replace this with a real database (PostgreSQL via Prisma,
 * MongoDB, or Supabase). This store provides the same interface so the
 * rest of the code doesn't need to change.
 *
 * Each entity is stored as a Map<string, T> keyed by UUID.
 */

import type {
  ContactRequest,
  Donation,
  EmailMessage,
  CommunicationThread,
  Notification,
  AdminUser,
  DashboardStats,
  DonationFilter,
  ContactFilter,
  PaginatedResponse,
} from "@/types";

// ─── UUID generator (crypto.randomUUID is available in modern runtimes) ────────

function uuid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older environments
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ─── Store class ──────────────────────────────────────────────────────────────

class Store {
  private contacts: Map<string, ContactRequest> = new Map();
  private donations: Map<string, Donation> = new Map();
  private emails: Map<string, EmailMessage> = new Map();
  private threads: Map<string, CommunicationThread> = new Map();
  private notifications: Map<string, Notification> = new Map();
  private adminUsers: Map<string, AdminUser> = new Map();

  constructor() {
    // Seed a default admin user
    const adminId = uuid();
    this.adminUsers.set(adminId, {
      id: adminId,
      email: "admin@rhark.org",
      name: "RHARK Admin",
      role: "superadmin",
      createdAt: new Date().toISOString(),
    });
  }

  // ─── Contacts ────────────────────────────────────────────────────────────────

  createContact(data: Omit<ContactRequest, "id" | "createdAt" | "updatedAt" | "emailHistory">): ContactRequest {
    const id = uuid();
    const now = new Date().toISOString();
    const contact: ContactRequest = {
      ...data,
      id,
      emailHistory: [],
      createdAt: now,
      updatedAt: now,
    };
    this.contacts.set(id, contact);
    return contact;
  }

  getContact(id: string): ContactRequest | undefined {
    return this.contacts.get(id);
  }

  updateContact(id: string, data: Partial<ContactRequest>): ContactRequest | undefined {
    const contact = this.contacts.get(id);
    if (!contact) return undefined;
    const updated = { ...contact, ...data, updatedAt: new Date().toISOString() };
    this.contacts.set(id, updated);
    return updated;
  }

  listContacts(filter?: ContactFilter): PaginatedResponse<ContactRequest> {
    let items = Array.from(this.contacts.values());
    const page = filter?.page ?? 1;
    const pageSize = filter?.pageSize ?? 20;

    if (filter?.status) {
      items = items.filter((c) => c.status === filter.status);
    }
    if (filter?.inquiryType) {
      items = items.filter((c) => c.inquiryType === filter.inquiryType);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      items = items.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.subject.toLowerCase().includes(q) ||
          c.message.toLowerCase().includes(q)
      );
    }
    if (filter?.startDate) {
      items = items.filter((c) => c.createdAt >= filter.startDate!);
    }
    if (filter?.endDate) {
      items = items.filter((c) => c.createdAt <= filter.endDate!);
    }

    // Sort
    const sortBy = filter?.sortBy ?? "createdAt";
    const sortOrder = filter?.sortOrder ?? "desc";
    items.sort((a, b) => {
      const aVal = a[sortBy as keyof ContactRequest] as string;
      const bVal = b[sortBy as keyof ContactRequest] as string;
      return sortOrder === "desc" ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
    });

    const total = items.length;
    const start = (page - 1) * pageSize;
    const paged = items.slice(start, start + pageSize);

    return { success: true, data: paged, total, page, pageSize };
  }

  // ─── Donations ───────────────────────────────────────────────────────────────

  createDonation(data: Omit<Donation, "id" | "createdAt" | "updatedAt" | "emailHistory">): Donation {
    const id = uuid();
    const now = new Date().toISOString();
    const donation: Donation = {
      ...data,
      id,
      emailHistory: [],
      createdAt: now,
      updatedAt: now,
    };
    this.donations.set(id, donation);
    return donation;
  }

  getDonation(id: string): Donation | undefined {
    return this.donations.get(id);
  }

  getDonationByTransactionId(transactionId: string): Donation | undefined {
    return Array.from(this.donations.values()).find((d) => d.transactionId === transactionId);
  }

  getDonationByCheckoutRequestId(checkoutRequestId: string): Donation | undefined {
    return Array.from(this.donations.values()).find(
      (d) => d.mpesaCheckoutRequestId === checkoutRequestId
    );
  }

  updateDonation(id: string, data: Partial<Donation>): Donation | undefined {
    const donation = this.donations.get(id);
    if (!donation) return undefined;
    const updated = { ...donation, ...data, updatedAt: new Date().toISOString() };
    this.donations.set(id, updated);
    return updated;
  }

  listDonations(filter?: DonationFilter): PaginatedResponse<Donation> {
    let items = Array.from(this.donations.values());
    const page = filter?.page ?? 1;
    const pageSize = filter?.pageSize ?? 20;

    if (filter?.status) {
      items = items.filter((d) => d.status === filter.status);
    }
    if (filter?.paymentMethod) {
      items = items.filter((d) => d.paymentMethod === filter.paymentMethod);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      items = items.filter(
        (d) =>
          d.donorName.toLowerCase().includes(q) ||
          d.email.toLowerCase().includes(q) ||
          d.transactionId.toLowerCase().includes(q)
      );
    }
    if (filter?.startDate) {
      items = items.filter((d) => d.createdAt >= filter.startDate!);
    }
    if (filter?.endDate) {
      items = items.filter((d) => d.createdAt <= filter.endDate!);
    }

    const sortBy = filter?.sortBy ?? "createdAt";
    const sortOrder = filter?.sortOrder ?? "desc";
    items.sort((a, b) => {
      if (sortBy === "amount") {
        return sortOrder === "desc" ? b.amount - a.amount : a.amount - b.amount;
      }
      const aVal = a[sortBy as keyof Donation] as string;
      const bVal = b[sortBy as keyof Donation] as string;
      return sortOrder === "desc" ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
    });

    const total = items.length;
    const start = (page - 1) * pageSize;
    const paged = items.slice(start, start + pageSize);

    return { success: true, data: paged, total, page, pageSize };
  }

  // ─── Emails ──────────────────────────────────────────────────────────────────

  createEmail(data: Omit<EmailMessage, "id" | "createdAt">): EmailMessage {
    const id = uuid();
    const now = new Date().toISOString();
    const email: EmailMessage = { ...data, id, createdAt: now };
    this.emails.set(id, email);
    return email;
  }

  updateEmail(id: string, data: Partial<EmailMessage>): EmailMessage | undefined {
    const email = this.emails.get(id);
    if (!email) return undefined;
    const updated = { ...email, ...data };
    this.emails.set(id, updated);
    return updated;
  }

  getEmail(id: string): EmailMessage | undefined {
    return this.emails.get(id);
  }

  listEmails(page = 1, pageSize = 50): PaginatedResponse<EmailMessage> {
    const items = Array.from(this.emails.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const total = items.length;
    const start = (page - 1) * pageSize;
    const paged = items.slice(start, start + pageSize);
    return { success: true, data: paged, total, page, pageSize };
  }

  // ─── Communication Threads ───────────────────────────────────────────────────

  createThread(data: Omit<CommunicationThread, "id" | "createdAt" | "updatedAt">): CommunicationThread {
    const id = uuid();
    const now = new Date().toISOString();
    const thread: CommunicationThread = { ...data, id, createdAt: now, updatedAt: now };
    this.threads.set(id, thread);
    return thread;
  }

  getThreadByContactId(contactRequestId: string): CommunicationThread | undefined {
    return Array.from(this.threads.values()).find(
      (t) => t.contactRequestId === contactRequestId
    );
  }

  addMessageToThread(
    contactRequestId: string,
    message: { from: "user" | "admin"; content: string }
  ): CommunicationThread | undefined {
    let thread = this.getThreadByContactId(contactRequestId);
    if (!thread) {
      thread = this.createThread({ contactRequestId, messages: [] });
    }
    thread.messages.push({ ...message, createdAt: new Date().toISOString() });
    thread.updatedAt = new Date().toISOString();
    this.threads.set(thread.id, thread);
    return thread;
  }

  // ─── Notifications ───────────────────────────────────────────────────────────

  createNotification(data: Omit<Notification, "id" | "createdAt">): Notification {
    const id = uuid();
    const notification: Notification = { ...data, id, createdAt: new Date().toISOString() };
    this.notifications.set(id, notification);
    return notification;
  }

  listNotifications(limit = 20): Notification[] {
    return Array.from(this.notifications.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  markNotificationRead(id: string): void {
    const n = this.notifications.get(id);
    if (n) {
      n.isRead = true;
      this.notifications.set(id, n);
    }
  }

  getUnreadNotificationCount(): number {
    return Array.from(this.notifications.values()).filter((n) => !n.isRead).length;
  }

  // ─── Admin Users ─────────────────────────────────────────────────────────────

  getAdminByEmail(email: string): AdminUser | undefined {
    return Array.from(this.adminUsers.values()).find((u) => u.email === email);
  }

  // ─── Dashboard Stats ─────────────────────────────────────────────────────────

  getDashboardStats(): DashboardStats {
    const allDonations = Array.from(this.donations.values());
    const allContacts = Array.from(this.contacts.values());
    const allEmails = Array.from(this.emails.values());

    return {
      totalDonations: allDonations.length,
      totalDonationAmount: allDonations
        .filter((d) => d.status === "successful")
        .reduce((sum, d) => sum + d.amount, 0),
      pendingDonations: allDonations.filter((d) => d.status === "pending").length,
      successfulDonations: allDonations.filter((d) => d.status === "successful").length,
      totalContacts: allContacts.length,
      newContacts: allContacts.filter((c) => c.status === "new").length,
      totalEmailsSent: allEmails.filter((e) => e.status === "sent").length,
      failedEmails: allEmails.filter((e) => e.status === "failed").length,
    };
  }

  // ─── Export / Data Access ────────────────────────────────────────────────────

  exportDonationsCSV(): string {
    const donations = Array.from(this.donations.values());
    const headers = [
      "Transaction ID",
      "Donor Name",
      "Email",
      "Phone",
      "Amount",
      "Payment Method",
      "Status",
      "M-Pesa Receipt",
      "Date",
    ];
    const rows = donations.map((d) =>
      [
        d.transactionId,
        d.donorName,
        d.email,
        d.phone,
        d.amount.toString(),
        d.paymentMethod,
        d.status,
        d.mpesaReceiptNumber ?? "",
        d.createdAt,
      ].join(",")
    );
    return [headers.join(","), ...rows].join("\n");
  }
}

// ─── Singleton export ──────────────────────────────────────────────────────────

export const store = new Store();