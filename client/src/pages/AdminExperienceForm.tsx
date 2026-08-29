import { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "wouter";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import { categories, formats, iconOptions } from "@/data/experiences";
import { checkAdminSession, fetchAdminExperiences, createExperience, updateExperience, uploadImage } from "@/lib/api";
import type { ExperienceRow } from "@/data/experiences";

type FormState = {
  slug: string;
  name: string;
  hook: string;
  category: string;
  format: string;
  color: string;
  isReal: boolean;
  displayOrder: number;
  // concept fields
  iconName: string;
  image: string;
  imageAlt: string;
  previewDescription: string;
  previewPossibleElementsText: string;
  // real fields
  heroImage: string;
  heroAlt: string;
  partner: string;
  storyDirection: string;
  ceremony: string;
  highlightsText: string;
  galleryText: string;
  proof: string;
  pressLinksText: string;
  storyLink: string;
  imagePlaceholder: boolean;
  // /stories magazine-page fields (real experiences only)
  storyScene: string;
  storyNarrative: string;
  storyMoment: string;
  storyGalleryStyle: string;
  storyVideosText: string;
};

const emptyForm: FormState = {
  slug: "",
  name: "",
  hook: "",
  category: categories[0].id,
  format: formats[0].id,
  color: "coral",
  isReal: false,
  displayOrder: 0,
  iconName: Object.keys(iconOptions)[0],
  image: "",
  imageAlt: "",
  previewDescription: "",
  previewPossibleElementsText: "",
  heroImage: "",
  heroAlt: "",
  partner: "",
  storyDirection: "",
  ceremony: "",
  highlightsText: "",
  galleryText: "",
  proof: "",
  pressLinksText: "",
  storyLink: "",
  imagePlaceholder: false,
  storyScene: "",
  storyNarrative: "",
  storyMoment: "",
  storyGalleryStyle: "evidence",
  storyVideosText: "",
};

function rowToForm(row: ExperienceRow): FormState {
  return {
    slug: row.slug,
    name: row.name,
    hook: row.hook,
    category: row.category,
    format: row.format,
    color: row.color,
    isReal: row.isReal,
    displayOrder: row.displayOrder,
    iconName: row.iconName || Object.keys(iconOptions)[0],
    image: row.image || "",
    imageAlt: row.imageAlt || "",
    previewDescription: row.previewDescription || "",
    previewPossibleElementsText: (row.previewPossibleElements || []).join("\n"),
    heroImage: row.heroImage || "",
    heroAlt: row.heroAlt || "",
    partner: row.partner || "",
    storyDirection: row.storyDirection || "",
    ceremony: row.ceremony || "",
    highlightsText: (row.highlights || []).join("\n"),
    galleryText: (row.gallery || []).map((g) => `${g.src} | ${g.alt} | ${g.caption}`).join("\n"),
    proof: row.proof || "",
    pressLinksText: (row.pressLinks || []).map((p) => `${p.title} | ${p.source} | ${p.url}`).join("\n"),
    storyLink: row.storyLink || "",
    imagePlaceholder: row.imagePlaceholder || false,
    storyScene: row.storyScene || "",
    storyNarrative: row.storyNarrative || "",
    storyMoment: row.storyMoment || "",
    storyGalleryStyle: row.storyGalleryStyle || "evidence",
    storyVideosText: (row.storyVideos || []).map((v) => `${v.src} | ${v.label}`).join("\n"),
  };
}

function formToPayload(form: FormState): Partial<ExperienceRow> {
  const base = {
    slug: form.slug.trim(),
    name: form.name.trim(),
    hook: form.hook.trim(),
    category: form.category,
    format: form.format,
    color: form.color,
    isReal: form.isReal,
    displayOrder: Number(form.displayOrder) || 0,
  };
  if (form.isReal) {
    return {
      ...base,
      heroImage: form.heroImage.trim(),
      heroAlt: form.heroAlt.trim(),
      partner: form.partner.trim(),
      storyDirection: form.storyDirection.trim(),
      ceremony: form.ceremony.trim(),
      highlights: form.highlightsText.split("\n").map((s) => s.trim()).filter(Boolean),
      gallery: form.galleryText.split("\n").map((s) => s.trim()).filter(Boolean).map((line) => {
        const [src, alt, caption] = line.split("|").map((p) => p.trim());
        return { src: src || "", alt: alt || "", caption: caption || "" };
      }),
      proof: form.proof.trim(),
      pressLinks: form.pressLinksText.split("\n").map((s) => s.trim()).filter(Boolean).map((line) => {
        const [title, source, url] = line.split("|").map((p) => p.trim());
        return { title: title || "", source: source || "", url: url || "" };
      }),
      storyLink: form.storyLink.trim() || form.slug.trim(),
      imagePlaceholder: form.imagePlaceholder,
      storyScene: form.storyScene.trim() || null,
      storyNarrative: form.storyNarrative.trim() || null,
      storyMoment: form.storyMoment.trim() || null,
      storyGalleryStyle: form.storyNarrative.trim() ? form.storyGalleryStyle : null,
      storyVideos: form.storyVideosText.split("\n").map((s) => s.trim()).filter(Boolean).map((line) => {
        const [src, label] = line.split("|").map((p) => p.trim());
        return { src: src || "", label: label || "" };
      }),
      iconName: null,
      image: null,
      imageAlt: null,
      previewDescription: null,
      previewPossibleElements: null,
    };
  }
  return {
    ...base,
    iconName: form.iconName,
    image: form.image.trim(),
    imageAlt: form.imageAlt.trim(),
    previewDescription: form.previewDescription.trim(),
    previewPossibleElements: form.previewPossibleElementsText.split("\n").map((s) => s.trim()).filter(Boolean),
    heroImage: null,
    heroAlt: null,
    partner: null,
    storyDirection: null,
    ceremony: null,
    highlights: null,
    gallery: null,
    proof: null,
    pressLinks: null,
    storyLink: null,
    imagePlaceholder: false,
    storyScene: null,
    storyNarrative: null,
    storyMoment: null,
    storyGalleryStyle: null,
    storyVideos: null,
  };
}

function ImageUploadField({ label, value, onChange }: { label: string; value: string; onChange: (url: string) => void }) {
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
      <span>{label}</span>
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

export default function AdminExperienceForm() {
  const [, navigate] = useLocation();
  const params = useParams<{ id?: string }>();
  const isNew = !params.id || params.id === "new";
  const [checked, setChecked] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [rowId, setRowId] = useState<number | null>(null);

  useEffect(() => {
    checkAdminSession().then((session) => {
      if (!session.authenticated) {
        navigate("/admin/login");
        return;
      }
      setChecked(true);
      if (!isNew) {
        fetchAdminExperiences().then((result) => {
          if ("error" in result) {
            setError(result.error);
            setLoading(false);
            return;
          }
          const row = result.experiences.find((e) => String(e.id) === params.id);
          if (row) {
            setForm(rowToForm(row));
            setRowId(row.id);
          } else {
            setError("Experience not found.");
          }
          setLoading(false);
        });
      }
    });
  }, [navigate, isNew, params.id]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = formToPayload(form);
    const result = isNew ? await createExperience(payload) : await updateExperience(rowId!, payload);
    setSaving(false);
    if (result.success) {
      navigate("/admin/experiences");
    } else {
      setError(result.error || "Something went wrong.");
    }
  };

  if (!checked || loading) return null;

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <div>
          <Link href="/admin/experiences" className="text-link admin-form__back"><ArrowLeft size={14} strokeWidth={1.7} /> All experiences</Link>
          <h1>{isNew ? "Add experience" : `Edit: ${form.name || "…"}`}</h1>
        </div>
      </header>

      <main className="admin-page__main admin-form__main">
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form__grid">
            <label className="admin-form__field">
              <span>Slug (URL-safe, unique)</span>
              <input type="text" value={form.slug} onChange={(e) => update("slug", e.target.value)} placeholder="e.g. sunset-sessions" required />
            </label>
            <label className="admin-form__field">
              <span>Name</span>
              <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} required />
            </label>
          </div>

          <label className="admin-form__field">
            <span>Hook (one-line teaser)</span>
            <textarea rows={2} value={form.hook} onChange={(e) => update("hook", e.target.value)} required />
          </label>

          <div className="admin-form__grid admin-form__grid--3">
            <label className="admin-form__field">
              <span>Category</span>
              <select value={form.category} onChange={(e) => update("category", e.target.value)}>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </label>
            <label className="admin-form__field">
              <span>Format</span>
              <select value={form.format} onChange={(e) => update("format", e.target.value)}>
                {formats.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
              </select>
            </label>
            <label className="admin-form__field">
              <span>Accent colour</span>
              <select value={form.color} onChange={(e) => update("color", e.target.value)}>
                <option value="coral">Coral</option>
                <option value="gold">Gold</option>
                <option value="teal">Teal</option>
              </select>
            </label>
          </div>

          <label className="admin-form__toggle">
            <input type="checkbox" checked={form.isReal} onChange={(e) => update("isReal", e.target.checked)} />
            <span>This is a real, delivered experience (unchecked = concept idea)</span>
          </label>

          {form.isReal ? (
            <>
              <div className="admin-form__section">Delivered experience details</div>
              <ImageUploadField label="Hero image" value={form.heroImage} onChange={(v) => update("heroImage", v)} />
              <label className="admin-form__field"><span>Hero image alt text</span><input type="text" value={form.heroAlt} onChange={(e) => update("heroAlt", e.target.value)} /></label>
              <label className="admin-form__field"><span>Partner organization(s)</span><input type="text" value={form.partner} onChange={(e) => update("partner", e.target.value)} /></label>
              <label className="admin-form__field"><span>Story Direction (what story this day was decided to tell)</span><textarea rows={4} value={form.storyDirection} onChange={(e) => update("storyDirection", e.target.value)} /></label>
              <label className="admin-form__field"><span>Ceremony (the spotlight moment that made it feel significant)</span><textarea rows={3} value={form.ceremony} onChange={(e) => update("ceremony", e.target.value)} /></label>
              <label className="admin-form__field"><span>Highlights (one per line)</span><textarea rows={4} value={form.highlightsText} onChange={(e) => update("highlightsText", e.target.value)} /></label>
              <label className="admin-form__field"><span>Gallery — one per line: image URL | alt text | caption</span><textarea rows={4} value={form.galleryText} onChange={(e) => update("galleryText", e.target.value)} placeholder="/images/example.jpg | A description | Short caption" /></label>
              <label className="admin-form__field"><span>Proof stat (the headline number/quote)</span><input type="text" value={form.proof} onChange={(e) => update("proof", e.target.value)} /></label>
              <label className="admin-form__field"><span>Press links — one per line: title | source | url (optional)</span><textarea rows={3} value={form.pressLinksText} onChange={(e) => update("pressLinksText", e.target.value)} /></label>
              <label className="admin-form__field"><span>Story link (anchor id on the Stories page)</span><input type="text" value={form.storyLink} onChange={(e) => update("storyLink", e.target.value)} placeholder="defaults to slug" /></label>
              <label className="admin-form__toggle"><input type="checkbox" checked={form.imagePlaceholder} onChange={(e) => update("imagePlaceholder", e.target.checked)} /><span>Photos are still placeholders, flag as pending real event photography</span></label>

              <div className="admin-form__section">Stories page (long-form magazine treatment)</div>
              <p className="admin-form__hint">Leave "Narrative" blank to keep this story off the /stories page for now — it stays on /experiences either way.</p>
              <label className="admin-form__field"><span>Scene (one line under the banner image)</span><textarea rows={2} value={form.storyScene} onChange={(e) => update("storyScene", e.target.value)} /></label>
              <label className="admin-form__field"><span>Narrative (the full long-form story paragraph)</span><textarea rows={5} value={form.storyNarrative} onChange={(e) => update("storyNarrative", e.target.value)} /></label>
              <label className="admin-form__field"><span>Moment (short pull-quote for the closing panel)</span><input type="text" value={form.storyMoment} onChange={(e) => update("storyMoment", e.target.value)} /></label>
              <label className="admin-form__field"><span>Gallery layout style</span>
                <select value={form.storyGalleryStyle} onChange={(e) => update("storyGalleryStyle", e.target.value)}>
                  <option value="evidence">Evidence</option>
                  <option value="timeline">Timeline</option>
                  <option value="closeups">Closeups</option>
                  <option value="festival">Festival</option>
                </select>
              </label>
              <label className="admin-form__field"><span>Videos — one per line: video URL | label (optional)</span><textarea rows={3} value={form.storyVideosText} onChange={(e) => update("storyVideosText", e.target.value)} placeholder="/videos/example.mp4 | Where it started" /></label>
            </>
          ) : (
            <>
              <div className="admin-form__section">Concept idea details</div>
              <label className="admin-form__field">
                <span>Icon</span>
                <select value={form.iconName} onChange={(e) => update("iconName", e.target.value)}>
                  {Object.keys(iconOptions).map((name) => <option key={name} value={name}>{name}</option>)}
                </select>
              </label>
              <ImageUploadField label="Illustrative photo" value={form.image} onChange={(v) => update("image", v)} />
              <label className="admin-form__field"><span>Photo alt text</span><input type="text" value={form.imageAlt} onChange={(e) => update("imageAlt", e.target.value)} /></label>
              <label className="admin-form__field"><span>Description (conditional voice — "could look like", never "was")</span><textarea rows={4} value={form.previewDescription} onChange={(e) => update("previewDescription", e.target.value)} /></label>
              <label className="admin-form__field"><span>Possible elements (one per line)</span><textarea rows={4} value={form.previewPossibleElementsText} onChange={(e) => update("previewPossibleElementsText", e.target.value)} /></label>
            </>
          )}

          <label className="admin-form__field admin-form__field--narrow"><span>Display order (lower shows first)</span><input type="number" value={form.displayOrder} onChange={(e) => update("displayOrder", Number(e.target.value))} /></label>

          {error ? <p className="admin-login-card__error">{error}</p> : null}

          <div className="admin-form__actions">
            <button type="submit" className="button button--coral" disabled={saving}>{saving ? "Saving…" : isNew ? "Create experience" : "Save changes"}</button>
            <Link href="/admin/experiences" className="text-link">Cancel</Link>
          </div>
        </form>
      </main>
    </div>
  );
}
