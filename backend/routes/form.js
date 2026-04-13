const express = require("express");
const router = express.Router();
const multer = require("multer");
const nodemailer = require("nodemailer");
const Submission = require("../models/Submission");

/* EMAIL SETUP */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

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

      /* 📩 SEND EMAIL */
      const attachments = [];

      if (req.files) {
        Object.values(req.files).forEach(arr => {
          arr.forEach(file => {
            attachments.push({
              filename: file.originalname,
              path: file.path
            });
          });
        });
      }

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: "New Submission Received",
        html: `
          <h2>New Form Submission</h2>
          <p><b>Name:</b> ${req.body.full_name}</p>
          <p><b>Email:</b> ${req.body.email}</p>
          <p><b>Phone:</b> ${req.body.phone}</p>
        `,
        attachments: attachments
      });

      res.json({ message: "Saved & Email sent" });

    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Error saving data" });
    }
  }
);

/* ADMIN GET ALL */
router.get("/admin/submissions", async (req, res) => {
  try {
    const data = await Submission.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching data" });
  }
});

/* DELETE */
router.delete("/admin/delete/:id", async (req, res) => {
  try {
    await Submission.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;
