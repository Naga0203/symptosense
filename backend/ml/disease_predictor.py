import os
import re
import pickle
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import torch
import torch.nn as nn
import torch.nn.functional as F

# Ensure NLTK data is downloaded for preprocessing
nltk.download('punkt', quiet=True)
nltk.download('punkt_tab', quiet=True) # Ensure compatibility with newer NLTK
nltk.download('stopwords', quiet=True)

class SymptomClassifier(nn.Module):
    def __init__(self, vocab_size, embedding_dim, hidden_dim, output_dim, max_seq_len, dropout_prob=0.5):
        super(SymptomClassifier, self).__init__()
        self.embedding = nn.Embedding(vocab_size, embedding_dim, padding_idx=0)
        self.flatten = nn.Flatten()
        self.fc1 = nn.Linear(max_seq_len * embedding_dim, hidden_dim)
        self.bn1 = nn.BatchNorm1d(hidden_dim)
        self.dropout = nn.Dropout(p=dropout_prob)
        self.fc2 = nn.Linear(hidden_dim, output_dim)

    def forward(self, text):
        embedded = self.embedding(text)
        flattened = self.flatten(embedded)
        x = self.fc1(flattened)
        x = self.bn1(x)
        x = F.relu(x)
        x = self.dropout(x)
        x = self.fc2(x)
        return x

def preprocess_text(text):
    text = text.lower()
    text = re.sub(r'[^A-z ]', '', text) # Matches training: Keeps letters, spaces, and underscores (_)
    text = re.sub(r'\d+', '', text)    # Remove numbers
    tokens = word_tokenize(text)
    stop_words = set(stopwords.words('english'))
    filtered_tokens = [word for word in tokens if word not in stop_words]
    return ' '.join(filtered_tokens)

def text_to_sequence_inference(text, vocabulary, max_len):
    """
    Converts cleaned text into a numerical ID sequence and pads/truncates it
    to a fixed maximum length.
    """
    words = text.split()
    sequence = [vocabulary.get(word, vocabulary.get('<unk>', 0)) for word in words]
    if len(sequence) < max_len:
        sequence = sequence + [vocabulary.get('<pad>', 0)] * (max_len - len(sequence))
    else:
        sequence = sequence[:max_len]
    return sequence

class DiseasePredictor:
    def __init__(self):
        # Resolve paths
        self.assets_dir = os.path.join(os.path.dirname(__file__), 'Assets')
        label_encoder_path = os.path.join(self.assets_dir, 'label_encoder.pkl')
        vocabulary_path = os.path.join(self.assets_dir, 'vocabulary.pkl')
        max_seq_len_path = os.path.join(self.assets_dir, 'max_seq_len.pkl')
        model_save_path = os.path.join(self.assets_dir, 'tuned_symptom_classifier_model.pth')

        # Load standard components
        with open(label_encoder_path, 'rb') as f:
            self.label_encoder = pickle.load(f)
            
        with open(vocabulary_path, 'rb') as f:
            self.vocabulary = pickle.load(f)
            
        with open(max_seq_len_path, 'rb') as f:
            self.max_seq_len = pickle.load(f)

        # Load PyTorch model state_dict first to derive architecture dims
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        state_dict = torch.load(model_save_path, map_location=self.device)

        # Infer network dimensions dynamically from weights since they were omitted (e.g. NEW_EMBEDDING_DIM) 
        vocab_size = len(self.vocabulary)
        output_dim = len(self.label_encoder.classes_)
        embedding_dim = state_dict['embedding.weight'].shape[1]
        hidden_dim = state_dict['fc2.weight'].shape[1]
        
        # Dropout prob doesn't matter for inference (.eval() bypasses it)
        dropout_prob = 0.5 

        # Instantiate Model
        self.model = SymptomClassifier(
            vocab_size,
            embedding_dim,
            hidden_dim,
            output_dim,
            self.max_seq_len,
            dropout_prob
        )

        # Initialize and prep for inference
        self.model.load_state_dict(state_dict)
        self.model.to(self.device)
        self.model.eval()

    def predict(self, raw_symptom_text):
        """
        Predicts the disease based on raw symptom text using the loaded model.
        Returns:
            predicted_disease_name (str), confidence (float)
        """
        cleaned_text = preprocess_text(raw_symptom_text)
        processed_sequence = text_to_sequence_inference(cleaned_text, self.vocabulary, self.max_seq_len)
        input_tensor = torch.tensor(processed_sequence, dtype=torch.long).unsqueeze(0).to(self.device)

        with torch.no_grad():
            output = self.model(input_tensor)
            probabilities = F.softmax(output, dim=1)
            predicted_label_id = torch.argmax(probabilities, dim=1).item()
            confidence = torch.max(probabilities).item()

        predicted_disease_name = self.label_encoder.inverse_transform([predicted_label_id])[0]
        return predicted_disease_name, confidence

# Singular instance singleton available just like prediction_service
disease_predictor = DiseasePredictor()
