import { createUsePuck, Puck } from "@measured/puck";
import "@measured/puck/puck.css";
import { DropZone } from "@measured/puck";
import { Button } from "react-bootstrap";

const config = {
    // Définitions des catégories de composants
    categories: {
        typography: {
            components: ["HeadingBlock", "Card", "Image"],
            title: "Principale",
            defaultExpanded: true, // Collapse this category by default
        },
        foundational: {
            components: ["Colonnes"],
            defaultExpanded: false,
        },
    },
    // Définitions des composants
    components: {
        HeadingBlock: {
            fields: {
                children: {
                    type: "text",
                },
                title: {
                    type: "text",
                },
            },
            render: ({ children, title }) => {
                return <h1 aria-details={title}>{children}</h1>;
            },
        },
        Image: {
            fields: {
                txt: {
                    type: "text",
                },
                url: {
                    type: "text",
                },
            },
            render: ({ url, txt }) => {
                return <img alt={txt} src={url} />;
            },
        },
        Colonnes: {
            render: () => {
                return (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <DropZone zone="left-column" />
                        <DropZone zone="right-column" />
                    </div>
                );
            },
        },
        Card: {
            fields: {
                mytext: {
                    type: "text",
                },
                title: {
                    type: "text",
                },
            },
            render: ({ mytext, title }) => <div aria-name={title}>{mytext}</div>,
        },
    },
};

const usePuck = createUsePuck();

export function Editor({ initialData, onSave, isEditing }) {
    return (
        <Puck
            config={config}
            data={initialData}
            onPublish={(d) => onSave(d)}
            overrides={{
                headerActions: () => {
                    const appState = usePuck((s) => s.appState);

                    return (
                        <>
                            <Button
                                variant={isEditing ? "primary" : "success"}
                                onClick={() => {
                                    onSave(appState.data);
                                }}
                            >
                                <i className={`bi ${isEditing ? "bi-floppy" : "bi-plus-circle"} me-1`}></i>
                                {isEditing ? "Sauvegarder" : "Créer"}
                            </Button>
                        </>
                    );
                },
            }}
        />
    );
}
