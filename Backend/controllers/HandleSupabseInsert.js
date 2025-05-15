import { YoutubeTranscript } from "youtube-transcript";
import supabase from "../db/supabase.js";

// Fetching user containers data
export const getUserContainersData = async (req, res) => {
  try {
    const { userId } = req.params; // Extract userId from URL
    if (!userId) {
      console.log("User ID is required");
      return res.status(400).json({ error: "User ID is required" });
    }

    

    const { data, error } = await supabase
      .from("study_container")
      .select(
        `
        id,
        name,
        study_box!left (
          id,
          v_title, 
          v_thumbnail, 
          v_url, 
          v_code, 
          notes,
          watchtime_progress,
          duration,
          last_watched_at
        ), 
        pdf_files!left (
          id,
          title, 
          url, 
          name, 
          description
        )
      `
      )
      .eq("user_id", userId);

      console.log('data ye rha ', data)

    if (error) {
      console.error("Error fetching data:", error);
      return res.status(500).json({ error: error.message });
    } else {
      console.log("Fetched Data:", data);
      return res.status(200).json(data);
    }
  } catch (error) {
    console.log("error in getUserContainersData ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};






// Handling Youtube video uploads and saving the url to the table
export const CreateNewContainerAndAddData = async (req, res) => {
  const { userId, formdata } = req.body;
  if (!userId || !formdata) {
    console.log("userId or formdata is missing");
    return res.status(400).json({ error: "User ID or formdata is missing" });
  }

  // Step 1: Check if the container already exists
  try {
    let { data: existingContainer, error: selectError } = await supabase
      .from("study_container")
      .select("*")
      .eq("name", formdata.container)
      .eq("user_id", userId) // Ensure it's specific to the user
      .single(); // Expecting only one row

    let containerId;

    if (selectError && selectError.code !== "PGRST116") {
      console.error("Error checking container:", selectError.message);
      return res
        .status(500)
        .json({ error: "Database error while checking container" });
    }

    if (existingContainer) {
      console.log("Container already exists:", existingContainer);
      containerId = existingContainer.id; // Use existing container ID
    } else {
      // Step 2: If not found, create a new container
      const { data: newContainer, error: insertError } = await supabase
        .from("study_container")
        .insert([{ user_id: userId, name: formdata.container }])
        .select("*")
        .single();

      if (insertError) {
        console.error("Error inserting new container:", insertError.message);
        return res.status(500).json({ error: "Failed to create container" });
      }

      console.log("New container created:", newContainer);
      containerId = newContainer.id;
    }

    // Step 3: Insert video data into study_box
    const { data: videos, error: videoError } = await supabase
      .from("study_box")
      .insert([
        {
          container_id: containerId,
          v_title: formdata.title,
          v_thumbnail: formdata.thumbnail,
          v_code: formdata.videoID,
          v_url: formdata.url,
          v_id: formdata.videoID,
          notes: formdata.description,
        },
      ])
      .select("*");

    if (videoError) {
      console.error("Error inserting video data:", videoError.message);
      return res.status(500).json({ error: "Failed to insert video data" });
    }
    console.log("Video data inserted successfully:", videos);


  
    // Step 4: Fetch and save transcript for the video (with safe throttle and error handling)
try {
  // Add a delay to avoid rate limits (1 second)
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Optional: Check if transcript already exists
  const { data: existingTranscript } = await supabase
    .from("transcripts")
    .select("id")
    .eq("video_id", formdata.videoID)
    .single();

  if (!existingTranscript) {
    const transcript = await YoutubeTranscript.fetchTranscript(formdata.videoID);
    const flatTranscript = transcript.flat();
    const plainText = flatTranscript
      .map((item) => item.text)
      .filter((text) => !!text && text.trim() !== "" && !text.includes("[संगीत]"))
      .join(" ");

    const { error: insertTranscriptError } = await supabase
      .from("transcripts")
      .insert([{ video_id: formdata.videoID, text: plainText }]);

    if (insertTranscriptError) {
      console.error("Error saving transcript:", insertTranscriptError.message);
    } else {
      console.log("Transcript saved successfully!");
    }
  } else {
    console.log("Transcript already exists, skipping fetch.");
  }

} catch (transcriptError) {
  console.error("Error fetching transcript:", transcriptError.message);
}




  } catch (error) {
    console.log("error in CreateNewContainerAndAddData", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};




// Handling pdf uploads and saving to supabase storage
export const CreateNewContainerAndAddPDFData = async (req, res) => {
  // const { userId, formdata } =  req.body;
  const { finalFormData } =  req.body;

  console.log('formdata from backend ', finalFormData);
  


  try {
    const filePath = `pdfs/${Date.now()}-${formdata?.pdfFile.name}`; // Unique path

    // Uploading to Supabase Storage
    const { data, error } = await supabase.storage
      .from("pdf-uploads")
      .upload(filePath, formdata?.pdfFile, { upsert: true }); // upsert to update the file if it already exists

    if (error) {
      console.error("Upload failed:", error);
      return res.status(500).json({ error: "Failed to upload file" });
    }

    // Get the file URL to save on our table 
    const { data: urlData } = supabase.storage
      .from("pdf-uploads")
      .getPublicUrl(filePath);

    const fileURL = urlData.publicUrl;
    console.log("File URL:", fileURL);

    // Step 1: Check if the container already exists
    let { data: existingContainer, error: selectError } = await supabase
      .from("study_container")
      .select("*")
      .eq("name", formdata.container)
      .eq("user_id", userId) // Ensure it's specific to the user
      .single(); // Expecting only one row

    let containerId;

    if (selectError && selectError.code !== "PGRST116") {
      console.error("Error checking container:", selectError.message);
    }

    if (existingContainer) {
      console.log("Container already exists:", existingContainer);
      containerId = existingContainer.id; // Use existing container ID
    } else {
      // Step 2: If not found, create a new container
      const { data: newContainer, error: insertError } = await supabase
        .from("study_container")
        .insert([{ user_id: userId, name: formdata.container }])
        .select("*")
        .single();

      if (insertError) {
        console.error("Error inserting new container:", insertError.message);
        return res.status(500).json({ error: "Failed to create container" });
      }

      console.log("New container created:", newContainer);
      containerId = newContainer.id;
    }
  

     console.log('containerId ', containerId);
     console.log('name is ', formdata.pdfFile)
     
    // Insert metadata into the database
    const { data: dbData, error: dbError } = await supabase
      .from("pdf_files")
      .insert([
        {    
          container_id: containerId, // Link to study_box ID
          name: formdata.pdfFile[0].name,
          description: formdata[0].description,
          title: formdata.title,
          pdf_type: formdata.pdfFile[0].type,
          url: fileURL,
          size: formdata.pdfFile[0].size,
        },
      ]);

    if (dbError) {
      console.error("Error inserting pdf data:", dbError.message);
      return res.status(500).json({ error: "Failed to insert pdf data" });
    }

    console.log("pdf data inserted successfully:", dbData);
    return res
      .status(201)
      .json({ message: "Data added successfully", containerId, dbData });
      
  } catch (error) {
    console.log("error in CreateNewContainerAndAddPDFData ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};



// Fetching user containers data
export const getUserLatestData = async (req, res) => {
    const { containerId } = req.params;
    if (!containerId) {
      return res.status(400).json({ error: "Container ID is required" });
    }
  
    // Fetching user containers data
    try {
      const { data, error } = await supabase
        .from("study_container")
        .select(
          `
       id,
       name,
       study_box!left (
         id,
         v_title, 
         v_thumbnail, 
         v_url, 
         v_code, 
         notes,
         watchtime_progress,
         duration,
         last_watched_at
       ), 
       pdf_files!left (
         id,
         title, 
         url, 
         name, 
         description
       )
     `
        )
        .eq("id", containerId); // 🎯 Only this container
  
      if (error) {
        console.error("Error fetching data:", error);
        return res.status(500).json({ error: error.message });
      } else {
        console.log("Fetched Latest Data:", data);
        return res.status(200).json(data);
      }
  
  
    } catch (error) {
      console.log("error in getUserLatestData ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
  

  