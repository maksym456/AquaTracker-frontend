
---

# 1. Retrospektywa Sprintu nr 2 (Etap Wczesny)

**Kontekst:** Pierwsze próby połączenia z bazą i wystawienie API.

- **Data:** 2025-11-02
- **Uczestnicy:** Wszyscy członkowie zespołu

## 1. Co poszło dobrze? (What went well)
- ✓ Udało się nawiązać połączenie z kodem (zadanie Roberta).
- ✓ Mamy zarysowany podstawowy design podstron, zespół wie, jak aplikacja ma wyglądać.
- ✓ Komunikacja na Slacku/Discordzie była bardzo szybka przy konfiguracji środowiska.

## 2. Co można poprawić? (What could be improved)
- ✗ **Problemy z dostępem do bazy danych:** Straciliśmy dużo czasu na przesyłanie sobie haseł i connection stringów, nie każdy mógł się połączyć od razu.
- ✗ **Niejasne API:** Nie było do końca jasne, jakie dane dokładnie ma zwracać "podstawowe REST API" dla Kuby, co wymusiło zgadywanie.

## 3. Dyskusja i wnioski
**Główny problem:** Niejasna struktura danych zwracanych przez API (Frontend vs Backend).

**Analiza (5 Whys):**
> Dlaczego API nie pasowało frontendowi? → Bo Backend pisał logikę, a Frontend widok oddzielnie.
> Dlaczego robili to oddzielnie? → Bo nie ustalili kontraktu (JSON-a) przed rozpoczęciem pracy.
> **Wniosek:** Musimy ustalać wygląd JSON-a zanim napiszemy kod.

## 4. Plan działania (Action Items)
1. **Dokumentacja Endpointów**
    - *Co:* Przed kodowaniem Backend wrzuca na czat przykładowy JSON, a Frontend go akceptuje.
    - *Kto:* Robertkuzba & Jakub137

---