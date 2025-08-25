import React, { useState } from "react";
import UploadBox from "./components/UploadBox";
import PdfViewer from "./components/PdfViewer";
import ChatBox from "./components/ChatBox";

function App() {
  const [pdfFile, setPdfFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [citationPage, setCitationPage] = useState(null);

  return (
<div
      style={{
        display: "grid",
        gridTemplateColumns: pdfFile ? "1fr 1fr" : "1fr",
        height: "100vh",
      }}
    >
      {!pdfFile ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <UploadBox onFileUpload={setPdfFile} />
        </div>
      ) : (
        <>
          <ChatBox onCitationClick={(page) => setCitationPage(page)} />

          <PdfViewer
            file={pdfFile}
            numPages={numPages}
            setNumPages={setNumPages}
            citationPage={citationPage}
          />
        </>
      )}
    </div>
  );
}

export default App;
