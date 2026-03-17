>  This is the Frontend repository. Backend repo: [archflow-backend](https://github.com/faezur/archflow-backend)

# ArchFlow — AI Architectural Render Generator

> Transform your 2D floor plans into photorealistic 3D renders using AI

[![Live Demo](https://img.shields.io/badge/Live-Demo-amber?style=for-the-badge)](https://arch-flow-mu.vercel.app)
[![Frontend](https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge)](https://github.com/faezur/archflow)
[![Backend](https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge)](https://github.com/faezur/archflow-backend)

---

##  Links 
- **Live Demo:** [arch-flow-mu.vercel.app](https://arch-flow-mu.vercel.app)
- **Backend API:** [archflow-backend.onrender.com](https://archflow-backend.onrender.com)
- **Frontend Repo:** [github.com/faezur/archflow](https://github.com/faezur/archflow)
- **Backend Repo:** [github.com/faezur/archflow-backend](https://github.com/faezur/archflow-backend)

---

## 📸 Screenshots

### Home Page
![Home Page](./screenshots/home.png)

### Generate Page
![Generate Page](./screenshots/generate.png)

### History Page
![History Page](./screenshots/history.png)

### 3D Render Result
![3D Render](./screenshots/render-result.png)

---

##  Features 

-  **Floor Plan Upload** — Drag & drop or click to upload 2D floor plan 
-  **AI Analysis** — AI analyzes rooms, dimensions and spatial layout 
-  **3D Render Generation** — Photorealistic top-down architectural render 
-  **JWT Authentication** — Secure register & login 
- **Google OAuth** — One click sign in with Google 
-  **Render History** — View, download and delete your renders 
-  **Image Compare Slider** — Compare original vs generated 
-  **Cloud Storage** — Images stored on Cloudinary 
- **Fully Responsive** — Works on all screen sizes 
- **Retry Logic** — Auto retry on API rate limits 

---

## Tech Stack 

| Category | Technology |
|----------|-----------|
| Frontend | React, Vite, Tailwind CSS, React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT, bcryptjs, Passport.js, Google OAuth 2.0 |
| AI | Groq Vision AI, Stability AI |
| Storage | Cloudinary, Multer |
| Deploy | Vercel (Frontend), Render.com (Backend) |

---

##  AI Flow 

```
1. User uploads 2D floor plan image
        ↓
2. Image saved to Cloudinary
        ↓
3. AI analyzes floor plan
   → Identifies rooms & positions
   → Reads dimensions
   → Maps furniture per room type
        ↓
4. Detailed prompt generated
        ↓
5. Stability AI generates 3D render
        ↓
6. Generated image saved to Cloudinary
        ↓
7. Result saved to MongoDB & displayed
```

---

##  Installation & Setup 

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account
- Groq API key
- Stability AI API key
- Google OAuth credentials

### Backend Setup
```bash
git clone https://github.com/faezur/archflow-backend
cd archflow-backend
npm install
```

Create `.env` file:
```

```bash
node server.js
```

### Frontend Setup
```bash
git clone https://github.com/faezur/archflow
cd archflow
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

---

## API Endpoints 

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register user |
| POST | `/api/auth/login` | No | Login user |
| GET | `/api/auth/google` | No | Google OAuth |
| GET | `/api/auth/google/callback` | No | Google callback |
| GET | `/api/auth/me` | Bearer | Get current user |
| POST | `/api/renders` | Bearer | Create render |
| GET | `/api/renders` | Bearer | Get all renders |
| DELETE | `/api/renders/:id` | Bearer | Delete render |

---

##  Deployment 

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Vercel | [arch-flow-mu.vercel.app](https://arch-flow-mu.vercel.app) |
| Backend | Render.com | [archflow-backend.onrender.com](https://archflow-backend.onrender.com) |
| Database | MongoDB Atlas | Cloud hosted |

---

##  Author 

**Faiz Ansari** 
- GitHub: [@faezur](https://github.com/faezur)
- Email: faezur@gmail.com
- LinkedIn: [linkedin.com/in/faezur](https://linkedin.com/in/faezur)

---

## 📄 License

MIT License — feel free to use this project for learning purposes.
