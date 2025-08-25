import React, { useRef } from "react";
import { Document, Page } from "react-pdf";
import ChatBox from "./ChatBox";

const PdfViewer = ({ file, numPages, setNumPages, citationPage }) => {
  const viewerRef = useRef();

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  React.useEffect(() => {
    if (citationPage && viewerRef.current) {
      const pageElement = viewerRef.current.querySelector(
        `[data-page-number="${citationPage}"]`
      );
      if (pageElement) {
        pageElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [citationPage]);
  
  const handleCitationClick = (pageNum) => {
  setPageNumber(pageNum); 
};


  return (
    <div
      ref={viewerRef}
      style={{ height: "80vh", overflowY: "auto", border: "1px solid #ddd" }}
    >
      <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.from(new Array(numPages), (el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        ))}
      </Document>

    </div>
  );
};

export default PdfViewer;
