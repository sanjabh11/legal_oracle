"""Rate limiting and internationalization middleware."""
from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer
import time
from typing import Dict, Any
from collections import defaultdict
import json

class RateLimiter:
    """Simple in-memory rate limiter."""
    def __init__(self, requests_per_minute: int = 60):
        self.requests_per_minute = requests_per_minute
        self.requests = defaultdict(list)
        
    def is_allowed(self, key: str) -> bool:
        """Check if request is allowed for given key."""
        now = time.time()
        
        # Clean old requests
        self.requests[key] = [
            req_time for req_time in self.requests[key]
            if now - req_time < 60
        ]
        
        if len(self.requests[key]) >= self.requests_per_minute:
            return False
            
        self.requests[key].append(now)
        return True
    
    def get_rate_limit_info(self, key: str) -> Dict[str, Any]:
        """Get rate limit info for key."""
        now = time.time()
        recent_requests = [
            req_time for req_time in self.requests[key]
            if now - req_time < 60
        ]
        
        return {
            "limit": self.requests_per_minute,
            "remaining": max(0, self.requests_per_minute - len(recent_requests)),
            "reset_time": int(now + 60)
        }

# Global rate limiter
rate_limiter = RateLimiter(requests_per_minute=100)

class I18nMiddleware:
    """Simple internationalization support."""
    def __init__(self):
        self.translations = {
            "en": {
                "rate_limit_exceeded": "Rate limit exceeded. Please try again later.",
                "invalid_token": "Invalid authentication token.",
                "dataset_not_found": "Dataset '{dataset}' not found.",
                "search_empty": "No results found for your query.",
                "export_ready": "Your export is ready for download.",
                "feedback_received": "Thank you for your feedback!"
            },
            "es": {
                "rate_limit_exceeded": "Límite de tasa excedido. Inténtalo de nuevo más tarde.",
                "invalid_token": "Token de autenticación inválido.",
                "dataset_not_found": "Conjunto de datos '{dataset}' no encontrado.",
                "search_empty": "No se encontraron resultados para tu búsqueda.",
                "export_ready": "Tu exportación está lista para descargar.",
                "feedback_received": "¡Gracias por tu retroalimentación!"
            },
            "hi": {
                "rate_limit_exceeded": "दर सीमा पार हो गई। कृपया बाद में पुनः प्रयास करें।",
                "invalid_token": "अमान्य प्रमाणीकरण टोकन।",
                "dataset_not_found": "डेटासेट '{dataset}' नहीं मिला।",
                "search_empty": "आपकी क्वेरी के लिए कोई परिणाम नहीं मिले।",
                "export_ready": "आपका निर्यात डाउनलोड के लिए तैयार है।",
                "feedback_received": "आपकी प्रतिक्रिया के लिए धन्यवाद!"
            }
        }
    
    def get_message(self, key: str, lang: str = "en", **kwargs) -> str:
        """Get translated message."""
        translation = self.translations.get(lang, self.translations["en"])
        message = translation.get(key, key)
        
        # Format with kwargs
        try:
            return message.format(**kwargs)
        except:
            return message

# Global i18n instance
i18n = I18nMiddleware()

async def rate_limit_middleware(request: Request, call_next):
    """Rate limiting middleware."""
    # Get client identifier (IP + user ID if authenticated)
    client_ip = request.client.host
    user_id = getattr(request.state, 'user_id', None)
    key = f"{client_ip}:{user_id}" if user_id else client_ip
    
    if not rate_limiter.is_allowed(key):
        rate_info = rate_limiter.get_rate_limit_info(key)
        return HTTPException(
            status_code=429,
            detail={
                "error": i18n.get_message("rate_limit_exceeded"),
                "rate_limit_info": rate_info
            }
        )
    
    response = await call_next(request)
    
    # Add rate limit headers
    rate_info = rate_limiter.get_rate_limit_info(key)
    response.headers["X-RateLimit-Limit"] = str(rate_info["limit"])
    response.headers["X-RateLimit-Remaining"] = str(rate_info["remaining"])
    response.headers["X-RateLimit-Reset"] = str(rate_info["reset_time"])
    
    return response
