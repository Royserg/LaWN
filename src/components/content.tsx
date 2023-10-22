"use client";

import { useFileStore } from "@/store/file.store";
import { FC, useEffect, useState } from "react";
import { Editor } from "./editor";

const Content: FC = () => {
  const selectedFile = useFileStore((s) => s.selectedFile);
  const [content, setContent] = useState<string | null>(null);

  useEffect(() => {
    const readFileContent = async () => {
      if (selectedFile) {
        const file = await selectedFile.getFile();
        const content = await file.text();
        setContent(content);
      }
    };
    readFileContent();
  }, [selectedFile]);

  if (!selectedFile) {
    return <div className="p-4 text-gray-300">Select file</div>;
  }

  return (
    <div className="pt-4">
      <Editor fileContent={content!} />
    </div>
  );
};
Content.displayName = "Content";

export { Content };
