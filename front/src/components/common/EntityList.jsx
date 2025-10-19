export default function EntityList({ items, columns, onEdit, onDelete, emptyMessage }) {
    if (items.length === 0) {
        return (
            <div className="alert alert-info" role="alert">
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className="table-responsive">
            <table className="table table-striped table-hover">
                <thead className="table-dark">
                    <tr>
                        <th scope="col">ID</th>
                        {columns.map((col) => (
                            <th key={col.key} scope="col">
                                {col.header}
                            </th>
                        ))}
                        <th scope="col" className="text-end">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            {columns.map((col) => (
                                <td key={col.key}>
                                    {col.render ? col.render(item) : item[col.key]}
                                </td>
                            ))}
                            <td className="text-end">
                                <button
                                    onClick={() => onEdit(item)}
                                    className="btn btn-sm btn-warning me-2"
                                    aria-label={`Modifier ${item.name}`}
                                >
                                    Modifier
                                </button>
                                <button
                                    onClick={() => onDelete(item.id)}
                                    className="btn btn-sm btn-danger"
                                    aria-label={`Supprimer ${item.name}`}
                                >
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
