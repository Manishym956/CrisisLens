"""
seed_from_csv.py
-----------------
Seeds MongoDB `analyzed_news` using local `Fake.csv` + `True.csv`.

This is a fast, offline-friendly alternative to the RSS-based seeder.

Example:
  python seed_from_csv.py --fake-limit 100 --real-limit 100 --clear
"""

from __future__ import annotations

import argparse
import asyncio
import csv
import random
from datetime import datetime, timezone
from pathlib import Path

from core.config import settings
from core.logger import logger
from services.threat_ranker import threat_ranker


CSV_COLUMNS_CANDIDATES = ["text", "content", "body", "news_text"]


def _get_text_col(row: dict) -> str:
    for k in CSV_COLUMNS_CANDIDATES:
        v = row.get(k)
        if v and str(v).strip():
            return str(v)
    # Fallback: scan any value that looks like a big text field.
    for v in row.values():
        if v and len(str(v)) > 50:
            return str(v)
    return ""


def load_labeled_rows(csv_path: Path, *, is_fake: bool, limit: int, rng: random.Random) -> list[dict]:
    """
    Stream rows from CSV and return at most `limit` docs.
    We keep it simple (first N after shuffle-by-iteration not needed for MVP).
    """
    docs: list[dict] = []
    with csv_path.open("r", encoding="utf-8", errors="ignore", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            text = _get_text_col(row)
            if not text:
                continue

            title = (row.get("title") or "").strip()[:160] or text[:160]
            docs.append(
                {
                    "news_text": text,
                    "title": title,
                    "is_fake": is_fake,
                }
            )
            if len(docs) >= limit:
                break
    rng.shuffle(docs)  # mix Fake/True ordering when we later interleave
    return docs


async def seed_mongodb(docs: list[dict], *, clear: bool) -> int:
    from motor.motor_asyncio import AsyncIOMotorClient

    client = AsyncIOMotorClient(settings.MONGO_URI)
    collection = client[settings.MONGO_DB_NAME]["analyzed_news"]

    if clear:
        await collection.delete_many({})

    if not docs:
        logger.warning("[CSV SEED] No docs provided.")
        return 0

    now = datetime.now(timezone.utc)
    insert_docs = []

    for idx, item in enumerate(docs):
        # virality_score drives the keyword-weighted threat ranking
        virality_score = max(0.05, min(0.99, round(random.uniform(0.2, 0.95), 3)))

        threat = threat_ranker.rank_threat(item["news_text"], virality_score=virality_score)
        confidence = 0.95 if item["is_fake"] else 0.05

        insert_docs.append(
            {
                "news_text": item["news_text"],
                "title": item["title"],
                "virality_score": virality_score,
                "source": "csv_fake" if item["is_fake"] else "csv_true",
                "source_url": "",
                "created_at": now,
                "verification_result": {
                    "consensus": {
                        "is_fake": item["is_fake"],
                        "fake_votes": 2 if item["is_fake"] else 0,
                        "total_votes": 3,
                    },
                    "confidence": confidence,
                    "openai": {
                        "is_fake": item["is_fake"],
                        "confidence_score": confidence,
                        "reasoning": "Seeded from CSV label (offline).",
                    },
                    "gemini": None,
                    "groq": None,
                },
                "threat_ranking": threat,
                "seeded": True,
            }
        )

    result = await collection.insert_many(insert_docs)
    inserted = len(result.inserted_ids)
    logger.info(f"[CSV SEED] Inserted {inserted} documents into MongoDB.")

    client.close()
    return inserted


async def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--fake-limit", type=int, default=100)
    parser.add_argument("--real-limit", type=int, default=100)
    parser.add_argument("--clear", action="store_true", help="Delete existing analyzed_news first")
    parser.add_argument("--seed", type=int, default=42)
    args = parser.parse_args()

    rng = random.Random(args.seed)
    base_dir = Path(__file__).parent
    fake_csv = base_dir / "Fake.csv"
    true_csv = base_dir / "True.csv"

    if not fake_csv.exists() or not true_csv.exists():
        raise FileNotFoundError(
            f"Missing CSV files. Expected: {fake_csv} and {true_csv}"
        )

    fake_docs = load_labeled_rows(fake_csv, is_fake=True, limit=args.fake_limit, rng=rng)
    real_docs = load_labeled_rows(true_csv, is_fake=False, limit=args.real_limit, rng=rng)

    # Interleave to reduce any obvious ordering effects
    mixed_docs: list[dict] = []
    for i in range(max(len(fake_docs), len(real_docs))):
        if i < len(fake_docs):
            mixed_docs.append(fake_docs[i])
        if i < len(real_docs):
            mixed_docs.append(real_docs[i])

    inserted = await seed_mongodb(mixed_docs, clear=args.clear)
    print(f"CSV seeding complete. Inserted: {inserted}")


if __name__ == "__main__":
    asyncio.run(main())

