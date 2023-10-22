"use client";

import { FC } from "react";

interface EditorProps {
  fileContent: string;
}

const Editor: FC<EditorProps> = ({ fileContent }) => {
  return <div>{fileContent}</div>;
};

Editor.displayName = "Editor";

export { Editor };
