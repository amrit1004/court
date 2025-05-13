# Adaalat: A court management system

![app-preview](https://res.cloudinary.com/dapafwlvo/image/upload/v1635735765/image1_kafi3l.png)

A court case management software that has facility to record information like adding a case,
adding lawyers (have facility select from existing list of lawyers), add invoice for
for each hearing and for different heads under which lawyers charge the clients.
In short the system should provide end to end management of court cases from a
client perspective and should be easy to use.

## Features

- Add and manage court cases 
- Select lawyers from existing database
- Generate and download PDF case details
- Case status tracking with timeline
- Document management with file uploads
- Lawyer rating and review system
- Advanced search and filtering capabilities
- Dark mode support for better user experience

---
## Tech Stack

- NextJS
- Tailwind CSS
- MongoDB
- NextAuth (Credential and Google OAuth)
- React-Hook-Forms
- jsPDF for PDF generation
- Formidable for file uploads

## Run Locally

Clone the project

```bash
  git clone https://github.com/GeoBrodas/adalat-court-management.git
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Add Environment Variables

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_URL=http://localhost:3000
MONGODB_USERNAME=
MONGODB_PASSWORD=
MONGODB_CLUSTER=
MONGODB_DATABASE=
```

Start the server

```bash
  npm run dev
```

## New Features Details

### 1. Case Status Tracking
- Track the progress of cases through different stages (Filed, In Progress, Completed, etc.)
- Add status updates with notes
- View a timeline of all status changes

### 2. Document Management
- Upload and organize case-related documents
- Support for various document types (Evidence, Affidavit, Court Order, etc.)
- View and download uploaded documents

### 3. Lawyer Rating and Review
- Rate lawyers on a 5-star scale
- Leave detailed reviews about lawyer performance
- View other clients' reviews and ratings

### 4. Advanced Search
- Search cases by multiple criteria
- Filter by case type, status, date range
- Sort and organize search results

## Initial Setup

After setting up the project, you can initialize the database with test data by visiting:

```
http://localhost:3000/api/setup-db
```

This will create necessary collections and indexes for the new features.

## Feedback

If you have any feedback, please reach out to us at

- https://georgey.codes
- geobro2310@gmail.com

## 🔗 Links

[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://georgey.codes/)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/georgeyvb/)
