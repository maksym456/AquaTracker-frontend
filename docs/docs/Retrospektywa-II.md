
# 2. Retrospektywa Sprintu nr 5 (Etap Środkowy)

**Kontekst:** Integracja Frontendu z Backendem, prawdziwe dane.

- **Data:** 2025-11-23
- **Uczestnicy:** 

## 1. Co poszło dobrze? (What went well)
- ✓ Aplikacja wyświetla prawdziwe dane o roślinach zamiast "Lorem Ipsum".
- ✓ Ikonki roślin przygotowane przez Natalię wyglądają świetnie na frontendzie.
- ✓ Naprawiono błąd UI z chowającymi się przyciskami na systemie Windows.

## 2. Co można poprawić? (What could be improved)
- ✗ **Integracja trwała dłużej niż zakładano:** Endpointy zwracały błędy, gdy baza była pusta.
- ✗ **Formatowanie tekstu:** Opisy roślin w bazie były za długie i "rozjeżdżały" tabelkę w widoku.

## 3. Dyskusja i wnioski
**Główny problem:** Aplikacja jest niestabilna przy pustej bazie danych (Edge cases).

**Analiza:**
> Dlaczego aplikacja się wywalała? → Frontend zakładał, że zawsze dostanie listę, a dostawał `null`.
> Dlaczego dostawał `null`? → Bo na środowisku lokalnym dewelopera baza była pusta.
> **Wniosek:** Musimy lepiej obsługiwać puste stany (empty states).

## 4. Plan działania (Action Items)
1. **Obsługa błędów API**
    - *Co:* Dodać obsługę kodów 404/500 oraz komunikat "Brak danych" zamiast białego ekranu.
    - *Kto:* Jakub137

---