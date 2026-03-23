from typing import Literal
import json
import openai
import anthropic as anthropic_sdk
try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False
from pydantic import BaseModel
from services.crypto_service import CryptoService


class GeneratedSlide(BaseModel):
    title: str
    body: str
    layout: Literal["title-body", "title-only", "quote", "bullet-list"] = "title-body"
    bullets: list[str] = []
    quote: str = ""
    author: str = ""


SYSTEM_PROMPT = """You are a professional presentation designer. Generate engaging carousel slides in JSON format.
Return ONLY a JSON array of slide objects. Each object must have:
- title (string)
- body (string, used when layout is "title-body")
- layout (one of: "title-body", "title-only", "quote", "bullet-list")
- bullets (array of strings, used when layout is "bullet-list")
- quote (string, used when layout is "quote")
- author (string, used with quote layout)

Guidelines:
- First slide: use "title-only" as a strong title card
- Last slide: use "title-only" as a call-to-action or summary
- Mix layouts for visual variety
- Keep titles under 8 words, body under 30 words
- Return ONLY the JSON array, no other text"""


def _build_user_prompt(topic: str, num_slides: int) -> str:
    return f'Create {num_slides} carousel slides about: "{topic}". Return only the JSON array.'


def _parse_slides(raw: str) -> list[GeneratedSlide]:
    raw = raw.strip()
    if raw.startswith("```"):
        raw = raw.split("\n", 1)[1]
        raw = raw.rsplit("```", 1)[0]
    data = json.loads(raw)
    return [GeneratedSlide(**item) for item in data]


class AiService:
    @staticmethod
    def generate_with_openai(api_key: str, topic: str, num_slides: int) -> list[GeneratedSlide]:
        client = openai.OpenAI(api_key=api_key)
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": _build_user_prompt(topic, num_slides)},
            ],
            temperature=0.7,
        )
        raw = response.choices[0].message.content or ""
        return _parse_slides(raw)

    @staticmethod
    def generate_with_anthropic(api_key: str, topic: str, num_slides: int) -> list[GeneratedSlide]:
        client = anthropic_sdk.Anthropic(api_key=api_key)
        message = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=2048,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": _build_user_prompt(topic, num_slides)}],
        )
        raw = message.content[0].text if message.content else ""
        return _parse_slides(raw)

    @staticmethod
    def generate_with_gemini(api_key: str, topic: str, num_slides: int) -> list[GeneratedSlide]:
        if not GEMINI_AVAILABLE:
            raise RuntimeError("google-generativeai is not installed. Run: pip install google-generativeai")
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel(
            model_name="gemini-1.5-pro",
            system_instruction=SYSTEM_PROMPT,
        )
        response = model.generate_content(_build_user_prompt(topic, num_slides))
        raw = response.text or ""
        return _parse_slides(raw)

    @staticmethod
    def generate(
        encrypted_key: str,
        provider: str,
        topic: str,
        num_slides: int,
    ) -> list[GeneratedSlide]:
        api_key = CryptoService.decrypt(encrypted_key)
        provider_lower = provider.lower()
        if provider_lower == "anthropic":
            return AiService.generate_with_anthropic(api_key, topic, num_slides)
        if provider_lower == "gemini":
            return AiService.generate_with_gemini(api_key, topic, num_slides)
        return AiService.generate_with_openai(api_key, topic, num_slides)
