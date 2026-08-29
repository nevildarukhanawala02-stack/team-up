import { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "wouter";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import { checkAdminSession, fetchAdminBlogPosts, createBlogPost, updateBlogPost, uploadImage } from "@/lib/api";
import { blogCategories, estimateReadTime, type BlogPostRow } from "@/data/blog";
import RichTextEditor from "@/components/RichTextEditor";

type FormState = {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  coverImageAlt: string;
  content: string;
  category: string;
  postType: "pillar_guide" | "cluster_article" | "faq_hub";
  tagsText: string;
  author: string;
  status: "draft" | "published";
  readTimeMinutes: string;
};

const emptyForm: FormState = {
  slug: "",
  title: "",
  excerpt: "",
  coverImage: "",
  coverImageAlt: "",
  content: "",
  category: blogCategories[0],
  postType: "cluster_article",
  tagsText: "",
  author: "Team Up Foundation",
  status: "draft",
  readTimeMinutes: "",
};

function rowToForm(row: BlogPostRow): FormState {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt || "",
    coverImage: row.coverImage || "",
    coverImageAlt: row.coverImageAlt || "",
    content: row.content,
    category: row.category || blogCategories[0],
    postType: (row.postType as "pillar_guide" | "cluster_article" | "faq_hub") || "cluster_article",
    tagsText: (row.tags || []).join(", "),
    author: row.author || "Team Up Foundation",
    status: row.status === "published" ? "published" : "draft",
    readTimeMinutes: row.readTimeMinutes ? String(row.readTimeMinutes) : "",
  };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function formToPayload(form: FormState): Partial<BlogPostRow> {
  return {
    slug: form.slug.trim() || slugify(form.title),
    title: form.title.trim(),
    excerpt: form.excerpt.trim() || null,
    coverImage: form.coverImage.trim() || null,
    coverImageAlt: form.coverImageAlt.trim() || null,
    content: form.content,
    category: form.category || null,
    postType: form.postType,
    tags: form.tagsText.split(",").map((s) => s.trim()).filter(Boolean),
    author: form.author.trim() || null,
    status: form.status,
    readTimeMinutes: form.readTimeMinutes ? Number(form.readTimeMinutes) : estimateReadTime(form.content),
  };
}

function CoverImageField({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const result = await uploadImage(file);
    setUploading(false);
    if (result.success && result.url) {
      onChange(result.url);
    } else {
      alert(result.error || "Upload failed.");
    }
    e.target.value = "";
  };

  return (
    <label className="admin-form__field">
      <span>Cover image</span>
      <div className="admin-form__image-field">
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder="Image URL, or upload below" />
        <label className="admin-form__upload-button">
          {uploading ? <Loader2 size={15} className="admin-form__spin" /> : <Upload size={15} />}
          {uploading ? "Uploading…" : "Upload"}
          <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} hidden />
        </label>
      </div>
      {value ? <img src={value} alt="" className="admin-form__image-preview" /> : null}
    </label>
  );
}

export default function AdminBlogForm() {
  const [, navigate] = useLocation();
  const params = useParams<{ id?: string }>();
  const isNew = !params.id || params.id === "new";
  const [checked, setChecked] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [rowId, setRowId] = useState<number | null>(null);
  const [slugTouched, setSlugTouched] = useState(!isNew);

  useEffect(() => {
    checkAdminSession().then((session) => {
      if (!session.authenticated) {
        navigate("/admin/login");
        return;
      }
      setChecked(true);
      if (!isNew) {
        fetchAdminBlogPosts().then((result) => {
          if ("error" in result) {
            setError(result.error);
            setLoading(false);
            return;
          }
          const row = result.posts.find((p) => String(p.id) === params.id);
          if (row) {
            setForm(rowToForm(row));
            setRowId(row.id);
          } else {
            setError("Post not found.");
          }
          setLoading(false);
        });
      }
    });
  }, [navigate, isNew, params.id]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  const handleTitleChange = (title: string) => {
    update("title", title);
    if (!slugTouched) update("slug", slugify(title));
  };

  const handleSubmit = async (publish: boolean) => {
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!form.slug.trim()) {
      setError("Slug is required.");
      return;
    }
    if (!form.content.trim() || form.content === "<p></p>") {
      setError("Content can't be empty.");
      return;
    }
    setSaving(true);
    setError("");
    const finalForm = { ...form, status: (publish ? "published" : "draft") as "draft" | "published" };
    const payload = formToPayload(finalForm);
    const result = isNew ? await createBlogPost(payload) : await updateBlogPost(rowId!, payload);
    setSaving(false);
    if (result.success) {
      navigate("/admin/blog");
    } else {
      setError(result.error || "Something went wrong.");
    }
  };

  if (!checked || loading) return null;

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <div>
          <Link href="/admin/blog" className="text-link admin-form__back"><ArrowLeft size={14} strokeWidth={1.7} /> All posts</Link>
          <h1>{isNew ? "New post" : `Edit: ${form.title || "…"}`}</h1>
        </div>
      </header>

      <main className="admin-page__main admin-form__main">
        <form className="admin-form" onSubmit={(e) => e.preventDefault()}>
          <label className="admin-form__field">
            <span>Title</span>
            <input type="text" value={form.title} onChange={(e) => handleTitleChange(e.target.value)} required />
          </label>

          <label className="admin-form__field">
            <span>Slug (URL-safe, unique)</span>
            <input type="text" value={form.slug} onChange={(e) => { setSlugTouched(true); update("slug", e.target.value); }} placeholder="e.g. why-celebration-and-impact-are-additive" required />
          </label>

          <label className="admin-form__field">
            <span>Excerpt (shown in blog list cards and the homepage)</span>
            <textarea rows={2} value={form.excerpt} onChange={(e) => update("excerpt", e.target.value)} />
          </label>

          <CoverImageField value={form.coverImage} onChange={(v) => update("coverImage", v)} />
          <label className="admin-form__field"><span>Cover image alt text</span><input type="text" value={form.coverImageAlt} onChange={(e) => update("coverImageAlt", e.target.value)} /></label>

          <div className="admin-form__grid admin-form__grid--4">
            <label className="admin-form__field">
              <span>Category</span>
              <select value={form.category} onChange={(e) => update("category", e.target.value)}>
                {blogCategories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label className="admin-form__field">
              <span>Post type</span>
              <select value={form.postType} onChange={(e) => update("postType", e.target.value as typeof form.postType)}>
                <option value="pillar_guide">Pillar guide</option>
                <option value="cluster_article">Cluster article</option>
                <option value="faq_hub">FAQ hub</option>
              </select>
            </label>
            <label className="admin-form__field">
              <span>Author</span>
              <input type="text" value={form.author} onChange={(e) => update("author", e.target.value)} />
            </label>
            <label className="admin-form__field">
              <span>Read time (minutes, optional, auto-estimated if blank)</span>
              <input type="number" min="1" value={form.readTimeMinutes} onChange={(e) => update("readTimeMinutes", e.target.value)} />
            </label>
          </div>

          <label className="admin-form__field"><span>Tags (comma-separated)</span><input type="text" value={form.tagsText} onChange={(e) => update("tagsText", e.target.value)} placeholder="CSR, employee engagement, Mumbai" /></label>

          <label className="admin-form__field">
            <span>Content</span>
            <RichTextEditor value={form.content} onChange={(html) => update("content", html)} placeholder="Write the post…" />
          </label>

          {error ? <p className="admin-login-card__error">{error}</p> : null}

          <div className="admin-form__actions">
            <button type="button" className="button button--ghost" disabled={saving} onClick={() => handleSubmit(false)}>{saving ? "Saving…" : "Save as draft"}</button>
            <button type="button" className="button button--coral" disabled={saving} onClick={() => handleSubmit(true)}>{saving ? "Publishing…" : "Publish"}</button>
            <Link href="/admin/blog" className="text-link">Cancel</Link>
          </div>
        </form>
      </main>
    </div>
  );
}
