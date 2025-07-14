import { Puck } from "@measured/puck";
import "@measured/puck/puck.css";
import { DropZone } from "@measured/puck";

// Create Puck component config
const config = {
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
            <div
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
            >
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

// Describe the initial data
const initialData = {};

// Save the data to your database
/*const save = (data, setConfig, setData) => {
    console.log(data)
    setConfig(config)
    setData(data)
};*/

// Render Puck editor
export function Editor({setConfig, setData, onSave}) {
  return <Puck
    config={config} data={initialData} onPublish={(d) => onSave(d)}
  />
}
//config={config} data={initialData} onPublish={(d) => save(d, setConfig, setData)}