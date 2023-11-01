import { mergeAttributes, Node } from "@tiptap/core";

export interface ListItemOptions {
  HTMLAttributes: Record<string, any>;
  bulletListTypeName: string;
  orderedListTypeName: string;
}

export const ListItem = Node.create<ListItemOptions>({
  name: "listItem",

  addOptions() {
    return {
      HTMLAttributes: {},
      bulletListTypeName: "bulletList",
      orderedListTypeName: "orderedList",
    };
  },

  // content: "paragraph block*",
  // content: "block*",
  content: "block",
  group: "block",

  defining: true,

  parseHTML() {
    return [
      {
        tag: "li",
      },
    ];
  },

  // How element is renderedToHTML to and from editor
  renderHTML({ HTMLAttributes }) {
    return [
      "li",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },

  addKeyboardShortcuts() {
    return {
      Enter: () => this.editor.commands.splitListItem(this.name),
      Tab: () => this.editor.commands.sinkListItem(this.name),
      "Shift-Tab": () => this.editor.commands.liftListItem(this.name),
    };
  },
});
