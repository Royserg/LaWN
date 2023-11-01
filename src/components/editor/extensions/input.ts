import { Node } from "@tiptap/core";

export const Input = Node.create({
  name: "input",
  group: "inline",
  content: "inline*",
  inline: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      checked: {
        default: false,
        keepOnSplit: false,
        parseHTML: (element: HTMLInputElement) => element.checked,
        renderHTML: (attributes) => ({
          checked: attributes.checked,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "input[type=checkbox]",
      },
    ];
  },

  renderHTML({ node }) {
    return [
      "input",
      {
        type: "checkbox",
        checked: node.attrs.checked || null,
      },
      0,
    ];
  },

  addNodeView() {
    return ({ HTMLAttributes, getPos, editor }) => {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = HTMLAttributes.checked;
      checkbox.contentEditable = "true";

      checkbox.addEventListener("change", (event) => {
        const isChecked = (<HTMLInputElement>event.target).checked;

        if (editor.isEditable && typeof getPos === "function") {
          editor
            .chain()
            .focus(undefined, { scrollIntoView: false })
            .command(({ tr }) => {
              const position = getPos();
              const currentNode = tr.doc.nodeAt(position);

              tr.setNodeMarkup(position, undefined, {
                ...currentNode?.attrs,
                checked: isChecked || null,
              });
              return true;
            })
            .run();
        }
      });

      return {
        dom: checkbox,
        update: (updatedNode) => {
          if (updatedNode.type !== this.type) {
            return false;
          }

          if (updatedNode.attrs.checked) {
            checkbox.checked = true;
          } else {
            checkbox.checked = false;
          }

          return true;
        },
      };
    };
  },
});
