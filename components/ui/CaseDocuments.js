import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import Image from 'next/image';

// Helper function to get MIME type from file extension
const getMimeType = (extension) => {
  if (!extension) return 'application/octet-stream';
  
  const ext = extension.toLowerCase().replace('.', '');
  const mimeTypes = {
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'txt': 'text/plain',
    'csv': 'text/csv',
    'html': 'text/html',
    'htm': 'text/html',
  };
  
  return mimeTypes[ext] || 'application/octet-stream';
};

// Helper to extract file extension
const getFileExtension = (filename) => {
  if (!filename) return '';
  const parts = filename.split('.');
  return parts.length > 1 ? `.${parts[parts.length - 1].toLowerCase()}` : '';
};

function CaseDocuments({ caseId }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [documentType, setDocumentType] = useState('Evidence');
  const [documentTitle, setDocumentTitle] = useState('');
  const fileInputRef = useRef(null);

  const documentTypes = [
    'Evidence',
    'Affidavit',
    'Legal Brief',
    'Court Order',
    'Judgment',
    'Petition',
    'Witness Statement',
    'Expert Report',
    'Other'
  ];

  // Allowed file types
  const allowedFileTypes = [
    'application/pdf',                                    // PDF
    'application/msword',                                 // DOC
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',  // DOCX
    'image/jpeg',                                         // JPG/JPEG
    'image/png',                                          // PNG
    'application/vnd.ms-excel',                           // XLS
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',       // XLSX
    'text/plain'                                          // TXT
  ];

  // Fetch documents on component mount
  useEffect(() => {
    async function fetchDocuments() {
      try {
        const response = await fetch(`/api/case/documents?caseId=${caseId}`);
        const data = await response.json();
        
        if (response.ok) {
          setDocuments(data.documents || []);
        } else {
          toast.error('Failed to fetch documents');
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
        toast.error('An error occurred while fetching documents');
      } finally {
        setLoading(false);
      }
    }

    if (caseId) {
      fetchDocuments();
    }
  }, [caseId]);

  // Handle file upload
  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!fileInputRef.current.files || fileInputRef.current.files.length === 0) {
      toast.error('Please select a document to upload');
      return;
    }
    
    const file = fileInputRef.current.files[0];
    
    // Validate file name
    if (!file.name || file.name.trim() === '') {
      toast.error('Invalid filename. Please rename your file before uploading.');
      return;
    }
    
    // Validate file type
    if (!allowedFileTypes.includes(file.type)) {
      toast.error('File type not supported. Please upload PDF, DOCX, JPG, PNG, XLS, XLSX, or TXT files.');
      return;
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds the 10MB limit');
      return;
    }
    
    setUploading(true);
    const toastId = toast.loading('Uploading document...');
    
    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('caseId', caseId);
      formData.append('title', documentTitle || file.name);
      formData.append('documentType', documentType);
      
      const response = await fetch('/api/case/documents', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success('Document uploaded successfully');
        
        // Add the new document to the list
        setDocuments([data.document, ...documents]);
        
        // Reset form
        fileInputRef.current.value = '';
        setDocumentTitle('');
      } else {
        toast.error(data.message || 'Failed to upload document');
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('An error occurred while uploading the document');
    } finally {
      setUploading(false);
      toast.dismiss(toastId);
    }
  };

  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };

  // Determine if a file is viewable in browser
  const isViewableInBrowser = (fileName) => {
    if (!fileName) return false;
    const ext = fileName.split('.').pop().toLowerCase();
    return ['pdf', 'jpg', 'jpeg', 'png'].includes(ext);
  };

  // Handle document view safely
  const handleDocumentView = (doc) => {
    if (!doc || !doc.filePath) {
      toast.error('Document path not available');
      return;
    }
    
    // Check if the file is viewable in browser
    if (isViewableInBrowser(doc.fileName)) {
      window.open(doc.filePath, '_blank');
    } else {
      // For non-viewable files, attempt download with proper filename
      try {
        // Get file extension from filename
        const fileExt = doc.fileExtension || getFileExtension(doc.fileName);
        
        // Get appropriate MIME type
        const mimeType = getMimeType(fileExt);
        
        // Create blob from file URL (for content-type)
        fetch(doc.filePath)
          .then(response => response.blob())
          .then(blob => {
            // Create blob with proper MIME type
            const file = new Blob([blob], { type: mimeType });
            
            // Create download link
            const downloadUrl = URL.createObjectURL(file);
            const link = document.createElement('a');
            link.href = downloadUrl;
            
            // Set proper filename
            const downloadName = doc.fileName || (`document${fileExt}`);
            link.setAttribute('download', downloadName);
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            
            // Clean up
            document.body.removeChild(link);
            URL.revokeObjectURL(downloadUrl);
          })
          .catch(error => {
            console.error('Fetch error:', error);
            // Fallback to direct link
            directDownload(doc);
          });
      } catch (error) {
        console.error('Download error:', error);
        // Fallback to direct link method
        directDownload(doc);
      }
    }
  };
  
  // Fallback direct download method
  const directDownload = (doc) => {
    try {
      const link = document.createElement('a');
      link.href = doc.filePath;
      
      // Use sanitized original filename for download
      const downloadName = doc.fileName || (`document${doc.fileExtension || ''}`);
      link.setAttribute('download', downloadName);
      
      // Append element, trigger click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Direct download error:', error);
      toast.error('Failed to download the document');
      // Final fallback - open in new tab
      window.open(doc.filePath, '_blank');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6 transition-colors duration-200">
      <h2 className="text-xl font-bold mb-4 dark:text-white">Case Documents</h2>
      
      {/* Document upload form */}
      <form onSubmit={handleUpload} className="mb-8">
        <div className="mb-4">
          <label className="block uppercase tracking-wide text-gray-500 dark:text-gray-400 text-xs font-bold mb-2">
            Document Type
          </label>
          <select
            className="form-select mt-1 block w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            required
          >
            {documentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block uppercase tracking-wide text-gray-500 dark:text-gray-400 text-xs font-bold mb-2">
            Document Title
          </label>
          <input
            type="text"
            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 dark:text-white bg-white dark:bg-gray-700 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
            placeholder="Enter document title (optional)"
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block uppercase tracking-wide text-gray-500 dark:text-gray-400 text-xs font-bold mb-2">
            Select Document
          </label>
          <input
            type="file"
            ref={fileInputRef}
            className="border border-gray-300 dark:border-gray-600 p-2 w-full rounded dark:bg-gray-700 dark:text-white"
            required
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Max file size: 10MB. Supported formats: PDF, DOCX, JPG, PNG, XLS, XLSX, TXT
          </p>
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          {uploading ? 'Uploading...' : 'Upload Document'}
        </button>
      </form>

      {/* Document list */}
      <div>
        <h3 className="text-lg font-semibold mb-3 dark:text-white">Uploaded Documents</h3>
        
        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading documents...</p>
        ) : documents.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No documents uploaded yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Document</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Type</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Size</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Uploaded</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc._id} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800 dark:text-gray-200">{doc.title || 'Untitled Document'}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{doc.fileName || 'No filename'}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{doc.documentType || 'Other'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{doc.fileSize ? formatFileSize(doc.fileSize) : 'Unknown'}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="text-gray-700 dark:text-gray-300">{doc.uploadedAt ? formatDate(doc.uploadedAt) : 'Unknown'}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">by {doc.uploadedBy || 'Unknown'}</div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        onClick={() => handleDocumentView(doc)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        {isViewableInBrowser(doc.fileName) ? 'View' : 'Download'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default CaseDocuments; 