import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, List, ListOrdered, Quote, Heading2, Heading3, Link as LinkIcon, Image as ImageIcon, Undo, Redo, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { uploadImage } from "@/lib/api";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [uploadingImage, setUploadingImage] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, autolink: true }),
      Image,
      Placeholder.configure({ placeholder: placeholder || "Start writing…" }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { class: "rich-editor__content" },
    },
  });

  useEffect(() => {
    if (!editor) return;
    // Only push an external update when it actually differs from what's in the
    // editor, so this doesn't fight the user's cursor on every keystroke,
    // onUpdate already keeps `value` in sync while they're typing.
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL", previousUrl || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    const result = await uploadImage(file);
    setUploadingImage(false);
    if (result.success && result.url) {
      editor.chain().focus().setImage({ src: result.url }).run();
    } else {
      alert(result.error || "Image upload failed.");
    }
    e.target.value = "";
  };

  return (
    <div className="rich-editor">
      <div className="rich-editor__toolbar">
        <button type="button" className={editor.isActive("bold") ? "is-active" : ""} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold"><Bold size={15} /></button>
        <button type="button" className={editor.isActive("italic") ? "is-active" : ""} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic"><Italic size={15} /></button>
        <span className="rich-editor__divider" />
        <button type="button" className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Heading"><Heading2 size={15} /></button>
        <button type="button" className={editor.isActive("heading", { level: 3 }) ? "is-active" : ""} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="Subheading"><Heading3 size={15} /></button>
        <span className="rich-editor__divider" />
        <button type="button" className={editor.isActive("bulletList") ? "is-active" : ""} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet list"><List size={15} /></button>
        <button type="button" className={editor.isActive("orderedList") ? "is-active" : ""} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered list"><ListOrdered size={15} /></button>
        <button type="button" className={editor.isActive("blockquote") ? "is-active" : ""} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Quote"><Quote size={15} /></button>
        <span className="rich-editor__divider" />
        <button type="button" className={editor.isActive("link") ? "is-active" : ""} onClick={setLink} title="Link"><LinkIcon size={15} /></button>
        <label className="rich-editor__image-button" title="Insert image">
          {uploadingImage ? <Loader2 size={15} className="admin-form__spin" /> : <ImageIcon size={15} />}
          <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} hidden />
        </label>
        <span className="rich-editor__divider" />
        <button type="button" onClick={() => editor.chain().focus().undo().run()} title="Undo"><Undo size={15} /></button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} title="Redo"><Redo size={15} /></button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
