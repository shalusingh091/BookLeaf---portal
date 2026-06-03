# BookLeaf Author Support & Communication Portal

AI-powered ticket management system for authors to get instant support for their published books.

**Live Demo**  
Frontend: [https://bookleaf-portal.vercel.app](https://bookleaf-portal.vercel.app)  
Backend: [https://bookleaf-api.onrender.com](https://bookleaf-api.onrender.com)  

> Note: Backend is hosted on Render free tier. First request may take 30s to wake up if inactive.

**Test Credentials**  
Author: `author1@test.com` / `password123`  
Admin: `admin@bookleaf.com` / `password123`  

## Key Features
- **AI Ticket Classification**: Auto-categorizes tickets into 6 types using gpt-4o-mini
- **Smart Priority Assignment**: AI assigns Critical/High/Medium/Low priority
- **AI Draft Responses**: Generates empathetic replies using BookLeaf Knowledge Base
- **Role-Based Access**: Separate dashboards for Authors and Admins
- **Book-Specific Support**: Link tickets directly to published books
- **Real-Time Updates**: 5s polling for live ticket status
- **Secure Auth**: JWT-based authentication with role validation

## Tech Stack
**Frontend:** React.js, Vite, Axios, Tailwind CSS, React Router  
**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT  
**AI:** OpenAI gpt-4o-mini API  
**Deployment:** Vercel (Frontend), Render (Backend)

## AI Integration Details
1. **Model**: gpt-4o-mini for cost efficiency
2. **Prompt Engineering**: Knowledge Base injected for BookLeaf-specific context
3. **Auto-Classification**: Royalty, Publishing, Technical, Content, Marketing, Account
4. **Priority Logic**: Critical for payment issues, High for publishing delays
5. **Fallback System**: Pre-written responses if OpenAI API fails
6. **Cost Optimization**: ~$0.00005 per ticket, max_tokens: 250, temperature: 0.3

## Project Workflow
1. **Author Login**: Author signs in with credentials
2. **Create Ticket**: Selects book → writes issue → submits
3. **AI Processing**: Backend sends ticket to OpenAI → gets category, priority, draft
4. **Admin Review**: Admin sees AI draft → edits if needed → sends response
5. **Resolution**: Author gets notification → ticket marked resolved

## API Endpoints
| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/login` | Public | User login |
| POST | `/api/auth/register` | Public | Author signup |
| GET | `/api/books/my` | Author | Get author's books |
| POST | `/api/tickets` | Author | Create new ticket |
| GET | `/api/tickets` | Both | Get tickets by role |
| GET | `/api/tickets/:id` | Both | Get ticket details |
| PUT | `/api/tickets/:id/respond` | Admin | Send final response |
| POST | `/api/ai/process` | Internal | AI processing |
| POST | `/api/ai/regenerate` | Admin | Regenerate AI draft |

## Database Schema
**Users Collection**
```js
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  role: "author" | "admin",
  name: String,
  createdAt: Date
}
*Books Collection*
{
  _id: ObjectId,
  authorId: ObjectId,
  title: String,
  isbn: String,
  status: "published" | "draft",
  royaltyPending: Number,
  publishedAt: Date
}
*Tickets Collection*
{
  _id: ObjectId,
  authorId: ObjectId,
  bookId: ObjectId,
  subject: String,
  description: String,
  category: String,
  priority: "Critical" | "High" | "Medium" | "Low",
  status: "open" | "in-progress" | "resolved",
  aiDraft: String,
  adminResponse: String,
  createdAt: Date,
  updatedAt: Date
}
## Challenges & Solutions
Challenge | Solution
OpenAI API rate limits | Implemented retry logic with exponential backoff
Render free tier sleep | Added note in README, used uptime monitoring
JWT token expiry | Added refresh token mechanism
Large AI responses | Limited max_tokens to 250 for cost control
## Prerequisites
- http://Node.js v18+
- MongoDB Atlas account
- OpenAI API key

## Environment Variables
*Backend `.env`*
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bookleaf
JWT_SECRET=your_super_secret_jwt_key_here
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
NODE_ENV=production
PORT=5000
*Frontend `.env`*
VITE_API_URL=https://bookleaf-api.onrender.com
## Local Setup
# 1. Clone repo
git clone https://github.com/yourusername/bookleaf.git
cd bookleaf

# 2. Backend setup
cd backend
npm install
npm run dev

# 3. Frontend setup
cd frontend
npm install
npm run dev

# 4. Seed database with demo data
cd backend
node seed.js
Frontend: `http://localhost:5173`  
Backend: `http://localhost:5000`

## System Architecture
1. *Frontend*: React SPA with protected routes. Authors see only their tickets/books. Admins see all.
2. *Backend*: RESTful Express API with JWT middleware. Role-based access control.
3. *AI Flow*: Ticket Created → OpenAI API Call → Category + Priority + Draft → Save to DB → Admin Reviews
4. *Real-time*: Frontend polls `/api/tickets` every 5s for updates.
5. *Knowledge Base*: BookLeaf policies/FAQs injected in system prompt for accurate AI responses.

## Future Improvements
1. WebSocket integration for instant updates
2. AWS S3 for file attachments in tickets
3. Email notifications via SendGrid
4. Advanced analytics dashboard for admins
5. Multi-language AI support

## Known Limitations
1. File upload supports images only, S3 pending
2. Polling used instead of WebSockets
3. Basic Tailwind UI, needs design revamp
4. No automated email alerts yet

## License
MIT License

*Developed by:* Shalu Singh