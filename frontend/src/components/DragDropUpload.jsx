import { useState, useRef } from "react";
import { UploadCloud, FileText, CheckCircle2, Loader2, X } from "lucide-react";

const DragDropUpload = ({ onUpload, uploading, error }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        setSelectedFile(file);
      } else {
        alert("Please select a PDF contract file.");
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    await onUpload(selectedFile);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const clearSelection = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
          Upload Contract
        </h2>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">PDF up to 10MB</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3
          ${
            isDragging
              ? "border-blue-500 bg-blue-500/10 scale-[0.99]"
              : "border-zinc-300 hover:border-zinc-400 bg-white dark:bg-zinc-900/40 dark:border-zinc-800 dark:hover:border-zinc-700 shadow-xs"
          }
        `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 flex items-center justify-center text-zinc-600 dark:text-zinc-300 shadow-inner">
            <UploadCloud className="w-6 h-6 text-blue-500 dark:text-blue-400" />
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              PDF, contracts, agreements or amendments (max. 10MB)
            </p>
          </div>
        </div>

        {/* Selected File Feedback & Upload Button */}
        {selectedFile && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 shadow-sm animate-in fade-in duration-200">
            <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
              <div className="w-9 h-9 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                  {selectedFile.name}
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
              <button
                type="button"
                onClick={clearSelection}
                className="p-1 text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100"
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing & Indexing...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Upload & Analyze</span>
                </>
              )}
            </button>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 dark:text-rose-400 text-xs">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default DragDropUpload;
