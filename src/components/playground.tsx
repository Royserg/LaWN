"use client";

import { Button } from "@/components/ui/button";
import { useFileStore } from "@/store/file.store";
import { FolderClosed } from "lucide-react";
import { FC, useEffect } from "react";
import { Content } from "./content";
import { FileList } from "./file-list";
import { Toolbar } from "./toolbar";

const Playground: FC = () => {
  const pickRootDirectory = useFileStore((state) => state.pickRootDirectory);
  const initializeFileStore = useFileStore((state) => state.initializeStore);
  const rootFiles = useFileStore((state) => state.rootFiles);
  const saveContentToFile = useFileStore((state) => state.saveContentToFile);

  useEffect(() => {
    initializeFileStore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pickDirectory = async () => {
    await pickRootDirectory();
  };

  return (
    <main className="flex flex-col justify-start w-full h-full gap-2">
      <nav className="flex gap-6 justify-between items-end">
        <div className="flex gap-6 items-end">
          <h2>LaWN</h2>
          <Button size={"sm"} variant={"outline"} onClick={pickDirectory}>
            <FolderClosed className="w-4" />
          </Button>
        </div>

        <Button
          variant={"outline"}
          size={"sm"}
          onClick={() =>
            saveContentToFile(
              "# Heading 1\n## Heading 2\n - [ ] Todo 1\n - [x] todo completed",
            )
          }
        >
          Save
        </Button>
      </nav>

      <div className="flex rounded-md h-full w-full">
        {/* File tree */}
        <section className="w-1/6 rounded-md border">
          <Toolbar />
          <div className="px-1 py-1">
            <FileList files={rootFiles} />
          </div>
        </section>

        {/* Content */}
        <section className="w-5/6 border border-black rounded-md bg-slate-50">
          <Content />
        </section>
      </div>
    </main>
  );
};
Playground.displayName = "Playground";

export { Playground };
