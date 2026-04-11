import numpy as np
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from typing import Any, Dict, List, Optional
import joblib
import os


class PredictionService:
    def __init__(self):
        self.models: Dict[str, Any] = {}
        self.scalers: Dict[str, StandardScaler] = {}
        self.models_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'models')
        os.makedirs(self.models_dir, exist_ok=True)

    def train_regression_model(
        self,
        model_name: str,
        X: np.ndarray,
        y: np.ndarray,
        test_size: float = 0.2,
        **kwargs
    ) -> Dict[str, Any]:
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=42
        )
        
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        
        model = RandomForestRegressor(**kwargs)
        model.fit(X_train_scaled, y_train)
        
        train_score = model.score(X_train_scaled, y_train)
        test_score = model.score(X_test_scaled, y_test)
        
        self.models[model_name] = model
        self.scalers[model_name] = scaler
        
        self._save_model(model_name, model, scaler)
        
        return {
            'model_name': model_name,
            'train_score': train_score,
            'test_score': test_score,
            'feature_count': X.shape[1]
        }

    def train_classification_model(
        self,
        model_name: str,
        X: np.ndarray,
        y: np.ndarray,
        test_size: float = 0.2,
        **kwargs
    ) -> Dict[str, Any]:
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=42
        )
        
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        
        model = RandomForestClassifier(**kwargs)
        model.fit(X_train_scaled, y_train)
        
        train_score = model.score(X_train_scaled, y_train)
        test_score = model.score(X_test_scaled, y_test)
        
        self.models[model_name] = model
        self.scalers[model_name] = scaler
        
        self._save_model(model_name, model, scaler)
        
        return {
            'model_name': model_name,
            'train_score': train_score,
            'test_score': test_score,
            'feature_count': X.shape[1],
            'classes': sorted(list(np.unique(y)))
        }

    def predict(self, model_name: str, X: np.ndarray) -> np.ndarray:
        if model_name not in self.models:
            self._load_model(model_name)
        
        scaler = self.scalers.get(model_name)
        if scaler:
            X = scaler.transform(X)
        
        model = self.models.get(model_name)
        if model is None:
            raise ValueError(f"Model '{model_name}' not found")
        
        return model.predict(X)

    def predict_proba(self, model_name: str, X: np.ndarray) -> np.ndarray:
        if model_name not in self.models:
            self._load_model(model_name)
        
        scaler = self.scalers.get(model_name)
        if scaler:
            X = scaler.transform(X)
        
        model = self.models.get(model_name)
        if model is None:
            raise ValueError(f"Model '{model_name}' not found")
        
        if hasattr(model, 'predict_proba'):
            return model.predict_proba(X)
        raise AttributeError(f"Model '{model_name}' does not support probability predictions")

    def _save_model(self, model_name: str, model: Any, scaler: StandardScaler):
        model_path = os.path.join(self.models_dir, f'{model_name}_model.joblib')
        scaler_path = os.path.join(self.models_dir, f'{model_name}_scaler.joblib')
        joblib.dump(model, model_path)
        joblib.dump(scaler, scaler_path)

    def _load_model(self, model_name: str):
        model_path = os.path.join(self.models_dir, f'{model_name}_model.joblib')
        scaler_path = os.path.join(self.models_dir, f'{model_name}_scaler.joblib')
        
        if os.path.exists(model_path):
            self.models[model_name] = joblib.load(model_path)
        if os.path.exists(scaler_path):
            self.scalers[model_name] = joblib.load(scaler_path)

    def list_models(self) -> List[str]:
        return list(self.models.keys())


prediction_service = PredictionService()
