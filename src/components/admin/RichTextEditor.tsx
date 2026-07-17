"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Link,
  Image,
  Undo,
  Redo,
} from "lucide-react";
import { cn } from "@/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing...",
  minHeight = 300,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      ImageExtension.configure({
        inline: false,
        allowBase64: true,
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary-600 underline hover:text-primary-700",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none min-h-[200px] px-4 py-3",
      },
    },
  });

  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const ToolbarButton = ({
    onClick,
    isActive,
    children,
    label,
  }: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    label: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "rounded-lg p-1.5 transition-colors",
        isActive
          ? "bg-primary-100 text-primary-700"
          : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
      )}
    >
      {children}
    </button>
  );

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-neutral-200 bg-neutral-50 px-3 py-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          label="Bold"
        >
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          label="Italic"
        >
          <Italic size={16} />
        </ToolbarButton>

        <div className="mx-1 h-5 w-px bg-neutral-300" />

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive("heading", { level: 1 })}
          label="Heading 1"
        >
          <Heading1 size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
          label="Heading 2"
        >
          <Heading2 size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          isActive={editor.isActive("heading", { level: 3 })}
          label="Heading 3"
        >
          <Heading3 size={16} />
        </ToolbarButton>

        <div className="mx-1 h-5 w-px bg-neutral-300" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          label="Bullet List"
        >
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          label="Ordered List"
        >
          <ListOrdered size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          label="Blockquote"
        >
          <Quote size={16} />
        </ToolbarButton>

        <div className="mx-1 h-5 w-px bg-neutral-300" />

        <ToolbarButton onClick={addLink} isActive={editor.isActive("link")} label="Link">
          <Link size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={addImage} label="Image">
          <Image size={16} />
        </ToolbarButton>

        <div className="mx-1 h-5 w-px bg-neutral-300" />

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          label="Undo"
        >
          <Undo size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          label="Redo"
        >
          <Redo size={16} />
        </ToolbarButton>
      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className="min-h-[200px]"
        style={{ minHeight }}
      />
    </div>
  );
}