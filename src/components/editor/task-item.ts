// import { Mark } from 'tiptap';
import { mergeAttributes, Node } from "@tiptap/core";

export const Paragraph = Node.create({
  name: "paragraph",
  group: "block",
  // content: "block+",
  content: "inline*",
  priority: 100,

  parseHTML() {
    return [{ tag: "p" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "p",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
});

// TODO: handle changing state (modify TaskItem from TipTap)
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
          "data-checked": attributes.checked,
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
});
