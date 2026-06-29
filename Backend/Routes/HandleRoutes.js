import supabase from "../db/supabase.js";
import { CreateNewContainerAndAddData, CreateNewContainerAndAddPDFData, getUserContainersData, getUserLatestData }
from "../controllers/HandleSupabseInsert.js"
import express from "express";


const router = express.Router();


router.get('/user/containers/Data/:userId', getUserContainersData)
router.get('/user/containers/latest/data/:containerId', getUserLatestData)
router.post('/Create/NewContainer/And/AddData', CreateNewContainerAndAddData)

router.post('/Create/NewContainer/And/AddPDFData', CreateNewContainerAndAddPDFData)


router.get('/container/:id/:type' , async (req, res) => {
    const { id, type , userId} = req.params;

    if(!id || !type) {
      return res.status(400).json({ error: "Container ID or video ID or type is missing" });
    }

  

    if(type === "video") {
      const { data, error } = await supabase
        .from("study_box").select(
          "*"
        ).eq("id", id)
      if (error) {
        return res.status(500).json({ error: error.message });
      }
    
     return res.json(data);
    } else {
      const { data, error } = await supabase
        .from("pdf_files")
        .select(
          "title, url, name, description"
        ).eq("id", id)
    
      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.json(data);
    }
    
    
  })



router.get('/getStudyData/:id', async (req, res) => {
    const { id, userId } = req.params;
    const { data, error } = await supabase
      .from("study_box")
      .select(
        "v_title, v_thumbnail, v_code, v_url, v_id, notes, study_container(name)"
      )
      .eq("id", id)
      .join("study_container", "study_box.container_id", "study_container.id");
  
    if (error) {
      return res.status(500).json({ error: error.message });
    }


    res.json(data);
  })


router.delete('/user/containers/delete', async (req, res) => { 
     try {
    const { id, userId } = req.query;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Container ID is required",
      });
    }

    const { error } = await supabase
      .from("study_container")
      .delete()
      .eq("id", id);

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Container deleted successfully",
    });
  } catch (err) {
    console.error("Delete container error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
  })



router.delete('/user/delete/item', async (req, res) => { 
  try {
   

    const { title, itemId, container_id, userId } = await req.body();



    // Basic Validation
    if (!itemId || !container_id) {
      return res.status(400).json({ error: "Missing required fields: id or container_id" });
    }


    if (title) {
      const { error } = await supabase
        .from("study_box")
        .delete()
        .eq("id", itemId)
        .eq("container_id", container_id);
        
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("pdf_files")
        .delete()
        .eq("id", itemId)
        .eq("container_id", container_id);
        
      if (error) throw error;
    }

    
    return res.status(200).json({ 
      success: true, 
      message: "Item deleted successfully and cache invalidated." 
    });

  } catch (error) {
    console.error("Global delete route error:", error.message);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});



export default router;