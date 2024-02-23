//this file is used to register routes

const express = require("express");
const uploadMiddleware = require("../middleware/multer");

const {
  createDetail,
  getDetail,
  getDetails,
  deleteDetail,
  updateEmployeeBasicInfo,
  updateEmployeeTraining,
  addEmployeeTraining,
  deleteEmployeeTraining,
  downloadFile
} = require('../controllers/detailControllers');
const requireAuth  = require('../middleware/requireAuth');

const router = express.Router();

router.use(requireAuth);

router.get("/", getDetails);
router.get("/:id", getDetail);
router.post("/", createDetail);
router.delete("/:id", deleteDetail);
router.patch("/updateInfo/:id", updateEmployeeBasicInfo);

router.patch("/updateTraining/:id", uploadMiddleware.fields([
  { name: 'reportFile', maxCount: 1 },
  { name: 'certificate', maxCount: 1 }
]), updateEmployeeTraining);

router.post("/addTraining/:id", uploadMiddleware.fields([
  { name: 'reportFile', maxCount: 1 },
  { name: 'certificate', maxCount: 1 }
]), addEmployeeTraining);

router.delete("/deleteTraining/:id", deleteEmployeeTraining);

router.get("/download/:id", downloadFile);


module.exports = router;
