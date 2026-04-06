# 🏘️ Neighborhood Watch - Community Safety Platform

A comprehensive incident reporting and geolocation-based safety platform designed to enhance neighborhood safety through collaborative reporting, real-time notifications, and data-driven insights.

## ✨ Features

### User Features
- 🔐 **Secure Authentication** - User registration and login with bcrypt password hashing
- 📱 **Incident Reporting** - Submit detailed incident reports with categories:
  - Theft
  - Fire
  - Harassment
  - Vandalism
  - Suspicious Activity
  - Accidents
  - Other
- 📍 **Geolocation Support** - Report incidents with precise latitude/longitude coordinates
- 📸 **Photo Upload** - Attach images to incident reports (up to 16MB)
- 🔒 **Anonymous Reporting** - Option to report anonymously
- 🗺️ **Interactive Maps** - View reported incidents on an interactive map
- 🔔 **Real-time Updates** - Live notifications via WebSocket (Socket.IO)
- 📊 **Personal Dashboard** - View your submitted reports and their status

### Admin Features
- 📈 **Analytics Dashboard** - View incident statistics and trends
- 📋 **Report Management** - Review and manage all incident reports
- ⚙️ **Priority Assignment** - Assign priority levels (low, medium, high, critical)
- 📝 **Admin Notes** - Add internal notes to incident reports
- 👥 **User Management** - Manage user accounts and permissions
- 🤖 **Hotspot Detection** - ML-based identification of crime hotspots
- 🔄 **Status Tracking** - Update report status (pending → in progress → resolved)

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Backend** | Flask 3.1, Flask-SocketIO 5.5.1 |
| **Database** | MongoDB 4.11.3 |
| **Authentication** | Flask-Login 0.6.3, bcrypt 4.3.0 |
| **Real-time** | Socket.IO, eventlet 0.40.4 |
| **ML/Data** | scikit-learn 1.6.1, numpy 2.2.3 |
| **Frontend** | HTML5, CSS3, JavaScript |
| **Server** | Werkzeug 3.1.3 |

## 📋 Prerequisites

- Python 3.8 or higher
- MongoDB 4.0 or higher (local or cloud instance)
- pip (Python package manager)
- Virtual environment (recommended)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd neighborhood-watch
```

### 2. Create Virtual Environment
```bash
# On Windows
python -m venv .venv
.venv\Scripts\activate

# On macOS/Linux
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables
Create a `.env` file in the project root:
```env
SECRET_KEY=your-secret-key-here-change-this-in-production
MONGO_URI=mongodb://localhost:27017/neighborhood_watch
FLASK_ENV=development
FLASK_APP=app.py
```

### 5. Start MongoDB
```bash
# On Windows (if installed)
mongod

# On macOS (via Homebrew)
brew services start mongodb-community

# Or use MongoDB Atlas (cloud)
# Update MONGO_URI in .env with your connection string
```

### 6. Run the Application
```bash
python app.py
```

The application will be available at `http://localhost:5000`

## 📁 Project Structure

```
neighborhood-watch/
├── app.py                  # Flask application factory
├── config.py               # Configuration settings
├── models.py               # MongoDB data models (User, Report)
├── requirements.txt        # Python dependencies
├── .env                    # Environment variables (create this)
├── .gitignore              # Git ignore file
│
├── routes/                 # Flask blueprints
│   ├── __init__.py
│   ├── auth.py            # Authentication routes (login, register)
│   ├── user.py            # User dashboard routes
│   ├── admin.py           # Admin dashboard routes
│   └── api.py             # RESTful API endpoints
│
├── ml/                     # Machine Learning module
│   ├── __init__.py
│   └── hotspot.py         # Hotspot detection algorithm
│
├── static/                 # Static files
│   ├── css/
│   │   └── style.css      # Main stylesheet
│   ├── js/
│   │   ├── main.js        # Core application logic
│   │   ├── map.js         # Map functionality
│   │   └── charts.js      # Analytics charts
│   └── uploads/           # User-uploaded files
│
└── templates/             # HTML templates
    ├── base.html          # Base template
    ├── index.html         # Home page
    ├── login.html         # Login page
    ├── register.html      # Registration page
    ├── submit_report.html # Report submission form
    ├── user_dashboard.html # User dashboard
    ├── admin_dashboard.html
    ├── admin_analytics.html
    └── admin_reports.html
```

## 🔑 Key Functionalities

### User Workflow
1. **Register** - Create account with email and password
2. **Authenticate** - Login with credentials
3. **Submit Report** - Fill form with incident details and location
4. **Upload Photo** - Attach evidence image (optional)
5. **Track Status** - Monitor report status in personal dashboard
6. **View Map** - See all incidents on interactive map

### Admin Workflow
1. **Dashboard Access** - View all reports and statistics
2. **Review Reports** - Examine incident details and photos
3. **Assign Priority** - Set priority level for each report
4. **Update Status** - Change report status as it's resolved
5. **Add Notes** - Document investigation progress
6. **Analyze Hotspots** - View ML-detected crime hotspots

## 🗄️ Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user/admin),
  neighborhood: String,
  created_at: DateTime
}
```

### Reports Collection
```javascript
{
  _id: ObjectId,
  user_id: ObjectId (reference to User),
  category: String,
  description: String,
  location: GeoJSON Point,
  latitude: Float,
  longitude: Float,
  neighborhood: String,
  anonymous: Boolean,
  photo: String (filename),
  status: String (pending/in_progress/resolved),
  priority: String (low/medium/high/critical),
  assigned_to: ObjectId (admin user),
  admin_notes: String,
  created_at: DateTime,
  updated_at: DateTime
}
```

## 🧪 Testing

Run tests using:
```bash
python test_mongo.py
```

The test file validates:
- MongoDB connection
- User authentication
- Report creation and retrieval
- Geolocation indexing

## 🔐 Security Features

- ✅ Password hashing with bcrypt
- ✅ CSRF protection via Flask
- ✅ SQL injection prevention (using MongoDB ORM)
- ✅ File upload validation
- ✅ Role-based access control (RBAC)
- ✅ Session management with Flask-Login
- ⚠️ Environment variables for sensitive data

## 🚨 Important Security Notes

Before deploying to production:
1. Change `SECRET_KEY` in `.env` to a strong random string
2. Use environment variables for all sensitive data
3. Enable HTTPS
4. Configure MongoDB authentication
5. Add input validation and sanitization
6. Implement rate limiting
7. Add logging and monitoring

## 📖 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/logout` - User logout

### Reports
- `POST /api/reports` - Submit new report
- `GET /api/reports` - Get all reports (with filters)
- `GET /api/reports/<id>` - Get specific report
- `PUT /api/reports/<id>` - Update report (admin)
- `DELETE /api/reports/<id>` - Delete report (admin)

### Analytics
- `GET /api/analytics/stats` - Get incident statistics
- `GET /api/analytics/hotspots` - Get crime hotspots

## 🔄 Real-time Features

Socket.IO events:
- `new_report` - Notification when new report is submitted
- `report_update` - Real-time status updates
- `hotspot_detected` - Alert for detected hotspots

## 📚 Dependencies

See `requirements.txt` for complete list:
- Flask - Web framework
- Flask-SocketIO - Real-time communication
- Flask-Login - User session management
- pymongo - MongoDB driver
- bcrypt - Password hashing
- scikit-learn - Machine learning
- numpy - Numerical computing

## 🤝 Contributing

This is a college project. For improvements:
1. Create a new branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📝 License

This project is created for educational purposes as a college final year project.

## 👤 Author

**Your Name** - College Student  
Project created: April 2026

## 📞 Support

For issues or questions:
- Check existing GitHub issues
- Create a new issue with detailed description
- Include error messages and reproduction steps

## ✅ Checklist for Deployment

- [ ] Configure `.env` with production values
- [ ] Set up MongoDB Atlas or production MongoDB
- [ ] Enable SSL/HTTPS
- [ ] Set strong SECRET_KEY
- [ ] Test all authentication flows
- [ ] Verify file upload restrictions
- [ ] Test report submission with geolocation
- [ ] Run all unit tests
- [ ] Review security configurations
- [ ] Set up error logging and monitoring
- [ ] Configure rate limiting
- [ ] Create database backups

## 🎓 College Project Notes

**Course:** [Your Course Name]  
**Semester:** Final Year  
**Submitted:** [Submission Date]

**Key Learning Outcomes:**
- Full-stack web application development
- MongoDB and NoSQL databases
- Real-time communication with WebSockets
- ML integration for geospatial analysis
- Authentication and authorization
- RESTful API design
- Frontend-backend integration

---

**Last Updated:** April 6, 2026
