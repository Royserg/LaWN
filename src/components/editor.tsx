"use client";

import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { FC, useEffect } from "react";
import rehypeParse from "rehype-parse";
import rehypeRemark from "rehype-remark";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import { Input, Paragraph } from "./editor/task-item";

// import { micromark } from "micromark";
// import { gfm, gfmHtml } from "micromark-extension-gfm";

interface EditorProps {
  fileContent: string;
}

const Editor: FC<EditorProps> = ({ fileContent }) => {
  const editor = useEditor({
    // extensions: [StarterKit, Input, Paragraph],
    extensions: [Document, Text, Paragraph, Input],
    content: "<p>Loading...</p>",
    injectCSS: false,
    editorProps: {
      attributes: {
        class: "focus:outline-none h-full w-full pl-4 pr-4 pb-4",
      },
    },
    onUpdate: async ({ editor }) => {
      const html = editor.getHTML();
      console.log("editor HTML:", html);

      // Convert html to markdown
      const md = await unified()
        .use(rehypeParse)
        .use(rehypeRemark)
        .use(remarkStringify)
        .process(html);

      console.log("md: ", String(md));
    },
  });

  useEffect(() => {
    const setEditorContent = async () => {
      // const output = micromark(fileContent, {
      //   allowDangerousHtml: true,
      //   extensions: [gfm()],
      //   htmlExtensions: [gfmHtml()],
      // });
      // console.log("HTML - micromark:", output);

      const html = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypeStringify)
        .process(fileContent);

      console.log("HTML - unified: ", html.value);

      editor?.commands.setContent(html.value);
    };

    setEditorContent();
  }, [fileContent, editor]);

  return <EditorContent editor={editor} />;
};

Editor.displayName = "Editor";

export { Editor };
