import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { UTubeVideoModel } from "@/components/fetchVideoDetails";
import { UploadPdfDialog } from "@/components/fetchPdfDetails";
import supabase from "@/utils/Supabase";
import { getUserContainersData } from "@/utils/ApiCalls";


function Dashboard() {
  const [openVideoDialog, setOpenVideoDialog] = useState(false);
  const [openPdfDialog, setOpenPdfDialog] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [containers, setContainers] = useState([]);

  async function getUser() {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error("Error fetching user:", error.message);
      return;
    }

    setUserDetails(data.user);

  
    const res = await getUserContainersData(data.user.id);
    console.log('res ', res.data);
    
    setContainers(res?.data);

  }

  useEffect(() => {
    getUser();
  }, [openVideoDialog, openPdfDialog]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black">
      <main
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12
      "
      >
        {/* Featured Section */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-6 bg-[var(--primary-color)] bg-clip-text text-transparent">
            Structure Your Study
          </h2>
          <div className="relative group rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/10 border border-zinc-800/50 transition-all duration-300 hover:shadow-blue-500/20">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-950/90 z-10"></div>
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400&q=80"
              alt="Featured"
              className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
              <h3 className="text-2xl font-bold text-white mb-2">
                Welcome to Your Dashboard
              </h3>
              <p className="text-zinc-300">
                Access and manage your content with our powerful tools
              </p>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {/* YouTube Video Card */}
          <div className=" bg-zinc-900 rounded-2xl p-6 border border-zinc-800/50 shadow-lg transition-all duration-300 hover:shadow-blue-500/5">
            <div className="flex items-start justify-between mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="text-3xl">🎥</span>
                <span className="bg-[var(--primary-color)] bg-clip-text text-transparent">
                  Add YouTube Videos
                </span>
              </h3>
            </div>
            <p className="text-zinc-400 mb-6 ">
            Save your essential study videos in one place. No more searching for links—just structured, easy access to your learning materials whenever you need them.
            </p>
            <Button
              variant="outline"
              onClick={() => setOpenVideoDialog(true)}
              className=" bg-zinc-800 text-white hover:bg-blue-600 hover:text-white
               border-zinc-700 transition-all duration-300 mx-auto"
            >
              Add Videos
            </Button>
            {openVideoDialog && (
              <UTubeVideoModel
                open={openVideoDialog}
                setOpen={setOpenVideoDialog}
                userDetails={userDetails}
                containers={containers}
              />
            )}
          </div>


    

          {/* PDF Details Card */}
          <div className=" bg-zinc-900 rounded-2xl p-6 border border-zinc-800/50 shadow-lg transition-all duration-300 hover:shadow-blue-500/5">
            <div className="flex items-start justify-between mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="text-3xl">📄</span>
                <span className="bg-[var(--primary-color)] bg-clip-text text-transparent">
                   Upload  PDFs
                </span>
              </h3>
            </div>
            <p className="text-zinc-400 mb-6">
            Keep all your study PDFs organized in one container. From lecture notes to eBooks, access your materials anytime and structure your learning effortlessly.
            </p>
            <Button
              variant="outline"
              onClick={() => setOpenPdfDialog(true)}
              className=" bg-zinc-800 text-white hover:bg-blue-600 hover:text-white border-zinc-700 transition-all duration-300"
            >
              Add PDF
            </Button>
            {openPdfDialog && (
              <UploadPdfDialog
                open={openPdfDialog}
                setOpen={setOpenPdfDialog}
                userDetails={userDetails}
                containers={containers}
              />
            )}
          </div>
        </div>

        
      </main>
    </div>
  );
}

export default Dashboard;
