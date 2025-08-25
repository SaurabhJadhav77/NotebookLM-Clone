import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Document, Page, pdfjs } from "react-pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";


pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

const UploadBox = ({ onFileUpload }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileUrl, setFileUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [error, setError] = useState(null);


const uploadToChatPDF = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("https://api.chatpdf.com/v1/sources/add-file", {
      method: "POST",
      headers: {
        "x-api-key": import.meta.env.VITE_CHATPDF_KEY,
      },
      body: formData,
    });

    const data = await res.json();
    console.log("Upload API response:", data); // 👈 debug log

    if (data?.sourceId) {
      localStorage.setItem("chatpdf_sourceId", data.sourceId);
    } else if (data?.sourceIds?.length > 0) {
      localStorage.setItem("chatpdf_sourceId", data.sourceIds[0]);
    } else {
      console.error("ChatPDF upload failed:", data);
      setError("ChatPDF upload failed. Please try again.");
    }
  } catch (err) {
    console.error("ChatPDF upload error:", err);
    setError("Error uploading to ChatPDF.");
  }
};


  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setUploading(true);
      setProgress(0);
      setError(null);

      let prog = 0;
      const interval = setInterval(() => {
        prog += 20;
        setProgress(prog);
        if (prog >= 100) {
          clearInterval(interval);
          setUploading(false);
          setFileUrl(URL.createObjectURL(file));
          onFileUpload(file); 
          uploadToChatPDF(file); 
        }
      }, 300);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      {!fileUrl ? (
        <Card
          sx={{
            p: 4,
            textAlign: "center",
            width: 400,
            borderRadius: "16px",
            boxShadow: 3,
          }}
        >
          <CardContent>
            {!uploading ? (
              <>
                <CloudUploadIcon sx={{ fontSize: 50, color: "purple" }} />
                <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
                  Upload PDF to start chatting
                </Typography>
                <Button
                  variant="contained"
                  component="label"
                  sx={{
                    borderRadius: "10px",
                    background: "linear-gradient(90deg, #8a2be2, #6a0dad)",
                  }}
                >
                  Click or drag to upload
                  <input
                    type="file"
                    hidden
                    accept="application/pdf"
                    onChange={handleFileChange}
                  />
                </Button>
              </>
            ) : (
              <>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <CircularProgress size={20} color="secondary" />
                    <Typography color="purple">Uploading PDF</Typography>
                  </Box>
                  <Typography color="purple">{progress}%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    mt: 2,
                    height: 8,
                    borderRadius: 5,
                    backgroundColor: "#e0cfff",
                  }}
                  color="secondary"
                />
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <Box
          width="80%"
          height="90vh"
          p={2}
          bgcolor="white"
          boxShadow={3}
          borderRadius={2}
          overflow="auto"
        >
          {error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <Document
              file={fileUrl}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              onLoadError={(err) => {
                console.error("PDF load error:", err);
                setError("Failed to load PDF file.");
              }}
            >
              {Array.from(new Array(numPages), (el, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  width={600}
                />
              ))}
            </Document>
          )}
        </Box>
      )}
    </Box>
  );
};

export default UploadBox;
