from pydantic import BaseModel
from enum import Enum
from typing import Optional

class Goal(str, Enum):
    LOSE_WEIGHT = "Lose Weight"
    MAINTAIN = "Maintain Weight"
    GAIN_MUSCLE = "Gain Muscle"

class ActivityLevel(str, Enum):
    SEDENTARY = "Sedentary"
    LIGHT = "Lightly Active"
    MODERATE = "Moderately Active"
    VERY_ACTIVE = "Very Active"

class Gender(str, Enum):
    MALE = "Male"
    FEMALE = "Female"

class DietType(str, Enum):
    BALANCED = "Balanced"
    HIGH_PROTEIN = "High Protein"
    LOW_CARB = "Low Carb"
    KETO = "Keto"
    LOW_FAT = "Low Fat"
    VEGAN = "Vegan"

class PreparationStyle(str, Enum):
    RECIPES = "Recipes"
    INGREDIENTS = "Ingredients"

class VarietyLevel(str, Enum):
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"

class PlanningMode(str, Enum):
    AUTOMATIC = "Automatic"
    CUSTOM = "Custom"

class UserBase(BaseModel):
    id: str | None = None
    email: str
    name: str = "User"
    age: int = 25
    weight: float = 70.0
    height: float = 170.0
    gender: Gender = Gender.FEMALE
    goal: Goal = Goal.LOSE_WEIGHT
    activity_level: ActivityLevel = ActivityLevel.MODERATE
    country: str = "Mexico"
    region: str = "CDMX"
    is_onboarding_complete: bool = False
    diet_type: DietType = DietType.BALANCED
    foods_like: list[str] = []
    meals_per_day: list[str] = ["Breakfast", "Lunch", "Dinner"]
    preparation_style: PreparationStyle = PreparationStyle.RECIPES
    variety_level: VarietyLevel = VarietyLevel.MEDIUM
    planning_mode: PlanningMode = PlanningMode.AUTOMATIC

class UserCreate(UserBase):
    country: str
    region: str
    password: str

class UserInDB(UserBase):
    email: str
    hashed_password: str
    id: Optional[str] = None

class UserUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    weight: Optional[float] = None
    height: Optional[float] = None
    gender: Optional[Gender] = None
    goal: Optional[Goal] = None
    activity_level: Optional[ActivityLevel] = None
    country: Optional[str] = None
    region: Optional[str] = None
    is_onboarding_complete: Optional[bool] = None
    diet_type: Optional[DietType] = None
    foods_like: Optional[list[str]] = None
    meals_per_day: Optional[list[str]] = None
    preparation_style: Optional[PreparationStyle] = None
    variety_level: Optional[VarietyLevel] = None
    planning_mode: Optional[PlanningMode] = None
