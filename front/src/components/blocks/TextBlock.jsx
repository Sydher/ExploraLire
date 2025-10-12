import RichTextEditor from '../RichTextEditor';

export default function TextBlock({ block, onChange, onDelete }) {
  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <label className="form-label mb-0">
          <i className="bi bi-text-paragraph me-2"></i>
          Texte
        </label>
        <button
          type="button"
          onClick={onDelete}
          className="btn btn-sm btn-outline-danger"
          aria-label="Supprimer le bloc"
        >
          <i className="bi bi-trash"></i>
        </button>
      </div>

      <RichTextEditor
        content={block.text || ''}
        onChange={(html) => onChange({ ...block, text: html })}
      />
    </div>
  );
}
