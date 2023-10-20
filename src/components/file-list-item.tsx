"use client";

import { FileOrDirectoryType, useFileStore } from "@/store/file.store";
import { File, Folder, FolderOpen } from "lucide-react";
import { FC, useState } from "react";
import { Toggle } from "@/components/ui/toggle";
import { FileList } from "./file-list";

interface FileListItemProps {
  data: FileOrDirectoryType;
}
export const FileListItem: FC<FileListItemProps> = ({ data }) => {
  const getDirFiles = useFileStore((state) => state.getDirectoryFiles);
  const [pressed, setPressed] = useState(false);
  const [files, setFiles] = useState<FileOrDirectoryType[]>([]);

  const handleDirectoryClick = async (isPressed: boolean) => {
    setPressed(isPressed);
    if (isPressed) {
      const dirFiles = await getDirFiles(data as FileSystemDirectoryHandle);
      if (dirFiles) {
        setFiles(dirFiles);
      }
    }

    if (!isPressed) {
      setFiles([]);
    }
  };

  const content = () => {
    if (data.kind === "directory") {
      return (
        <Toggle
          className="flex justify-start items-center w-full gap-2 hover:bg-slate-100 p-0"
          onPressedChange={handleDirectoryClick}
          size={"sm"}
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
    <>
      <div className="pl-1 cursor-pointer flex justify-start items-center gap-2 hover:bg-slate-100 rounded-md transition-colors">
        {content()}
      </div>
      {files && files.length > 0 && (
        <FileList files={files} className="text-[10px] pl-1" />
      )}
    </>
  );
};
FileListItem.displayName = "FileListItem";
