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
