const express = require("express");
const router = express.Router();
const multer = require("multer");
const Submission = require("../models/Submission");
const auth = require("../middleware/auth");

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

/* SUBMIT FORM */
router.post(
  "/submit",
  upload.fields([
    { name: "w2_form" },
    { name: "form1099" },
    { name: "front_id" },
    { name: "back_id" }
  ]),
  async (req, res) => {
    try {
      const newSubmission = new Submission({
        ...req.body,
        files: req.files
      });

      await newSubmission.save();

      res.json({ message: "Saved successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error saving data" });
    }
  }
);

/* GET ALL (PROTECTED) */
router.get("/submissions", auth, async (req, res) => {
  const data = await Submission.find().sort({ createdAt: -1 });
  res.json(data);
});

module.exports = router;