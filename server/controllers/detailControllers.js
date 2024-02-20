const Detail = require("../models/detailModel");
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');


//get all details
const getDetails = async (req, res) => {
    const details = await Detail.find({}).sort({ createdAt: -1 });
    res.status(200).json(details);
};

//create a new detail- user
const createDetail = async (req, res) => {
    const { EmployeeId, Name, Designation, Division, Section} = req.body;
    //add doc to db
    try {
        const detail = await Detail.create({
            EmployeeId,
            Name,
            Designation,
            Division,
            Section
        });
        res.status(200).json(detail);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// get a single detail
// const getDetail = async (req, res) => {
//     const {id} = req.params;
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         return res.status(404).json({ error: 'No such detail' });
//     }
//     const detail = await Detail.findById(id);
//     if (!detail) {
//         return res.status(404).json({ error: 'No such detail' });
//     };
//     res.status(200).json(detail);
// };

const getDetail = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such detail' });
    }

    try {
        const detail = await Detail.findById(id);
        if (!detail) {
            return res.status(404).json({ error: 'No such detail' });
        }

        // Check if Trainings array exists and has elements
        if (detail.Trainings && detail.Trainings.length > 0) {
            // Loop through each training and add the file path or URL
            detail.Trainings.forEach(training => {
                if (training.reportFile) {
                    // Construct the file path or URL (modify as needed)
                    training.reportFileUrl = `./uploads/${training.reportFile}`;
                }
            });
        }

        res.status(200).json(detail);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Function to handle downloading file data
const downloadFile = async (req, res) => {
    const { id, trainingId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such detail for id ' });
    }

    try {
        const detail = await Detail.findById(id);
        if (!detail) {
            return res.status(404).json({ error: 'No such detail for training id' });
        }

        const training = detail.Trainings.find(training => training._id == trainingId);
        if (!training || !training.reportFile) {
            return res.status(404).json({ error: 'No such training or file' });
        }

        // Construct the file path
        const filePath = path.join(__dirname, 'uploads', training.reportFile);
        // Stream the file data as the response
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// delete a detail user
const deleteDetail = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'No such employee' });
    }
    const detail = await Detail.findOneAndDelete({ _id: id });
    if (!detail) {
        return res.status(400).json({ error: 'No such detail' });
    }
    res.status(200).json(detail);
}

// update a detail user
const updateEmployeeBasicInfo = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'No such employee' })
    }
    const detail = await Detail.findOneAndUpdate({ _id: id }, {
        ...req.body
    })
    if (!detail) {
        return res.status(400).json({ error: 'No such detail' })
    }
    res.status(200).json(detail)
};

// const updateEmployeeTraining = async (req, res) => {
//     const { id } = req.params;
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         return res.status(400).json({ error: 'Invalid employee ID' });
//     }

//     const { _id: trainingId, ...updatedTraining } = req.body;
//     if (!mongoose.Types.ObjectId.isValid(trainingId)) {
//         return res.status(400).json({ error: 'Invalid training ID' });
//     }

//     try {
//         const detail = await Detail.findOneAndUpdate(
//             { _id: id, "Trainings._id": trainingId }, // Find the employee by ID and ensure the training ID matches
//             { $set: { "Trainings.$": updatedTraining } }, // Update the matching training with the new data
//             { new: true }
//         );

//         if (!detail) {
//             return res.status(404).json({ error: 'Employee detail or training not found' });
//         }

//         res.status(200).json(detail);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

const updateEmployeeTraining = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid employee ID' });
    }

    const { _id: trainingId, reportFile, ...updatedTraining } = req.body; // Exclude reportFile from updatedTraining
    if (!mongoose.Types.ObjectId.isValid(trainingId)) {
        return res.status(400).json({ error: 'Invalid training ID' });
    }

    try {
        const detail = await Detail.findOne({ _id: id });
        if (!detail) {
            return res.status(404).json({ error: 'Employee detail not found' });
        }

        const trainingIndex = detail.Trainings.findIndex(training => training._id.toString() === trainingId);
        if (trainingIndex === -1) {
            return res.status(404).json({ error: 'Training not found' });
        }

        // Check if there's a file associated with the training
        if (reportFile) {
            // If a new file is uploaded, delete the old file
            const oldFilePath = `./uploads/${detail.Trainings[trainingIndex].reportFile}`;
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
        }

        // Update the training with the new data (excluding reportFile)
        detail.Trainings[trainingIndex] = { ...updatedTraining, _id: trainingId };

        // If a new file is uploaded, update the reportFile field
        if (reportFile) {
            detail.Trainings[trainingIndex].reportFile = reportFile.filename;
        }

        // Save the updated detail document
        await detail.save();

        res.status(200).json({ message: 'Training updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteEmployeeTraining = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid employee ID' });
    }

    const { trainingId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(trainingId)) {
        return res.status(400).json({ error: 'Invalid training ID' });
    }

    try {
        const detail = await Detail.findOne({ _id: id });
        if (!detail) {
            return res.status(404).json({ error: 'Employee detail not found' });
        }

        const training = detail.Trainings.find(training => training._id.toString() === trainingId);
        if (!training) {
            return res.status(404).json({ error: 'Training not found' });
        }

        // Check if there's a file associated with the training
        if (training.reportFile) {
            const filePath = `./uploads/${training.reportFile}`;
            
            // Check if the file exists
            if (fs.existsSync(filePath)) {
                // If the file exists, delete it
                fs.unlinkSync(filePath);
            }
        }

        // Remove the training from the Trainings array
        detail.Trainings.pull({ _id: trainingId });
        await detail.save();

        res.status(200).json({ message: 'Training and associated file deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addEmployeeTraining = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid employee ID' });
    }

    const { Title, StartDate, EndDate, Country, Funding } = req.body;
    const reportFile = req.file; // Access the uploaded file from req.file

    try {
        const detail = await Detail.findById(id);

        if (!detail) {
            return res.status(404).json({ error: 'Employee detail not found' });
        }

        // Construct the new training object based on the trainingSchema
        const newTraining = {
            Title,
            StartDate: new Date(StartDate), // Ensure Date type formatting
            EndDate: new Date(EndDate), // Ensure Date type formatting
            Country,
            Funding,
            reportFile: reportFile ? reportFile.filename : undefined // Save the filename if a file was uploaded, or undefined if not
        };

        // Add the new training to the Trainings array of the employee detail document
        detail.Trainings.push(newTraining);

        // Save the updated employee detail document
        await detail.save();

        // Retrieve the updated employee detail document (optional)
        const updatedDetail = await Detail.findById(id);

        res.status(200).json(updatedDetail);
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
    updateEmployeeTraining,
    addEmployeeTraining,
    deleteEmployeeTraining,
    downloadFile
};
