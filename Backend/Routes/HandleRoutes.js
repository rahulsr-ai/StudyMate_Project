import { CreateNewContainerAndAddData, CreateNewContainerAndAddPDFData, getUserContainersData, getUserLatestData }
from "../controllers/HandleSupabseInsert.js"
import express from "express";



const router = express.Router();


router.get('/user/containers/Data/:userId', getUserContainersData)
router.get('/user/containers/latest/data/:containerId', getUserLatestData)
router.post('/Create/NewContainer/And/AddData', CreateNewContainerAndAddData)
router.post('/Create/NewContainer/And/AddPDFData', CreateNewContainerAndAddPDFData)


export default router;