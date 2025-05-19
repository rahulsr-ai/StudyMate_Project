import { useEffect, useState } from "react";
import { CreateNewContainerAndAddData } from "@/utils/ApiCalls";

export function UTubeVideoModel({ open, setOpen, userDetails, containers }) {
  const [creatingNewContainer, setCreatingNewContainer] = useState(false);
  const [newContainerName, setNewContainerName] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoFetched, setVideoFetched] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    url: "",
    title: "",
    container: "",
    description: "",
    thumbnail: "",
    videoID: "",
    html: "",
  });

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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="relative bg-[var(--foreground)] rounded-md max-w-md w-full p-6">


        <div 
        onClick={() =>  setOpen(false)}
        className="cursor-pointer scale-95 transition-all w-fit absolute right-2 top-4">
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e7dfdf" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </div>


        <div className="mb-4">
          <h2 className="text-lg font-bold text-[var(--primary-color)]">
            Share Video
          </h2>
          <p className="text-sm text-white">
            Fill in the details and save the video info.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              name="url"
              type="url"
              placeholder="Paste the YouTube URL..."
              value={formData.url}
              onChange={handleChange}
              required
              className="flex-1 p-2 rounded bg-gray-800 text-white"
            />
            <button
              type="button"
              onClick={fetchVideoDetails}
              className="px-4 py-2 bg-[var(--primary-color)] hover:bg-[var(--primary-color-hover)] text-white rounded"
            >
              Fetch Video
            </button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {videoFetched && (
            <>
              <div className="grid gap-1">
                <label htmlFor="title" className="text-sm text-white">
                  Name
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="p-2 rounded bg-gray-800 text-white"
                />
              </div>

              <div className="grid gap-1">
                <label htmlFor="container" className="text-sm text-white">
                  Study Containers
                </label>
                <select
                  name="container"
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
                  className="p-2 rounded bg-gray-800 text-white"
                >
                  <option value="" disabled>
                    Choose Study Container
                  </option>
                  {containers.map((container, index) => (
                    <option key={index} value={container.name}>
                      {container.name}
                    </option>
                  ))}
                  <option value="new" className="text-blue-500">
                    + Create New Container
                  </option>
                </select>
              </div>

              {creatingNewContainer && (
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Enter container name..."
                    value={newContainerName}
                    onChange={(e) => setNewContainerName(e.target.value)}
                    className="w-full p-2 rounded bg-gray-800 text-white"
                  />
                </div>
              )}

              <div className="grid gap-1">
                <label htmlFor="description" className="text-sm text-white">
                  Quick Notes
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Any additional notes..."
                  value={formData.description}
                  onChange={handleChange}
                  className="p-2 rounded bg-gray-800 text-white"
                />
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[var(--primary-color)] hover:bg-[var(--primary-color-hover)] text-white rounded"
                >
                  Save
                </button>
              </div>
            </>
          )}
        </form>

     {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm rounded-md">
            <div className="w-12 h-12 border-t-4 border-b-4 border-[var(--primary-color)] rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
}
