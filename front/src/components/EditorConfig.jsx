import "@measured/puck/puck.css";
import { DropZone } from "@measured/puck";

export const EditorConfig = {
    // Définitions des catégories de composants
    categories: {
        principales: {
            components: ["Titre1", "Texte", "Image"],
            defaultExpanded: true,
        },
        titres: {
            components: ["Titre1", "Titre2", "Titre3"],
            defaultExpanded: false,
        },
        foundational: {
            components: ["Colonnes"],
            defaultExpanded: false,
        },
    },
    // Définitions des composants
    components: {
        Titre1: {
            fields: {
                texte: {
                    type: "text",
                },
            },
            render: ({ texte }) => {
                return <h1>{texte}</h1>;
            },
        },
        Titre2: {
            fields: {
                texte: {
                    type: "text",
                },
            },
            render: ({ texte }) => {
                return <h2>{texte}</h2>;
            },
        },
        Titre3: {
            fields: {
                texte: {
                    type: "text",
                },
            },
            render: ({ texte }) => {
                return <h3>{texte}</h3>;
            },
        },
        Texte: {
            fields: {
                texte: {
                    type: "textarea",
                },
            },
            render: ({ texte }) => <p>{texte}</p>,
        },
        Image: {
            fields: {
                nom: {
                    type: "text",
                },
                url: {
                    type: "text",
                },
            },
            render: ({ url, nom }) => {
                return <img alt={nom} src={url} />;
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
    },
};
