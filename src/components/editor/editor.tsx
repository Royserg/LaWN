"use client";

import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import { EditorContent, useEditor } from "@tiptap/react";
import { FC, useEffect } from "react";
import rehypeParse from "rehype-parse";
import rehypeRemark from "rehype-remark";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import { Input } from "./extensions/input";
import { Paragraph } from "./extensions/paragraph";
import Heading from "@tiptap/extension-heading";
// import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";

import { micromark } from "micromark";
import { gfm, gfmHtml } from "micromark-extension-gfm";
import { ListItem } from "./extensions/list-item";

interface EditorProps {
  fileContent: string;
}

const Editor: FC<EditorProps> = ({ fileContent }) => {
  const editor = useEditor({
    extensions: [
      Document,
      Text,
      Heading,
      Paragraph,
      Input,
      BulletList,
      ListItem,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
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

      const stringMd = String(md);

      // NOTE: <li> have automatically inserted <h1> tag
      // which appears in the output String as "* # \[ ] todo item"
      const parsed = stringMd.replaceAll("* # ", "- ").replaceAll("\\[", "[");

      console.log("parsed:", parsed);
    },
  });

  useEffect(() => {
    const setEditorContent = async () => {
      const html = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypeStringify)
        .process(fileContent);

      console.log("HTML - unified: ", html.value);

      // const output = micromark(fileContent, {
      //   allowDangerousHtml: true,
      //   extensions: [gfm()],
      //   htmlExtensions: [gfmHtml()],
      // });
      // console.log("HTML - micromark: ", output);

      editor?.commands.setContent(html.value);
    };

    setEditorContent();
  }, [fileContent, editor]);

  return <EditorContent editor={editor} />;
};

Editor.displayName = "Editor";

export { Editor };
