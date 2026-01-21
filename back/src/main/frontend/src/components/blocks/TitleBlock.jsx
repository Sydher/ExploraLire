export default function TitleBlock({ block, onChange, onDelete }) {
  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <label className="form-label mb-0">
          <i className="bi bi-type-h1 me-2"></i>
          Titre
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

      <select
        className="form-select mb-2"
        value={block.level || 'h2'}
        onChange={(e) => onChange({ ...block, level: e.target.value })}
      >
        <option value="h1">Titre principal (H1)</option>
        <option value="h2">Sous-titre (H2)</option>
        <option value="h3">Titre de section (H3)</option>
      </select>

      <input
        type="text"
        className="form-control"
        value={block.text || ''}
        onChange={(e) => onChange({ ...block, text: e.target.value })}
        placeholder="Entrez le texte du titre"
        required
      />
    </div>
  );
}
