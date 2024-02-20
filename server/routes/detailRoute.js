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

// GET all employees
router.get("/", getDetails);

// Route to download file
router.get('/download', downloadFile);

// GET a single employee
router.get("/:id", getDetail);

// POST a new employee
router.post("/", createDetail);

// DELETE an employee
router.delete("/:id", deleteDetail);

router.patch("/updateInfo/:id", updateEmployeeBasicInfo);

router.patch("/updateTraining/:id",uploadMiddleware.single("reportFile"), updateEmployeeTraining);

router.post("/addTraining/:id", uploadMiddleware.single("reportFile"), addEmployeeTraining);

router.delete("/deleteTraining/:id", deleteEmployeeTraining);

module.exports = router;
