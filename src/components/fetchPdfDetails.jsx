import { useState } from "react";
import { savePdfData } from "@/utils/ApiCalls";

export function UploadPdfDialog({ open, setOpen, userDetails, containers }) {
  const [formData, setFormData] = useState({
    title: "",
    container: "",
    description: "",
    pdfFile: null,
    pdfPreview: "",
  });

  const [creatingNewContainer, setCreatingNewContainer] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type === "application/pdf") {
      setFormData({
        ...formData,
        pdfFile: file,
        pdfPreview: URL.createObjectURL(file),
        title: file.name,
      });
      setError("");
    } else {
      setError("Only PDF files are allowed.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.pdfFile) {
      setError("Please upload a PDF file.");
      setLoading(false);
      return;
    }

    await savePdfData(userDetails?.id, formData);
    setLoading(false);
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center ">
      <div className="bg-[var(--foreground)] p-6 rounded-md w-full max-w-md relative">

         <div 
        onClick={() =>  setOpen(false)}
        className="cursor-pointer scale-95 transition-all w-fit absolute right-2 top-4">
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e7dfdf" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </div>

        <h2 className="text-lg font-bold text-[var(--primary-color)]">Upload PDF</h2>
        <p className="text-sm text-white mb-4">Select a PDF file and provide details to upload.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* PDF Upload */}
          <div className="grid gap-2">
            <label htmlFor="pdfFile" className="text-white">Upload PDF</label>
            <input
              id="pdfFile"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              required
              className="bg-gray-200 rounded p-2"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Title Input */}
          <div className="grid gap-2">
            <label htmlFor="title" className="text-white">Name</label>
            <input
              id="title"
              name="title"
              placeholder="Enter Pdf name..."
              value={formData.title}
              onChange={handleChange}
              required
              className="bg-gray-800 text-white p-2 rounded"
            />
          </div>

          {/* Study Container */}
          <div className="grid gap-2">
            <label htmlFor="containerSelect" className="text-white">Study Container</label>
            <select
              id="containerSelect"
              value={formData.container}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "new") {
                  setCreatingNewContainer(true);
                  setFormData({ ...formData, container: "" });
                } else {
                  setCreatingNewContainer(false);
                  setFormData({ ...formData, container: val });
                }
              }}
              required={!creatingNewContainer}
              className="bg-gray-800 text-white p-2 rounded"
            >
              <option value="" disabled>Choose Study Container</option>
              {containers.map((container, index) => (
                <option key={index} value={container.name}>
                  {container.name}
                </option>
              ))}
              <option value="new">+ Create New Container</option>
            </select>

            {creatingNewContainer && (
              <input
                name="container"
                type="text"
                placeholder="Enter container name..."
                onChange={handleChange}
                className="bg-gray-800 text-white p-2 rounded mt-2"
              />
            )}
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <label htmlFor="description" className="text-white">Quick Notes</label>
            <textarea
              id="description"
              name="description"
              placeholder="Any additional notes..."
              value={formData.description}
              onChange={handleChange}
              className="bg-gray-800 text-white p-2 rounded"
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-[var(--primary-color)] hover:bg-[var(--primary-color-hover)] text-white rounded"
            >
              Create
            </button>
          </div>
        </form>

        {/* Loading Spinner */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm rounded-md">
            <div className="w-12 h-12 border-t-4 border-b-4 border-[var(--primary-color)] rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
}
