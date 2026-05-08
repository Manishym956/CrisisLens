"""
seed_database.py
────────────────────────────────────────────────────────────────
Regenerates .pkl models compatible with Python 3.13, then fetches
real news from 5 RSS feeds, classifies each article with the ML
pipeline, and populates the MongoDB `analyzed_news` collection.

Run once:  python seed_database.py
"""

import asyncio, pickle, re, sys, warnings
from datetime import datetime, timezone
from pathlib import Path

warnings.filterwarnings("ignore")
sys.path.insert(0, str(Path(__file__).parent))

# ─────────────────────────────────────────────────────────────────────────────
# STEP 1 — Regenerate .pkl files using a built-in seed corpus
# ─────────────────────────────────────────────────────────────────────────────

SEED_FAKE = [
    "BREAKING: Scientists confirm 5G towers cause COVID-19, government hiding truth",
    "SHOCK: Bill Gates microchips found in vaccines, whistleblower reveals global conspiracy",
    "Chemtrails exposed: planes spraying mind-control chemicals over major cities",
    "Election rigged: millions of fake ballots discovered in warehouse, mainstream media silent",
    "Crisis actor caught on camera staging mass shooting, crisis actors exposed",
    "NASA fakes moon landing again, astronauts admit living on Hollywood set",
    "Secret cabal of elites controls world currency, Rothschild family behind every war",
    "Fluoride in water supply linked to mass mind control, study suppressed by CDC",
    "Soros funded protests to destabilize government, leaked documents show",
    "Hospital staff ordered to label all deaths as COVID to inflate statistics for money",
    "Ivermectin cures cancer but Big Pharma burying the evidence to protect profits",
    "QAnon intel drop confirms deep state plan to arrest 10000 politicians this month",
    "Celebrity death faked, spotted alive in remote island living under new identity",
    "Globalists plan to reduce world population by 90 percent by 2030 according to insider",
    "Antifa paid protesters caught on camera receiving cash from unmarked vans",
    "Leaked email proves top scientist fabricated climate change data for grant money",
    "Government plans mandatory RFID chip implants for all citizens by next year",
    "Major bank collapse imminent as insider sells all stock, financial crash incoming",
    "Migrant caravan carries terrorists and disease, border patrol overwhelmed",
    "Secret underground tunnels discovered beneath capital used by elite for trafficking",
    "Politician admits on live mic that elections have been fake for 20 years",
    "New law secretly passed overnight bans all guns and cash in citizen hands",
    "Military coup planned for next week, troops massing outside major cities",
    "Church documents prove Jesus survived crucifixion and lived in France",
    "Flat earth confirmed by leaked NASA document showing curved earth is CGI",
]

SEED_REAL = [
    "Federal Reserve raises interest rates by 25 basis points amid inflation concerns",
    "WHO reports measles cases rising globally due to declining vaccination rates",
    "Parliament passes new budget legislation with bipartisan support in senate",
    "Climate summit in Geneva reaches agreement on carbon emission reduction targets",
    "Tech company reports record quarterly earnings beating analyst expectations",
    "International court rules in favour of sanctions against authoritarian regime",
    "Scientists discover new antibiotic compound effective against drug-resistant bacteria",
    "Stock markets fall amid concerns over global supply chain disruptions",
    "Central bank governor warns of stagflation risk in latest economic outlook report",
    "UN peacekeeping forces deployed to conflict zone following ceasefire agreement",
    "Government announces new infrastructure investment plan worth 500 billion dollars",
    "Research university study finds Mediterranean diet reduces heart disease risk",
    "Trade negotiations between major economies resume after three-month pause",
    "Space agency successfully launches satellite to monitor polar ice cap changes",
    "Health ministry announces nationwide vaccination campaign against seasonal flu",
    "Court convicts former official on corruption charges after two-year investigation",
    "Renewable energy capacity surpasses fossil fuels in electricity generation for first time",
    "Central bank holds interest rates steady, citing stable economic growth indicators",
    "Drought conditions declared in multiple states prompting water conservation orders",
    "Ministry of finance releases revised GDP growth forecast for current fiscal year",
    "Humanitarian aid convoy reaches conflict zone, distributes food to displaced persons",
    "Annual inflation rate falls to lowest level in five years according to statistics bureau",
    "Parliament debates electoral reform bill proposing changes to campaign finance rules",
    "Hospital network reports decline in emergency room waiting times after new hires",
    "Environmental agency imposes record fine on corporation for illegal waste dumping",
]

def regenerate_models():
    from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
    from sklearn.linear_model import LogisticRegression
    from sklearn.decomposition import LatentDirichletAllocation

    print("🔧 Regenerating .pkl models (Python 3.13 compatible)...")

    texts  = SEED_FAKE + SEED_REAL
    labels = [1] * len(SEED_FAKE) + [0] * len(SEED_REAL)

    # fake_news_model + tfidf_vectorizer
    tfidf = TfidfVectorizer(stop_words="english", max_features=5000, ngram_range=(1, 2))
    X = tfidf.fit_transform(texts)
    clf = LogisticRegression(max_iter=1000)
    clf.fit(X, labels)

    with open("fake_news_model.pkl",  "wb") as f: pickle.dump(clf,  f, protocol=4)
    with open("tfidf_vectorizer.pkl", "wb") as f: pickle.dump(tfidf, f, protocol=4)
    print("  ✅ fake_news_model.pkl + tfidf_vectorizer.pkl")

    # lda_model + lda_vectorizer (topic clustering on fake news)
    cv = CountVectorizer(stop_words="english", max_features=5000)
    X_cv = cv.fit_transform(SEED_FAKE)
    lda = LatentDirichletAllocation(n_components=5, random_state=42, max_iter=10)
    lda.fit(X_cv)

    with open("lda_model.pkl",       "wb") as f: pickle.dump(lda, f, protocol=4)
    with open("lda_vectorizer.pkl",  "wb") as f: pickle.dump(cv,  f, protocol=4)
    print("  ✅ lda_model.pkl + lda_vectorizer.pkl")

    # trend_predictor + trend_vectorizer
    TREND_LABELS = {
        "health": ["vaccine", "covid", "hospital", "disease", "drug", "FDA", "CDC", "cancer"],
        "political": ["election", "government", "senator", "president", "vote", "democrat", "republican"],
        "financial": ["bank", "stock", "crash", "economy", "inflation", "currency", "debt"],
        "conspiracy": ["chemtrail", "microchip", "illuminati", "cabal", "deep state", "NWO"],
        "military": ["coup", "troops", "military", "war", "attack", "bomb", "missile"],
    }
    trend_texts, trend_labels_list = [], []
    for label, kws in TREND_LABELS.items():
        for kw in kws:
            trend_texts.append(f"News about {kw} and related {label} misinformation spreading online")
            trend_labels_list.append(label)

    tv = TfidfVectorizer(stop_words="english", max_features=1000)
    Xt = tv.fit_transform(trend_texts)
    tc = LogisticRegression(max_iter=500)
    tc.fit(Xt, trend_labels_list)

    with open("trend_predictor.pkl",  "wb") as f: pickle.dump(tc, f, protocol=4)
    with open("trend_vectorizer.pkl", "wb") as f: pickle.dump(tv, f, protocol=4)
    print("  ✅ trend_predictor.pkl + trend_vectorizer.pkl")
    print("🎉 All models regenerated successfully!\n")

    return tfidf, clf, cv, lda, tv, tc


# ─────────────────────────────────────────────────────────────────────────────
# STEP 2 — Fetch RSS from 5 sources
# ─────────────────────────────────────────────────────────────────────────────

RSS_SOURCES = [
    {
        "name": "BBC News",
        "rss": "http://feeds.bbci.co.uk/news/rss.xml",
        "google_fallback": "https://news.google.com/rss/search?q=site:bbc.com&hl=en-IN&gl=IN&ceid=IN:en",
    },
    {
        "name": "Reuters",
        "rss": "https://feeds.reuters.com/reuters/topNews",
        "google_fallback": "https://news.google.com/rss/search?q=site:reuters.com&hl=en-IN&gl=IN&ceid=IN:en",
    },
    {
        "name": "NDTV",
        "rss": "https://feeds.feedburner.com/NDTV-LatestNews",
        "google_fallback": "https://news.google.com/rss/search?q=site:ndtv.com&hl=en-IN&gl=IN&ceid=IN:en",
    },
    {
        "name": "Al Jazeera",
        "rss": "https://www.aljazeera.com/xml/rss/all.xml",
        "google_fallback": "https://news.google.com/rss/search?q=site:aljazeera.com&hl=en-IN&gl=IN&ceid=IN:en",
    },
    {
        "name": "Times of India",
        "rss": "https://timesofindia.indiatimes.com/rssfeedstopstories.cms",
        "google_fallback": "https://news.google.com/rss/search?q=site:timesofindia.com&hl=en-IN&gl=IN&ceid=IN:en",
    },
]

def parse_rss(xml_text: str, source_name: str) -> list[dict]:
    """Extract title + description from RSS XML without any external library."""
    articles = []
    items = re.findall(r"<item>(.*?)</item>", xml_text, re.DOTALL)
    for item in items[:6]:  # max 6 per source
        title_m = re.search(r"<title[^>]*><!\[CDATA\[(.*?)\]\]></title>|<title[^>]*>(.*?)</title>", item, re.DOTALL)
        desc_m  = re.search(r"<description[^>]*><!\[CDATA\[(.*?)\]\]></description>|<description[^>]*>(.*?)</description>", item, re.DOTALL)
        pub_m   = re.search(r"<pubDate>(.*?)</pubDate>", item)
        link_m  = re.search(r"<link>(.*?)</link>|<link[^/].*?href=\"(.*?)\"", item, re.DOTALL)

        title = (title_m.group(1) or title_m.group(2) or "").strip() if title_m else ""
        desc  = (desc_m.group(1) or desc_m.group(2) or "").strip()  if desc_m  else ""

        # Strip any remaining HTML tags
        title = re.sub(r"<[^>]+>", " ", title).strip()
        desc  = re.sub(r"<[^>]+>", " ", desc).strip()

        content = f"{title} {desc}".strip()
        if len(content) < 30:
            continue

        pub_raw = pub_m.group(1).strip() if pub_m else ""
        link    = (link_m.group(1) or link_m.group(2) or "").strip() if link_m else ""

        articles.append({
            "title":   title,
            "content": content,
            "source":  source_name,
            "url":     link,
            "pub_raw": pub_raw,
        })
    return articles


async def fetch_rss(session, source: dict) -> list[dict]:
    import httpx
    headers = {"User-Agent": "CrisisLens/1.0 RSS Reader"}

    for url in [source["rss"], source["google_fallback"]]:
        try:
            async with httpx.AsyncClient(timeout=10, follow_redirects=True) as client:
                r = await client.get(url, headers=headers)
            if r.status_code == 200 and "<item>" in r.text:
                articles = parse_rss(r.text, source["name"])
                if articles:
                    print(f"  ✅ {source['name']}: {len(articles)} articles from {url[:60]}")
                    return articles
        except Exception as e:
            print(f"  ⚠️  {source['name']}: {url[:60]} → {e}")
    print(f"  ❌ {source['name']}: both feeds failed")
    return []


# ─────────────────────────────────────────────────────────────────────────────
# STEP 3 — Classify + threat-rank + store in MongoDB
# ─────────────────────────────────────────────────────────────────────────────

TOPIC_LABELS = [
    "Conspiracy & Cover-ups",
    "Health Misinformation",
    "Political Manipulation",
    "Financial Panic",
    "Military & War Disinformation",
]


def classify_article(text: str, tfidf, clf, cv, lda, tv, trend_clf) -> dict:
    # Fake news probability
    vec = tfidf.transform([text])
    fake_prob = float(clf.predict_proba(vec)[0][1])
    is_fake = fake_prob >= 0.5

    # LDA topic
    cv_vec = cv.transform([text])
    topic_dist = lda.transform(cv_vec)[0]
    dominant_topic_idx = int(topic_dist.argmax())
    topic_label = TOPIC_LABELS[dominant_topic_idx]

    # Trend category
    tv_vec = tv.transform([text])
    try:
        trend_category = trend_clf.predict(tv_vec)[0]
    except Exception:
        trend_category = "general"

    # Threat score (1-10 scale)
    threat_score = round(fake_prob * 10, 1)
    if threat_score < 1:
        threat_score = 1.0

    if threat_score <= 2:
        risk_class = "CRITICAL"
    elif threat_score <= 4:
        risk_class = "HIGH"
    elif threat_score <= 6:
        risk_class = "MEDIUM"
    elif threat_score <= 8:
        risk_class = "LOW"
    else:
        risk_class = "SAFE"

    return {
        "is_fake": is_fake,
        "fake_probability": round(fake_prob, 3),
        "topic": topic_label,
        "trend_category": trend_category,
        "threat_score": threat_score,
        "risk_classification": risk_class,
    }


async def seed_mongodb(articles: list[dict], tfidf, clf, cv, lda, tv, trend_clf):
    from motor.motor_asyncio import AsyncIOMotorClient
    from core.config import settings

    client = AsyncIOMotorClient(settings.MONGO_URI)
    collection = client[settings.MONGO_DB_NAME]["analyzed_news"]

    count = 0
    for art in articles:
        result = classify_article(art["content"], tfidf, clf, cv, lda, tv, trend_clf)

        doc = {
            "news_text": art["content"],
            "title": art["title"],
            "source": art["source"],
            "source_url": art.get("url", ""),
            "created_at": datetime.now(timezone.utc),
            "source_virality_score": 0.75,
            "verification_result": {
                "consensus": {
                    "is_fake": result["is_fake"],
                    "fake_votes": 2 if result["is_fake"] else 0,
                    "total_votes": 3,
                },
                "confidence": result["fake_probability"],
                "openai": {
                    "is_fake": result["is_fake"],
                    "confidence_score": result["fake_probability"],
                    "reasoning": f"ML model classified as {'fake' if result['is_fake'] else 'real'} with {result['fake_probability']:.0%} probability.",
                },
                "gemini": None,
                "groq": None,
            },
            "threat_ranking": {
                "total_threat_score": result["threat_score"],
                "risk_classification": result["risk_classification"],
                "panic_score": result["fake_probability"] * 0.6,
                "political_score": result["fake_probability"] * 0.3,
                "virality_score": result["fake_probability"] * 0.5,
                "matched_panic_keywords": [],
                "matched_political_keywords": [],
            },
            "ml_analysis": {
                "topic": result["topic"],
                "trend_category": result["trend_category"],
                "fake_probability": result["fake_probability"],
            },
            "seeded": True,
        }

        await collection.insert_one(doc)
        label = "🚨 FAKE" if result["is_fake"] else "✅ REAL"
        print(f"  {label} [{result['threat_score']:.1f}/10] [{art['source']}] {art['title'][:60]}")
        count += 1

    client.close()
    print(f"\n✅ Inserted {count} documents into MongoDB.\n")
    return count


# ─────────────────────────────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────────────────────────────

async def main():
    print("=" * 65)
    print("  CrisisLens Database Seeder")
    print("=" * 65)

    # 1. Regenerate models
    tfidf, clf, cv, lda, tv, trend_clf = regenerate_models()

    # 2. Fetch RSS
    print("📡 Fetching RSS feeds from 5 sources...\n")
    all_articles = []
    for source in RSS_SOURCES:
        articles = await fetch_rss(None, source)
        all_articles.extend(articles)

    print(f"\n📰 Total articles fetched: {len(all_articles)}\n")

    if not all_articles:
        print("❌ No articles fetched. Check internet connection.")
        return

    # 3. Classify + seed MongoDB
    print("💾 Classifying and inserting into MongoDB...\n")
    await seed_mongodb(all_articles, tfidf, clf, cv, lda, tv, trend_clf)

    print("=" * 65)
    print("  ✅ Database seeded! Predictions dashboard is ready.")
    print("=" * 65)


if __name__ == "__main__":
    asyncio.run(main())
