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
        
        # Determine Classification
        if total_threat >= 0.75:
            classification = "CRITICAL"
        elif total_threat >= 0.50:
            classification = "HIGH"
        elif total_threat >= 0.25:
            classification = "MEDIUM"
        else:
            classification = "LOW"
            
        return {
            "panic_score": round(panic_score, 2),
            "political_score": round(political_score, 2),
            "virality_score": round(virality_score, 2),
            "total_threat_score": round(total_threat, 2),
            "risk_classification": classification,
            "matched_panic_keywords": matched_panic,
            "matched_political_keywords": matched_pol
        }

threat_ranker = ThreatRanker()
