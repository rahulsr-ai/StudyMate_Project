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
import { CreateNewContainerAndAddData } from "@/utils/ApiCalls";
import { useEffect, useState } from "react";

export function CustomDialogModel({
  open,
  setOpen,
  userDetails,
  containers,
}) {
  const [creatingNewContainer, setCreatingNewContainer] = useState(false);
  const [formData, setFormData] = useState({
    url: "",
    title: "",
    container: "",
    description: "",
    thumbnail: "",
    videoID: "",
    html: "",
    videoFile: null,
  });
  const [videoFetched, setVideoFetched] = useState(false);
  const [error, setError] = useState("");
  const [videoSource, setVideoSource] = useState("system"); // 'system' or 'url'

  const handleVideoSourceChange = (value) => {
    setVideoSource(value);
    setFormData({
      ...formData,
      url: "", // Reset URL field if changing source
      videoFile: null, // Reset file input
    });
    setVideoFetched(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("video/")) {
      setFormData({ ...formData, videoFile: file });
    } else {
      alert("Please select a valid video file.");
    }
  };

  // Fetch Video Details (For YouTube URL only)
  const fetchVideoDetails = async () => {
    setError("");
    const videoID = extractVideoID(formData.url);

    if (!videoID) {
      setError("Invalid YouTube URL");
      return;
    }

    try {
      const response = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoID}&format=json`
      );

      if (!response.ok) throw new Error("Failed to fetch video data");

      const data = await response.json();
      setFormData({
        ...formData,
        title: data.title,
        thumbnail: `https://img.youtube.com/vi/${videoID}/hqdefault.jpg`,
        videoID: videoID,
        html: `<iframe src="https://www.youtube.com/embed/${videoID}" allowfullscreen></iframe>`,
      });
      setVideoFetched(true);
    } catch (err) {
      setError("Error fetching video details");
    }
  };

  const extractVideoID = (url) => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    return match ? match[1] : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    const res = await CreateNewContainerAndAddData(userDetails?.id, formData);
    console.log(res);

    setCreatingNewContainer(false);
    setFormData({
      url: "",
      title: "",
      container: "",
      description: "",
      thumbnail: "",
      videoID: "",
      html: "",
      videoFile: null,
    });
    setVideoFetched(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Custom Video</DialogTitle>
          <DialogDescription>
            Fill in the details and save the video info.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          {/* 🔹 Select Video Source (System or URL) */}
          <div className="flex gap-2">
            <Label>Select Video Source</Label>
            <Select value={videoSource} onValueChange={handleVideoSourceChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose Video Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Video Source</SelectLabel>
                  <SelectItem value="system">Upload from System</SelectItem>
                  <SelectItem value="url">Add from URL</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* 🔹 Conditional rendering based on source selection */}
          {videoSource === "url" && (
            <>
              <div className="flex gap-2">
                <Input
                  id="url"
                  name="url"
                  placeholder="Paste the Video URL..."
                  value={formData.url}
                  onChange={handleChange}
                  required
                />
                <Button onClick={fetchVideoDetails} type="button">
                  Fetch Video Details
                </Button>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {videoFetched && (
                <div className="grid gap-2">
                  <Label>Video Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter video title..."
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}
            </>
          )}

          {videoSource === "system" && (
            <div className="flex gap-2">
              <Input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                required
              />
            </div>
          )}

          {/* 🔹 Show Video Preview (If URL fetched or file selected) */}
          {videoFetched && (
            <div className="grid gap-2">
              <Label>Video Preview</Label>
              <iframe
                src={`https://www.youtube.com/embed/${formData.videoID}`}
                className="w-full h-48 rounded-lg"
                allowFullScreen
              ></iframe>
            </div>
          )}

          {/* 🔹 Category Select */}
          <div className="grid gap-2">
            <Label>Study Containers</Label>
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
          </div>

          {/* 🔹 Input for New Container */}
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

          {/* 🔹 Description Textarea */}
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

          {/* 🔹 Save Button */}
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
