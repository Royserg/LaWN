"use client";

import { useFileStore } from "@/store/file.store";
import { FC, useEffect, useState } from "react";

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

  return <div>{content}</div>;
};

Content.displayName = "Content";

export { Content };
