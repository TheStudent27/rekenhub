import json
import re
from datetime import datetime
from urllib.request import Request, urlopen
from bs4 import BeautifulSoup


def scrape_pagina(url: str, output_bestand: str = "scraped_data.json") -> None:
    """
    Haalt koppen, tabellen, eurobedragen en percentages van een webpagina
    en slaat alles gestructureerd op als JSON-bestand.
    """
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
        )
    }

    print(f"Ophalen van: {url} ...")
    req = Request(url, headers=headers)
    with urlopen(req, timeout=15) as response:
        html = response.read().decode("utf-8", errors="ignore")

    soup = BeautifulSoup(html, "html.parser")
    volledige_tekst = soup.get_text(" ", strip=True)

    # 1. Koppen (H1, H2, H3)
    koppen = []
    for tag in soup.find_all(["h1", "h2", "h3"]):
        tekst = tag.get_text(" ", strip=True)
        if tekst:
            koppen.append({"niveau": tag.name.upper(), "tekst": tekst})

    # 2. Tabellen uitlezen (handig voor barema's, btw- of belastingtabellen)
    tabellen = []
    for idx, table in enumerate(soup.find_all("table"), start=1):
        rijen = []
        for tr in table.find_all("tr"):
            cellen = [td.get_text(" ", strip=True) for td in tr.find_all(["th", "td"])]
            if any(cellen):
                rijen.append(cellen)
        if rijen:
            tabellen.append({"tabel_nr": idx, "rijen": rijen})

    # 3. Eurobedragen en percentages filteren
    bedragen = sorted(set(re.findall(r"€\s?\d+(?:[.,]\d+)?", volledige_tekst)))
    percentages = sorted(set(re.findall(r"\d+(?:[.,]\d+)?\s?%", volledige_tekst)))

    resultaat = {
        "bron_url": url,
        "opgehaald_op": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "pagina_titel": soup.title.string.strip() if soup.title and soup.title.string else "",
        "aantal_tabellen": len(tabellen),
        "gevonden_bedragen": bedragen,
        "gevonden_percentages": percentages,
        "koppen": koppen[:40],
        "tabellen": tabellen,
    }

    with open(output_bestand, "w", encoding="utf-8") as f:
        json.dump(resultaat, f, ensure_ascii=False, indent=2)

    print(f"Klaar! Opgeslagen in '{output_bestand}' ({len(tabellen)} tabellen, {len(bedragen)} bedragen).")


if __name__ == "__main__":
    # Pas hieronder de URL aan naar de pagina die je wilt uitlezen:
    doel_url = "https://www.rijksoverheid.nl/onderwerpen/minimumloon/bedragen-minimumloon"
    scrape_pagina(doel_url, "scraped_data.json")