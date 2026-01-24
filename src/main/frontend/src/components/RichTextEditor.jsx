import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Highlight } from '@tiptap/extension-highlight';
import { TextAlign } from '@tiptap/extension-text-align';
import './RichTextEditor.css';

export default function RichTextEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        defaultAlignment: 'left',
      }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const textColors = ['#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff'];
  const highlightColors = ['transparent', '#ffc9c9', '#ffe0b2', '#ffffe0', '#d4f4dd', '#cce5ff', '#e6d9ff'];

  return (
    <div className="rich-text-editor">
      <div className="toolbar">
        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`toolbar-btn ${editor.isActive('bold') ? 'is-active' : ''}`}
            title="Gras"
          >
            <i className="bi bi-type-bold"></i>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`toolbar-btn ${editor.isActive('italic') ? 'is-active' : ''}`}
            title="Italique"
          >
            <i className="bi bi-type-italic"></i>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`toolbar-btn ${editor.isActive('underline') ? 'is-active' : ''}`}
            title="Souligné"
          >
            <i className="bi bi-type-underline"></i>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`toolbar-btn ${editor.isActive('strike') ? 'is-active' : ''}`}
            title="Barré"
          >
            <i className="bi bi-type-strikethrough"></i>
          </button>
        </div>

        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`toolbar-btn ${editor.isActive('bulletList') ? 'is-active' : ''}`}
            title="Liste à puces"
          >
            <i className="bi bi-list-ul"></i>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`toolbar-btn ${editor.isActive('orderedList') ? 'is-active' : ''}`}
            title="Liste numérotée"
          >
            <i className="bi bi-list-ol"></i>
          </button>
        </div>

        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`toolbar-btn ${editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}`}
            title="Aligner à gauche"
          >
            <i className="bi bi-text-left"></i>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`toolbar-btn ${editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}`}
            title="Centrer"
          >
            <i className="bi bi-text-center"></i>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`toolbar-btn ${editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}`}
            title="Aligner à droite"
          >
            <i className="bi bi-text-right"></i>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={`toolbar-btn ${editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''}`}
            title="Justifier"
          >
            <i className="bi bi-justify"></i>
          </button>
        </div>

        <div className="toolbar-group">
          <span className="toolbar-label">Couleur de texte:</span>
          {textColors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => editor.chain().focus().setColor(color).run()}
              className={`color-btn ${editor.isActive('textStyle', { color }) ? 'is-active' : ''}`}
              style={{ backgroundColor: color }}
              title={`Couleur ${color}`}
              aria-label={`Appliquer la couleur ${color}`}
            />
          ))}
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetColor().run()}
            className="toolbar-btn"
            title="Supprimer la couleur"
          >
            <i className="bi bi-x-circle"></i>
          </button>
        </div>

        <div className="toolbar-group">
          <span className="toolbar-label">Surlignage:</span>
          {highlightColors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() =>
                color === 'transparent'
                  ? editor.chain().focus().unsetHighlight().run()
                  : editor.chain().focus().setHighlight({ color }).run()
              }
              className={`color-btn ${
                color === 'transparent' && !editor.isActive('highlight')
                  ? 'is-active'
                  : editor.isActive('highlight', { color })
                  ? 'is-active'
                  : ''
              }`}
              style={{
                backgroundColor: color,
                border: color === 'transparent' ? '2px solid #ccc' : 'none',
              }}
              title={color === 'transparent' ? 'Aucun surlignage' : `Surlignage ${color}`}
              aria-label={
                color === 'transparent'
                  ? 'Supprimer le surlignage'
                  : `Appliquer le surlignage ${color}`
              }
            />
          ))}
        </div>

        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
            className="toolbar-btn"
            title="Effacer le formatage"
          >
            <i className="bi bi-eraser"></i>
          </button>
        </div>
      </div>

      <EditorContent editor={editor} className="editor-content" />
    </div>
  );
}
