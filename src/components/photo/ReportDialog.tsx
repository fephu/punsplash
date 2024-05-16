"use client";

import { Ellipsis, Flag } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { toast } from "sonner";

const ReportDialog = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onSubmit = () => {
    setIsOpen(false);

    toast.success("We appreciate your report.");
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant={"outline"} size={"sm"} className="shadow-md">
            <Ellipsis className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-28 p-0">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant={"ghost"}>
                Report
                <Flag className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-3xl">Report</DialogTitle>
                <DialogDescription>
                  Can you choose your type? We will consider later
                </DialogDescription>
              </DialogHeader>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select your type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spam">Spam</SelectItem>
                  <SelectItem value="license">License</SelectItem>
                </SelectContent>
              </Select>

              <DialogFooter className="flex items-center gap-3">
                <Button variant={"outline"} onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={onSubmit}>Submit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default ReportDialog;
