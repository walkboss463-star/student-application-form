import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import { fetchFlag } from "../services/flagAPI";
import jsPDF from "jspdf";
import "../styles/SubmissionDisplay.css";

export default function SubmissionDisplay() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [flagUrl, setFlagUrl] = useState(null);

  // Fetch student data
  useEffect(() => {
    if (!id) return;

    API.get(`/students/${id}`)
      .then(async (res) => {
        const student = res.data;
        setData(student);

        // Fetch flag for stored country
        if (student.country) {
          const url = await fetchFlag(student.country);
          setFlagUrl(url);
        }
      })
      .catch((err) => console.error(err));
  }, [id]);

  // ----------------------------
  // PDF DOWNLOAD FUNCTION
  // ----------------------------
  const downloadPDF = () => {
    if (!data) return;

    const doc = new jsPDF();
    let y = 20;

    // Title
    doc.setFontSize(18);
    doc.text("Student Application Details", 14, y);
    y += 10;

    doc.setFontSize(12);
    doc.line(14, y, 196, y);
    y += 10;

    const addField = (label, value) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, 14, y);

      doc.setFont("helvetica", "normal");
      doc.text(String(value || "-"), 70, y);

      y += 8; // spacing
    };

    addField("Name:", data.name);
    addField("Email:", data.email);
    addField("Country:", data.country);
    addField("Contact No:", data.contactNumber);
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

    doc.save(`${data.name}-Application.pdf`);
  };

  // ----------------------------
  // SEND EMAIL FUNCTION
  // ----------------------------
  const sendEmail = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/email/send-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      alert(result.message || "Email sent successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to send email");
    }
  };

  // Loading screen
  if (!data)
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="submitted-page">
      <div className="submitted-card">
        <h2 className="submitted-title">Submitted Details</h2>

        {/* PDF Download Button */}
        <button className="pdf-btn" onClick={downloadPDF}>
          Download PDF
        </button>

        {/* SEND EMAIL BUTTON */}
        <button className="email-btn" onClick={sendEmail}>
          Send Email
        </button>

        <div className="details-grid">
          <div className="detail-item">
            <span className="label">Name:</span>
            <span className="value">{data.name}</span>
          </div>

          <div className="detail-item">
            <span className="label">Email:</span>
            <span className="value">{data.email}</span>
          </div>

          <div className="detail-item country-row">
            <span className="label">Country:</span>
            <span className="value">{data.country}</span>

            {flagUrl && (
              <img src={flagUrl} alt="flag" className="submitted-flag" />
            )}
          </div>

          <div className="detail-item">
            <span className="label">Contact No:</span>
            <span className="value">{data.contactNumber || "-"}</span>
          </div>

          <div className="detail-item">
            <span className="label">State:</span>
            <span className="value">{data.state}</span>
          </div>

          <div className="detail-item">
            <span className="label">City:</span>
            <span className="value">{data.city}</span>
          </div>

          <div className="detail-item">
            <span className="label">Gender:</span>
            <span className="value">{data.gender}</span>
          </div>

          <div className="detail-item">
            <span className="label">Education:</span>
            <span className="value">{data.educationType}</span>
          </div>

          {data.educationType === "PUC" && (
            <div className="detail-item">
              <span className="label">PUC Stream:</span>
              <span className="value">{data.pucStream}</span>
            </div>
          )}

          {data.educationType === "Diploma" && (
            <div className="detail-item">
              <span className="label">Diploma Branch:</span>
              <span className="value">{data.diplomaBranch}</span>
            </div>
          )}

          <div className="detail-item">
            <span className="label">Submitted On:</span>
            <span className="value">
              {new Date(data.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
