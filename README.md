# MonkMedia NRCS - Enterprise Newsroom Control System

A professional, enterprise-grade newsroom control system with department-specific workspaces for modern media organizations.

## 🚀 Features

### Department Workspaces
- **Input Workspace**: Story creation, submission, and management
- **Output Workspace**: Editorial review, approval, and content management
- **Playout Workspace**: Broadcast scheduling, live control, and media management
- **Admin Workspace**: User management, system configuration, and analytics

### Core Functionality
- **Real-time Collaboration**: WebSocket-based real-time updates and notifications
- **Role-based Access Control**: Granular permissions based on user roles and departments
- **Workflow Management**: Customizable story workflows with approval processes
- **Media Management**: Support for images, videos, audio, and documents
- **Scheduling System**: Advanced broadcast scheduling and timeline management
- **Analytics Dashboard**: Comprehensive reporting and performance metrics
- **Mobile Responsive**: Optimized for desktop, tablet, and mobile devices

### Enterprise Features
- **Multi-tenant Architecture**: Support for multiple organizations
- **Audit Logging**: Complete activity tracking and compliance
- **API Integration**: RESTful APIs for third-party integrations
- **Security**: JWT authentication, rate limiting, and data encryption
- **Scalability**: Microservices architecture with horizontal scaling

## 🏗️ Architecture

### Backend (Node.js + Express)
- **Authentication**: JWT-based with role-based access control
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.io for live updates
- **File Upload**: Multer for media handling
- **Validation**: Express-validator for input validation
- **Security**: Helmet, CORS, rate limiting

### Frontend (React + TypeScript)
- **UI Framework**: Material-UI (MUI) for consistent design
- **State Management**: React Context API
- **Routing**: React Router for navigation
- **Real-time**: Socket.io client for live updates
- **Charts**: Recharts for analytics visualization
- **Forms**: Controlled components with validation

### Database Schema
- **Users**: Authentication, roles, permissions, preferences
- **Stories**: Content, metadata, workflow, scheduling
- **Departments**: Configuration, permissions, statistics
- **Workflows**: Customizable approval processes
- **Notifications**: Real-time messaging system

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- MongoDB 4.4+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd monkmedia-nrcs
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   cd client
   npm install
   cd ..
   ```

3. **Environment Setup**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit .env with your configuration
   nano .env
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB (if not running)
   mongod
   
   # The application will create the database and collections automatically
   ```

5. **Start the application**
   ```bash
   # Development mode (both frontend and backend)
   npm run dev
   
   # Or start separately
   npm run server  # Backend only
   npm run client  # Frontend only
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Documentation: http://localhost:5000/api/docs

## 📁 Project Structure

```
monkmedia-nrcs/
├── server/                 # Backend application
│   ├── config/            # Database and configuration
│   ├── middleware/        # Custom middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   └── index.js          # Server entry point
├── client/               # Frontend application
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── contexts/     # React contexts
│   │   ├── pages/        # Page components
│   │   ├── types/        # TypeScript types
│   │   └── App.tsx       # Main app component
│   └── package.json
├── uploads/              # File uploads directory
├── .env.example          # Environment variables template
├── package.json          # Root package.json
└── README.md
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/monkmedia-nrcs
DB_NAME=monkmedia_nrcs

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Redis (for caching and sessions)
REDIS_URL=redis://localhost:6379

# API Keys
NEWS_API_KEY=your-news-api-key
WEATHER_API_KEY=your-weather-api-key

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

## 👥 User Roles and Permissions

### Roles
- **Reporter**: Create and edit stories
- **Editor**: Review, approve, and manage content
- **Producer**: Schedule and manage broadcasts
- **Director**: Oversee all operations
- **Admin**: System administration
- **Manager**: Department management

### Department Access
- **Input Department**: Story creation and submission
- **Output Department**: Editorial review and approval
- **Playout Department**: Broadcast management
- **Admin Department**: System administration
- **Management Department**: Strategic oversight

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Stories
- `GET /api/stories` - Get all stories
- `POST /api/stories` - Create new story
- `GET /api/stories/:id` - Get story by ID
- `PUT /api/stories/:id` - Update story
- `DELETE /api/stories/:id` - Delete story

### Departments
- `GET /api/departments` - Get all departments
- `POST /api/departments` - Create department
- `PUT /api/departments/:id` - Update department
- `DELETE /api/departments/:id` - Delete department

### Workflows
- `GET /api/workflows` - Get workflows
- `POST /api/workflows` - Create workflow
- `PUT /api/workflows/:id` - Update workflow

## 🚀 Deployment

### Production Build
```bash
# Build frontend
cd client
npm run build

# Start production server
cd ..
npm start
```

### Docker Deployment
```bash
# Build Docker image
docker build -t monkmedia-nrcs .

# Run container
docker run -p 5000:5000 monkmedia-nrcs
```

### Environment Variables for Production
- Set `NODE_ENV=production`
- Configure production MongoDB URI
- Set secure JWT secret
- Configure email service
- Set up file storage (AWS S3, etc.)

## 🧪 Testing

```bash
# Run backend tests
npm test

# Run frontend tests
cd client
npm test

# Run all tests
npm run test:all
```

## 📊 Monitoring and Analytics

- **Performance Metrics**: Response times, throughput
- **User Analytics**: Activity tracking, usage patterns
- **System Health**: Database performance, memory usage
- **Error Tracking**: Logging and error reporting
- **Audit Trail**: Complete activity history

## 🔒 Security Features

- **Authentication**: JWT tokens with expiration
- **Authorization**: Role-based access control
- **Input Validation**: Server-side validation
- **Rate Limiting**: API rate limiting
- **CORS**: Cross-origin resource sharing
- **Helmet**: Security headers
- **Data Encryption**: Password hashing with bcrypt

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Core workspace functionality
- ✅ User management
- ✅ Story workflow
- ✅ Real-time updates

### Phase 2 (Next)
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] API integrations
- [ ] Advanced scheduling

### Phase 3 (Future)
- [ ] AI-powered content suggestions
- [ ] Advanced reporting
- [ ] Multi-language support
- [ ] Cloud deployment

---

**MonkMedia NRCS** - Professional Enterprise Newsroom Control System