// import { useLocation } from "react-router-dom";
// import { useEffect, useState } from "react";
// import StudyDrawer from "../StudyDrawer";
// import supabase from "@/utils/Supabase";

// function Feature() {
//   const location = useLocation();
//   const { container, container_id } = location.state || {};
//   const [mergedArray, setMergedArray] = useState([
//     ...(container?.pdf_files || []),
//     ...(container?.study_box || []),
//   ]);

//   const editNotes = async (id, notes, url) => {
//     console.log("container id , id, notes, url", container_id, id, notes, url);

//     if (!(container_id || id || notes || url)) {
//       alert("Please provide all the required parameters");
//       return;
//     }

//     let updatedItem = null;

//     if (
//       url.includes("https://jtxvaqctajkhgkjekams.supabase.co/storage/v1/object")
//     ) {
//       const { data, error } = await supabase
//         .from("pdf_files")
//         .update({ description: notes })
//         .eq("container_id", container_id)
//         .eq("id", id)
//         .eq("url", url);

//       if (error) {
//         console.error("Error updating description:", error);
//         return;
//       }
//       updatedItem = { ...data[0], description: notes };
//     } else {
//       const { data, error } = await supabase
//         .from("study_box")
//         .update({ notes: notes })
//         .eq("container_id", container_id)
//         .eq("id", id);

//       if (error) {
//         console.error("Error updating notes:", error);
//         return;
//       }
//       updatedItem = { ...data[0], notes: notes };
//     }

//     // Update the mergedArray state with the new notes
//     setMergedArray((prev) =>
//       prev.map((item) => (item.id === id ? { ...item, ...updatedItem } : item))
//     );
//   };

//   useEffect(() => {
//     setMergedArray([
//       ...(container?.pdf_files || []),
//       ...(container?.study_box || []),
//     ]);
//   }, [container_id]);

//   return (
//     <div className="w-full bg-gradient-to-br from-zinc-900 to-black">
//       <div className="container mx-auto px-9 py-18 min-h-screen bg-gradient-to-br from-zinc-900 to-black">
//         <div className="flex flex-col gap-10">
//           <div className="flex gap-4 flex-col items-start">
//             <div className="flex gap-2 flex-col">
//               <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
//                 {container?.name}
//               </h2>
//               <p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-left text-gray-400">
//                 Managing a small business today is already tough.
//               </p>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
//             {mergedArray.map((item, index) => {
//               const [open, setOpen] = useState(false);

//               return (
//                 <div key={index} className="flex flex-col gap-4">
//                   <div
//                     className="bg-muted rounded-md aspect-video mb-2 cursor-pointer"
//                     onClick={() => setOpen(true)}
//                   >
//                     {item?.v_title ? (
//                       <iframe
//                         width="100%"
//                         height="100%"
//                         src={`https://www.youtube.com/embed/${item.v_code}`}
//                         title="YouTube video"
//                         frameBorder="0"
//                         allow="encrypted-media"
//                         className="rounded-lg pointer-events-none"
//                       />
//                     ) : (
//                       <iframe
//                         src={item.url}
//                         title="PDF document"
//                         width="100%"
//                         height="100%"
//                         style={{ border: "none" }}
//                       />
//                     )}
//                   </div>

//                   <button
//                     className="w-full border-blue-500 border-2 bg-transparent text-white p-2 rounded-md"
//                     onClick={() => setOpen(true)}
//                   >
//                     Open Media
//                   </button>

//                   {open && (
//                     <StudyDrawer
//                       mediaType={item.v_title ? "video" : "pdf"}
//                       mediaSrc={
//                         item.v_title
//                           ? `https://www.youtube.com/embed/${item.v_code}`
//                           : item.url
//                       }
//                       title={item.v_title || item.title}
//                       description={item.notes || item.description}
//                       setOpen={setOpen}
//                       open={open}
//                       editNotes={editNotes}
//                       id={item.id}
//                     />
//                   )}

//                   <h3 className="tracking-tight text-blue-600 text-lg">
//                     {item.v_title || item.title}
//                   </h3>
//                   <p className="text-sm text-gray-200 mb-4">
//                     {item.notes || item.description}
//                   </p>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export { Feature };
