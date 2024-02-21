const Detail = require("../models/detailModel");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const getContentType = (filename) => {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case ".pdf":
      return "application/pdf";
    case ".doc":
    case ".docx":
      return "application/msword";
    case ".xls":
    case ".xlsx":
      return "application/vnd.ms-excel";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    default:
      return "application/octet-stream";
  }
};
const downloadFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { trainingId } = req.query;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "Invalid detail ID" });
    }
    if (!trainingId || !mongoose.Types.ObjectId.isValid(trainingId)) {
      return res.status(400).json({ error: "Invalid or missing training ID" });
    }
    const detail = await Detail.findById(id);
    if (!detail) {
      return res.status(404).json({ error: "Detail not found" });
    }
    const training = detail.Trainings.find(
      (t) => t._id.toString() === trainingId
    );
    if (!training || !training.reportFile) {
      return res.status(404).json({ error: "Training or file not found" });
    }
    const filePath = path.join(__dirname, "..", "uploads", training.reportFile);
    fs.readFile(filePath, (err, fileContent) => {
      if (err) {
        console.error("Error reading file:", err);
        return res.status(500).json({ error: "Error reading file" });
      }
      const contentType = getContentType(training.reportFile);
      res.setHeader(
        "Content-disposition",
        `attachment; filename="${training.reportFile}"`
      );
      res.setHeader("Content-type", contentType);
      res.send(fileContent);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addEmployeeTraining = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid employee ID" });
    }
    const { Title, StartDate, EndDate, Country, Funding } = req.body;
    const reportFile = req.file;
    const detail = await Detail.findById(id);
    if (!detail) {
      return res.status(404).json({ error: "Employee detail not found" });
    }
    const newTraining = {
      Title,
      StartDate: new Date(StartDate),
      EndDate: new Date(EndDate),
      Country,
      Funding,
      reportFile: reportFile ? reportFile.filename : undefined,
    };
    detail.Trainings.push(newTraining);
    await detail.save();
    const updatedDetail = await Detail.findById(id);
    res.status(200).json(updatedDetail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateEmployeeTraining = async (req, res) => {
  try {
    const { id } = req.params;
    const { trainingId } = req.query;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid employee ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(trainingId)) {
      return res.status(400).json({ error: "Invalid training ID" });
    }
    const { Title, StartDate, EndDate, Country, Funding } = req.body;
    const reportFile = req.file;
    const detail = await Detail.findById(id);
    if (!detail) {
      return res.status(404).json({ error: "Employee detail not found" });
    }
    const training = detail.Trainings.id(trainingId);
    if (!training) {
      return res.status(404).json({ error: "Training not found" });
    }
    if (reportFile && training.reportFile) {
      const filePath = `./uploads/${training.reportFile}`;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    if (Title) training.Title = Title;
    if (StartDate) training.StartDate = new Date(StartDate);
    if (EndDate) training.EndDate = new Date(EndDate);
    if (Country) training.Country = Country;
    if (Funding) training.Funding = Funding;
    if (reportFile) training.reportFile = reportFile.filename;
    await detail.save();
    const updatedDetail = await Detail.findById(id);
    res.status(200).json(updatedDetail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteEmployeeTraining = async (req, res) => {
  try {
    const { id } = req.params;
    const { trainingId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid employee ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(trainingId)) {
      return res.status(400).json({ error: "Invalid training ID" });
    }
    const detail = await Detail.findById(id);
    if (!detail) {
      return res.status(404).json({ error: "Employee detail not found" });
    }
    const training = detail.Trainings.id(trainingId);
    if (!training) {
      return res.status(404).json({ error: "Training not found" });
    }
    if (training.reportFile) {
      const filePath = `./uploads/${training.reportFile}`;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    training.deleteOne();
    await detail.save();
    res
      .status(200)
      .json({ message: "Training and associated file deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  downloadFile,
  addEmployeeTraining,
  updateEmployeeTraining,
  deleteEmployeeTraining,
};
