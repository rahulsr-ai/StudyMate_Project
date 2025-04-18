import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import StudyDrawer from "../StudyDrawer";
import supabase from "@/utils/Supabase";
import { getUserLatestData } from "@/utils/ApiCalls";
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

function Feature() {
  const [mergedArray, setMergedArray] = useState([]);
  const [openItemId, setOpenItemId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const location = useLocation();
  const { container, container_id } = location.state || {};

  const fetchData = async () => {
    if (!container_id) {
      console.error("No container_id provided in location.state");
      return;
    }

    const { data: user, error } = await supabase.auth.getUser();
    if (error) {
      console.error("Error fetching user:", error.message);
      return;
    }

    const res = await getUserLatestData(container_id);
    if (res.data && res.data[0]) {
      const arr = [...(res.data[0].pdf_files || []), ...(res.data[0].study_box || [])];
      setMergedArray(arr);
    } else {
      console.warn("No study or PDF data found for this container.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [openItemId]);

  const editNotes = async (id, notes, url) => {
    if (!(container_id && id && notes && url)) {
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
        .eq("container_id", container_id)
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
        .eq("container_id", container_id)
        .eq("id", id);

      if (error) {
        console.error("Error updating notes:", error);
        return;
      }
      updatedItem = { ...data[0], notes: notes };
    }

    setMergedArray((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedItem } : item))
    );
  };

  const deleteItem = async (id) => {
    const item = mergedArray.find((i) => i.id === id);
    if (!item) return;

    if (item.v_title) {
      await supabase
        .from("study_box")
        .delete()
        .eq("id", id)
        .eq("container_id", container_id);
    } else {
      await supabase
        .from("pdf_files")
        .delete()
        .eq("id", id)
        .eq("container_id", container_id);
    }

    fetchData(); // refresh list
    setShowDeleteDialog(false); // close dialog
    setSelectedItemId(null);
  };



  return (
    <div className="w-full bg-gradient-to-br from-zinc-900 to-black">
      <div className="container mx-auto px-9 py-18 min-h-screen">
        <div className="flex flex-col gap-10">
          <div className="flex gap-4 flex-col items-start">
            <div className="flex gap-2 flex-col">
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
                {container?.name || "Container"}
              </h2>
              <p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-left text-gray-400">
                Managing a small business today is already tough.
              </p>
            </div>
          </div>

          {loading ? (
            <p className="text-white">Loading content...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
              {mergedArray.map((item, index) => (
                <div key={index} className="flex flex-col gap-4">
                  <div
                    className="bg-muted rounded-md aspect-video mb-2 cursor-pointer"
                    onClick={() => setOpenItemId(item.id)}
                  >
                    {item?.v_title ? (
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${item.v_code}`}
                        title="YouTube video"
                        allow="encrypted-media"
                        className="rounded-lg pointer-events-none"
                      />
                    ) : (
                      <iframe
                        src={item.url}
                        title="PDF document"
                        width="100%"
                        height="100%"
                        style={{ border: "none" }}
                      />
                    )}
                  </div>

                  <button
                    className="w-full border-blue-500 border-2 bg-transparent text-white p-2 rounded-md"
                    onClick={() => setOpenItemId(item.id)}
                  >
                    Open Media
                  </button>

                  {openItemId === item.id && (
                    <StudyDrawer
                      mediaType={item.v_title ? "video" : "pdf"}
                      mediaSrc={
                        item.v_title
                          ? `https://www.youtube.com/embed/${item.v_code}`
                          : item.url
                      }
                      title={item.v_title || item.title}
                      description={item.notes || item.description}
                      setOpen={() => setOpenItemId(null)}
                      open={openItemId === item.id}
                      editNotes={editNotes}
                      id={item.id}
                      youtubeId={item.v_code}
                      containerId={container_id}
                      watchtimeProgress={item.watchtime_progress}
                      lastWatched={item.last_watched_at}
                      fetchData={fetchData}
                    />
                  )}

                  <div className="flex justify-between items-center">
                    <h3 className="tracking-tight text-blue-600 text-lg">
                      {item.v_title || item.title}
                    </h3>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Trash2
                          className="w-5 h-5 text-red-500 hover:text-red-700 cursor-pointer"
                          onClick={() => {
                            setSelectedItemId(item.id);
                            setShowDeleteDialog(true);
                          }}
                        />
                      </AlertDialogTrigger>
                      {showDeleteDialog && selectedItemId === item.id && (
                        <AlertDialogContent 
                        className={
                          "bg-gradient-to-br from-zinc-900 to-black rounded-lg p-4 shadow-lg"
                        }>
                          <AlertDialogHeader>
                            <AlertDialogTitle
                            className={"text-lg font-semibold mb-2 text-white"}
                            >
                              Are you sure you want to delete?
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
                                deleteItem(item.id);
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
                  </div>

                  <p className="text-sm text-gray-200 mb-4">
                    {item.notes || item.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { Feature };
