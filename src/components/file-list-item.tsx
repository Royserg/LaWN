"use client";

import { FileOrDirectoryType } from "@/store/file.store";
import { File, Folder, FolderOpen } from "lucide-react";
import { FC, useState } from "react";
import { Toggle } from "@/components/ui/toggle";

interface FileListItemProps {
  data: FileOrDirectoryType;
}
export const FileListItem: FC<FileListItemProps> = ({ data }) => {
  const [pressed, setPressed] = useState(false);

  const content = () => {
    if (data.kind === "directory") {
      return (
        <Toggle
          className="flex justify-start items-center w-full gap-2 hover:bg-slate-100 p-0"
          onPressedChange={(isPressed) => {
            setPressed(isPressed);
          }}
        >
          {pressed ? (
            <FolderOpen className="w-4" />
          ) : (
            <Folder className="w-4" />
          )}
          {data.name}
        </Toggle>
      );
    }

    if (data.kind === "file") {
      return (
        <>
          <File className="w-4" />
          {data.name}
        </>
      );
    }
  };

  return (
    <div className="pl-1 cursor-pointer flex justify-start items-center gap-2 hover:bg-slate-100 rounded-md transition-colors">
      {content()}
    </div>
  );
};
FileListItem.displayName = "FileListItem";
