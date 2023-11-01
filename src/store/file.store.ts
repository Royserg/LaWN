import { create } from "zustand";
import { get as idbGet, set as idbSet } from "idb-keyval";

export type FileOrDirectoryType =
  | FileSystemDirectoryHandle
  | FileSystemFileHandle;

const persistanceKeys = {
  rootDirHandle: "rootDirHandle",
};

type FileStore = {
  rootDirHandle: FileSystemDirectoryHandle | null;
  rootFiles: FileOrDirectoryType[];
  selectedFile: FileSystemFileHandle | null;

  getDirectoryFiles: (
    dirHandle: FileSystemDirectoryHandle,
  ) => Promise<FileOrDirectoryType[] | undefined>;
  pickRootDirectory: () => Promise<void>;
  selectFile: (fileHandle: FileSystemFileHandle) => void;

  saveContentToFile: (content: string) => void;
  createInMemoryFile: (name: string) => void;

  initializeStore: () => Promise<void>;
};

export const useFileStore = create<FileStore>()((set, get) => ({
  createInMemoryFile: async (name) => {
    console.log("NEW FILE NAME: ", name);
    // TODO: this has error that FileSystemFileEntry doesn't exist
    const file = new FileSystemFileEntry();
    console.log("FILE", file);
    // file.name = ''
  },

  rootDirHandle: null,
  rootFiles: [],
  selectedFile: null,

  pickRootDirectory: async () => {
    let handle: FileSystemDirectoryHandle;

    try {
      handle = await window.showDirectoryPicker({ mode: "readwrite" });
      const files = await get().getDirectoryFiles(handle);

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
        if (!fileOrDir.name.startsWith(".")) {
          files.push(fileOrDir);
        }
      }
      return files;
    } catch (err) {
      console.log("Reading directory files error:", err);
    }
  },

  saveContentToFile: async (content) => {
    // create a new handle
    const fileHandle = await window.showSaveFilePicker({
      startIn: "desktop",
      suggestedName: "lawn-file",
      types: [
        {
          description: "markdown",
          accept: {
            "text/markdown": [".md"],
          },
        },
      ],
    });

    console.log("fileHandle", fileHandle);
    set({
      rootFiles: [...get().rootFiles, fileHandle],
    });

    // create a FileSystemWritableFileStream to write to
    const writableStream = await fileHandle.createWritable();

    // write our file
    await writableStream.write(content);

    // close the file and write the contents to disk.
    await writableStream.close();
  },

  selectFile: (fileHandle) => {
    set({ selectedFile: fileHandle });
  },

  initializeStore: async () => {
    const rootDirHandle = await idbGet(persistanceKeys.rootDirHandle);
    const files = await get().getDirectoryFiles(rootDirHandle);

    set({
      rootDirHandle: rootDirHandle,
      rootFiles: files || [],
    });
  },
}));
