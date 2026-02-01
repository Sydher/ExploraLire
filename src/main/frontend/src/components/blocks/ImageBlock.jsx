import { useState, useRef } from "react";
import { uploadImage, getImageUrl } from "../../services/imageService";

export default function ImageBlock({ block, onChange, onDelete }) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError(null);

        try {
            const result = await uploadImage(file);
            onChange({ ...block, filename: result.filename, url: undefined });
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    const imageUrl = block.filename ? getImageUrl(block.filename) : block.url || "";

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
                <label htmlFor={`image-file-${block.id}`} className="form-label small">
                    Fichier image
                </label>
                <input
                    type="file"
                    id={`image-file-${block.id}`}
                    ref={fileInputRef}
                    className="form-control"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={uploading}
                />
                {uploading && (
                    <div className="mt-1">
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        <small>Envoi en cours...</small>
                    </div>
                )}
                {error && (
                    <div className="text-danger small mt-1" role="alert">
                        {error}
                    </div>
                )}
            </div>

            <div className="mb-2">
                <label htmlFor={`image-alt-${block.id}`} className="form-label small">
                    Texte alternatif (pour l'accessibilité)
                </label>
                <input
                    type="text"
                    id={`image-alt-${block.id}`}
                    className="form-control"
                    value={block.alt || ""}
                    onChange={(e) => onChange({ ...block, alt: e.target.value })}
                    placeholder="Description de l'image"
                    required
                />
            </div>

            <div className="mb-2">
                <label htmlFor={`image-caption-${block.id}`} className="form-label small">
                    Légende (facultatif)
                </label>
                <input
                    type="text"
                    id={`image-caption-${block.id}`}
                    className="form-control"
                    value={block.caption || ""}
                    onChange={(e) => onChange({ ...block, caption: e.target.value })}
                    placeholder="Légende de l'image"
                />
            </div>

            <div className="mb-2">
                <span className="form-label small d-block">Taille de l'image</span>
                <div className="btn-group" role="group" aria-label="Taille de l'image">
                    {[
                        { value: 25, label: "Petit" },
                        { value: 50, label: "Moyen" },
                        { value: 75, label: "Grand" },
                        { value: 100, label: "Taille réelle" },
                    ].map(({ value, label }) => (
                        <button
                            key={value}
                            type="button"
                            className={`btn btn-sm ${(block.width || 100) === value ? "btn-primary" : "btn-outline-primary"}`}
                            onClick={() => onChange({ ...block, width: value })}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {imageUrl && (
                <figure className="mt-2">
                    <img
                        src={imageUrl}
                        alt={block.alt || "Aperçu"}
                        className="img-thumbnail"
                        style={{ maxHeight: "200px", objectFit: "contain" }}
                        onError={(e) => {
                            e.target.style.display = "none";
                        }}
                    />
                    {block.caption && (
                        <figcaption className="fst-italic text-secondary mt-1">
                            {block.caption}
                        </figcaption>
                    )}
                </figure>
            )}
        </div>
    );
}
