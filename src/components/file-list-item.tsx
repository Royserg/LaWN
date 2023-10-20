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
  if (data.kind === "directory") {
    return <ItemDirectory dirHandle={data} />;
  }

  if (data.kind === "file") {
    return <ItemFile fileHandle={data} />;
  }
};
FileListItem.displayName = "FileListItem";

// Item Directory

interface ItemDirectoryProps {
  dirHandle: FileSystemDirectoryHandle;
}
const ItemDirectory: FC<ItemDirectoryProps> = ({ dirHandle }) => {
  const getDirFiles = useFileStore((state) => state.getDirectoryFiles);
  const [pressed, setPressed] = useState(false);
  const [files, setFiles] = useState<FileOrDirectoryType[]>([]);

  const handleDirectoryClick = async (isPressed: boolean) => {
    setPressed(isPressed);
    if (isPressed) {
      const dirFiles = await getDirFiles(dirHandle);
      if (dirFiles) {
        setFiles(dirFiles);
      }
    }

    if (!isPressed) {
      setFiles([]);
    }
  };
  return (
    <>
      <div className="pl-1 cursor-pointer flex justify-start items-center gap-2 hover:bg-slate-100 rounded-md transition-colors">
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
          {dirHandle.name}
        </Toggle>
      </div>
      {files && files.length > 0 && (
        <FileList files={files} className="text-[10px] pl-1" />
      )}
    </>
  );
};

// Item File

interface ItemFileProps {
  fileHandle: FileSystemHandle;
}
const ItemFile: FC<ItemFileProps> = ({ fileHandle }) => {
  return (
    <div className="pl-1 cursor-pointer flex justify-start items-center gap-2 hover:bg-slate-100 rounded-md transition-colors">
      <File className="w-4" />
      {fileHandle.name}
    </div>
  );
};
