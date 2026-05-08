import httpx
import re
from urllib.parse import urlparse
from core.logger import logger
from services.ai_verifier import ai_verifier

# Known reliable news domains (partial list for scoring)
TRUSTED_DOMAINS = {
    "bbc.com", "bbc.co.uk", "reuters.com", "apnews.com", "theguardian.com",
    "nytimes.com", "washingtonpost.com", "thehindus.com", "thehindu.com",
    "ndtv.com", "timesofindia.com", "economist.com", "bloomberg.com",
    "forbes.com", "nature.com", "who.int", "cdc.gov", "nih.gov",
    "gov.in", "pib.gov.in", "wikipedia.org", "britannica.com"
}

SUSPICIOUS_PATTERNS = [
    r"(\d{1,3}\.){3}\d{1,3}",          # Raw IP address as domain
    r"[a-z0-9]{20,}\.(com|net|org)",    # Random long subdomain
    r"(free|win|click|earn|prize)\.",    # Spam-like prefixes
]

SUSPICIOUS_TLDS = {".xyz", ".tk", ".ml", ".ga", ".cf", ".click", ".link", ".download"}


class URLVerifierService:

    def _analyze_domain(self, url: str) -> dict:
        """Score the domain purely on structural signals — no external calls."""
        try:
            parsed = urlparse(url if url.startswith("http") else "https://" + url)
            domain = parsed.netloc.lower().replace("www.", "")
            tld = "." + domain.rsplit(".", 1)[-1] if "." in domain else ""
        except Exception:
            return {"domain": url, "trust_score": 0, "signals": ["Invalid URL format"]}

        signals = []
        trust_score = 50  # neutral start

        # Trusted domain list
        base = ".".join(domain.split(".")[-2:])
        if base in TRUSTED_DOMAINS:
            trust_score += 40
            signals.append("✅ Recognised reputable news domain")

        # HTTPS check
        if parsed.scheme == "https":
            trust_score += 5
            signals.append("✅ Secure HTTPS connection")
        else:
            trust_score -= 15
            signals.append("⚠️ Insecure HTTP (no SSL)")

        # Suspicious TLD
        if tld in SUSPICIOUS_TLDS:
            trust_score -= 30
            signals.append(f"🚨 Suspicious TLD: {tld}")

        # Suspicious patterns in domain
        for pat in SUSPICIOUS_PATTERNS:
            if re.search(pat, domain):
                trust_score -= 20
                signals.append("🚨 Domain matches suspicious pattern")
                break

        # Subdomain depth (e.g. news.real.legit.fakery.com)
        parts = domain.split(".")
        if len(parts) > 4:
            trust_score -= 10
            signals.append("⚠️ Excessive subdomain depth")

        trust_score = max(0, min(100, trust_score))
        return {"domain": domain, "trust_score": trust_score, "signals": signals}

    async def fetch_page_text(self, url: str) -> str:
        """Fetch the URL and strip HTML to extract readable text."""
        headers = {
            "User-Agent": "Mozilla/5.0 (compatible; CrisisLens/1.0; +https://crisislens.ai)"
        }
        try:
            async with httpx.AsyncClient(follow_redirects=True, timeout=10.0) as client:
                response = await client.get(url, headers=headers)
                html = response.text

            # Strip HTML tags and collapse whitespace
            text = re.sub(r"<style[^>]*>.*?</style>", " ", html, flags=re.DOTALL)
            text = re.sub(r"<script[^>]*>.*?</script>", " ", text, flags=re.DOTALL)
            text = re.sub(r"<[^>]+>", " ", text)
            text = re.sub(r"\s+", " ", text).strip()

            # Return first 2000 chars — enough for AI to judge content quality
            return text[:2000]
        except Exception as e:
            logger.warning(f"[URL FETCH] Failed to fetch {url}: {e}")
            return ""

    async def verify_url(self, url: str) -> dict:
        """Full URL verification pipeline: domain analysis + content AI verification."""
        # 1. Domain signal analysis (instant, no network needed)
        domain_result = self._analyze_domain(url)

        # 2. Fetch page content
        logger.info(f"[URL VERIFY] Fetching content from: {url}")
        page_text = await self.fetch_page_text(url)

        content_available = bool(page_text and len(page_text) > 100)

        # 3. AI verification on the page content (if fetchable)
        ai_result = None
        if content_available:
            # Prepend URL context so AI can factor in the source
            analysis_text = (
                f"URL: {url}\n\n"
                f"Page Content Excerpt:\n{page_text}"
            )
            ai_result = await ai_verifier.run_verification(analysis_text)
        else:
            # AI can still score based on URL/domain alone
            ai_result = await ai_verifier.run_verification(
                f"Assess the credibility of this URL and website: {url}. "
                f"Domain: {domain_result['domain']}. "
                f"The page content could not be fetched (blocked or unavailable). "
                f"Judge based on the domain name and URL structure only."
            )

        # 4. Composite legitimacy score
        domain_score = domain_result["trust_score"]
        ai_confidence = ai_result.get("confidence", 0.5)
        ai_is_fake = ai_result.get("consensus", {}).get("is_fake", False)

        # If AI says it's fake, penalise domain trust; if real, boost it
        ai_adjustment = -20 if ai_is_fake else +15
        final_score = max(0, min(100, domain_score + int(ai_confidence * ai_adjustment)))

        if final_score >= 70:
            legitimacy = "LEGITIMATE"
        elif final_score >= 40:
            legitimacy = "SUSPICIOUS"
        else:
            legitimacy = "UNRELIABLE"

        return {
            "url": url,
            "domain": domain_result["domain"],
            "legitimacy": legitimacy,
            "trust_score": final_score,
            "domain_signals": domain_result["signals"],
            "content_fetched": content_available,
            "ai_verification": ai_result,
        }


url_verifier_service = URLVerifierService()
