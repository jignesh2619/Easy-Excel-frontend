import React from "react";
import { createRoot } from "react-dom/client";
import { InteractiveSheetEditor } from "./components/InteractiveSheetEditor";
import "./index.css";

// Get data from sessionStorage
const editorDataStr = sessionStorage.getItem('editorData');
if (!editorDataStr) {
  document.body.innerHTML = '<div style="padding: 20px; font-family: system-ui;">No data available. Please go back and click "Preview & Edit" again.</div>';
} else {
  try {
    const { data, columns, formatting_metadata } = JSON.parse(editorDataStr);
    
    const root = createRoot(document.getElementById("root")!);
    root.render(
      <InteractiveSheetEditor
        data={data}
        columns={columns}
        formatting_metadata={formatting_metadata}
        onClose={() => window.close()}
        onSave={(editedData) => {
          // Update sessionStorage with edited data
          sessionStorage.setItem('editorData', JSON.stringify({
            data: editedData,
            columns: columns,
            formatting_metadata: formatting_metadata
          }));
          alert("Changes saved!");
        }}
      />
    );
  } catch (error) {
    document.body.innerHTML = `<div style="padding: 20px; font-family: system-ui;">Error loading data: ${error}</div>`;
  }
}






