export default function ImageBlock({ block, onChange, onDelete }) {
  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <label className="form-label mb-0">
          <i className="bi bi-image me-2"></i>
          Image
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

      <div className="mb-2">
        <label htmlFor={`image-url-${block.id}`} className="form-label small">
          URL de l'image
        </label>
        <input
          type="url"
          id={`image-url-${block.id}`}
          className="form-control"
          value={block.url || ''}
          onChange={(e) => onChange({ ...block, url: e.target.value })}
          placeholder="https://exemple.com/image.jpg"
          required
        />
      </div>

      <div className="mb-2">
        <label htmlFor={`image-alt-${block.id}`} className="form-label small">
          Texte alternatif (pour l'accessibilité)
        </label>
        <input
          type="text"
          id={`image-alt-${block.id}`}
          className="form-control"
          value={block.alt || ''}
          onChange={(e) => onChange({ ...block, alt: e.target.value })}
          placeholder="Description de l'image"
          required
        />
      </div>

      {block.url && (
        <div className="mt-2">
          <img
            src={block.url}
            alt={block.alt || 'Aperçu'}
            className="img-thumbnail"
            style={{ maxHeight: '200px', objectFit: 'contain' }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );
}
