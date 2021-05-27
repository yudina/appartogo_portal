import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

export default function PDF(props) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div>
      <Document file={props.file} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={1} pageIndex={0} height={200} />
      </Document>
    </div>
  );
}
