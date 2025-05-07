import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { useEffect, useRef, useState } from "react";
import YouTube from "react-youtube";
import supabase from "@/utils/Supabase";
import { getPrompt, getTranscript, returnPdfText } from "@/utils/ApiCalls";
import axios from "axios";

const StudyDrawer = ({
  mediaType,
  mediaSrc,
  title,
  description,
  setOpen,
  open,
  editNotes,
  id,
  youtubeId,
  containerId,
  lastWatched,
  watchtimeProgress,
  fetchData,
}) => {
  const [Aiopen, setAiOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(watchtimeProgress || 0);
  const [duration, setDuration] = useState(0);
  const [summary, setSummary] = useState("");
  const playerRef = useRef(null);

  const [text, setText] = useState(description);
  const [isEditing, setIsEditing] = useState(false);

  const [prompt, setPrompt] = useState(" ");

  const onPlayerReady = (event) => {
    playerRef.current = event.target;
    if (watchtimeProgress) {
      playerRef.current.seekTo(watchtimeProgress);
    }
  };

  useEffect(() => {
    if (mediaType === "video") {
      const interval = setInterval(() => {
        const player = playerRef.current;
        if (player?.getCurrentTime && player?.getDuration) {
          setCurrentTime(player.getCurrentTime());
          setDuration(player.getDuration());
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [mediaType]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  
  const handleDrawerClose = async () => {
    try {
      if (mediaType === "video" && playerRef.current) {
        const player = playerRef.current;
        const current = player.getCurrentTime();
        const total = player.getDuration();

        const { error } = await supabase
          .from("study_box")
          .update({
            watchtime_progress: Math.floor(current),
            duration: Math.floor(total),
            last_watched_at: new Date().toISOString(),
          })
          .eq("id", id)
          .eq("container_id", containerId);

        if (error) console.error("❌ Supabase update error:", error);
        else console.log("✅ Progress saved to Supabase");
      }
    } catch (err) {
      console.error("❌ Something went wrong:", err);
    }
  };




  console.log("mediaSrc ", mediaSrc); // geting the url
  console.log("mediaSrc ", youtubeId); // getting the id

  const getSummary = async () => {
    console.log("getSummary called");
    
  
    if (mediaType === "pdf" ) {

      const {data} = await axios.post('/api/groq/chat', {prompt: prompt , transcript: "You are a helpful assistant that answers based on the user prompt."});
      console.log('response from groq from pdf ', data?.reply);
      return data?.reply

  
    } else {

      const transcript = await getTranscript(youtubeId);
      setSummary(transcript.plainText);
      const {data} = await axios.post('/api/groq/chat', {prompt: prompt, transcript: transcript.plainText});
      console.log('response from groq for video ', data?.reply);
      return data?.reply
    }

  };



  




    


  return (
    <>
      <Drawer
        open={open}
        onOpenChange={(newOpen) => {
          if (!newOpen) {
            handleDrawerClose();
          }
          setOpen(newOpen);
        }}
      >
        <DrawerContent className="p-2 max-w-6xl h-full mx-auto bg-gradient-to-br from-zinc-900 to-black rounded-lg">
          <DialogTitle className="text-lg font-semibold mb-2 bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
            {title}
          </DialogTitle>

         

          <div className="flex gap-2 justify-end my-1">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={!isEditing}
            className="h-[80px] md:h-44 text-xs focus:border-blue-500 focus:ring-blue-500 w-full text-white overflow-auto mt-4"
          />
          
            <Button
              onClick={() => setIsEditing(true)}
              disabled={isEditing}
              className="p-2 cursor-pointer hover:bg-gray-200 hover:text-blue-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.232 5.232l3.536 3.536M9 11l6.536-6.536a2 2 0 112.828 2.828L11.828 13.828a2 2 0 01-.828.536l-4 1a1 1 0 01-1.264-1.264l1-4a2 2 0 01.536-.828z"
                />
              </svg>
            </Button>

            <Button
              onClick={() => {
                editNotes(id, text, mediaSrc);
                setIsEditing(false);
                setOpen(false);
              }}
              disabled={!isEditing}
              className="bg-blue-500 hover:bg-blue-800"
            >
              Save
            </Button>
          </div>

          {mediaType === "video" ? (
            <>
              <div className="my-0 md:my-1">
                <div className="w-full bg-gray-300 h-2 rounded-full">
                  <div
                    className="bg-green-500 h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        duration ? (currentTime / duration) * 100 : 0
                      }%`,
                    }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 ">
                  ⏱ Watched: {formatTime(currentTime)} / {formatTime(duration)}
                </p>
              </div>

              <YouTube
                className="rounded-lg border-4 min-h-[200px] sm:h-full"
                videoId={youtubeId}
                onReady={onPlayerReady}
                opts={{
                  height: "100%",
                  width: "100%",
                  playerVars: {
                    autoplay: 0,
                  },
                }}
              />

              <div className="flex justify-end mt-3">
                <Button
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white shadow-md"
                  onClick={() => {
                    setAiOpen(true);
                  }}
                >
                  🤖 Ask AI
                </Button>
              </div>
            </>
          ) : mediaType === "pdf" ? (
            <>
              <iframe
                src={mediaSrc}
                width="100%"
                height="70%"
                className="rounded-lg border-4 md:h-full"
              ></iframe>

              <div className="flex justify-end mt-4">
                <Button
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white shadow-md"
                  onClick={() => {
                    setAiOpen(true);
                  }}
                >
                  🤖 Ask AI
                </Button>
              </div>
            </>
          ) : (
            <p className="text-red-500">Invalid media type</p>
          )}
        </DrawerContent>
      </Drawer>

      {/* === AI Chat Dialog === */}
      <ChatDialog
        open={Aiopen}
        setOpen={setAiOpen}
        setPrompt={setPrompt}
        prompt={prompt}
        getSummary={getSummary}
      />
    </>
  );
};

export default StudyDrawer;
