# 🍳 CookGenie - AI-Powered Recipe Generator & Kitchen Inventory Manager

CookGenie is a full-stack web application that helps you discover delicious recipes based on ingredients you already have, manage your kitchen inventory, and get smart expiry alerts. Powered by Google's Gemini API for intelligent recipe generation.

![CookGenie](https://img.shields.io/badge/Status-Ready-success)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

### 🤖 AI Recipe Generation
- Generate personalized recipes using Google's Gemini API
- Uses your available ingredients automatically
- Respects dietary preferences and restrictions
- Adjusts based on cooking time, skill level, and available utensils
- Multiple cuisine options (Indian, Italian, Mexican, Chinese, etc.)

### 📦 Inventory Management
- Track all your kitchen ingredients
- Monitor quantities and units
- Categorize items (vegetables, dairy, spices, etc.)
- Add purchase and expiry dates
- Low stock alerts

### ⏰ Smart Expiry Alerts
- Get notified about items expiring soon
- Visual indicators for expired and expiring items
- Dashboard alerts for immediate attention
- Automatic categorization (expired, expiring soon, expiring this week)

### ❤️ Recipe Favorites
- Save your favorite recipes
- Quick access to loved recipes
- Add personal notes to favorites

### 🎨 User Preferences
- Set dietary restrictions (vegan, gluten-free, etc.)
- Choose preferred cuisines
- List disliked ingredients to avoid
- Specify available kitchen tools
- Set maximum cooking time
- Define skill level (beginner, intermediate, advanced)

### 👥 Multi-Profile Support
- Create multiple user profiles
- Each profile has its own inventory and preferences
- Perfect for households with different dietary needs

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **PostgreSQL** - Robust relational database
- **Google Gemini API** - AI-powered recipe generation
- **Pydantic** - Data validation
- **Alembic** - Database migrations

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Elegant notifications

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Python 3.9+**
- **Node.js 18+** and **npm/yarn**
- **PostgreSQL 12+**
- **Google Gemini API Key** ([Get one here](https://makersuite.google.com/app/apikey))

## 🚀 Installation & Setup

### Quick Setup

For detailed step-by-step instructions, see **[SETUP_GUIDE.md](SETUP_GUIDE.md)**

```bash
# 1. Create database
psql -U postgres
CREATE DATABASE cookgenie_db;
CREATE USER cookgenie WITH PASSWORD 'cookgenie123';
GRANT ALL PRIVILEGES ON DATABASE cookgenie_db TO cookgenie;
\q

# 2. Setup Backend
cd backend
python -m venv venv
venv\Scripts\activate       # Windows
source venv/bin/activate    # macOS/Linux
pip install -r requirements.txt
cp .env.example .env        # Edit and add your Gemini API key

# 3. Setup Frontend
cd frontend
npm install
cp .env.local.example .env.local

# 4. Run (in 2 separate terminals)
# Terminal 1:
cd backend && python main.py

# Terminal 2:
cd frontend && npm run dev

# 5. Open http://localhost:3000
```

**Get Gemini API Key:** Visit [Google AI Studio](https://makersuite.google.com/app/apikey) (free)

## 📱 Usage Guide

### First Time Setup

1. **Open the app** at http://localhost:3000
2. **Add ingredients** to your inventory:
   - Go to "Inventory" tab
   - Click "Add Item"
   - Fill in details (name, quantity, expiry date, etc.)
   - Repeat for all your ingredients

3. **Set preferences** (optional but recommended):
   - Go to "Settings" tab
   - Add dietary restrictions (e.g., "Vegan", "Gluten-free")
   - Add preferred cuisines
   - List disliked ingredients
   - Specify available kitchen tools
   - Set max cooking time and skill level

### Generate a Recipe

1. Click **"Generate Recipe"** button on Dashboard or Recipes page
2. Choose options:
   - Cuisine type (optional)
   - Max cooking time (optional)
   - Number of servings
3. Click **"Generate Recipe"**
4. Wait a few seconds for AI to create your recipe
5. View the complete recipe with:
   - Ingredients list
   - Step-by-step instructions
   - Cooking time & difficulty
   - Nutritional information
   - Required utensils

### Manage Inventory

- **Add items**: Click "Add Item" button
- **Edit items**: Click "Edit" on any item card
- **Delete items**: Click "Delete" on any item card
- **View expiry alerts**: Check dashboard for warnings

### Save Favorites

- Click the **heart icon** on any recipe card
- Access all favorites in the "Favorites" tab
- Remove from favorites by clicking heart again

## 🏗️ Project Structure

```
CookGenie/
├── backend/
│   ├── app/
│   │   ├── api/              # API endpoints
│   │   │   ├── profiles.py
│   │   │   ├── inventory.py
│   │   │   ├── recipes.py
│   │   │   └── preferences.py
│   │   ├── models/           # Database models
│   │   │   ├── profile.py
│   │   │   ├── inventory.py
│   │   │   ├── recipe.py
│   │   │   └── preference.py
│   │   ├── schemas/          # Pydantic schemas
│   │   ├── services/         # Business logic
│   │   │   ├── gemini_service.py
│   │   │   ├── inventory_service.py
│   │   │   ├── recipe_service.py
│   │   │   ├── profile_service.py
│   │   │   └── preference_service.py
│   │   ├── config.py         # Configuration
│   │   └── database.py       # Database connection
│   ├── main.py               # FastAPI app entry
│   └── requirements.txt
│
├── frontend/
│   ├── app/                  # Next.js App Router
│   │   ├── page.tsx          # Dashboard
│   │   ├── inventory/        # Inventory page
│   │   ├── recipes/          # Recipes page
│   │   ├── favorites/        # Favorites page
│   │   ├── settings/         # Settings page
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   ├── components/           # React components
│   │   ├── ui/               # Reusable UI components
│   │   ├── layout/           # Layout components
│   │   ├── inventory/        # Inventory components
│   │   └── recipe/           # Recipe components
│   ├── lib/                  # Utilities
│   │   ├── api.ts            # API client
│   │   ├── types.ts          # TypeScript types
│   │   └── utils.ts          # Utility functions
│   ├── package.json
│   └── tailwind.config.ts
│
└── README.md
```

## 🔌 API Endpoints

### Profiles
- `GET /api/profiles` - Get all profiles
- `POST /api/profiles` - Create profile
- `GET /api/profiles/{id}` - Get profile
- `PUT /api/profiles/{id}` - Update profile
- `DELETE /api/profiles/{id}` - Delete profile

### Inventory
- `GET /api/inventory/profile/{profile_id}` - Get all items
- `POST /api/inventory` - Add item
- `PUT /api/inventory/{id}` - Update item
- `DELETE /api/inventory/{id}` - Delete item
- `GET /api/inventory/profile/{profile_id}/expiry-alerts` - Get expiry alerts
- `GET /api/inventory/profile/{profile_id}/low-stock` - Get low stock items

### Recipes
- `POST /api/recipes/generate` - Generate recipe with AI
- `GET /api/recipes/profile/{profile_id}` - Get all recipes
- `GET /api/recipes/{id}` - Get single recipe
- `DELETE /api/recipes/{id}` - Delete recipe
- `POST /api/recipes/favorites` - Add to favorites
- `DELETE /api/recipes/favorites/{profile_id}/{recipe_id}` - Remove favorite
- `GET /api/recipes/favorites/profile/{profile_id}` - Get favorites

### Preferences
- `GET /api/preferences/{profile_id}` - Get preferences
- `POST /api/preferences` - Create preferences
- `PUT /api/preferences/{profile_id}` - Update preferences
- `DELETE /api/preferences/{profile_id}` - Delete preferences

## 🎨 Features in Detail

### Recipe Generation Algorithm

The AI recipe generation uses Google's Gemini Pro model with:
- **Context-aware prompting**: Includes all available ingredients
- **Preference integration**: Respects dietary restrictions and dislikes
- **Structured output**: JSON format for consistent parsing
- **Smart filtering**: Considers cooking time and available utensils
- **Fallback handling**: Graceful error handling if AI response is unexpected

### Expiry Alert System

Three-tier alert system:
- **Expired**: Items past expiry date (Red)
- **Expiring Soon**: Items expiring in 3 days (Orange)
- **Expiring This Week**: Items expiring in 7 days (Yellow)

### Inventory Tracking

Support for multiple unit types:
- Weight: gram, kilogram
- Volume: liter, milliliter
- Count: piece
- Cooking: cup, tablespoon, teaspoon

## 🐛 Troubleshooting

Having issues? Check **[SETUP_GUIDE.md](SETUP_GUIDE.md)** for detailed troubleshooting.

**Common Issues:**
- **Database Error:** Make sure PostgreSQL is running
- **API Error:** Verify Gemini API key in `backend/.env`
- **Connection Error:** Ensure backend is running at http://localhost:8000
- **Port in Use:** Kill the process or use a different port

For complete troubleshooting guide, see the setup guide.

## 🚀 Future Enhancements

- [ ] User authentication (JWT/OAuth)
- [ ] Recipe sharing and social features
- [ ] Meal planning calendar
- [ ] Shopping list generation
- [ ] Nutritional tracking
- [ ] Recipe scaling based on servings
- [ ] Photo upload for ingredients/recipes
- [ ] Voice commands integration
- [ ] Mobile app (React Native)
- [ ] Export recipes as PDF
- [ ] Integration with smart kitchen devices

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Built with ❤️ by Anmol Kamboj

## 📚 Documentation

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Complete setup instructions with troubleshooting
- **API Documentation** - Available at http://localhost:8000/docs when backend is running

## 🙏 Acknowledgments

- Google Gemini API for AI recipe generation
- FastAPI for the excellent Python framework
- Next.js team for the amazing React framework
- Lucide React for beautiful icons
- Tailwind CSS for styling utilities

---

**Happy Cooking with CookGenie! 🍳✨**
