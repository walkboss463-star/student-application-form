const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");

// -----------------------------
// SEND EMAIL WITH PDF
// -----------------------------
router.post("/send-email", async (req, res) => {
  try {
    const data = req.body;

    // ----------------------------------
    // Generate PDF using PDFKit
    // ----------------------------------
    const doc = new PDFDocument();
    let chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", async () => {
      const pdfBuffer = Buffer.concat(chunks);

      // ----------------------------------
      // Send Email
      // ----------------------------------
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: data.email,
        subject: "Your Student Application PDF",
        html: `
          <h3>Hello ${data.name},</h3>
          <p>Your application form is attached as a PDF.</p>
          <p>Regards,<br/>Your Institute</p>
        `,
        attachments: [
          {
            filename: `${data.name}-Application.pdf`,
            content: pdfBuffer,
          },
        ],
      };

      await transporter.sendMail(mailOptions);

      res.json({ message: "Email sent successfully!" });
    });

    // ----------------------------------
    // Write PDF Content
    // ----------------------------------
    doc.fontSize(20).text("Student Application Details", { underline: true });

    doc.moveDown();
    const addField = (label, value) => {
      doc.font("Helvetica-Bold").text(label, { continued: true });
      doc.font("Helvetica").text(" " + (value || "-"));
    };

    addField("Name:", data.name);
    addField("Email:", data.email);
    addField("Country:", data.country);
    addField("Contact:", data.contactNumber);
    addField("State:", data.state);
    addField("City:", data.city);
    addField("Gender:", data.gender);
    addField("Education:", data.educationType);

    if (data.educationType === "PUC") {
      addField("PUC Stream:", data.pucStream);
    }

    if (data.educationType === "Diploma") {
      addField("Diploma Branch:", data.diplomaBranch);
    }

    addField("Submitted On:", new Date(data.createdAt).toLocaleString());

    doc.end();

  } catch (err) {
    console.error("Email Error:", err);
    res.status(500).json({ message: "Failed to send email" });
  }
});

module.exports = router;
