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
