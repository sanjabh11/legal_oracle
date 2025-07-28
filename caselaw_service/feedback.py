"""User feedback and data quality flagging system."""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List
from datetime import datetime
from ..auth import get_current_user

router = APIRouter(prefix="/feedback", tags=["feedback"])

class FeedbackRequest(BaseModel):
    dataset_name: str
    item_id: str
    feedback_type: str  # "helpful", "inaccurate", "irrelevant", "other"
    comment: str = ""
    user_rating: int = None  # 1-5 stars

class FeedbackStore:
    """Simple feedback storage."""
    def __init__(self):
        self.feedback = []
        
    def add_feedback(self, feedback: Dict[str, Any]):
        """Add user feedback."""
        feedback["submitted_at"] = datetime.utcnow().isoformat()
        self.feedback.append(feedback)
        
    def get_feedback_stats(self, dataset_name: str = None) -> Dict[str, Any]:
        """Get feedback statistics."""
        filtered_feedback = self.feedback
        if dataset_name:
            filtered_feedback = [f for f in filtered_feedback 
                               if f.get("dataset_name") == dataset_name]
        
        stats = {
            "total_feedback": len(filtered_feedback),
            "by_type": {},
            "by_dataset": {},
            "average_rating": 0
        }
        
        total_rating = 0
        rating_count = 0
        
        for feedback in filtered_feedback:
            feedback_type = feedback.get("feedback_type", "other")
            stats["by_type"][feedback_type] = stats["by_type"].get(feedback_type, 0) + 1
            
            dataset = feedback.get("dataset_name", "unknown")
            stats["by_dataset"][dataset] = stats["by_dataset"].get(dataset, 0) + 1
            
            if feedback.get("user_rating"):
                total_rating += feedback["user_rating"]
                rating_count += 1
        
        if rating_count > 0:
            stats["average_rating"] = total_rating / rating_count
            
        return stats

# Global feedback store
_feedback_store = FeedbackStore()

@router.post("/submit")
async def submit_feedback(
    feedback: FeedbackRequest,
    user=Depends(get_current_user)
):
    """Submit user feedback for a dataset item."""
    feedback_data = {
        "user_id": str(user.id),
        "dataset_name": feedback.dataset_name,
        "item_id": feedback.item_id,
        "feedback_type": feedback.feedback_type,
        "comment": feedback.comment,
        "user_rating": feedback.user_rating
    }
    
    _feedback_store.add_feedback(feedback_data)
    
    return {
        "status": "success",
        "message": "Feedback submitted successfully",
        "feedback_id": len(_feedback_store.feedback) - 1
    }

@router.get("/stats")
async def get_feedback_stats(
    dataset_name: str = None,
    user=Depends(get_current_user)
):
    """Get feedback statistics."""
    return _feedback_store.get_feedback_stats(dataset_name)

@router.get("/my-feedback")
async def get_my_feedback(user=Depends(get_current_user)):
    """Get feedback submitted by current user."""
    user_feedback = [f for f in _feedback_store.feedback 
                    if f.get("user_id") == str(user.id)]
    
    return {
        "feedback": user_feedback,
        "total": len(user_feedback)
    }
