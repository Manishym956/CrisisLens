import re

PANIC_KEYWORDS = [
    "bomb", "kill", "virus", "lockdown", "riot", "fraud", "scam",
    "deadly", "explosion", "terror", "attack", "emergency", "crisis",
    "collapse", "market crash", "blood", "gun", "shooting"
]

POLITICAL_KEYWORDS = [
    "election", "vote", "president", "minister", "government", "parliament",
    "fraud", "rigged", "campaign", "ballot", "democrat", "republican",
    "corruption", "bribe", "protest"
]

class ThreatRanker:
    def _analyze_keywords(self, text: str, keywords: list[str]) -> tuple[float, list[str]]:
        text_lower = text.lower()
        matched = []
        for kw in keywords:
            if re.search(rf"\b{kw}\b", text_lower):
                matched.append(kw)
        
        # Max score is 1.0 if 3 or more keywords match
        score = min(len(matched) / 3.0, 1.0)
        return score, matched

    def rank_threat(self, text: str, virality_score: float) -> dict:
        panic_score, matched_panic = self._analyze_keywords(text, PANIC_KEYWORDS)
        political_score, matched_pol = self._analyze_keywords(text, POLITICAL_KEYWORDS)

        # Weights architecture:
        # Panic/Safety threat is highest priority (40%)
        # Political sensitivity is high priority (30%)
        # Virality multiplies the threat (30%)
        
        total_threat = (panic_score * 0.4) + (political_score * 0.3) + (virality_score * 0.3)
        
        # Determine ranking on a 1 to 10 scale (1 = Most Critical, 10 = Least Critical)
        # We invert the 0.0 -> 1.0 total_threat score:
        # total_threat 1.0 -> Rank 1
        # total_threat 0.0 -> Rank 10
        raw_rank = 10 - (total_threat * 9)
        final_rank = max(1, min(10, round(raw_rank)))
        
        # Determine Classification based on the 1-10 rank
        if final_rank <= 3:
            classification = "CRITICAL"
        elif final_rank <= 5:
            classification = "HIGH"
        elif final_rank <= 8:
            classification = "MEDIUM"
        else:
            classification = "LOW"
            
        return {
            "panic_score": round(panic_score, 2),
            "political_score": round(political_score, 2),
            "virality_score": round(virality_score, 2),
            "total_threat_score": final_rank, # Now passing the 1-10 rank
            "raw_threat_probability": round(total_threat, 2), # Keep the raw 0-1 probability for analytics if needed
            "risk_classification": classification,
            "matched_panic_keywords": matched_panic,
            "matched_political_keywords": matched_pol
        }

threat_ranker = ThreatRanker()
