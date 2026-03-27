import supabase from "../db/supabase.js";
import { CreateNewContainerAndAddData, CreateNewContainerAndAddPDFData, getUserContainersData, getUserLatestData }
from "../controllers/HandleSupabseInsert.js"
import express from "express";
import { redis } from "../redis.js";



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

      const isDelete = await redis.del(`containers:${userId}`);
      console.log("is Delete ", isDelete)

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

     const isDelete = await redis.del(`containers:${userId}`);
      console.log("is Delete ", isDelete)


    res.json(data);
  })


export default router;