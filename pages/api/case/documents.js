import { connectToDatabase, addCaseDocument, getCaseDocuments } from '@/helpers/db-utils';
import { getSession } from 'next-auth/client';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';

// Disable bodyParser to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// Get file extension from filename
const getFileExtension = (filename) => {
  if (!filename) return '';
  const parts = filename.split('.');
  return parts.length > 1 ? `.${parts[parts.length - 1].toLowerCase()}` : '';
};

// Sanitize filename to remove invalid characters
const sanitizeFilename = (filename) => {
  if (!filename) return 'document';
  return filename.replace(/[^a-z0-9.-]/gi, '_');
};

// Parse form data including files
const parseForm = async (req) => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({
      uploadDir: path.join(process.cwd(), 'public', 'uploads'),
      keepExtensions: true,
    });
    
    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
};

async function handler(req, res) {
  // Get user session to verify authentication
  const session = await getSession({ req });
  
  if (!session) {
    return res.status(401).json({ message: 'Not authenticated!' });
  }

  const client = await connectToDatabase();

  try {
    // GET request - fetch documents for a case
    if (req.method === 'GET') {
      const caseId = req.query.caseId;
      
      if (!caseId) {
        return res.status(400).json({ message: 'Case ID is required' });
      }
      
      const documents = await getCaseDocuments(client, caseId);
      return res.status(200).json({ documents });
    }
    
    // POST request - add a new document
    if (req.method === 'POST') {
      const { fields, files } = await parseForm(req);
      
      if (!fields.caseId) {
        return res.status(400).json({ message: 'Case ID is required' });
      }
      
      if (!files.document) {
        return res.status(400).json({ message: 'Document file is required' });
      }
      
      const file = files.document;
      const originalFilename = file.originalFilename || 'document';
      const sanitizedFilename = sanitizeFilename(originalFilename);
      const fileExtension = getFileExtension(originalFilename);
      const fileSize = file.size;
      
      // Create a unique filename with timestamp
      const timestamp = Date.now();
      const uniqueFilename = `doc_${timestamp}${fileExtension}`;
      
      // Safely handle file paths to avoid undefined path argument
      let relativePath = '';
      let storedFilename = '';
      
      try {
        if (file.filepath) {
          const filepathStr = String(file.filepath); // Ensure path is a string
          const uploadedFilePath = path.basename(filepathStr); 
          
          // Rename the file to include proper extension if needed
          const oldPath = path.join(process.cwd(), 'public', 'uploads', uploadedFilePath);
          const newPath = path.join(process.cwd(), 'public', 'uploads', uniqueFilename);
          
          // Only rename if the paths are different
          if (oldPath !== newPath) {
            fs.renameSync(oldPath, newPath);
          }
          
          relativePath = `/uploads/${uniqueFilename}`;
          storedFilename = uniqueFilename;
        } else {
          // If filepath is missing, create a fallback path
          relativePath = `/uploads/${uniqueFilename}`;
          storedFilename = uniqueFilename;
        }
      } catch (error) {
        console.error('Error processing file path:', error);
        relativePath = `/uploads/${uniqueFilename}`;
        storedFilename = uniqueFilename;
      }
      
      const documentData = {
        caseId: fields.caseId,
        title: fields.title || sanitizedFilename,
        fileName: sanitizedFilename, // Original sanitized filename for display
        storedFilename: storedFilename, // Actual filename on server
        fileExtension: fileExtension,
        fileSize,
        filePath: relativePath,
        documentType: fields.documentType || 'Other',
        uploadedBy: session.user.email,
      };
      
      const result = await addCaseDocument(client, documentData);
      return res.status(201).json({ 
        message: 'Document uploaded successfully', 
        document: {
          ...documentData,
          _id: result.insertedId
        } 
      });
    }
    
    // Method not allowed
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Error in case documents API:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    client.close();
  }
}

export default handler; 