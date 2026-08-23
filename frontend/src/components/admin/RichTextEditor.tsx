import React from 'react';
import { useStore } from '../../stores/useStore';

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
  className = ""
}) => {
  const { theme } = useStore();

  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  return (
    <div className={`border rounded-lg ${
      theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
    } ${className}`}>
      {/* Toolbar */}
      <div className={`flex items-center space-x-2 p-3 border-b ${
        theme === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'
      } rounded-t-lg`}>
        <button
          type="button"
          onClick={() => handleFormat('bold')}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}
          title="Gras"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => handleFormat('italic')}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}
          title="Italique"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => handleFormat('underline')}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}
          title="Souligné"
        >
          <u>U</u>
        </button>
        <div className={`w-px h-6 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}`} />
        <button
          type="button"
          onClick={() => handleFormat('insertUnorderedList')}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}
          title="Liste à puces"
        >
          •
        </button>
        <button
          type="button"
          onClick={() => handleFormat('insertOrderedList')}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}
          title="Liste numérotée"
        >
          1.
        </button>
      </div>

      {/* Editor */}
      <div
        contentEditable
        className={`min-h-[200px] p-4 outline-none ${
          theme === 'dark' 
            ? 'bg-gray-700 text-white' 
            : 'bg-white text-gray-900'
        } rounded-b-lg`}
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        data-placeholder={placeholder}
        style={{
          minHeight: '200px'
        }}
      />
    </div>
  );
};

export default RichTextEditor;