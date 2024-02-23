const Detail = require("../models/detailModel");
const mongoose = require("mongoose");
const fs = require("fs");


const createDetail = async (req, res) => {
  const { EmployeeId, Name, Designation, Division, Section } = req.body;
  try {
    const existingDetail = await Detail.findOne({ EmployeeId });
    if (existingDetail) {
      return res.status(400).json({ error: "EmployeeId already exists" });
    }

    const detail = await Detail.create({
      EmployeeId,
      Name,
      Designation,
      Division,
      Section,
    });
    res.status(200).json(detail);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getDetail = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such detail" });
  }
  try {
    const detail = await Detail.findById(id);
    if (!detail) {
      return res.status(404).json({ error: "No such detail" });
    }
    res.status(200).json(detail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDetails = async (req, res) => {
  try {
    const details = await Detail.find({}).sort({ createdAt: -1 });
    res.status(200).json(details);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteDetail = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such employee" });
  }
  try {
    const detail = await Detail.findById(id);
    if (!detail) {
      return res.status(400).json({ error: "No such detail" });
    }
    if (detail.Trainings.length > 0) {
      await Promise.all(
        detail.Trainings.map(async (training) => {
          if (training.reportFile) {
            const filePath1 = `./uploads/${training.reportFile}`;
            if (fs.existsSync(filePath1)) {
              fs.unlinkSync(filePath1);
            }
          }
          if (training.certificate) {
            const filePath2 = `./uploads/${training.certificate}`;
            if (fs.existsSync(filePath2)) {
              fs.unlinkSync(filePath2);
            }
          }
        })
      );
    }
    await detail.deleteOne();
    res.status(200).json({ message: "Employee detail deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateEmployeeBasicInfo = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "No such employee" });
    }
    const detail = await Detail.findByIdAndUpdate(id, req.body, { new: true });
    if (!detail) {
      return res.status(400).json({ error: "No such detail" });
    }
    res.status(200).json(detail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createDetail,
  getDetail,
  getDetails,
  deleteDetail,
  updateEmployeeBasicInfo,
};
