# AI Service Architecture - SocialPlay

## Table of Contents
1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [AI Models & Features](#ai-models--features)
5. [API Endpoints](#api-endpoints)
6. [Model Training Pipeline](#model-training-pipeline)
7. [Inference Optimization](#inference-optimization)
8. [Integration with Main Service](#integration-with-main-service)
9. [Deployment](#deployment)

---

## Overview

The AI Service provides machine learning-powered features including content recommendations, content moderation, sentiment analysis, and user behavior prediction.

### Key Features
- **Content Recommendation**: Personalized feed ranking
- **Content Moderation**: Detect inappropriate content
- **Sentiment Analysis**: Analyze post/comment sentiment
- **Image Recognition**: Auto-tagging and NSFW detection
- **Text Generation**: Smart replies and suggestions
- **User Behavior Analysis**: Interest prediction
- **Trend Detection**: Identify trending topics

### Design Principles
- **Model Versioning**: Support multiple model versions
- **A/B Testing**: Test model performance
- **Monitoring**: Track model performance metrics
- **Fallback**: Graceful degradation if ML fails
- **Privacy**: No PII in training data

---

## Technology Stack

```yaml
Runtime: Python 3.11+
Framework: FastAPI 0.104+
ASGI Server: Uvicorn

Machine Learning:
  Deep Learning: PyTorch 2.1+
  Classical ML: scikit-learn 1.3+
  NLP: transformers (Hugging Face), spaCy 3.7+
  Computer Vision: OpenCV, Pillow
  
Data Processing:
  Arrays: NumPy 1.25+
  DataFrames: Pandas 2.1+
  Feature Engineering: scikit-learn pipelines
  
Model Serving:
  TorchServe (optional)
  ONNX Runtime (for optimization)
  
Validation: Pydantic
HTTP Client: httpx (async)
Caching: Redis
Database: MongoDB (for logs and training data)
Queue: Celery with Redis
Testing: Pytest
Monitoring: Prometheus, MLflow

Model Storage:
  Development: Local filesystem
  Production: Cloudflare R2 / Backblaze B2 / MinIO
  
GPU Support: CUDA 12.0+ (optional)
```

---

## Project Structure

```
Backend/AI-Service/
├── src/
│   ├── api/                       # API layer
│   │   ├── v1/
│   │   │   ├── routes/
│   │   │   │   ├── recommendation.py
│   │   │   │   ├── moderation.py
│   │   │   │   ├── sentiment.py
│   │   │   │   ├── image.py
│   │   │   │   └── trends.py
│   │   │   └── __init__.py
│   │   └── dependencies.py        # Shared dependencies
│   │
│   ├── models/                    # ML Models
│   │   ├── recommendation/
│   │   │   ├── collaborative_filtering.py
│   │   │   ├── content_based.py
│   │   │   └── hybrid_recommender.py
│   │   │
│   │   ├── moderation/
│   │   │   ├── text_classifier.py
│   │   │   ├── image_classifier.py
│   │   │   └── nsfw_detector.py
│   │   │
│   │   ├── sentiment/
│   │   │   ├── bert_sentiment.py
│   │   │   └── aspect_based_sentiment.py
│   │   │
│   │   ├── image/
│   │   │   ├── image_tagger.py
│   │   │   ├── face_detector.py
│   │   │   └── object_detector.py
│   │   │
│   │   └── trends/
│   │       ├── topic_modeler.py
│   │       └── trend_detector.py
│   │
│   ├── services/                  # Business logic
│   │   ├── recommendation_service.py
│   │   ├── moderation_service.py
│   │   ├── sentiment_service.py
│   │   ├── image_service.py
│   │   └── trend_service.py
│   │
│   ├── schemas/                   # Pydantic schemas
│   │   ├── recommendation.py
│   │   ├── moderation.py
│   │   ├── sentiment.py
│   │   └── common.py
│   │
│   ├── core/                      # Core utilities
│   │   ├── config.py             # Configuration
│   │   ├── logging.py            # Logging setup
│   │   ├── security.py           # API key validation
│   │   ├── cache.py              # Redis caching
│   │   └── exceptions.py         # Custom exceptions
│   │
│   ├── ml/                        # ML utilities
│   │   ├── preprocessors/
│   │   │   ├── text_preprocessor.py
│   │   │   ├── image_preprocessor.py
│   │   │   └── feature_engineer.py
│   │   │
│   │   ├── training/
│   │   │   ├── trainer.py
│   │   │   ├── evaluator.py
│   │   │   └── hyperparameter_tuner.py
│   │   │
│   │   ├── inference/
│   │   │   ├── predictor.py
│   │   │   ├── batch_predictor.py
│   │   │   └── model_loader.py
│   │   │
│   │   └── utils/
│   │       ├── metrics.py
│   │       ├── model_versioning.py
│   │       └── data_loader.py
│   │
│   ├── data/                      # Data access layer
│   │   ├── mongodb.py            # MongoDB client
│   │   ├── redis.py              # Redis client
│   │   └── repositories/
│   │       ├── user_repository.py
│   │       ├── post_repository.py
│   │       └── interaction_repository.py
│   │
│   ├── tasks/                     # Celery tasks
│   │   ├── training_tasks.py
│   │   ├── batch_inference_tasks.py
│   │   └── data_collection_tasks.py
│   │
│   ├── main.py                    # FastAPI app
│   └── worker.py                  # Celery worker
│
├── models/                        # Trained model files
│   ├── recommendation/
│   ├── moderation/
│   ├── sentiment/
│   └── image/
│
├── data/                          # Training data
│   ├── raw/
│   ├── processed/
│   └── features/
│
├── notebooks/                     # Jupyter notebooks
│   ├── exploratory/
│   ├── training/
│   └── evaluation/
│
├── scripts/                       # Utility scripts
│   ├── train_model.py
│   ├── evaluate_model.py
│   ├── deploy_model.py
│   └── collect_data.py
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── performance/
│
├── requirements.txt               # Python dependencies
├── Dockerfile
├── docker-compose.yml
└── .env.example
```

---

## AI Models & Features

### 1. Content Recommendation System

#### Architecture
```
User Features ─┐
               ├─> Hybrid Model ─> Ranked Posts
Post Features ─┘
```

#### Implementation

```python
# models/recommendation/hybrid_recommender.py
import numpy as np
from typing import List, Dict
import torch
import torch.nn as nn
from sklearn.metrics.pairwise import cosine_similarity

class HybridRecommender:
    def __init__(self, model_path: str):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.collaborative_model = torch.jit.load(
            f"{model_path}/collaborative_model.pt"
        ).to(self.device)
        self.content_based_model = torch.jit.load(
            f"{model_path}/content_based_model.pt"
        ).to(self.device)
        self.hybrid_weight = 0.6  # Weight for collaborative filtering
        
    def predict(self, user_id: str, post_ids: List[str]) -> List[Dict]:
        """
        Predict relevance scores for posts
        """
        # Get collaborative filtering scores
        cf_scores = self._collaborative_scores(user_id, post_ids)
        
        # Get content-based scores
        cb_scores = self._content_based_scores(user_id, post_ids)
        
        # Hybrid scoring
        final_scores = (
            self.hybrid_weight * cf_scores + 
            (1 - self.hybrid_weight) * cb_scores
        )
        
        # Sort by score
        ranked_posts = sorted(
            zip(post_ids, final_scores),
            key=lambda x: x[1],
            reverse=True
        )
        
        return [
            {"post_id": post_id, "score": float(score)}
            for post_id, score in ranked_posts
        ]
    
    def _collaborative_scores(self, user_id: str, post_ids: List[str]) -> np.ndarray:
        """
        Matrix factorization based collaborative filtering
        """
        # User embedding
        user_embedding = self.collaborative_model.get_layer('user_embedding')(
            np.array([user_id])
        )
        
        # Post embeddings
        post_embeddings = self.collaborative_model.get_layer('post_embedding')(
            np.array(post_ids)
        )
        
        # Dot product for similarity
        scores = np.dot(user_embedding, post_embeddings.T)[0]
        
        return scores
    
    def _content_based_scores(self, user_id: str, post_ids: List[str]) -> np.ndarray:
        """
        Content-based filtering using post features
        """
        # Get user's historical interests
        user_profile = self._get_user_profile(user_id)
        
        # Get post features
        post_features = self._get_post_features(post_ids)
        
        # Cosine similarity
        scores = cosine_similarity(
            user_profile.reshape(1, -1),
            post_features
        )[0]
        
        return scores
    
    def _get_user_profile(self, user_id: str) -> np.ndarray:
        """
        Build user profile from historical interactions
        """
        # Fetch user's liked/commented posts
        # Aggregate features to create user profile
        # This is a placeholder
        return np.random.rand(128)  # 128-dim feature vector
    
    def _get_post_features(self, post_ids: List[str]) -> np.ndarray:
        """
        Extract features from posts
        """
        # Extract: text embeddings, tags, media type, etc.
        # This is a placeholder
        return np.random.rand(len(post_ids), 128)


# services/recommendation_service.py
from typing import List, Dict
from .models.recommendation.hybrid_recommender import HybridRecommender
from .core.cache import cache_result

class RecommendationService:
    def __init__(self):
        self.recommender = HybridRecommender("models/recommendation")
    
    @cache_result(ttl=300)  # Cache for 5 minutes
    async def get_personalized_feed(
        self,
        user_id: str,
        candidate_posts: List[str],
        limit: int = 20
    ) -> List[Dict]:
        """
        Generate personalized feed for user
        """
        # Get predictions
        ranked_posts = self.recommender.predict(user_id, candidate_posts)
        
        # Apply business rules
        ranked_posts = self._apply_diversity_filter(ranked_posts)
        ranked_posts = self._apply_freshness_boost(ranked_posts)
        
        return ranked_posts[:limit]
    
    def _apply_diversity_filter(self, posts: List[Dict]) -> List[Dict]:
        """
        Ensure diversity in recommendations
        """
        # Implement MMR (Maximal Marginal Relevance) or similar
        return posts
    
    def _apply_freshness_boost(self, posts: List[Dict]) -> List[Dict]:
        """
        Boost recent posts
        """
        # Boost posts from last 24 hours
        return posts
```

---

### 2. Content Moderation

#### Text Moderation

```python
# models/moderation/text_classifier.py
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

class TextModerator:
    def __init__(self, model_name: str = "unitary/toxic-bert"):
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForSequenceClassification.from_pretrained(model_name)
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model.to(self.device)
        
        # Categories
        self.categories = [
            "toxic",
            "severe_toxic",
            "obscene",
            "threat",
            "insult",
            "identity_hate"
        ]
        
    def predict(self, text: str) -> Dict[str, float]:
        """
        Predict toxicity scores for text
        """
        # Tokenize
        inputs = self.tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            max_length=512,
            padding=True
        ).to(self.device)
        
        # Predict
        with torch.no_grad():
            outputs = self.model(**inputs)
            scores = torch.sigmoid(outputs.logits).cpu().numpy()[0]
        
        # Create result dict
        results = {
            category: float(score)
            for category, score in zip(self.categories, scores)
        }
        
        # Overall toxicity score
        results["overall_toxic"] = max(scores)
        
        return results
    
    def is_safe(self, text: str, threshold: float = 0.7) -> bool:
        """
        Check if text is safe to publish
        """
        scores = self.predict(text)
        return scores["overall_toxic"] < threshold


# services/moderation_service.py
class ModerationService:
    def __init__(self):
        self.text_moderator = TextModerator()
        self.image_moderator = ImageModerator()
        
    async def moderate_post(self, content: str, images: List[str] = None) -> Dict:
        """
        Moderate a post (text + images)
        """
        # Moderate text
        text_results = self.text_moderator.predict(content)
        
        # Moderate images
        image_results = []
        if images:
            for image_url in images:
                result = await self.image_moderator.predict(image_url)
                image_results.append(result)
        
        # Determine if post should be flagged
        is_safe = (
            text_results["overall_toxic"] < 0.7 and
            all(img["is_safe"] for img in image_results)
        )
        
        return {
            "is_safe": is_safe,
            "text_moderation": text_results,
            "image_moderation": image_results,
            "action": "approve" if is_safe else "flag_for_review"
        }
```

#### Image Moderation (NSFW Detection)

```python
# models/moderation/nsfw_detector.py
import torch
from torchvision import transforms
from PIL import Image
import requests
from io import BytesIO

class NSFWDetector:
    def __init__(self, model_path: str):
        self.model = torch.load(model_path)
        self.model.eval()
        
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])
        
        self.classes = ["safe", "questionable", "unsafe"]
        
    async def predict(self, image_url: str) -> Dict:
        """
        Predict NSFW score for image
        """
        # Download image
        response = requests.get(image_url)
        image = Image.open(BytesIO(response.content)).convert("RGB")
        
        # Preprocess
        image_tensor = self.transform(image).unsqueeze(0)
        
        # Predict
        with torch.no_grad():
            outputs = self.model(image_tensor)
            probabilities = torch.softmax(outputs, dim=1)[0]
        
        results = {
            category: float(prob)
            for category, prob in zip(self.classes, probabilities)
        }
        
        results["is_safe"] = results["safe"] > 0.7
        
        return results
```

---

### 3. Sentiment Analysis

```python
# models/sentiment/bert_sentiment.py
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

class SentimentAnalyzer:
    def __init__(self, model_name: str = "distilbert-base-uncased-finetuned-sst-2-english"):
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForSequenceClassification.from_pretrained(model_name)
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model.to(self.device)
        
    def predict(self, text: str) -> Dict:
        """
        Predict sentiment of text
        """
        inputs = self.tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            max_length=512
        ).to(self.device)
        
        with torch.no_grad():
            outputs = self.model(**inputs)
            scores = torch.softmax(outputs.logits, dim=1).cpu().numpy()[0]
        
        return {
            "sentiment": "positive" if scores[1] > scores[0] else "negative",
            "positive_score": float(scores[1]),
            "negative_score": float(scores[0]),
            "confidence": float(max(scores))
        }


# services/sentiment_service.py
class SentimentService:
    def __init__(self):
        self.analyzer = SentimentAnalyzer()
        
    async def analyze_post(self, post_id: str, content: str) -> Dict:
        """
        Analyze sentiment of a post
        """
        result = self.analyzer.predict(content)
        
        # Store in database for analytics
        await self._store_sentiment(post_id, result)
        
        return result
    
    async def get_trending_sentiment(self, topic: str) -> Dict:
        """
        Get overall sentiment for a topic
        """
        # Fetch recent posts about topic
        # Aggregate sentiments
        return {
            "topic": topic,
            "overall_sentiment": "positive",
            "positive_percentage": 65.5,
            "negative_percentage": 34.5
        }
```

---

### 4. Image Recognition & Tagging

```python
# models/image/image_tagger.py
from transformers import CLIPProcessor, CLIPModel
from PIL import Image
import requests
from io import BytesIO

class ImageTagger:
    def __init__(self):
        self.model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
        self.processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
        
        # Predefined tags
        self.candidate_tags = [
            "food", "nature", "people", "animal", "travel",
            "technology", "sports", "art", "fashion", "music",
            "selfie", "group photo", "landscape", "sunset", "beach"
        ]
        
    async def predict(self, image_url: str, top_k: int = 5) -> List[Dict]:
        """
        Predict tags for image
        """
        # Download image
        response = requests.get(image_url)
        image = Image.open(BytesIO(response.content))
        
        # Prepare inputs
        inputs = self.processor(
            text=self.candidate_tags,
            images=image,
            return_tensors="pt",
            padding=True
        )
        
        # Predict
        outputs = self.model(**inputs)
        logits_per_image = outputs.logits_per_image
        probs = logits_per_image.softmax(dim=1).detach().numpy()[0]
        
        # Get top K tags
        top_indices = probs.argsort()[-top_k:][::-1]
        
        results = [
            {
                "tag": self.candidate_tags[idx],
                "confidence": float(probs[idx])
            }
            for idx in top_indices
        ]
        
        return results
```

---

### 5. Trend Detection

```python
# models/trends/trend_detector.py
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import DBSCAN
import numpy as np

class TrendDetector:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(max_features=1000, stop_words='english')
        
    def detect_trends(self, posts: List[Dict], time_window_hours: int = 24) -> List[Dict]:
        """
        Detect trending topics from recent posts
        """
        # Extract text from posts
        texts = [post["content"] for post in posts]
        
        # Vectorize
        tfidf_matrix = self.vectorizer.fit_transform(texts)
        
        # Cluster similar posts
        clustering = DBSCAN(eps=0.3, min_samples=5, metric='cosine')
        labels = clustering.fit_predict(tfidf_matrix)
        
        # Identify trends (clusters)
        trends = []
        for cluster_id in set(labels):
            if cluster_id == -1:  # Skip noise
                continue
            
            cluster_posts = [posts[i] for i, label in enumerate(labels) if label == cluster_id]
            
            # Extract top keywords for this cluster
            cluster_indices = np.where(labels == cluster_id)[0]
            cluster_tfidf = tfidf_matrix[cluster_indices]
            avg_tfidf = cluster_tfidf.mean(axis=0).A1
            
            top_keyword_indices = avg_tfidf.argsort()[-5:][::-1]
            keywords = [self.vectorizer.get_feature_names_out()[i] for i in top_keyword_indices]
            
            trends.append({
                "trend_id": f"trend_{cluster_id}",
                "keywords": keywords,
                "post_count": len(cluster_posts),
                "sample_posts": cluster_posts[:3]
            })
        
        # Sort by post count
        trends.sort(key=lambda x: x["post_count"], reverse=True)
        
        return trends
```

---

## API Endpoints

### FastAPI Application

```python
# main.py
from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from api.v1.routes import recommendation, moderation, sentiment, image, trends
from core.config import settings
from core.logging import setup_logging

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    setup_logging()
    # Load models here
    yield
    # Shutdown
    pass

app = FastAPI(
    title="SocialPlay AI Service",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Key validation
async def verify_api_key(x_api_key: str = Header(...)):
    if x_api_key != settings.API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API key")
    return x_api_key

# Routes
app.include_router(
    recommendation.router,
    prefix="/api/v1/recommendations",
    tags=["Recommendations"],
    dependencies=[Depends(verify_api_key)]
)

app.include_router(
    moderation.router,
    prefix="/api/v1/moderation",
    tags=["Moderation"],
    dependencies=[Depends(verify_api_key)]
)

app.include_router(
    sentiment.router,
    prefix="/api/v1/sentiment",
    tags=["Sentiment"],
    dependencies=[Depends(verify_api_key)]
)

app.include_router(
    image.router,
    prefix="/api/v1/image",
    tags=["Image"],
    dependencies=[Depends(verify_api_key)]
)

app.include_router(
    trends.router,
    prefix="/api/v1/trends",
    tags=["Trends"],
    dependencies=[Depends(verify_api_key)]
)

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
```

### Recommendation Endpoints

```python
# api/v1/routes/recommendation.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from services.recommendation_service import RecommendationService

router = APIRouter()
recommendation_service = RecommendationService()

class RecommendationRequest(BaseModel):
    user_id: str
    candidate_post_ids: List[str]
    limit: int = 20

class RecommendationResponse(BaseModel):
    post_id: str
    score: float

@router.post("/feed", response_model=List[RecommendationResponse])
async def get_personalized_feed(request: RecommendationRequest):
    """
    Get personalized post recommendations for user
    """
    try:
        recommendations = await recommendation_service.get_personalized_feed(
            user_id=request.user_id,
            candidate_posts=request.candidate_post_ids,
            limit=request.limit
        )
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/similar-posts/{post_id}")
async def get_similar_posts(post_id: str, limit: int = 10):
    """
    Get posts similar to given post
    """
    # Implementation
    pass
```

### Moderation Endpoints

```python
# api/v1/routes/moderation.py
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from services.moderation_service import ModerationService

router = APIRouter()
moderation_service = ModerationService()

class ModerationRequest(BaseModel):
    content: str
    images: Optional[List[str]] = None

@router.post("/moderate")
async def moderate_content(request: ModerationRequest):
    """
    Moderate post content (text + images)
    """
    result = await moderation_service.moderate_post(
        content=request.content,
        images=request.images
    )
    return result

@router.post("/text")
async def moderate_text(text: str):
    """
    Moderate text only
    """
    # Implementation
    pass

@router.post("/image")
async def moderate_image(image_url: str):
    """
    Moderate image only
    """
    # Implementation
    pass
```

---

## Model Training Pipeline

```python
# scripts/train_model.py
import argparse
from ml.training.trainer import ModelTrainer
from ml.data_loader import DataLoader

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", type=str, required=True)
    parser.add_argument("--data-path", type=str, required=True)
    parser.add_argument("--epochs", type=int, default=10)
    parser.add_argument("--batch-size", type=int, default=32)
    args = parser.parse_args()
    
    # Load data
    data_loader = DataLoader(args.data_path)
    train_data, val_data = data_loader.load_and_split()
    
    # Train model
    trainer = ModelTrainer(model_type=args.model)
    trainer.train(
        train_data=train_data,
        val_data=val_data,
        epochs=args.epochs,
        batch_size=args.batch_size
    )
    
    # Save model
    trainer.save(f"models/{args.model}/latest")
    
    print(f"Model trained and saved successfully!")

if __name__ == "__main__":
    main()
```

### Training Configuration

```python
# ml/training/trainer.py
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
import mlflow

class ModelTrainer:
    def __init__(self, model_type: str):
        self.model_type = model_type
        self.model = self._build_model()
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model.to(self.device)
        
    def train(self, train_loader: DataLoader, val_loader: DataLoader, epochs: int, lr: float = 0.001):
        # MLflow tracking
        mlflow.start_run()
        mlflow.log_params({
            "model_type": self.model_type,
            "epochs": epochs,
            "learning_rate": lr
        })
        
        # Setup
        criterion = nn.CrossEntropyLoss()
        optimizer = optim.Adam(self.model.parameters(), lr=lr)
        best_val_loss = float('inf')
        patience_counter = 0
        
        # Train
        for epoch in range(epochs):
            # Training phase
            self.model.train()
            train_loss = 0.0
            for batch in train_loader:
                inputs, labels = batch
                inputs, labels = inputs.to(self.device), labels.to(self.device)
                
                optimizer.zero_grad()
                outputs = self.model(inputs)
                loss = criterion(outputs, labels)
                loss.backward()
                optimizer.step()
                train_loss += loss.item()
            
            # Validation phase
            self.model.eval()
            val_loss = 0.0
            correct = 0
            total = 0
            with torch.no_grad():
                for batch in val_loader:
                    inputs, labels = batch
                    inputs, labels = inputs.to(self.device), labels.to(self.device)
                    outputs = self.model(inputs)
                    loss = criterion(outputs, labels)
                    val_loss += loss.item()
                    _, predicted = torch.max(outputs.data, 1)
                    total += labels.size(0)
                    correct += (predicted == labels).sum().item()
            
            val_accuracy = correct / total
            
            # Early stopping
            if val_loss < best_val_loss:
                best_val_loss = val_loss
                patience_counter = 0
                torch.save(self.model.state_dict(), 'models/best_model.pt')
            else:
                patience_counter += 1
                if patience_counter >= 3:
                    print(f"Early stopping at epoch {epoch}")
                    break
        
        # Log metrics
        mlflow.log_metrics({
            "train_loss": train_loss / len(train_loader),
            "val_loss": val_loss / len(val_loader),
            "val_accuracy": val_accuracy
        })
        
        mlflow.end_run()
```

---

## Inference Optimization

### Model Quantization

```python
# ml/inference/optimize.py
import torch
import torch.quantization

def quantize_model(model: nn.Module, output_path: str):
    """
    Quantize PyTorch model to reduce size and improve inference speed
    """
    model.eval()
    
    # Dynamic quantization (easiest, good for LSTMs/RNNs)
    quantized_model = torch.quantization.quantize_dynamic(
        model,
        {nn.Linear, nn.LSTM},
        dtype=torch.qint8
    )
    
    # Save quantized model
    torch.save(quantized_model.state_dict(), output_path)
    converter.target_spec.supported_types = [tf.float16]
    
    tflite_model = converter.convert()
    
    with open(output_path, 'wb') as f:
        f.write(tflite_model)
    
    print(f"Quantized model saved to {output_path}")
```

### Batch Inference

```python
# ml/inference/batch_predictor.py
class BatchPredictor:
    def __init__(self, model_path: str, batch_size: int = 32):
        self.model = load_model(model_path)
        self.batch_size = batch_size
        
    async def predict_batch(self, inputs: List[Any]) -> List[Dict]:
        """
        Process inputs in batches for efficiency
        """
        results = []
        
        for i in range(0, len(inputs), self.batch_size):
            batch = inputs[i:i + self.batch_size]
            batch_results = self.model.predict(batch)
            results.extend(batch_results)
        
        return results
```

---

## Integration with Main Service

### gRPC Interface (Optional for High Performance)

```python
# protos/ai_service.proto
syntax = "proto3";

service AIService {
  rpc GetRecommendations(RecommendationRequest) returns (RecommendationResponse);
  rpc ModerateContent(ModerationRequest) returns (ModerationResponse);
}

message RecommendationRequest {
  string user_id = 1;
  repeated string candidate_post_ids = 2;
  int32 limit = 3;
}

message RecommendationResponse {
  repeated ScoredPost posts = 1;
}

message ScoredPost {
  string post_id = 1;
  float score = 2;
}
```

### REST API Client (Main Service)

```typescript
// Main Service - lib/clients/aiService.ts
import axios from 'axios';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5000';
const AI_API_KEY = process.env.AI_SERVICE_API_KEY;

export const aiServiceClient = axios.create({
  baseURL: AI_SERVICE_URL,
  headers: {
    'X-API-Key': AI_API_KEY
  }
});

export const getPersonalizedFeed = async (userId: string, candidatePosts: string[]) => {
  const response = await aiServiceClient.post('/api/v1/recommendations/feed', {
    user_id: userId,
    candidate_post_ids: candidatePosts,
    limit: 20
  });
  
  return response.data;
};

export const moderateContent = async (content: string, images?: string[]) => {
  const response = await aiServiceClient.post('/api/v1/moderation/moderate', {
    content,
    images
  });
  
  return response.data;
};
```

---

## Deployment

### Docker Configuration

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY src/ ./src/
COPY models/ ./models/

# Expose port
EXPOSE 5000

# Run application
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "5000", "--workers", "4"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  ai-service:
    build: .
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URL=mongodb://mongo:27017
      - REDIS_URL=redis://redis:6379
      - API_KEY=${AI_SERVICE_API_KEY}
    volumes:
      - ./models:/app/models
      - ./data:/app/data
    depends_on:
      - mongo
      - redis
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
  
  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  mongo_data:
```

### Environment Variables

```bash
# .env
MONGODB_URL=mongodb://localhost:27017/socialplay_ai
REDIS_URL=redis://localhost:6379
API_KEY=your-secret-api-key
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Cloudflare R2 for model storage
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-key
R2_SECRET_ACCESS_KEY=your-secret
S3_BUCKET=socialplay-ml-models

# MLflow
MLFLOW_TRACKING_URI=http://localhost:5001
```

---

**Next Document**: [API Gateway Setup](./04-API-GATEWAY-SETUP.md)
