import React, { useState, useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { useStore } from "../../stores/useStore";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Entrez votre description...",
  className = "",
}) => {
  const { theme } = useStore();
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const execCommand = (command: string, value?: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      const selection = window.getSelection();
      if (selection && selection.rangeCount === 0) {
        const range = document.createRange();
        range.selectNodeContents(editorRef.current);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      console.log(`Executing command: ${command}`);
      document.execCommand(command, false, value);
      updateValue();
    }
  };

  const updateValue = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      console.log("Current HTML:", html);
      if (html !== value) {
        onChange(html);
      }
    }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    updateValue();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (
      e.key.length === 1 ||
      e.key === "Backspace" ||
      e.key === "Delete" ||
      e.key === "Enter"
    ) {
      return;
    }
    if (
      (e.ctrlKey || e.metaKey) &&
      (e.key === "Shift" || e.key === "7" || e.key === "8")
    ) {
      return;
    }
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    if (editorRef.current) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(text));
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        editorRef.current.textContent += text;
      }
      updateValue();
    }
  };

  const toolbarButtons = [
    { icon: Bold, command: "bold", title: "Gras" },
    { icon: Italic, command: "italic", title: "Italique" },
    { icon: Underline, command: "underline", title: "Souligné" },
    { icon: List, command: "insertUnorderedList", title: "Liste à puces" },
    {
      icon: ListOrdered,
      command: "insertOrderedList",
      title: "Liste numérotée",
    },
    { icon: AlignLeft, command: "justifyLeft", title: "Aligner à gauche" },
    { icon: AlignCenter, command: "justifyCenter", title: "Centrer" },
    { icon: AlignRight, command: "justifyRight", title: "Aligner à droite" },
  ];

  return (
    <div className={`space-y-2 ${className}`}>
      <div
        className={`flex flex-wrap items-center gap-1 p-2 rounded-lg border ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-gray-50 border-gray-200"
        }`}
      >
        {toolbarButtons.map((button) => (
          <button
            key={button.command}
            type="button"
            onClick={() => execCommand(button.command)}
            title={button.title}
            className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            <button.icon className="h-4 w-4" />
          </button>
        ))}
      </div>

      <div
        ref={editorRef}
        contentEditable
        dir="ltr"
        suppressContentEditableWarning={true}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onPaste={handlePaste}
        className={`editor min-h-[200px] p-4 rounded-lg border transition-colors ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
        } ${
          isFocused ? "border-orange-500 ring-2 ring-orange-500/20" : ""
        } focus:outline-none`}
        data-placeholder={placeholder}
        style={
          {
            "--tw-placeholder-opacity": "0.5",
          } as React.CSSProperties
        }
      />
    </div>
  );
};

export default RichTextEditor;
