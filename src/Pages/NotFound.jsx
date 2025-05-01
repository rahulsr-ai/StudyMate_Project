// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-900 text-white p-6">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Oops! Page not found.</p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;



// import React, { useState, useRef, useEffect } from "react";
// import { motion } from "framer-motion";
// import { BsSend } from "react-icons/bs";
// import { useLocation, useParams } from "react-router-dom";
// import axios from "axios";
// import YouTube from "react-youtube";

// const Modal = () => {
//   const { id, containerId, type } = useParams();

//   console.log(id, containerId, type);

//   const location = useLocation();
  
//   const [currentStudy, setCurrentStudy] = useState(null);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [message, setMessage] = useState("");
//   const [inputValue, setInputValue] = useState("");
//   const [chatMessages, setChatMessages] = useState([
//     { role: "ai", text: "Hello! How can I assist you today?" },
//   ]);

//   const playerRef = useRef(null);
//   const chatEndRef = useRef(null);

//   const fetchData = async () => {
//     try {
//       const { data } = await axios.get(`/api/container/${id}/${type}`);
//       if (data && data.length > 0) {
//         setMessage(data[0]?.notes);
//         setCurrentStudy(data[0]);
//         setCurrentTime(data[0]?.watchtime_progress || 0);
//         setDuration(data[0]?.duration || 0);
//       }
//     } catch (error) {
//       console.error("Error fetching study data:", error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (currentStudy?.v_title) {
//       const interval = setInterval(() => {
//         const player = playerRef.current;
//         if (player?.getCurrentTime && player?.getDuration) {
//           const current = player.getCurrentTime();
//           const total = player.getDuration();

//           console.log("Current Time:", current, "Duration:", total); // Debugging
//           setCurrentTime(current);
//           setDuration(total);
//         }
//       }, 1000); // Update every second

//       return () => clearInterval(interval);
//     }
//   }, [currentStudy?.v_title]);



//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chatMessages]);


//   const handleSendMessage = () => {
//     if (inputValue.trim() === "") return;

//     const userMessage = { role: "user", text: inputValue };
//     setChatMessages((prevMessages) => [...prevMessages, userMessage]);

//     setTimeout(() => {
//       const aiResponse = { role: "ai", text: "This is a simulated AI response." };
//       setChatMessages((prevMessages) => [...prevMessages, aiResponse]);
//     }, 1000);

//     setInputValue("");
//   };


//   const formatTime = (seconds) => {
//     const min = Math.floor(seconds / 60);
//     const sec = Math.floor(seconds % 60);
//     return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
//   };


//   const onPlayerReady = (event) => {
//     playerRef.current = event.target;
//     if (currentStudy?.watchtime_progress) {
//       playerRef.current.seekTo(currentStudy.watchtime_progress);
//     }
//   };

  

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className=" flex items-center justify-center border-4 bg-black bg-opacity-80"
//     >
//       <motion.div
//         initial={{ scale: 0.9 }}
//         animate={{ scale: 1 }}
//         exit={{ scale: 0.9 }}
//         className="w-full h-full bg-zinc-800 text-white rounded-lg shadow-lg flex flex-col md:flex-row"
//       >
//         {/* Left Section */}
//         <div className="w-full md:w-2/3 p-6 border-r md:border-r-0 border-zinc-700">
//           {/* Heading */}
//           <h2 className="text-2xl font-semibold mb-4">
//             {currentStudy?.v_title || currentStudy?.title || "Loading..."}
//           </h2>

//           {/* Video or iframe */}
//           {currentStudy?.v_title ? (
//             <>
//               <div className="my-2">
//                 <div className="w-full bg-gray-300 h-2 rounded-full">
//                   <div
//                     className="bg-green-500 h-full rounded-full transition-all duration-300"
//                     style={{
//                       width: duration ? `${(currentTime / duration) * 100}%` : "0%",
//                     }}
//                   />
//                 </div>
//                 <p className="text-sm text-gray-400 mt-2">
//                   ⏱ Watched: {formatTime(currentTime)} / {formatTime(duration)}
//                 </p>
//               </div>

//               <YouTube
//                 className="rounded-lg"
//                 videoId={currentStudy?.v_code}
//                 onReady={onPlayerReady}
//                 opts={{
//                   width: "100%",
//                   height: "350px",
//                   playerVars: { autoplay: 0 },
//                 }}
//               />
//             </>
//           ) : currentStudy?.url  (
//             <iframe
//               src={currentStudy.url}
//               width="100%"
//               height="370px"
//               className="rounded-lg border-4"
//               title="Study Material"
//             ></iframe>
//           )}

//           {/* Notes Section */}
//           <div className="flex flex-col space-y-4 mt-4">
//             <textarea
//               className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded-md focus:outline-none focus:border-blue-500"
//               rows="4"
//               placeholder="Enter your notes..."
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//             ></textarea>
//             <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
//               Save
//             </button>
//           </div>
//         </div>

//         {/* Right Section - AI Chat */}
//         <div className="w-full md:w-1/3 p-2 bg-zinc-900 border-t md:border-t-0 border-zinc-700 flex flex-col hide-scrollbar ">
//           <div className="sticky top-0 bg-zinc-900 p-4 border-b border-zinc-700 mb-4">
//             <h2 className="text-2xl font-semibold">AI Chat</h2>
//           </div>

//           <div className="flex-grow overflow-y-auto mb-4 scrollbar-hide">
//             {chatMessages.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`p-4 rounded-md mb-2 ${
//                   msg.role === "ai" ? "bg-zinc-700 text-gray-300" : "bg-blue-500 text-white"
//                 }`}
//               >
//                 <p>{msg.text}</p>
//               </div>
//             ))}
//             {/* Ref only at bottom */}
//             <div ref={chatEndRef} />
//           </div>

//           <div className="sticky bottom-0 bg-zinc-900 p-4 border-t border-zinc-700 flex items-center">
//             <input
//               type="text"
//               className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded-md focus:outline-none focus:border-blue-500"
//               placeholder="Type your message..."
//               value={inputValue}
//               onChange={(e) => setInputValue(e.target.value)}
//             />
//             <button
//               onClick={handleSendMessage}
//               className="ml-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
//             >
//               <BsSend className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default Modal;
