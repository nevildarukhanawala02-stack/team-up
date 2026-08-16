import type { ExperienceRow } from "@/data/experiences";

export interface ContactSubmission {
  name: string;
  organization?: string;
  email?: string;
  phone?: string;
  message?: string;
  source: "contact_page" | "experience_inquiry";
  sourceDetail?: string;
}

export async function submitContactForm(data: ContactSubmission): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { success: false, error: body.error || "Something went wrong. Please try again." };
    }
    return { success: true };
  } catch {
    return { success: false, error: "Couldn't reach the server. Please check your connection and try again." };
  }
}

export async function adminLogin(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { success: false, error: body.error || "Invalid email or password." };
    }
    return { success: true };
  } catch {
    return { success: false, error: "Couldn't reach the server." };
  }
}

export async function adminLogout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
}

export async function checkAdminSession(): Promise<{ authenticated: boolean; email?: string }> {
  try {
    const res = await fetch("/api/auth/me");
    if (!res.ok) return { authenticated: false };
    return await res.json();
  } catch {
    return { authenticated: false };
  }
}

export interface Lead {
  id: number;
  name: string;
  organization: string | null;
  email: string | null;
  phone: string | null;
  message: string | null;
  source: string;
  sourceDetail: string | null;
  createdAt: string;
}

export async function fetchLeads(): Promise<{ leads: Lead[] } | { error: string }> {
  try {
    const res = await fetch("/api/admin/leads");
    if (!res.ok) return { error: "Not authenticated or something went wrong." };
    return await res.json();
  } catch {
    return { error: "Couldn't reach the server." };
  }
}

// --- Experiences admin ---

export async function fetchAdminExperiences(): Promise<{ experiences: ExperienceRow[] } | { error: string }> {
  try {
    const res = await fetch("/api/admin/experiences");
    if (!res.ok) return { error: "Not authenticated or something went wrong." };
    return await res.json();
  } catch {
    return { error: "Couldn't reach the server." };
  }
}

export async function createExperience(data: Partial<ExperienceRow>): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/admin/experiences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { success: false, error: body.error || "Something went wrong." };
    }
    return { success: true };
  } catch {
    return { success: false, error: "Couldn't reach the server." };
  }
}

export async function updateExperience(id: number, data: Partial<ExperienceRow>): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`/api/admin/experiences/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { success: false, error: body.error || "Something went wrong." };
    }
    return { success: true };
  } catch {
    return { success: false, error: "Couldn't reach the server." };
  }
}

export async function deleteExperience(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`/api/admin/experiences/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { success: false, error: body.error || "Something went wrong." };
    }
    return { success: true };
  } catch {
    return { success: false, error: "Couldn't reach the server." };
  }
}

// --- Analytics admin ---

export interface AnalyticsData {
  range: "week" | "month";
  metrics: {
    visits: number;
    pageViews: number;
    pagesPerVisit: number;
    experienceViews: number;
    conversions: number;
    conversionRate: number;
  };
  funnel: { label: string; value: number }[];
  leaderboard: { slug: string; name: string; views: number }[];
}

export async function fetchAnalytics(range: "week" | "month"): Promise<AnalyticsData | { error: string }> {
  try {
    const res = await fetch(`/api/admin/analytics?range=${range}`);
    if (!res.ok) return { error: "Not authenticated or something went wrong." };
    return await res.json();
  } catch {
    return { error: "Couldn't reach the server." };
  }
}

export async function uploadImage(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { success: false, error: body.error || "Upload failed." };
    }
    return await res.json();
  } catch {
    return { success: false, error: "Couldn't reach the server." };
  }
}
