import os
from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel, EmailStr
from typing import Dict, Optional
import psycopg2
from psycopg2.extras import RealDictCursor
import bcrypt
from dotenv import load_dotenv

load_dotenv(override=True)

router = APIRouter()

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

def get_db_connection():
    try:
        conn = psycopg2.connect(
            os.getenv("DATABASE_URL"),
            cursor_factory=RealDictCursor
        )
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        raise HTTPException(status_code=500, detail="Database connection error")

def verify_password(plain_password, hashed_password):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password):
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

@router.post("/register")
async def register(request: RegisterRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Check if user already exists
        cursor.execute("SELECT id FROM users WHERE email = %s", (request.email,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Email already registered")
            
        # Hash password and insert
        hashed_password = get_password_hash(request.password)
        cursor.execute(
            "INSERT INTO users (email, password_hash) VALUES (%s, %s) RETURNING id",
            (request.email, hashed_password)
        )
        new_user = cursor.fetchone()
        conn.commit()
        
        return {"message": "User registered successfully", "user_id": new_user['id']}
        
    except psycopg2.Error as e:
        conn.rollback()
        print(f"Database error during registration: {e}")
        raise HTTPException(status_code=500, detail="Registration failed due to server error")
    finally:
        cursor.close()
        conn.close()

@router.post("/login")
async def login(request: LoginRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Fetch user
        cursor.execute("SELECT id, password_hash FROM users WHERE email = %s", (request.email,))
        user = cursor.fetchone()
        
        # Verify user exists and password is correct
        if not user or not verify_password(request.password, user['password_hash']):
            raise HTTPException(status_code=400, detail="Incorrect email or password")
            
        return {"message": "Login successful", "email": request.email}
        
    finally:
        cursor.close()
        conn.close()
