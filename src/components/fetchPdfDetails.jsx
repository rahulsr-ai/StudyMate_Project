import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { savePdfData} from "@/utils/ApiCalls";




export function UploadPdfDialog({ open, setOpen, userDetails, containers }) {
  const [formData, setFormData] = useState({
    title: "",
    container: "",
    description: "",
    pdfFile: null,
    pdfPreview: "",
  });
  const [error, setError] = useState("");
  const [creatingNewContainer, setCreatingNewContainer] = useState(false);
    const [loading, setLoading] = useState(false);

  // Handle File Upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    

    if (file && file.type === "application/pdf") {
      setFormData({
        ...formData,
        pdfFile: file,
        pdfPreview: URL.createObjectURL(file),
        title: file.name
      });
      setError("");
    } else {
      setError("Only PDF files are allowed.");
    }
  };

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    console.log("form data", formData);

    if (!formData.pdfFile) {
      setError("Please upload a PDF file.");
      return;
    }

    
    await savePdfData(userDetails?.id, formData);
    setLoading(false)
    setOpen(false);

    
  };

  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md bg-[var(--foreground)] border-none rounded-md ">
        <DialogHeader>
          <DialogTitle className={"text-[var(--primary-color)]"}>Upload PDF</DialogTitle>
          <DialogDescription>
            Select a PDF file and provide details to upload.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* PDF Upload Field */}
          <div className="grid gap-2">
            <Label htmlFor="pdfFile">Upload PDF</Label>
            <Input
              id="pdfFile"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              required
              className={"bg-gray-200"}
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}

          {/* Title Input */}
          <div className="grid gap-2">
            <Label htmlFor="title">Name</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter Pdf name..."
              value={formData?.title || ""}
              onChange={handleChange}
              required
              className={"text-white"}
            />
          </div>

          {/* Category Select */}
          <div className="grid gap-2">
            <Label>Study Container</Label>
            <Select
              onValueChange={(value) => {
                if (value === "new") {
                  setCreatingNewContainer(true);
                } else {
                  setFormData({ ...formData, container: value });
                }
              }}
            >
              <SelectTrigger className="w-full text-white">
                <SelectValue placeholder="Choose Study Container" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Containers</SelectLabel>
                  {containers.map((container, index) => (
                    <SelectItem key={index} value={container?.name}>
                      {container?.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="new" className="text-blue-500">
                    + Create New Container
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Input for New Container */}
            {creatingNewContainer && (
              <div className="flex gap-2 mt-2">
                <Input
                  id="container"
                  name="container"
                  placeholder="Enter container name..."
                  onChange={handleChange}
                className={"text-white"}
                />
              </div>
            )}
          </div>

          {/* Description Textarea */}
          <div className="grid gap-2">
            <Label htmlFor="description">Quick Notes</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Any additional notes..."
              value={formData.description}
              onChange={handleChange}
              className={"text-white"}
            />
          </div>

          {/* Save Button */}
          <DialogFooter className="mt-4">
            <Button type="submit" className="px-4 bg-[var(--primary-color)] hover:bg-[var(--primary-color-hover)]">
              Create
            </Button>
          </DialogFooter>

          { loading && 
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                <div className=" dark:bg-gray-800 md:rounded-lg p-6 shadow-lg flex items-center justify-center">
                  {/* Spinner */}
                  <div className="border-t-4 border-b-4 border-[var(--primary-color)] h-12 w-12 rounded-full animate-spin"></div>
                </div>
              </div>
          }

        </form>
      </DialogContent>
    </Dialog>
  );
}
