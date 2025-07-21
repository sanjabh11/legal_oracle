from transformers import AutoTokenizer, AutoModel
from . import BaseStreamingDataset, register_dataset
import torch

@register_dataset("inlegalbert")
class InLegalBERTDataset(BaseStreamingDataset):
    """Embedding endpoint for law-ai/InLegalBERT."""
    HF_MODEL = "law-ai/InLegalBERT"

    def __init__(self):
        self.tokenizer = AutoTokenizer.from_pretrained(self.HF_MODEL)
        self.model = AutoModel.from_pretrained(self.HF_MODEL)

    def embed(self, text: str):
        inputs = self.tokenizer(text, return_tensors="pt")
        with torch.no_grad():
            outputs = self.model(**inputs)
        # Return [CLS] embedding
        return outputs.last_hidden_state[:, 0, :].squeeze().tolist()
