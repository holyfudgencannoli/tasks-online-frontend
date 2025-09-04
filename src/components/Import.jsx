import { useState } from "react";

export default function ImportBackup() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage(""); // reset
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("https://react-tasks-online.onrender.com/api/import-all", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ ${data.message}`);
      } else {
        setMessage(`❌ Error: ${data.error || "Something went wrong"}`);
      }
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div className="p-4 rounded-xl border border-gray-300 shadow-md w-fit">
      <h2 className="text-lg font-semibold mb-2">Import Backup</h2>

      <input
        type="file"
        accept=".xlsx"
        onChange={handleFileChange}
        className="mb-3"
      />

      <button
        onClick={handleUpload}
        disabled={!file}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
      >
        Upload
      </button>

      {message && (
        <p className="mt-3 text-sm">{message}</p>
      )}
    </div>
  );
}
