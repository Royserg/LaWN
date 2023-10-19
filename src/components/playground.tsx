"use client";

import { Button } from "@/components/ui/button";
import { useFileStore } from "@/store/file.store";
import { FolderClosed } from "lucide-react";
import { FC, useEffect } from "react";
import { FileList } from "./file-list";

const Playground: FC = () => {
  const pickRootDirectory = useFileStore((state) => state.pickRootDirectory);
  const initializeFileStore = useFileStore((state) => state.initializeStore);

  useEffect(() => {
    initializeFileStore();
  }, []);

  const pickDirectory = async () => {
    await pickRootDirectory();
  };

  return (
    <main className="flex flex-col justify-start w-full h-full gap-2">
      <nav className="flex gap-6 justify-start items-end">
        <h2>LaWN</h2>
        <Button size={"sm"} variant={"outline"} onClick={pickDirectory}>
          <FolderClosed className="w-4" />
        </Button>
      </nav>

      <div className="flex rounded-md h-full w-full">
        {/* File tree */}
        <section className="w-1/6 rounded-md border py-2 px-1">
          <FileList />
        </section>

        {/* Content */}
        <section className="w-5/6 border border-black rounded-md bg-slate-50"></section>
      </div>
    </main>
  );
};
Playground.displayName = "Files";

export { Playground };
