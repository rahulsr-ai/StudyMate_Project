import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { BsSend } from "react-icons/bs";
import { useParams } from "react-router-dom";
import axios from "axios";
import YouTube from "react-youtube";
import supabase from "@/utils/Supabase";
import { Copy } from "lucide-react";
import toast from "react-hot-toast";
import { IoMdArrowRoundBack } from "react-icons/io";



const StudyPage = () => {
  const { id, containerId, type } = useParams();

  console.log(id, containerId, type);

  const notify = () => toast.success("Copied to clipboard");

  const [prompt, setprompt] = useState(" ");
  const [videoload, setvideoload] = useState(false);
  const [currentStudy, setCurrentStudy] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { role: "ai", text: "Hello! How can I assist you today?" },
  ]);

  const [isTyping, setIsTyping] = useState(false);


  const playerRef = useRef(null);
  const chatEndRef = useRef(null);

  const fetchData = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/container/${id}/${type}`);
      if (data && data.length > 0) {
        console.log(data);

        setMessage(data[0]?.notes);
        setCurrentStudy(data[0]);
        setCurrentTime(data[0]?.watchtime_progress || 0);
        setDuration(data[0]?.duration || 0);
        await getSummary();
      }
    } catch (error) {
      console.error("Error fetching study data:", error);
    }

    setTimeout(() => {
      setvideoload(true);
    }, 1000);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (currentStudy?.v_title) {
      const interval = setInterval(() => {
        const player = playerRef.current;
        if (player?.getCurrentTime && player?.getDuration) {
          const current = player.getCurrentTime();
          const total = player.getDuration();
          setCurrentTime(current);
          setDuration(total);
        }
      }, 1000); // Update every second

      return () => clearInterval(interval);
    }
  }, [currentStudy?.v_title]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const editNotes = async (id, notes, url) => {
    if (!(containerId && id && notes && url)) {
      alert("Please provide all the required parameters");
      return;
    }

    let updatedItem = null;

    if (
      url.includes("https://jtxvaqctajkhgkjekams.supabase.co/storage/v1/object")
    ) {
      const { data, error } = await supabase
        .from("pdf_files")
        .update({ description: notes })
        .eq("container_id", containerId)
        .eq("id", id)
        .eq("url", url);

      if (error) {
        console.error("Error updating description:", error);
        return;
      }
      updatedItem = { ...data[0], description: notes };
    } else {
      const { data, error } = await supabase
        .from("study_box")
        .update({ notes: notes })
        .eq("container_id", containerId)
        .eq("id", id);

      if (error) {
        console.error("Error updating notes:", error);
        return;
      }
      updatedItem = { ...data[0], notes: notes };

      toast.success("Notes updated successfully");
    }
  };

  
  const handleSendMessage = async () => {
  if (prompt.trim() === "") return;

  const userMessage = { role: "user", text: prompt };
  const updatedMessages = [...chatMessages, userMessage];
  setChatMessages(updatedMessages);
  setprompt("");
  setIsTyping(true);

  // Add a temporary "Typing..." message
  const tempMessages = [...updatedMessages, { role: "ai", text: "Typing..." }];
  setChatMessages(tempMessages);

  const GroqResponse = await getSummary();

  // Replace the "Typing..." with actual response
  const finalMessages = [...updatedMessages, { role: "ai", text: GroqResponse }];
  setChatMessages(finalMessages);
  setIsTyping(false);
  localStorage.setItem("chatHistory", JSON.stringify(finalMessages));
};

  

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  const onPlayerReady = (event) => {
    playerRef.current = event.target;
    if (currentStudy?.watchtime_progress) {
      playerRef.current.seekTo(currentStudy.watchtime_progress);
    }
  };

  
  const getSummary = async () => {

    if (!currentStudy?.v_code) {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/groq/chat`, {
        prompt: prompt,
      });
      console.log("response from groq from pdf ", data?.reply);
      return data?.reply;
    } else {
     
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/groq/chat`, {
        prompt: prompt,
        videoId: currentStudy?.v_code
      });

      console.log("response from groq for video ", data?.reply);

      return data?.reply;
    }


  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-screen bg-black bg-opacity-80 "
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="w-full  bg-zinc-800 text-white shadow-lg flex flex-col md:flex-row"
      >
        {/* Left Section */}
        <div className="w-full md:w-2/3 px-4 py-3 border-r md:border-r-0 border-zinc-700 ">
          <div
            className=" text-white flex items-center gap-2 cursor-pointer
            "
          >
            <button
              onClick={() => {
                window.history.back();
              }}
              className="text-xl bg-zinc-950 p-2 rounded-full"
            >
              <IoMdArrowRoundBack />
            </button>
          </div>

          <h2 className="text-2xl font-semibold mb-4">
            {currentStudy?.v_title || currentStudy?.title || "Loading..."}
          </h2>

          {/* Video or iframe */}
          {currentStudy?.v_title ? (
            <>
              <div className="my-2">
                <div className="w-full bg-gray-900 h-2 rounded-full">
                  <div
                    className="bg-green-500 h-full rounded-full transition-all duration-300"
                    style={{
                      width: duration
                        ? `${(currentTime / duration) * 100}%`
                        : "0%",
                    }}
                  />
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  ⏱ Watched: {formatTime(currentTime)} / {formatTime(duration)}
                </p>
              </div>

              {videoload ? (
              
                  <YouTube
                className="rounded-lg"
                videoId={currentStudy?.v_code}
                onReady={onPlayerReady}
                opts={{
                  width: "100%",
                  height: "350px",
                  playerVars: { autoplay: 0 },
                }}
              />
               
              ) : (
                <div className=" dark:bg-gray-800 md:rounded-lg h-[350px] p-6 shadow-lg flex items-center justify-center">
                  <div className="border-t-4 border-b-4 border-[var(--primary-color)] h-12 w-12 rounded-full animate-spin"></div>
                </div>
              )}
            </>
          ) : (
            <>
              {videoload ? (
                <iframe
                  src={currentStudy?.url}
                  width="100%"
                  height="370"
                  className="rounded-lg border"
                  title="Study Material"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="dark:bg-gray-800 md:rounded-lg h-[370px] p-6 shadow-lg flex items-center justify-center">
                  <div className="border-t-4 border-b-4 border-[var(--primary-color)] h-12 w-12 rounded-full animate-spin"></div>
                </div>
              )}
            </>
          )}

          {/* Notes Section */}
          <div className="flex  flex-col space-y-4 mt-4">
            <textarea
              className="w-full text-sm p-2 bg-zinc-700 border border-zinc-600 rounded-md focus:outline-none focus:border-blue-500"
              rows="6"
              placeholder="Enter your notes..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>

            <div className="flex justify-end gap-7">
              <button
                onClick={() =>
                  editNotes(
                    id,
                    message,
                    currentStudy?.v_url || currentStudy?.url
                  )
                }
                className="px-4 py-2 w-1/1 bg-[var(--primary-color)] text-white rounded-md hover:bg-[var(--primary-color)] transition"
              >
                Save
              </button>
              {/* <button className="px-4 py-2 w-1/4 bg-[var(--primary-color)] text-white rounded-md hover:bg-[var(--primary-color)] transition">
                Export Notes
              </button> */}
            </div>
          </div>
        </div>

        {/* Right Section - AI Chat */}
        <div className="w-full h-full md:w-1/3 p-2 bg-zinc-900 border-t md:border-t-0 border-zinc-700 flex flex-col ">
          {/* Header */}
          <div className="bg-zinc-900 p-4 border-b border-zinc-700">
            <h2 className="text-2xl font-semibold">AI Chat</h2>
          </div>

          {/* Chat Messages */}
          <div className="flex-grow overflow-y-auto mb-4 scrollbar-hide max-h-[calc(100vh-200px)] p-2 hide-scrollbar">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-md mb-2 ${
                  msg.role === "ai"
                    ? "bg-zinc-700 text-gray-300"
                    : "bg-[var(--primary-color)] text-white"
                }`}
              >
                <div
                  onClick={() => {
                    navigator.clipboard.writeText(msg.text);
                    notify();
                  }}
                  className="flex justify-end cursor-pointer"
                >
                  <Copy className="hover:scale-95" size={15} />
                </div>

                <p>{msg.text === "Typing..." ? <em>{msg.text}</em> : msg.text}</p>

              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-zinc-700 bg-zinc-900 flex items-center mb-8 md:mb-2">
            <input
              type="text"
              className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Type your message..."
              value={prompt}
              onChange={(e) => setprompt(e.target.value)}
            />
            <button
              onClick={handleSendMessage}
              className="ml-2 p-2 bg-[var(--primary-color)] text-white rounded-md hover:bg-[var(--primary-color)] transition"
            >
              <BsSend className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StudyPage;
