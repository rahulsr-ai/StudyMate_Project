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

export function UTubeVideoModel({ open, setOpen, userDetails, containers }) {
  const [creatingNewContainer, setCreatingNewContainer] = useState(false);
  const [newContainerName, setNewContainerName] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    url: "",
    title: "",
    container: "",
    description: "",
    thumbnail: "",
    videoID: "",
    html: "",
  });

  const [videoFetched, setVideoFetched] = useState(false);
  const [error, setError] = useState("");

  const extractVideoID = (url) => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    return match ? match[1] : null;
  };

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const containerName = creatingNewContainer
      ? newContainerName
      : formData.container;

    const res = await CreateNewContainerAndAddData(userDetails?.id, {
      ...formData,
      container: containerName,
    });

    setCreatingNewContainer(false);
    setNewContainerName("");
    setFormData({
      url: "",
      title: "",
      container: "",
      description: "",
      thumbnail: "",
      videoID: "",
      html: "",
    });
    setVideoFetched(false);
    setLoading(false);
    setOpen(false);
  };



  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md bg-[var(--foreground)] border-none rounded-md ">
        <DialogHeader>
          <DialogTitle className={"text-[var(--primary-color)]"}>Share Video</DialogTitle>
          <DialogDescription>
            Fill in the details and save the video info.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Input
              id="url"
              name="url"
              placeholder="Paste the YouTube URL..."
              value={formData?.url || ""}
              onChange={handleChange}
              required
              className={"text-white dark:text-black"}
            />
            <Button onClick={fetchVideoDetails} type="button" className={"hover:bg-[var(--primary-color-hover)] bg-[var(--primary-color)]"}>
              Fetch Video
            </Button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {videoFetched && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="title">Name</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter video title..."
                  value={formData.title}
                  onChange={handleChange}
                  required
                 className={"text-white"}
                />
              </div>

              <div className="grid gap-2">
                <Label>Study Containers</Label>
                <Select
                  value={formData.container || ""}
                  onValueChange={(value) => {
                    if (value === "new") {
                      setCreatingNewContainer(true);
                      setFormData({ ...formData, container: "" });
                    } else {
                      setCreatingNewContainer(false);
                      setFormData({ ...formData, container: value });
                    }
                  }}
                >
                  <SelectTrigger className="w-full text-white">
                    <SelectValue placeholder="Choose Study Container"/>
                  </SelectTrigger>
                  <SelectContent className="max-h-52 overflow-y-auto">
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

                {creatingNewContainer && (
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="new-container"
                      placeholder="Enter container name..."
                      value={newContainerName}
                      onChange={(e) => setNewContainerName(e.target.value)}
                      className={"text-white"}
                    />
                  </div>
                )}
              </div>

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

              <DialogFooter className="mt-4">
                <Button type="submit" className="px-4 hover:bg-[var(--primary-color-hover)] bg-[var(--primary-color)]">
                  Save
                </Button>
              </DialogFooter>
            </>
          )}
        


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
