import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
    <div ref={setNodeRef} style={style} className="card mb-3">
      <div className="card-body">
        <div className="d-flex">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary me-3"
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

export default function BlockEditor({ blocks, onChange }) {
  const [localBlocks, setLocalBlocks] = useState(blocks || []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = localBlocks.findIndex((block) => block.id === active.id);
      const newIndex = localBlocks.findIndex((block) => block.id === over.id);

      const newBlocks = arrayMove(localBlocks, oldIndex, newIndex);
      setLocalBlocks(newBlocks);
      onChange(newBlocks);
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
      newBlock.url = '';
      newBlock.alt = '';
    }

    const newBlocks = [...localBlocks, newBlock];
    setLocalBlocks(newBlocks);
    onChange(newBlocks);
  };

  const updateBlock = (id, updatedBlock) => {
    const newBlocks = localBlocks.map((block) => (block.id === id ? updatedBlock : block));
    setLocalBlocks(newBlocks);
    onChange(newBlocks);
  };

  const deleteBlock = (id) => {
    const newBlocks = localBlocks.filter((block) => block.id !== id);
    setLocalBlocks(newBlocks);
    onChange(newBlocks);
  };

  return (
    <div>
      <div className="d-flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => addBlock('title')}
          className="btn btn-outline-primary btn-sm"
        >
          <i className="bi bi-type-h1 me-1"></i>
          Ajouter un titre
        </button>
        <button
          type="button"
          onClick={() => addBlock('text')}
          className="btn btn-outline-primary btn-sm"
        >
          <i className="bi bi-text-paragraph me-1"></i>
          Ajouter un texte
        </button>
        <button
          type="button"
          onClick={() => addBlock('image')}
          className="btn btn-outline-primary btn-sm"
        >
          <i className="bi bi-image me-1"></i>
          Ajouter une image
        </button>
      </div>

      {localBlocks.length === 0 ? (
        <div className="alert alert-info" role="alert">
          Aucun bloc pour le moment. Utilisez les boutons ci-dessus pour ajouter du contenu.
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={localBlocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
            {localBlocks.map((block) => (
              <SortableBlock
                key={block.id}
                block={block}
                onUpdate={(updated) => updateBlock(block.id, updated)}
                onDelete={() => deleteBlock(block.id)}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
