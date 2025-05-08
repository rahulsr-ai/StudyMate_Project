import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Folder,
  Video,
  FileText,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import supabase from "@/utils/Supabase";
import { getUserContainersData } from "@/utils/ApiCalls";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";


const VideoGrid = ({ title, container, items , showDeleteDialog , setShowDeleteDialog, 
  getUser
}) => {
  const navigate = useNavigate();
  const [hoverIndex, setHoverIndex] = useState(null);

  console.log('container id ', container.id);
  


  // Only show first two items
  const previewItems = items.slice(0, 1);
  const remainingItems = items.length - 1;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
  };

  const noteVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 },
    },
  };

  const sendToContainer = () => {

    navigate("/study/sets", {
      state: { container: container, container_id: container.id },
    });
  };
 
  const [selectedItemId, setSelectedItemId] = useState(null);

  
  const deleteItem = async (id) => {
     if(!id) {
      alert("Please select an item to delete");
      return;
     }
  
      await supabase
        .from("study_container")
        .delete()
        .eq("id", id)
        
    // fetchData(); // refresh list
    setShowDeleteDialog(false); // close dialog
    setSelectedItemId(null);
    getUser()
  };


  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-zinc-900/80 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800/50 shadow-lg hover:shadow-[var(--primary-color)]/10 cursor-pointer group h-fit"
        
    >
      <motion.div
        className="flex items-center gap-3 mb-6"
        whileHover={{ x: 5 }}
      >
        <span className="p-2 bg-zinc-800 rounded-lg">
          <Folder className="w-6 h-6 text-[var(--primary-color)]" />
        </span>
        <div 
        onClick={() => sendToContainer()} // Ensure this is the only onClick handler for navigation
        className="flex-1">
          <h3 className="text-2xl font-bold bg-[var(--primary-color)] bg-clip-text text-transparent">
            {title}
          </h3>
          <p className="text-sm text-zinc-400">
            {items.length} {items.length === 1 ? "item" : "items"} available
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-[var(--primary-color)] opacity-0 group-hover:opacity-100 transition-opacity" />
           <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Trash2
                                  className="w-5 h-5 text-red-500 hover:text-red-700 cursor-pointer"
                                  onClick={() => {
                                    setSelectedItemId(container.id);
                                    setShowDeleteDialog(true);
                                  }}
                                />
                              </AlertDialogTrigger>
                              {showDeleteDialog && selectedItemId === container.id && (
                                <AlertDialogContent 
                                className={
                                  "bg-gradient-to-br from-zinc-900 to-black rounded-lg p-4 shadow-lg"
                                }>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle
                                    className={"text-lg font-semibold mb-2 text-white"}
                                    >
                                      Are you sure you want to delete this container?
                                    </AlertDialogTitle>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel
                                      onClick={() => {
                                        setShowDeleteDialog(false);
                                        setSelectedItemId(null);
                                      }}
                                    >
                                      No
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => {
                                        deleteItem(container.id);
                                        setShowDeleteDialog(false);
                                        setSelectedItemId(null);
                                      }}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Yes
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              )}
                            </AlertDialog>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-950/50 backdrop-blur-sm rounded-lg p-4"
        variants={containerVariants}
      >
        {previewItems.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover="hover"
            className="relative flex flex-col items-center bg-zinc-800/70 p-4 rounded-lg shadow-md"
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(null)}
          >
           
            <motion.span
              className="absolute top-2 left-2 flex items-center gap-1 text-xs bg-zinc-700/80 backdrop-blur-sm px-3 py-1 rounded-full text-white"
              whileHover={{ scale: 1.05 }}
            >
              {container.study_box.length > 0 ? (
                <>
                  <Video className="w-3 h-3" /> Video
                </>
              ) : (
                <>
                  <FileText className="w-3 h-3" /> PDF
                </>
              )}
            </motion.span>

            <div className="w-full aspect-video rounded-lg overflow-hidden shadow-lg">
              {container.study_box.length > 0 ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${container?.study_box[index]?.v_code}`}
                  title="YouTube video"
                  frameBorder="0"
                  allow="encrypted-media"
                  className="rounded-lg pointer-events-none"
                />
              ) : (
                <iframe
                  src={container?.pdf_files[index]?.url}
                  title="PDF document"
                  width="100%"
                  height="100%"
                  style={{ border: "none" }}
                />
              )}
            </div>

            <AnimatePresence>
              {hoverIndex === index &&
                (container?.study_box[index]?.notes ||
                  container?.pdf_files[index]?.description) && (
                  <motion.div
                    variants={noteVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 transform bg-zinc-900/95 backdrop-blur-sm p-4 rounded-lg shadow-xl border border-zinc-700/50 w-[90%] text-sm text-white"
                  >
                    {container?.study_box[index]?.notes ||
                      container?.pdf_files[index]?.description}
                  </motion.div>
                )}
            </AnimatePresence>
          </motion.div>
        ))}

        {remainingItems > 0 && (
          <motion.div
            variants={itemVariants}
            whileHover="hover"
            className="relative flex flex-col items-center justify-center bg-zinc-800/30 p-4 rounded-lg shadow-md border-2 border-dashed border-zinc-700/50 aspect-video "
          >
            <MoreHorizontal className="w-8 h-8 text-zinc-500 mb-2" />
            <p className="text-zinc-400 text-sm font-medium">
              +{remainingItems} more {remainingItems === 1 ? "item" : "items"}
            </p>
            <p className="text-zinc-500 text-xs mt-1">Click to view all</p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

///-----------------------

const StudyContainers = () => {
  const [containers, setContainers] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
 
  const pageVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2,
      },
    },
  };

  async function getUser() {
    const { data, error } = await supabase.auth.getUser();
   

    if (error) {
      console.error("Error fetching user:", error.message);
      return;
    }
    console.log('data is ', data.user.id);
    
    const res = await getUserContainersData(data.user.id);
    setContainers(res.data);
    console.log("Containers data:", res);
    
  }

  useEffect(() => {
    getUser();
  }, []);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 p-4 md:p-8
      lg:p-16"
    >
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-8 bg-[var(--primary-color)] bg-clip-text text-transparent flex items-center gap-4"
        >
          Study Materials
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          variants={pageVariants}
        >
          {containers.map((container, index) => (
            <>
              <VideoGrid
                showDeleteDialog={showDeleteDialog}
                setShowDeleteDialog={setShowDeleteDialog}
                key={index}
                title={container.name}
                container={container}
                getUser={getUser}
                items={[...container.study_box, ...container.pdf_files]}
              />
            </>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StudyContainers
