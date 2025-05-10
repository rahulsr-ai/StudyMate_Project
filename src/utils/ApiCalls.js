import supabase from "./Supabase";
import axios from "axios";

// Fetching user containers data
export const getUserContainersData = async (userId) => {
 
  try { 
     const data = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/containers/Data/${userId}`) 
     console.log('here is your frontend log ' , data);
     
     return data
  } catch (error) {
    console.log('frontend error while fetching user containers ', error);
     return null
  }


};

// Handling Youtube video uploads and saving the url to the table
export const CreateNewContainerAndAddData = async (userId, formdata) => {
  if (!userId || !formdata) {
    return alert("Please provide all the required parameters");
  }

   try {
     const {data} = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/Create/NewContainer/And/AddData`,{userId, formdata})
     return data
   } catch (error) {
      console.log('frontend error while creating new container ', error);
      return null 
   }
};

// Handling pdf uploads and saving to supabase storage
export const CreateNewContainerAndAddPDFData = async (userId, formdata) => {
   console.log('formdata just before making an api call', formdata);
   console.log('userid just before making an api call', userId);

  if (!formdata?.pdfFile || !userId) {
    return alert("Please provide all the required parameters");
  }

  console.log('formdata just before making an api call', formdata);

  try {
     const data = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/Create/NewContainer/And/AddPDFData`,{userId, formdata} )
     return data
  } catch (error) {
     console.log('frontend error while creating new container ', error);
     return null
  }

 
};


export const getUserLatestData = async (containerId) => {
 
 try {
    const data = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/containers/latest/data/${containerId}`)
    return data
 } catch (error) {
    console.log('frontend error while fetching latest data ', error);
    return null
 }

}


export const savePdfData = async (userId, formdata) => {
   if(!formdata?.pdfFile || !userId) {
    return alert("Please provide all the required parameters");
   }
   
      const filePath = `pdfs/${Date.now()}-${formdata?.pdfFile.name}`; // Unique path
  
      // Uploading to Supabase Storage
      const { data, error } = await supabase.storage
        .from("pdf-uploads")
        .upload(filePath, formdata?.pdfFile, { upsert: true }); // upsert to update the file if it already exists
  
      if (error) {
        console.error("Upload failed:", error);
        return null;
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
          return 
        }
  
        console.log("New container created:", newContainer);
        containerId = newContainer.id;
      }
    
  
     
       
      // Insert metadata into the database
      const { data: dbData, error: dbError } = await supabase
        .from("pdf_files")
        .insert([
          {    
            container_id: containerId, // Link to study_box ID
            name: formdata.pdfFile.name,
            description: formdata.description,
            title: formdata.title,
            pdf_type: formdata.pdfFile.type,
            url: fileURL,
            size: formdata.pdfFile.size,
          },
        ]);
  
      if (dbError) {
        console.error("Error inserting pdf data:", dbError.message);
        return null;
      }
  
      console.log("pdf data inserted successfully:", dbData);
      return dbData
        
  }




export const getTranscript = async (videoId ) => {
  try { 
      const {data} =  await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/getSummary?videoid=${videoId}`)
  console.log('transcript ', data);
  return data;
    
  } catch (error) {
     return false 
     
  }
    
}










