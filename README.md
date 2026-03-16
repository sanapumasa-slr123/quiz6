# Service Marketplace Platform

A full-stack electrical services marketplace platform built with Django REST Framework and React.

## Features

- User authentication with JWT tokens
- Seller application and approval workflow
- Service listing and management
- PayPal integration for payments
- AI chatbot for customer support
- Admin panel for user and application management

## Project Structure

```
hahaquiz6/
├── backend/
│   ├── backend/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── permissions.py
│   ├── users/
│   ├── applications/
│   ├── services/
│   ├── orders/
│   ├── chat/
│   ├── manage.py
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── actions/
    │   ├── constants/
    │   ├── reducers/
    │   ├── screens/
    │   ├── components/
    │   ├── store.js
    │   ├── axiosInstance.js
    │   └── App.js
    └── package.json
```

## Backend Setup

1. **Create Virtual Environment:**
```bash
cd backend
python -m venv venv
source venv/Scripts/activate  # On Windows
```

2. **Install Dependencies:**
```bash
pip install -r requirements.txt
```

3. **Run Migrations:**
```bash
python manage.py makemigrations
python manage.py migrate
```

4. **Create Superuser:**
```bash
python manage.py createsuperuser
```

5. **Run Server:**
```bash
python manage.py runserver
```

Backend will be available at `http://localhost:8000`

## Frontend Setup

1. **Navigate to Frontend:**
```bash
cd frontend
```

2. **Install Dependencies:**
```bash
npm install
```

3. **Configure Environment:**
Create `.env` file with:
```
REACT_APP_PAYPAL_CLIENT_ID=your_paypal_client_id
```

4. **Start Development Server:**
```bash
npm start
```

Frontend will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/v1/users/login/` - Login
- `POST /api/v1/users/register/` - Register
- `GET /api/v1/users/profile/` - Get user profile

### Services
- `GET /api/v1/services/list/` - List all services
- `GET /api/v1/services/<id>/` - Get service details
- `GET /api/v1/services/manage/` - List seller's services
- `POST /api/v1/services/manage/` - Create service
- `PUT /api/v1/services/manage/<id>/` - Update service
- `DELETE /api/v1/services/manage/<id>/` - Delete service

### Applications
- `POST /api/v1/applications/apply/` - Submit seller application
- `GET /api/v1/applications/list/` - List applications (admin only)
- `POST /api/v1/applications/<id>/approve/` - Approve application (admin only)
- `POST /api/v1/applications/<id>/decline/` - Decline application (admin only)

### Orders
- `POST /api/v1/orders/create/` - Create order
- `GET /api/v1/orders/history/` - Get order history

### Chat
- `POST /api/v1/chat/ask/` - AI chatbot ask

## User Roles

- **User**: Regular user who can browse and purchase services
- **Seller**: User who has been approved to create and sell services
- **Admin**: Administrator who manages users and seller applications

## Routes

| Route | Screen | Protection |
|---|---|---|
| `/` | Home Screen | Public |
| `/services/:id` | Service Details | Public |
| `/signin` | Sign In | Redirect if logged in |
| `/register` | Sign Up | Redirect if logged in |
| `/apply` | Apply as Seller | Protected |
| `/seller/dashboard` | Seller Dashboard | Protected (role=seller) |
| `/admin/users` | Admin Panel | Protected (role=admin) |
| `/profile` | User Profile | Protected |

## Technologies Used

### Backend
- Django 3.2
- Django REST Framework 3.13
- Django Simple JWT for authentication
- Django CORS Headers
- Pillow for image handling
- OpenAI API for chatbot

### Frontend
- React 18
- Redux Toolkit for state management
- Axios for API calls
- React Router for navigation
- PayPal React SDK for payments

## Contributing

1. Create a feature branch
2. Make your changes
3. Commit with short messages (2-4 words)
4. Push to the repository

## License

Private - All rights reserved
