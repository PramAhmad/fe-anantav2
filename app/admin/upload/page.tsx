"use client";

import { useState, FormEvent, ChangeEvent } from "react";

export default function BulkUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{
    success: number;
    failed: number;
    errors: string[];
  } | null>(null);
  const [error, setError] = useState("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = [
        "text/csv",
        "application/zip",
        "application/x-zip-compressed",
      ];

      if (!validTypes.includes(selectedFile.type)) {
        setError("Please upload a CSV or ZIP file");
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setError("");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    setProgress(0);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/import", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      setResult(data);
      setFile(null);
      setProgress(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="rounded-lg bg-blue-50 p-6 border border-blue-200">
        <h3 className="mb-3 font-semibold text-blue-900">📋 Upload Instructions</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>
            <strong>CSV Format:</strong> name, description, category, difficulty,
            video_url, audio_url
          </li>
          <li>
            <strong>ZIP Format:</strong> Folder with CSV + video files (auto upload)
          </li>
          <li>
            <strong>Example CSV:</strong>
            <pre className="mt-2 rounded bg-white p-3 text-xs overflow-x-auto">
{`name,description,category,difficulty,video_url,audio_url
Halo,Greeting gesture,Greetings,Easy,https://...,https://...
Terima Kasih,Thank you gesture,Greetings,Easy,https://...,`}
            </pre>
          </li>
        </ul>
      </div>

      {/* Upload Form */}
      <div className="rounded-lg bg-white p-6 shadow">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Upload CSV or ZIP
            </label>
            <div className="rounded-lg border-2 border-dashed border-slate-300 p-8 text-center hover:border-blue-500 transition-colors">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".csv,.zip"
                id="file-input"
                className="hidden"
              />
              <label
                htmlFor="file-input"
                className="cursor-pointer block"
              >
                <div className="text-4xl mb-2">📁</div>
                <p className="font-semibold text-slate-900">
                  {file ? file.name : "Click or drag to upload"}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  CSV or ZIP file (max 50MB)
                </p>
              </label>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Progress */}
          {isLoading && (
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-900">Uploading...</span>
                <span className="text-slate-600">{progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className={`rounded-lg p-4 ${
              result.failed === 0
                ? "bg-green-50 border border-green-200"
                : "bg-yellow-50 border border-yellow-200"
            }`}>
              <p className={`font-semibold ${
                result.failed === 0 ? "text-green-900" : "text-yellow-900"
              }`}>
                ✓ Upload Complete
              </p>
              <p className="mt-2 text-sm text-slate-700">
                Success: <span className="font-bold text-green-600">{result.success}</span>
                {" | "}
                Failed: <span className="font-bold text-red-600">{result.failed}</span>
              </p>

              {result.errors.length > 0 && (
                <div className="mt-4 max-h-48 overflow-y-auto rounded bg-white p-3">
                  <p className="text-xs font-medium text-slate-900 mb-2">
                    Errors:
                  </p>
                  <ul className="space-y-1 text-xs text-red-700">
                    {result.errors.map((err, i) => (
                      <li key={i}>• {err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!file || isLoading}
            className="w-full rounded-lg bg-blue-600 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Uploading..." : "Upload & Import"}
          </button>
        </form>
      </div>

      {/* Help */}
      <div className="rounded-lg bg-slate-50 p-6 border border-slate-200">
        <h3 className="font-semibold text-slate-900 mb-3">❓ FAQ</h3>
        <div className="space-y-4 text-sm text-slate-700">
          <div>
            <p className="font-medium text-slate-900">Gimana cara prepare dataset?</p>
            <p className="mt-1">
              1. Download dari SignID atau Kaggle
              <br />
              2. Resize video ke 480p: <code className="bg-slate-100 px-2 py-1 rounded text-xs">ffmpeg -i input.mp4 -s 854x480 output.mp4</code>
              <br />
              3. Upload ke Supabase Storage
              <br />
              4. Buat CSV dengan link URL
              <br />
              5. Upload CSV di sini
            </p>
          </div>

          <div>
            <p className="font-medium text-slate-900">
              Bisa batch upload video files?
            </p>
            <p className="mt-1">
              Ya! ZIP file dengan struktur: <code className="bg-slate-100 px-2 py-1 rounded text-xs">data.csv + video1.mp4 + video2.mp4</code>
              <br />
              Video akan auto-upload ke Storage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
