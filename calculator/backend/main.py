# FastAPI Calculator Backend
# User authentication and data persistence

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any
import json
import os
import hashlib
import secrets
from datetime import datetime, timedelta
import jwt

app = FastAPI(title="Calculator API", version="1.0.0")

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()
SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Data storage paths
DATA_DIR = "data"
USERS_DIR = os.path.join(DATA_DIR, "users")

# Ensure directories exist
os.makedirs(USERS_DIR, exist_ok=True)

# Pydantic models
class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    created_at: str

class CalculationHistory(BaseModel):
    expression: str
    result: str
    mode: str
    timestamp: str

class UserData(BaseModel):
    calculations: list[CalculationHistory] = []
    variables: Dict[str, float] = {}
    memory: float = 0.0
    favorites: list[str] = []

# Helper functions
def hash_password(password: str) -> str:
    """Hash password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    """Verify password against hash"""
    return hash_password(password) == hashed

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> dict:
    """Verify JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_user_file_path(user_id: str) -> str:
    """Get path to user data file"""
    return os.path.join(USERS_DIR, f"{user_id}.json")

def load_user_data(user_id: str) -> UserData:
    """Load user data from file"""
    file_path = get_user_file_path(user_id)
    if os.path.exists(file_path):
        try:
            with open(file_path, 'r') as f:
                data = json.load(f)
                return UserData(**data)
        except (json.JSONDecodeError, Exception):
            return UserData()
    return UserData()

def save_user_data(user_id: str, data: UserData):
    """Save user data to file"""
    file_path = get_user_file_path(user_id)
    try:
        with open(file_path, 'w') as f:
            json.dump(data.dict(), f, indent=2)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save user data: {str(e)}"
        )

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Get current user from JWT token"""
    token = credentials.credentials
    payload = verify_token(token)
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {"user_id": user_id, "username": payload.get("username")}

# Authentication endpoints
@app.post("/auth/register")
async def register(user: UserRegister):
    """Register a new user"""
    # Check if user already exists
    user_id = hashlib.md5(user.username.encode()).hexdigest()[:8]
    user_file = get_user_file_path(user_id)
    
    if os.path.exists(user_file):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists"
        )
    
    # Create user data
    user_data = UserData()
    save_user_data(user_id, user_data)
    
    # Create user record with hashed password
    user_record = {
        "id": user_id,
        "username": user.username,
        "email": user.email,
        "password_hash": hash_password(user.password),
        "created_at": datetime.utcnow().isoformat()
    }
    
    # Save user record
    user_record_file = os.path.join(USERS_DIR, f"{user_id}_record.json")
    with open(user_record_file, 'w') as f:
        json.dump(user_record, f, indent=2)
    
    # Create access token
    access_token = create_access_token(
        data={"sub": user_id, "username": user.username}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse(
            id=user_id,
            username=user.username,
            email=user.email,
            created_at=user_record["created_at"]
        )
    }

@app.post("/auth/login")
async def login(user: UserLogin):
    """Login user"""
    user_id = hashlib.md5(user.username.encode()).hexdigest()[:8]
    user_record_file = os.path.join(USERS_DIR, f"{user_id}_record.json")
    
    if not os.path.exists(user_record_file):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    
    with open(user_record_file, 'r') as f:
        user_record = json.load(f)
    
    if not verify_password(user.password, user_record["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    
    # Create access token
    access_token = create_access_token(
        data={"sub": user_id, "username": user.username}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse(
            id=user_id,
            username=user_record["username"],
            email=user_record["email"],
            created_at=user_record["created_at"]
        )
    }

@app.get("/auth/me")
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current user information"""
    user_id = current_user["user_id"]
    user_record_file = os.path.join(USERS_DIR, f"{user_id}_record.json")
    
    if not os.path.exists(user_record_file):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    with open(user_record_file, 'r') as f:
        user_record = json.load(f)
    
    return UserResponse(
        id=user_id,
        username=user_record["username"],
        email=user_record["email"],
        created_at=user_record["created_at"]
    )

# User data endpoints
@app.get("/user/data")
async def get_user_data(current_user: dict = Depends(get_current_user)):
    """Get user data"""
    user_id = current_user["user_id"]
    user_data = load_user_data(user_id)
    return user_data

@app.post("/user/data")
async def save_user_data_endpoint(user_data: UserData, current_user: dict = Depends(get_current_user)):
    """Save user data"""
    user_id = current_user["user_id"]
    save_user_data(user_id, user_data)
    return {"message": "User data saved successfully"}

@app.post("/user/calculations")
async def add_calculation(calculation: CalculationHistory, current_user: dict = Depends(get_current_user)):
    """Add calculation to history"""
    user_id = current_user["user_id"]
    user_data = load_user_data(user_id)
    
    # Add calculation to history
    user_data.calculations.append(calculation)
    
    # Keep only last 100 calculations
    if len(user_data.calculations) > 100:
        user_data.calculations = user_data.calculations[-100:]
    
    save_user_data(user_id, user_data)
    return {"message": "Calculation added to history"}

@app.get("/user/calculations")
async def get_calculations(current_user: dict = Depends(get_current_user)):
    """Get calculation history"""
    user_id = current_user["user_id"]
    user_data = load_user_data(user_id)
    return user_data.calculations

@app.post("/user/variables")
async def save_variables(variables: Dict[str, float], current_user: dict = Depends(get_current_user)):
    """Save variables"""
    user_id = current_user["user_id"]
    user_data = load_user_data(user_id)
    user_data.variables = variables
    save_user_data(user_id, user_data)
    return {"message": "Variables saved successfully"}

@app.get("/user/variables")
async def get_variables(current_user: dict = Depends(get_current_user)):
    """Get variables"""
    user_id = current_user["user_id"]
    user_data = load_user_data(user_id)
    return user_data.variables

@app.post("/user/memory")
async def save_memory(memory_value: float, current_user: dict = Depends(get_current_user)):
    """Save memory value"""
    user_id = current_user["user_id"]
    user_data = load_user_data(user_id)
    user_data.memory = memory_value
    save_user_data(user_id, user_data)
    return {"message": "Memory saved successfully"}

@app.get("/user/memory")
async def get_memory(current_user: dict = Depends(get_current_user)):
    """Get memory value"""
    user_id = current_user["user_id"]
    user_data = load_user_data(user_id)
    return {"memory": user_data.memory}

@app.post("/user/favorites")
async def add_favorite(favorite: str, current_user: dict = Depends(get_current_user)):
    """Add calculation to favorites"""
    user_id = current_user["user_id"]
    user_data = load_user_data(user_id)
    
    if favorite not in user_data.favorites:
        user_data.favorites.append(favorite)
        save_user_data(user_id, user_data)
    
    return {"message": "Favorite added successfully"}

@app.get("/user/favorites")
async def get_favorites(current_user: dict = Depends(get_current_user)):
    """Get favorites"""
    user_id = current_user["user_id"]
    user_data = load_user_data(user_id)
    return user_data.favorites

@app.delete("/user/favorites/{favorite}")
async def remove_favorite(favorite: str, current_user: dict = Depends(get_current_user)):
    """Remove calculation from favorites"""
    user_id = current_user["user_id"]
    user_data = load_user_data(user_id)
    
    if favorite in user_data.favorites:
        user_data.favorites.remove(favorite)
        save_user_data(user_id, user_data)
    
    return {"message": "Favorite removed successfully"}

@app.delete("/user/data")
async def delete_user_data(current_user: dict = Depends(get_current_user)):
    """Delete all user data"""
    user_id = current_user["user_id"]
    user_data = UserData()
    save_user_data(user_id, user_data)
    return {"message": "User data deleted successfully"}

# Health check
@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "Calculator API is running", "status": "healthy"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
