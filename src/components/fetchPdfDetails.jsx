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
import { CreateNewContainerAndAddPDFData, savePdfData} from "@/utils/ApiCalls";
import axios from "axios";

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

  // Handle File Upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setFormData({
        ...formData,
        pdfFile: file,
        pdfPreview: URL.createObjectURL(file),
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
    console.log("form data", formData);

    if (!formData.pdfFile) {
      setError("Please upload a PDF file.");
      return;
    }

    
    await savePdfData(userDetails?.id, formData);
    setOpen(false);

  //   try {
      
      
      
  //     const response  = axios.post(`/api/Create/NewContainer/And/AddPDFData`, {finalFormData},  )

  //     setOpen(false);
  //     console.log('data just before returning ', response);
      
  //     return 
  //  } catch (error) {
  //     console.log('frontend error while creating new container ', error);
  //     return null
  //  }

    
  };

  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload PDF</DialogTitle>
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
              value={formData.title}
              onChange={handleChange}
              required
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
              <SelectTrigger className="w-full">
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
            />
          </div>

          {/* Save Button */}
          <DialogFooter className="mt-4">
            <Button type="submit" className="px-4">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
