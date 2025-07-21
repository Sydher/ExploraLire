import { createUsePuck, Puck } from "@measured/puck";
import "@measured/puck/puck.css";
import { Button } from "react-bootstrap";
import { EditorConfig } from "./EditorConfig";

const usePuck = createUsePuck();

export function Editor({ initialData, onSave, isEditing }) {
    return (
        <Puck
            config={EditorConfig}
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
