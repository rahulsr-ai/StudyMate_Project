import { CreateNewContainerAndAddData, CreateNewContainerAndAddPDFData, getUserContainersData, getUserLatestData }
from "../controllers/HandleSupabseInsert.js"
import express from "express";



const router = express.Router();


router.get('/user/containers/Data/:userId', getUserContainersData)
router.get('/user/containers/latest/data/:containerId', getUserLatestData)
router.post('/Create/NewContainer/And/AddData', CreateNewContainerAndAddData)


router.post('/Create/NewContainer/And/AddPDFData', CreateNewContainerAndAddPDFData)


router.get('/container/:container_id/videos' , async (req, res) => {
    const { container_id } = req.params;
  
    const { data, error } = await supabase
      .from("study_box")
      .select(
        "v_title, v_thumbnail, v_code, v_url, v_id, notes, study_container(name)"
      )
      .eq("container_id", container_id)
      .join("study_container", "study_box.container_id", "study_container.id");
  
    if (error) {
      return res.status(500).json({ error: error.message });
    }
  
    res.json(data);
  })


export default router;