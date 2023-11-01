import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { FilePlus2 } from "lucide-react";
import { useFileStore } from "@/store/file.store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const Toolbar: FC = () => {
  const rootDirHandle = useFileStore((s) => s.rootDirHandle);

  return (
    <div className="flex gap-2 border-b rounded-sm px-1">
      {rootDirHandle && <AddFileButton />}
    </div>
  );
};

const AddFileButton: FC = () => {
  const [open, setOpen] = useState(false);
  const createFile = useFileStore((s) => s.createFile);
  const [filename, setFilename] = useState("");

  const handleAddNewFile = () => {
    if (filename.length === 0) {
      return;
    }

    try {
      createFile(filename);
      setOpen(false);
    } catch (err) {
      console.error("Creating file failed", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"} size={"sm"} className="p-0">
          <FilePlus2 className="w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new File</DialogTitle>
          <DialogDescription>
            Choose name for new markdown file.
          </DialogDescription>

          <div className="p-2 flex flex-col gap-4">
            <Input
              name="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="Filename..."
            />
            <Button
              type="submit"
              onClick={handleAddNewFile}
              disabled={filename.length === 0}
            >
              Add
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export { Toolbar };
