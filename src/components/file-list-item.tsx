"use client";
import { FileOrDirectoryType } from "@/store/file.store";
import { File, Folder } from "lucide-react";
import { FC } from "react";

interface FileListItemProps {
  data: FileOrDirectoryType;
}
export const FileListItem: FC<FileListItemProps> = ({ data }) => {
  const content = () => {
    if (data.kind === "directory") {
      // TODO: when folder clicked -> Toggle
      {
        /* <FolderOpen />  */
      }
      return (
        <>
          <Folder className="w-4" />
          {data.name}
        </>
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
    <div className="pl-2 cursor-pointer flex justify-start items-end gap-2 hover:bg-slate-100 rounded-md transition-colors">
      {content()}
    </div>
  );
};
FileListItem.displayName = "FileListItem";
