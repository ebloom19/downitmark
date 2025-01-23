"use client";

import { useState } from "react";
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export const FileUploader = () => {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [markdown, setMarkdown] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0]);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      setMarkdown(result.markdown.text_content || result.error);
    } catch (error) {
      setMarkdown("Conversion failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleFileChange}
        accept=".docx,.pptx,.xlsx"
      />
      <button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? "Converting..." : "Convert to Markdown"}
      </button>
      {markdown && (
        <div>
          <h2>Markdown Output:</h2>
          <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
        </div>
      )}
    </div>
  );
}
