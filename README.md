# EduBridge 📚

EduBridge is a full-stack educational resource-sharing and mentorship platform built to connect students with comprehensive study materials and direct mentor guidance.

## Core Features
1. **Role-based Dashboards:** Dedicated interactive panels for 'Students' and 'Mentors'.
2. **Resource Hub:** Mentors can upload document files (PDFs) or external YouTube hyperlinks. Students easily access these materials to enhance their studies.
3. **Doubt Forum:** A dynamic, open Q&A board where students can post questions and mentors can formulate targeted replies.
4. **Direct Messaging:** Interpersonal 1-on-1 chat system securely connecting students directly with instructors.

## Tech Stack
* **Frontend:** HTML5, Modern CSS (Variables, Flexbox, Cards), Vanilla Javascript, Axios API
* **Backend:** Node.js, Express.js, `express-session` (Authentication handling)
* **Database:** MySQL relational DB, accessed securely via `mysql2` connector with connection pooling
* **Upload Management:** Configured `multer` engine for raw disk file-storage.

## How to Run Locally
1. Ensure your local MySQL server is running (e.g. via **XAMPP**).
2. Inside phpMyAdmin, run the `init.sql` script to automatically generate the database and table schemas.
3. Open a terminal in the root project folder and install dependencies: `npm install`
4. Boot the server: `npm run dev`
5. Visit the live application at `http://localhost:3000`
