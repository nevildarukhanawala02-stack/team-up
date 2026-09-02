import nodemailer from "nodemailer";
import type { contactSubmissions } from "./db/schema";

/**
 * Sends a new-lead notification email whenever any form on the site
 * submits through /api/contact (Contact page, experience inquiries, Donate,
 * Volunteer, Partner, all of them route through that one endpoint, this
 * covers every one of them, not just the Contact page specifically).
 *
 * Uses Gmail SMTP via nodemailer. Requires two environment variables on
 * Railway:
 *   SMTP_USER — the Gmail address to send from
 *   SMTP_PASS — a Gmail App Password (Google Account > Security > 2-Step
 *               Verification > App Passwords), NOT the regular account
 *               password, Gmail's SMTP rejects that even with correct
 *               credentials, since it requires 2FA + an app-specific
 *               password for any SMTP client.
 *
 * If those aren't set, this logs a warning once and silently no-ops on
 * every call after, the lead is still saved to the database either way,
 * this is a notification convenience on top of that, never a dependency
 * for the form submission to succeed.
 */

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;
let warnedMissingConfig = false;

function getTransporter() {
  if (transporter) return transporter;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) {
    if (!warnedMissingConfig) {
      console.warn("SMTP_USER / SMTP_PASS not set, lead notification emails are disabled (leads are still saved to the database).");
      warnedMissingConfig = true;
    }
    return null;
  }
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
  return transporter;
}

const SOURCE_LABELS: Record<string, string> = {
  contact_page: "Contact page",
  experience_inquiry: "Experience inquiry",
  donate_inquiry: "Donate form",
  volunteer_signup: "Volunteer signup",
  partner_inquiry: "Partner inquiry",
};

type NewSubmission = typeof contactSubmissions.$inferInsert;

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildEmailHtml(submission: NewSubmission): string {
  const sourceLabel = SOURCE_LABELS[submission.source] || submission.source;
  const rows: { label: string; value: string }[] = [
    { label: "Name", value: submission.name },
    { label: "Organization", value: submission.organization || "" },
    { label: "Email", value: submission.email || "" },
    { label: "Phone", value: submission.phone || "" },
    { label: "Source", value: sourceLabel },
    { label: "Source detail", value: submission.sourceDetail || "" },
  ].filter((r) => r.value);

  const metadataRows = submission.metadata
    ? Object.entries(submission.metadata as Record<string, string>)
        .filter(([, v]) => v)
        .map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#5f574b;font-size:13px;">${escapeHtml(k)}</td><td style="padding:6px 0;color:#1c1b1a;font-size:13px;">${escapeHtml(v)}</td></tr>`)
        .join("")
    : "";

  const fieldRows = rows
    .map((r) => `<tr><td style="padding:6px 12px 6px 0;color:#5f574b;font-size:13px;white-space:nowrap;">${escapeHtml(r.label)}</td><td style="padding:6px 0;color:#1c1b1a;font-size:13px;">${escapeHtml(r.value)}</td></tr>`)
    .join("");

  const messageBlock = submission.message
    ? `<div style="margin-top:18px;"><p style="margin:0 0 6px;color:#5f574b;font-size:12px;letter-spacing:1px;text-transform:uppercase;">Message</p><p style="margin:0;padding:14px 16px;background:#f0e6d2;border-left:3px solid #e85d4c;color:#1c1b1a;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(submission.message)}</p></div>`
    : "";

  return `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#e7dbc4;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#e7dbc4;padding:32px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#f7f1e7;border-radius:8px;overflow:hidden;">
        <tr><td style="background:#1c1b1a;padding:20px 28px;">
          <p style="margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#e3a72e;font-weight:600;">Team Up Foundation</p>
          <p style="margin:6px 0 0;font-size:18px;font-weight:700;color:#f0e6d2;">New lead: ${escapeHtml(sourceLabel)}</p>
        </td></tr>
        <tr><td style="padding:24px 28px;">
          <table cellpadding="0" cellspacing="0">${fieldRows}${metadataRows}</table>
          ${messageBlock}
        </td></tr>
        <tr><td style="background:#1c1b1a;padding:14px 28px;">
          <p style="margin:0;font-size:11px;color:#c9bfa8;">View all leads in the admin dashboard at /admin</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

/**
 * Fire-and-forget: never throws, never awaited by the caller, a failed
 * notification email must never affect the form submission response, the
 * lead is already safely in the database by the time this is called.
 */
export function sendLeadNotification(submission: NewSubmission): void {
  // Always notify both trustees. LEAD_NOTIFICATION_EMAIL (if set on Railway)
  // is added on top rather than replacing these, so an override there can't
  // accidentally drop one of the trustees from the notification.
  const recipients = Array.from(new Set([
    "nevildarukhanawala02@gmail.com",
    "arvindkukreti@gmail.com",
    process.env.LEAD_NOTIFICATION_EMAIL,
  ].filter((email): email is string => Boolean(email))));
  const to = recipients.join(", ");
  try {
    const t = getTransporter();
    if (!t) return;
    const sourceLabel = SOURCE_LABELS[submission.source] || submission.source;
    t.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: `New lead: ${sourceLabel}, ${submission.name}`,
      html: buildEmailHtml(submission),
    }).catch((err) => {
      console.error("Failed to send lead notification email:", err);
    });
  } catch (err) {
    console.error("Failed to send lead notification email:", err);
  }
}
