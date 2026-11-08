# All-in-One Calculator - Full Stack Application

A comprehensive calculator application with user authentication, cloud storage, and multiple calculation modes.

## Features

### Calculator Modes
- **Basic Mode**: Standard arithmetic operations, variables, and memory functions
- **Scientific Mode**: Trigonometric, logarithmic, and advanced mathematical functions
- **Programmer Mode**: Number base conversion (Decimal, Hex, Binary, Octal) and bitwise operations
- **Unit Converter**: Convert between various units (length, weight, temperature, volume, time, data)

### User Features
- **User Authentication**: Register and login with username/email/password
- **Cloud Storage**: Save calculation history, variables, and memory values
- **Persistent Data**: User data is saved to the server and loaded automatically
- **Favorites**: Save favorite calculations for quick access

### Technical Features
- **Responsive Design**: Works on desktop and mobile devices
- **Keyboard Support**: Full keyboard navigation support
- **Real-time Updates**: Live calculation and display updates
- **Error Handling**: Comprehensive error handling and validation

## Project Structure

```
calculator/
├── backend/                 # FastAPI backend
│   ├── main.py             # Main FastAPI application
│   ├── requirements.txt    # Python dependencies
│   └── data/               # User data storage
│       └── users/          # Individual user data files
├── frontend/               # Frontend application
│   ├── index.html          # Main HTML file
│   ├── style.css           # Stylesheet
│   ├── calculator.js       # Main calculator logic
│   ├── api.js              # API client for backend communication
│   ├── scientific.js       # Scientific functions module
│   ├── programmer.js       # Programmer mode module
│   ├── converter.js        # Unit converter module
│   └── memory.js           # Memory functions module
└── README.md               # This file
```

## Setup Instructions

### Prerequisites
- Python 3.8 or higher
- pip package manager
- Modern web browser

### Backend Setup

1. Navigate to the backend directory:
```bash
cd calculator/backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Start the FastAPI server:
```bash
python main.py
```

The backend will run on `http://localhost:8001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd calculator/frontend
```

2. Start a local web server (using Python):
```bash
python -m http.server 8000
```

Or use any other web server of your choice.

3. Open your browser and navigate to:
```
http://localhost:8000
```

## Usage

### First Time Setup
1. The calculator will show a login/register modal
2. Click "Register" to create a new account
3. Enter your username, email, and password
4. Click "Register" to create your account

### Using the Calculator
1. **Basic Mode**: Standard arithmetic operations
   - Use number buttons or keyboard for input
   - Press Enter or = for calculation
   - Use variables X, Y, Z for storing values
   - Use memory functions (MR, M+, M-, MS, MC)

2. **Scientific Mode**: Advanced mathematical functions
   - Trigonometric functions: sin, cos, tan, etc.
   - Logarithmic functions: log, ln
   - Powers and roots: x², x³, √, nth root
   - Constants: π, e

3. **Programmer Mode**: Number base conversion
   - Switch between Decimal, Hex, Binary, Octal
   - Bitwise operations: AND, OR, XOR, NOT, shifts
   - Hex digits A-F support

4. **Unit Converter**: Convert between units
   - Select category (Length, Weight, Temperature, etc.)
   - Enter value and select units
   - Click "Convert" to see result

### Keyboard Shortcuts
- **F1**: Basic mode
- **F2**: Scientific mode
- **F3**: Programmer mode
- **F4**: Unit converter mode
- **Enter**: Calculate
- **Escape/C**: Clear
- **Backspace**: Delete last character

### Data Persistence
- All calculations are automatically saved to your account
- Variables and memory values are preserved between sessions
- History is loaded when you log in
- Use the "Save" button in history panel to manually save data

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user info

### User Data
- `GET /user/data` - Get all user data
- `POST /user/data` - Save all user data
- `DELETE /user/data` - Delete all user data

### Calculations
- `GET /user/calculations` - Get calculation history
- `POST /user/calculations` - Add calculation to history

### Variables
- `GET /user/variables` - Get variables
- `POST /user/variables` - Save variables

### Memory
- `GET /user/memory` - Get memory value
- `POST /user/memory` - Save memory value

### Favorites
- `GET /user/favorites` - Get favorites
- `POST /user/favorites` - Add favorite
- `DELETE /user/favorites/{favorite}` - Remove favorite

### Health Check
- `GET /health` - Health check endpoint
- `GET /` - API info

## Security Notes

- Passwords are hashed using SHA-256
- JWT tokens are used for authentication
- CORS is enabled for frontend communication
- User data is stored in JSON files (for development)
- **Important**: Change the SECRET_KEY in production

## Development

### Backend Development
- The backend uses FastAPI for high performance
- Data is stored in JSON files (easy to modify)
- Add new endpoints in `main.py`
- Models are defined using Pydantic

### Frontend Development
- Vanilla JavaScript for simplicity
- Modular architecture with separate files
- API client handles all backend communication
- Responsive CSS for mobile support

## Troubleshooting

### Backend Issues
- Make sure Python dependencies are installed
- Check if port 8001 is available
- Verify file permissions for data directory

### Frontend Issues
- Check browser console for JavaScript errors
- Ensure backend is running on port 8001
- Verify CORS settings if experiencing API errors

### Common Problems
- **Login fails**: Check username/password, ensure backend is running
- **Data not saving**: Check authentication status, verify API connection
- **Calculator not working**: Check browser console for errors

## Future Enhancements

- [ ] Add database support (SQLite, PostgreSQL)
- [ ] Implement password reset functionality
- [ ] Add email verification
- [ ] Implement calculation sharing
- [ ] Add more scientific functions
- [ ] Implement user profiles
- [ ] Add dark/light theme toggle
- [ ] Implement offline mode with PWA
- [ ] Add calculation history export/import
- [ ] Implement advanced programmer functions

## License

This project is open source and available for educational and personal use.

## Support

For issues and questions, please check the troubleshooting section or create an issue in the repository.
