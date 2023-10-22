"use client";

import { Toggle } from "@/components/ui/toggle";
import { FileOrDirectoryType, useFileStore } from "@/store/file.store";
import { File, Folder, FolderOpen } from "lucide-react";
import { FC, useEffect, useState } from "react";
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
      <div className="pl-1 cursor-pointer hover:bg-slate-100 rounded-md transition-colors">
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
  fileHandle: FileSystemFileHandle;
}
const ItemFile: FC<ItemFileProps> = ({ fileHandle }) => {
  const [isSelected, setIsSelected] = useState(false);

  const selectFile = useFileStore((s) => s.selectFile);
  const selectedFile = useFileStore((s) => s.selectedFile);

  const handleFileClick = async () => {
    selectFile(fileHandle);
  };

  useEffect(() => {
    const checkSelected = async () => {
      if (selectedFile) {
        const isSelected = await selectedFile.isSameEntry(fileHandle);
        setIsSelected(isSelected);
      }
    };

    checkSelected();
  }, [selectedFile, fileHandle]);

  return (
    <Toggle
      className="flex justify-start hover:bg-slate-100 p-0 pl-1 data-[state=on]:bg-slate-100 tracking-tighter w-full rounded-md transition-colors"
      onPressedChange={handleFileClick}
      pressed={isSelected}
      size={"sm"}
    >
      <div className="w-max flex justify-start items-center gap-2">
        <File className="w-3" />
        {fileHandle.name}
      </div>
    </Toggle>
  );
  // </div>
};
