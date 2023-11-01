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

  editorValue: string;
  setEditorValue: (value: string) => void;

  getDirectoryFiles: (
    dirHandle: FileSystemDirectoryHandle,
  ) => Promise<FileOrDirectoryType[] | undefined>;
  pickRootDirectory: () => Promise<void>;
  selectFile: (fileHandle: FileSystemFileHandle) => void;

  saveContentToFile: (content: string) => void;
  createFile: (name: string) => void;

  initializeStore: () => Promise<void>;
};

export const useFileStore = create<FileStore>()((set, get) => ({
  editorValue: "",
  setEditorValue: (value) => {
    set({
      editorValue: value,
    });
  },

  createFile: async (name) => {
    const rootDirHandle = get().rootDirHandle;

    if (!rootDirHandle) {
      console.error("Root directory missing.");
      return;
    }

    // NOTE: Doesn't create new file if the name already exists
    const fileExt = ".md";
    const newFile = await rootDirHandle.getFileHandle(`${name}${fileExt}`, {
      create: true,
    });

    set({
      rootFiles: [...get().rootFiles, newFile],
    });
  },

  saveContentToFile: async (content) => {
    // NOTE: create a new handle (user chooses destination)
    // const fileHandle = await window.showSaveFilePicker({
    //   startIn: "desktop",
    //   suggestedName: "lawn-file",
    //   types: [
    //     {
    //       description: "markdown",
    //       accept: {
    //         "text/markdown": [".md"],
    //       },
    //     },
    //   ],
    // });
    // console.log("fileHandle", fileHandle);
    //
    // set({
    //   rootFiles: [...get().rootFiles, fileHandle],
    // });

    // create a FileSystemWritableFileStream to write to
    const selectedFile = get().selectedFile;
    if (!selectedFile) {
      console.error("No file selected");
      return;
    }

    const writableStream = await selectedFile.createWritable();

    // write our file
    await writableStream.write(content);

    // close the file and write the contents to disk.
    await writableStream.close();
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
