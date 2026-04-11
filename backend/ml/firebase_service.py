import os
import firebase_admin
from firebase_admin import credentials, firestore, auth
from typing import Optional, Dict, Any, List
import json


class FirebaseService:
    _instance: Optional['FirebaseService'] = None
    _initialized: bool = False

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        if FirebaseService._initialized:
            return
        
        cred_path = os.getenv('FIREBASE_CREDENTIALS_PATH', '')
        if cred_path and os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
        else:
            try:
                firebase_admin.get_app()
            except ValueError:
                pass
        
        self.db = firestore.client() if firebase_admin._apps else None
        FirebaseService._initialized = True

    def verify_token(self, id_token: str) -> Optional[Dict[str, Any]]:
        try:
            decoded = auth.verify_id_token(id_token)
            return decoded
        except Exception:
            return None

    def create_user(self, email: str, password: str) -> Optional[Dict[str, Any]]:
        try:
            user = auth.create_user(email=email, password=password)
            return {'uid': user.uid, 'email': user.email}
        except Exception as e:
            return {'error': str(e)}

    def get_user(self, uid: str) -> Optional[Dict[str, Any]]:
        try:
            user = auth.get_user(uid)
            return {'uid': user.uid, 'email': user.email}
        except Exception:
            return None

    def collection(self, name: str) -> Optional['FirestoreCollection']:
        if self.db is None:
            return None
        return FirestoreCollection(self.db.collection(name))


class FirestoreCollection:
    def __init__(self, collection):
        self._collection = collection

    def add(self, data: Dict[str, Any]) -> Optional[str]:
        try:
            doc_ref = self._collection.add(data)
            return doc_ref[1].id
        except Exception:
            return None

    def document(self, doc_id: str) -> Optional['FirestoreDocument']:
        try:
            return FirestoreDocument(self._collection.document(doc_id))
        except Exception:
            return None

    def where(self, field: str, op: str, value: Any) -> 'FirestoreQuery':
        return FirestoreQuery(self._collection.where(field, op, value))

    def stream(self) -> List[Dict[str, Any]]:
        try:
            docs = self._collection.stream()
            return [{'id': doc.id, **doc.to_dict()} for doc in docs]
        except Exception:
            return []


class FirestoreDocument:
    def __init__(self, doc_ref):
        self._doc = doc_ref

    def get(self) -> Optional[Dict[str, Any]]:
        try:
            doc = self._doc.get()
            if doc.exists:
                return {'id': doc.id, **doc.to_dict()}
            return None
        except Exception:
            return None

    def set(self, data: Dict[str, Any]) -> bool:
        try:
            self._doc.set(data)
            return True
        except Exception:
            return False

    def update(self, data: Dict[str, Any]) -> bool:
        try:
            self._doc.update(data)
            return True
        except Exception:
            return False

    def delete(self) -> bool:
        try:
            self._doc.delete()
            return True
        except Exception:
            return False


class FirestoreQuery:
    def __init__(self, query):
        self._query = query

    def stream(self) -> List[Dict[str, Any]]:
        try:
            docs = self._query.stream()
            return [{'id': doc.id, **doc.to_dict()} for doc in docs]
        except Exception:
            return []


firebase_service = FirebaseService()
