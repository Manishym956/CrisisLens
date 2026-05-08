import asyncio, sys, json
sys.path.insert(0, '.')
from core.config import settings

news = "Government secretly replaced tap water with mind-control chemicals to suppress protests."

async def test_all():
    # Test Groq llama-3.1-8b-instant (Groq slot)
    try:
        from groq import AsyncGroq
        client = AsyncGroq(api_key=settings.GROQ_API_KEY)
        r = await client.chat.completions.create(
            model="llama-3.1-8b-instant",
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": "You are a fact-checking assistant. Output JSON only."},
                {"role": "user", "content": f'Analyze: "{news}". Respond with: {{"is_fake": true/false, "reasoning": "str", "confidence_score": 0.95}}'}
            ]
        )
        print("GROQ llama-3.1-8b-instant OK:", r.choices[0].message.content[:150])
    except Exception as e:
        print("GROQ ERROR:", e)

    # Test Gemini 2.5-flash
    try:
        import google.generativeai as genai
        import warnings
        warnings.filterwarnings("ignore")
        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = await asyncio.to_thread(
            model.generate_content,
            f'Analyze: "{news}". Respond ONLY with JSON: {{"is_fake": true/false, "reasoning": "str", "confidence_score": 0.95}}'
        )
        print("GEMINI 2.5-flash OK:", response.text[:150])
    except Exception as e:
        print("GEMINI ERROR:", e)

asyncio.run(test_all())
