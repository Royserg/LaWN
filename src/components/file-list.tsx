"use client";

import { FileOrDirectoryType } from "@/store/file.store";
import { FC } from "react";
import { FileListItem } from "./file-list-item";
import { cn } from "@/lib/utils";

interface FileListProps {
  files: FileOrDirectoryType[];
  className?: string;
}

const FileList: FC<FileListProps> = ({ files, className }) => {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {files.map((file, idx) => {
        return <FileListItem key={idx} data={file} />;
      })}
    </div>
  );
};
FileList.displayName = "FileList";

export { FileList };
