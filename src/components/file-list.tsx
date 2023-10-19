"use client";

import { useFileStore } from "@/store/file.store";
import { FC } from "react";
import { FileListItem } from "./file-list-item";

const FileList: FC = () => {
  const files = useFileStore((state) => state.rootFiles);

  return (
    <div className="flex flex-col gap-1">
      {files.map((file, idx) => {
        return <FileListItem key={idx} data={file} />;
      })}
    </div>
  );
};
FileList.displayName = "FileList";

export { FileList };
