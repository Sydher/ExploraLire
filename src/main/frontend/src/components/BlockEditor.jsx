import { useState, useEffect, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';
import TitleBlock from './blocks/TitleBlock';
import TextBlock from './blocks/TextBlock';
import ImageBlock from './blocks/ImageBlock';

function SortableBlock({ block, onUpdate, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const renderBlock = () => {
    switch (block.type) {
      case 'title':
        return <TitleBlock block={block} onChange={onUpdate} onDelete={onDelete} />;
      case 'text':
        return <TextBlock block={block} onChange={onUpdate} onDelete={onDelete} />;
      case 'image':
        return <ImageBlock block={block} onChange={onUpdate} onDelete={onDelete} />;
      default:
        return null;
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="card mb-2" data-block-id={block.id}>
      <div className="card-body p-2">
        <div className="d-flex">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary me-2"
            {...listeners}
            {...attributes}
            aria-label="Glisser pour réorganiser"
            style={{ cursor: 'grab' }}
          >
            <i className="bi bi-grip-vertical"></i>
          </button>
          <div className="flex-grow-1">{renderBlock()}</div>
        </div>
      </div>
    </div>
  );
}

function DroppableColumn({ columnId, blocks, onUpdate, onDelete, onDeleteColumn, columnCount }) {
  const { setNodeRef, isOver } = useDroppable({
    id: columnId,
  });

  const colClass = columnCount === 1 ? 'col-12' : columnCount === 2 ? 'col-md-6' : 'col-md-4';

  return (
    <div className={colClass}>
      <div
        ref={setNodeRef}
        className={`border rounded p-2 ${isOver ? 'bg-light border-primary' : 'border-secondary'}`}
        style={{ minHeight: '100px' }}
      >
        <div className="d-flex justify-content-between align-items-center mb-2">
          <small className="text-muted">Colonne</small>
          {columnCount > 1 && (
            <button
              type="button"
              onClick={onDeleteColumn}
              className="btn btn-sm btn-outline-danger"
              aria-label="Supprimer la colonne"
            >
              <i className="bi bi-trash"></i>
            </button>
          )}
        </div>
        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          {blocks.length === 0 ? (
            <div className="text-center text-muted py-3">
              <small>Glissez des blocs ici</small>
            </div>
          ) : (
            blocks.map((block) => (
              <SortableBlock
                key={block.id}
                block={block}
                onUpdate={(updated) => onUpdate(block.id, updated)}
                onDelete={() => onDelete(block.id)}
              />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
}

function Row({ row, rowIndex, onUpdate, onDeleteRow, onDeleteColumn, onAddColumn }) {
  return (
    <div className="card mb-3" data-block-id={row.id}>
      <div className="card-header d-flex justify-content-between align-items-center">
        <span>
          <i className="bi bi-layout-three-columns me-2"></i>
          Ligne {rowIndex + 1}
        </span>
        <div className="d-flex gap-2">
          {row.columns.length < 3 && (
            <button
              type="button"
              onClick={() => onAddColumn(rowIndex)}
              className="btn btn-sm btn-outline-primary"
              aria-label="Ajouter une colonne"
            >
              <i className="bi bi-plus-circle me-1"></i>
              Colonne
            </button>
          )}
          <button
            type="button"
            onClick={() => onDeleteRow(rowIndex)}
            className="btn btn-sm btn-outline-danger"
            aria-label="Supprimer la ligne"
          >
            <i className="bi bi-trash"></i>
          </button>
        </div>
      </div>
      <div className="card-body">
        <div className="row g-2">
          {row.columns.map((column, colIndex) => (
            <DroppableColumn
              key={column.id}
              columnId={column.id}
              blocks={column.blocks}
              onUpdate={(blockId, updatedBlock) => onUpdate(rowIndex, colIndex, blockId, updatedBlock)}
              onDelete={(blockId) => onUpdate(rowIndex, colIndex, blockId, null)}
              onDeleteColumn={() => onDeleteColumn(rowIndex, colIndex)}
              columnCount={row.columns.length}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function BlockEditor({ blocks, onChange }) {
  const [layout, setLayout] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [scrollTargetId, setScrollTargetId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (!blocks || blocks.length === 0) {
      setLayout([]);
    } else if (Array.isArray(blocks) && blocks[0]?.columns) {
      setLayout(blocks);
    } else {
      const initialRow = {
        id: `row-${Date.now()}`,
        columns: [
          {
            id: `col-${Date.now()}`,
            blocks: blocks || [],
          },
        ],
      };
      setLayout([initialRow]);
    }
  }, []);

  useEffect(() => {
    if (!scrollTargetId) return;
    const timer = setTimeout(() => {
      const el = document.querySelector(`[data-block-id="${scrollTargetId}"]`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      setScrollTargetId(null);
    }, 50);
    return () => clearTimeout(timer);
  }, [scrollTargetId]);

  const notifyChange = (newLayout) => {
    setLayout(newLayout);
    onChange(newLayout);
  };

  const addRow = () => {
    const rowId = `row-${Date.now()}`;
    const newRow = {
      id: rowId,
      columns: [
        {
          id: `col-${Date.now()}`,
          blocks: [],
        },
      ],
    };
    notifyChange([...layout, newRow]);
    setScrollTargetId(rowId);
  };

  const deleteRow = (rowIndex) => {
    const newLayout = layout.filter((_, index) => index !== rowIndex);
    notifyChange(newLayout);
  };

  const addColumn = (rowIndex) => {
    const newLayout = [...layout];
    if (newLayout[rowIndex].columns.length < 3) {
      newLayout[rowIndex].columns.push({
        id: `col-${Date.now()}`,
        blocks: [],
      });
      notifyChange(newLayout);
    }
  };

  const deleteColumn = (rowIndex, colIndex) => {
    const newLayout = [...layout];
    if (newLayout[rowIndex].columns.length > 1) {
      newLayout[rowIndex].columns.splice(colIndex, 1);
      notifyChange(newLayout);
    }
  };

  const addBlock = (type) => {
    const newBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
    };

    if (type === 'title') {
      newBlock.level = 'h2';
      newBlock.text = '';
    } else if (type === 'text') {
      newBlock.text = '';
    } else if (type === 'image') {
      newBlock.filename = '';
      newBlock.alt = '';
    }

    if (layout.length === 0) {
      const newRow = {
        id: `row-${Date.now()}`,
        columns: [
          {
            id: `col-${Date.now()}`,
            blocks: [newBlock],
          },
        ],
      };
      notifyChange([newRow]);
    } else {
      const newLayout = [...layout];
      newLayout[layout.length - 1].columns[0].blocks.push(newBlock);
      notifyChange(newLayout);
    }

    setScrollTargetId(newBlock.id);
  };

  const updateBlock = (rowIndex, colIndex, blockId, updatedBlock) => {
    const newLayout = [...layout];
    if (updatedBlock === null) {
      newLayout[rowIndex].columns[colIndex].blocks = newLayout[rowIndex].columns[colIndex].blocks.filter(
        (block) => block.id !== blockId
      );
    } else {
      const blockIndex = newLayout[rowIndex].columns[colIndex].blocks.findIndex(
        (block) => block.id === blockId
      );
      if (blockIndex !== -1) {
        newLayout[rowIndex].columns[colIndex].blocks[blockIndex] = updatedBlock;
      }
    }
    notifyChange(newLayout);
  };

  const findBlockLocation = (blockId) => {
    for (let rowIndex = 0; rowIndex < layout.length; rowIndex++) {
      for (let colIndex = 0; colIndex < layout[rowIndex].columns.length; colIndex++) {
        const blockIndex = layout[rowIndex].columns[colIndex].blocks.findIndex(
          (block) => block.id === blockId
        );
        if (blockIndex !== -1) {
          return { rowIndex, colIndex, blockIndex };
        }
      }
    }
    return null;
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeLocation = findBlockLocation(active.id);
    if (!activeLocation) return;

    const { rowIndex: activeRowIndex, colIndex: activeColIndex, blockIndex: activeBlockIndex } =
      activeLocation;

    const overLocation = findBlockLocation(over.id);
    if (overLocation) {
      const { rowIndex: overRowIndex, colIndex: overColIndex, blockIndex: overBlockIndex } = overLocation;

      if (activeRowIndex === overRowIndex && activeColIndex === overColIndex) {
        const newLayout = [...layout];
        const blocks = newLayout[activeRowIndex].columns[activeColIndex].blocks;
        newLayout[activeRowIndex].columns[activeColIndex].blocks = arrayMove(
          blocks,
          activeBlockIndex,
          overBlockIndex
        );
        notifyChange(newLayout);
      } else {
        const newLayout = [...layout];
        const [movedBlock] = newLayout[activeRowIndex].columns[activeColIndex].blocks.splice(
          activeBlockIndex,
          1
        );
        newLayout[overRowIndex].columns[overColIndex].blocks.splice(overBlockIndex, 0, movedBlock);
        notifyChange(newLayout);
      }
    } else {
      for (let rowIndex = 0; rowIndex < layout.length; rowIndex++) {
        for (let colIndex = 0; colIndex < layout[rowIndex].columns.length; colIndex++) {
          if (layout[rowIndex].columns[colIndex].id === over.id) {
            const newLayout = [...layout];
            const [movedBlock] = newLayout[activeRowIndex].columns[activeColIndex].blocks.splice(
              activeBlockIndex,
              1
            );
            newLayout[rowIndex].columns[colIndex].blocks.push(movedBlock);
            notifyChange(newLayout);
            return;
          }
        }
      }
    }
  };

  return (
    <div>
      <div className="d-flex gap-2 mb-3 flex-wrap bg-white py-2 sticky-top" style={{ zIndex: 10 }}>
        <button type="button" onClick={addRow} className="btn btn-outline-success btn-sm">
          <i className="bi bi-plus-square me-1"></i>
          Ajouter une ligne
        </button>
        <button type="button" onClick={() => addBlock('title')} className="btn btn-outline-primary btn-sm">
          <i className="bi bi-type-h1 me-1"></i>
          Ajouter un titre
        </button>
        <button type="button" onClick={() => addBlock('text')} className="btn btn-outline-primary btn-sm">
          <i className="bi bi-text-paragraph me-1"></i>
          Ajouter un texte
        </button>
        <button type="button" onClick={() => addBlock('image')} className="btn btn-outline-primary btn-sm">
          <i className="bi bi-image me-1"></i>
          Ajouter une image
        </button>
      </div>

      {layout.length === 0 ? (
        <div className="alert alert-info" role="alert">
          Aucun contenu pour le moment. Utilisez les boutons ci-dessus pour ajouter du contenu.
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {layout.map((row, rowIndex) => (
            <Row
              key={row.id}
              row={row}
              rowIndex={rowIndex}
              onUpdate={updateBlock}
              onDeleteRow={deleteRow}
              onDeleteColumn={deleteColumn}
              onAddColumn={addColumn}
            />
          ))}
        </DndContext>
      )}
    </div>
  );
}
