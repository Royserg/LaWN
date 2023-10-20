import { get as idbGet, set as idbSet } from "idb-keyval";
import { create } from "zustand";

export type FileOrDirectoryType =
  | FileSystemDirectoryHandle
  | FileSystemFileHandle;

const persistanceKeys = {
  rootDirHandle: "rootDirHandle",
};

type FileStore = {
  rootDirHandle: FileSystemDirectoryHandle | null;
  rootFiles: FileOrDirectoryType[];

  getDirectoryFiles: (
    dirHandle: FileSystemDirectoryHandle,
  ) => Promise<FileOrDirectoryType[] | undefined>;
  pickRootDirectory: () => Promise<void>;

  initializeStore: () => Promise<void>;
};

export const useFileStore = create<FileStore>()(
  // persist(
  (set, get) => ({
    rootDirHandle: null,
    rootFiles: [],

    pickRootDirectory: async () => {
      let handle: FileSystemDirectoryHandle;

      try {
        handle = await window.showDirectoryPicker({ mode: "readwrite" });

        const files: FileOrDirectoryType[] = [];
        for await (const fileOrDir of handle.values()) {
          if (!fileOrDir.name.startsWith(".")) {
            files.push(fileOrDir);
          }
        }

        set({
          rootDirHandle: handle,
          rootFiles: files,
        });

        await idbSet(persistanceKeys.rootDirHandle, handle);
      } catch (err) {
        if (err instanceof DOMException) {
          console.log("User canceled directory select prompt");
        } else {
          console.log("ERROR:", err);
        }
      }
    },

    getDirectoryFiles: async (dirHandle: FileSystemDirectoryHandle) => {
      try {
        const files: FileOrDirectoryType[] = [];
        for await (const fileOrDir of dirHandle.values()) {
          files.push(fileOrDir);
        }
        return files;
      } catch (err) {
        console.log("Reading directory files error:", err);
      }
    },

    initializeStore: async () => {
      const rootDirHandle = await idbGet(persistanceKeys.rootDirHandle);
      const files = await get().getDirectoryFiles(rootDirHandle);

      set({
        rootDirHandle: rootDirHandle,
        rootFiles: files || [],
      });
    },
  }),
);
