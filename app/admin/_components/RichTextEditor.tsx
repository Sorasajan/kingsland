"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Heading2,
  Heading3,
  Undo,
  Redo,
  ImagePlus,
  AlignLeft as WrapLeft,
  AlignRight as WrapRight,
  AlignCenter as WrapNone,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Extends the base Image node with a `style` attribute so images can
// float left/right with the surrounding text wrapping around them, or
// sit full-width/centered with no wrap.
const FloatableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: "display:block;margin:1rem auto;max-width:100%;border-radius:0.75rem;",
        parseHTML: (el: HTMLElement) => el.getAttribute("style"),
        renderHTML: (attrs: { style?: string }) =>
          attrs.style ? { style: attrs.style } : {},
      },
    };
  },
});

const FLOAT_LEFT_STYLE =
  "float:left;margin:0.25rem 1.25rem 0.75rem 0;max-width:45%;border-radius:0.75rem;";
const FLOAT_RIGHT_STYLE =
  "float:right;margin:0.25rem 0 0.75rem 1.25rem;max-width:45%;border-radius:0.75rem;";
const NO_FLOAT_STYLE =
  "display:block;margin:1rem auto;max-width:100%;border-radius:0.75rem;";

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing…",
  minHeight = "12rem",
  uploadUrl = "/api/admin/upload",
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
  uploadUrl?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Placeholder.configure({ placeholder }),
      FloatableImage,
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm prose-slate max-w-none focus:outline-none px-4 py-3",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Keep editor content in sync if `value` changes from outside
  // (e.g. switching tabs, loading a different record).
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current && value !== undefined) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  if (!editor) return null;

  function setLink() {
    const previousUrl = editor!.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previousUrl || "https://");
    if (url === null) return;
    if (url === "") {
      editor!.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor!.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  async function handleImageFile(file: File) {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(uploadUrl, { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        editor!.chain().focus().setImage({ src: data.url, alt: "" }).run();
      } else {
        window.alert(data.error || "Image upload failed.");
      }
    } catch {
      window.alert("Image upload failed — please try again.");
    } finally {
      setUploading(false);
    }
  }

  function setImageFloat(style: string) {
    if (!editor!.isActive("image")) return;
    editor!.chain().focus().updateAttributes("image", { style }).run();
  }

  const btn = (active: boolean) =>
    `w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
      active ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-100"
    }`;

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50 px-2 py-1.5">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btn(editor.isActive("bold"))} title="Bold">
          <Bold className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btn(editor.isActive("italic"))} title="Italic">
          <Italic className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={btn(editor.isActive("underline"))} title="Underline">
          <UnderlineIcon className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={btn(editor.isActive("strike"))} title="Strikethrough">
          <Strikethrough className="w-4 h-4" />
        </button>
        <div className="w-px h-5 bg-slate-200 mx-1" />
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btn(editor.isActive("heading", { level: 2 }))} title="Heading">
          <Heading2 className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btn(editor.isActive("heading", { level: 3 }))} title="Subheading">
          <Heading3 className="w-4 h-4" />
        </button>
        <div className="w-px h-5 bg-slate-200 mx-1" />
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btn(editor.isActive("bulletList"))} title="Bullet list">
          <List className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btn(editor.isActive("orderedList"))} title="Numbered list">
          <ListOrdered className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btn(editor.isActive("blockquote"))} title="Quote">
          <Quote className="w-4 h-4" />
        </button>
        <button type="button" onClick={setLink} className={btn(editor.isActive("link"))} title="Link">
          <LinkIcon className="w-4 h-4" />
        </button>
        <div className="w-px h-5 bg-slate-200 mx-1" />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className={btn(false)}
          title="Insert image"
        >
          <ImagePlus className="w-4 h-4" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageFile(file);
            e.target.value = "";
          }}
        />
        {editor.isActive("image") && (
          <>
            <button type="button" onClick={() => setImageFloat(FLOAT_LEFT_STYLE)} className={btn(false)} title="Wrap text right of image">
              <WrapLeft className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => setImageFloat(NO_FLOAT_STYLE)} className={btn(false)} title="No wrap — full width">
              <WrapNone className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => setImageFloat(FLOAT_RIGHT_STYLE)} className={btn(false)} title="Wrap text left of image">
              <WrapRight className="w-4 h-4" />
            </button>
          </>
        )}
        <div className="w-px h-5 bg-slate-200 mx-1" />
        <button type="button" onClick={() => editor.chain().focus().undo().run()} className={btn(false)} title="Undo">
          <Undo className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} className={btn(false)} title="Redo">
          <Redo className="w-4 h-4" />
        </button>
      </div>
      <div style={{ minHeight }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
