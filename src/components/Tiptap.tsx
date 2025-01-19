import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  BiBold,
  BiItalic,
  BiStrikethrough,
  BiListOl,
  BiListUl,
} from "react-icons/bi";
import "./Tiptap.css"; // Import custom styles

export function StyledDescriptionEditor({
  taskData,
  setTaskData,
}: {
  setTaskData: (data: any) => void;
  taskData: any;
}) {
  const [charCount, setCharCount] = useState(0);
  const editor = useEditor({
    extensions: [StarterKit],
    content: taskData.description,
    onUpdate: ({ editor }) => {
      const text = editor.getText().trim();
      setCharCount(text.length > 300 ? 300 : text.length); // Limit characters to 300
      setTaskData({ ...taskData, description: text });
      if (text.length > 300) {
        editor.commands.deleteRange({ from: 300, to: text.length });
      }
    },
  });

  if (!editor) {
    return null; // Render nothing until the editor initializes
  }

  return (
    <div className="w-full space-y-3">
      {/* Editor Container */}
      <div className="border max-h-[400px] border-gray-300 rounded-lg p-3 bg-[#f1f1f1]">
        <div className="max-h-[400px] overflow-y-auto">
          {/* TipTap Editor */}
          <EditorContent
            editor={editor}
            className="custom-editor text-gray-700 placeholder-gray-400"
            placeholder="Description"
          />
        </div>

        {/* Toolbar */}
        <div className="flex justify-between items-center pt-3">
          <div className="flex items-center space-x-3 border-gray-200">
            {/* Bold Button */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`toolbar-button ${
                editor.isActive("bold") ? "text-blue-500" : "text-gray-500"
              }`}
            >
              <BiBold size={20} />
            </button>

            {/* Italic Button */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`toolbar-button ${
                editor.isActive("italic") ? "text-blue-500" : "text-gray-500"
              }`}
            >
              <BiItalic size={20} />
            </button>

            {/* Strike-through Button */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`toolbar-button ${
                editor.isActive("strike") ? "text-blue-500" : "text-gray-500"
              }`}
            >
              <BiStrikethrough size={20} />
            </button>

            {/* Ordered List Button */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`toolbar-button ${
                editor.isActive("orderedList")
                  ? "text-blue-500"
                  : "text-gray-500"
              }`}
            >
              <BiListOl size={20} />
            </button>

            {/* Bullet List Button */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`toolbar-button ${
                editor.isActive("bulletList")
                  ? "text-blue-500"
                  : "text-gray-500"
              }`}
            >
              <BiListUl size={20} />
            </button>
          </div>
          {/* Footer: Character Count */}
          <div className="text-right text-sm text-gray-500">
            {charCount}/300 characters
          </div>
        </div>
      </div>
    </div>
  );
}
