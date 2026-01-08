# PRD: System Zarządzania Domowym Akwarium 
---
- **Data:** [2025-10-30]
- **Status:** [Zatwierdzony]
- **Zespół:** [Backend Team: Maksym Wilk, Robert Kuźba, Frontend Team: Jakub Janiec, Natalia Klimaszewska, Tester Team: Bartosz Dobroś, Natalia Klimaszewska]

---

## 1. Podsumowanie
---
System Zarządzania Domowym Akwarium to prosty i intuicyjny system, który pomaga użytkownikom zarządzać domowym akwarium. Łączy entuzjastów, początkujących oraz profesjonalistów akwarystki. Wspiera użytkowników przy prowadzeniu „zdrowego” i „szczęśliwego” środowiska akwarium.

---

## 2. Opis Problemu

### Jaki problem rozwiązujemy?
Wiele osób zaczynających przygodę z akwarystyką, nie wiedzą, z jakimi obowiązkami się to łączy, co często prowadzi do **zaniedbania zbiornika** lub **śnięcia ryb**. Obecnie jest mało dobrych metod monitorowania lub są nieskuteczne, jak na przykład zapisywanie w notesie o istotnych zmianach, a istniejące aplikacje często są przeładowane reklamami lub zbyt skomplikowane. Do tego potrzeba sprawdzania kompatybilności gatunków rybek akwariowych na forach internetowych jest nie mniej uciążliwa.
### Dla kogo jest ten produkt?
- **Główna persona:** "Andrzej, pracownik biurowy" Spędza 8 godzin przed komputerem w pracy. Akwarystyka to dla niego forma relaksu po pracy, ale nie ma czasu na przekopywanie setek stron forów internetowych. Potrzebuje prostego narzędzia, które powie mu: "Nie kupuj tej ryby, bo zje pozostałe".
- **Poboczna persona:** "Lucyna, entuzjastka precyzji" Osoba zorganizowana i aktywna. W kontekście akwarium – chce precyzyjnie monitorować parametry wody. tak jak monitoruje swoje wyniki treningowe. Zależy jej na wykresach i historycznych danych, aby optymalizować warunki dla wymagających gatunków roślin i ryb.
---

## 3. Cele i Mierniki Sukcesu

### Cele projektu
Cele projektu
- **Cel 1:** Umożliwienie użytkownikowi szybkiego sprawdzenia, czy wybrane gatunki ryb mogą żyć razem (weryfikator kompatybilności).
- **Cel 2:** Zastąpienie papierowych notatników cyfrowym dziennikiem, który automatycznie przypomina o cyklicznych zadaniach
- **Cel 3:** Podzielenie obowiązków pomiędzy domownikami, poprzez opcje dodawania użytkowników do współdzielenia akwarium.
### Mierniki sukcesu
- **Miernik 1**: Średni czas potrzebny na dodanie danych poniżej 5 sekund.
- **Miernik 2:** 30% użytkowników korzysta z funkcji kolaboracji.
- **Miernik 3:** 10% regularnie korzysta z usługi.
- **Miernik 4:** Pozytywne komentarze ludzi, którym serwis pomógł zadbać o swoje rybki
---

## 4. Wymagania i Zakres

### Kluczowe historyjki użytkownika

- **US-001:** Jako początkujący akwarysta, chcę sprawdzić, czy Bojownik może być w jednym akwarium z Gupikami, aby uniknąć agresji w zbiorniku.
- **US-002:** Jako użytkownik, chcę dzielić obowiązki między użytkownikami.
- **US-003:** Jako użytkownik, chcę stworzyć profil swojego akwarium, aby mieć wszystkie informacje w jednym miejscu.

### Zakres projektu

**Co jest w zakresie (In Scope):**

- Tworzenie profilu akwarium.
- zarządzanie własnymi akwariami i zapraszanie do zarządzania tym samym akwarium innych ludzi
- Baza danych popularnych ryb z informacją o wymaganiach.
- Baza danych popularnych roślin z informacją o wymaganiach.
- Prosty algorytm sprawdzania kompatybilności ryb (agresja, wymagania temperaturowe, ph, twardość). 
- Podstawowe statystyki: Ilość ryb i roślin, średni wiek ryb, kompatybilność i wymagania rybek.
- Podpowiadanie jaką kolejną rybkę można bezpiecznie dodać.
- Rejestracja przez zewnętrzny serwis internetowy

**Co jest poza zakresem (Out of Scope):**

- Integracja ze sterownikami IoT (inteligentne oświetlenie). 
- Sklep internetowy (zakup ryb przez aplikację). 
- Diagnozowanie chorób ryb na podstawie zdjęć (AI). 
- Dziennik czynności (logowanie podmian wody, karmienia, nawożenia).
- Gamifikacja 
---

## 6. Kwestie Techniczne (opcjonalnie)

- Backend: Java spring + AWS 
- Baza danych: PostgreSQL na amazon Aurora
- Frontend: Next.js + Tailwind
---

## 7. Otwarte Pytania i Ryzyka

- **Otwarte pytanie:** Skąd weźmiemy rzetelną bazę danych ryb? (Czy wprowadzamy ręcznie, czy korzystamy z zewnętrznego API/scrapingu?). 
  - **Ryzyko:** Użytkownik może polegać w 100% na aplikacji, a algorytm może nie przewidzieć specyficznych zachowań osobniczych ryb. 
    - **Plan mitygacji:** Dodanie wyraźnego disclaimer'a, że aplikacja jest sugestią, a każde zwierzę jest inne 
- **Otwarte pytanie:** W jaki sposób aplikacja ma prowadzić użytkownika przez pierwsze 4 tygodnie "dojrzewania" akwarium, zanim wpuści ryby? 
  - **Ryzyko:** Początkujący użytkownicy ("Andrzej") mogą zignorować ten proces i wpuścić ryby od razu. Gdy ryby padną, użytkownik obwini aplikację, że "nie ostrzegła" lub uzna, że hobby jest za trudne i porzuci produkt. 
- **Otwarte pytanie:** Czy od początku wspieramy jednostki imperialne (galony, stopnie Fahrenheita)? 
  - **Ryzyko:** Jeśli baza danych zostanie zaprojektowana tylko pod litry i stopnie Celsjusza, późniejsza ekspansja na rynki zagraniczne lub obsługa sprzętu z USA będzie wymagała kosztownego przepisania backendu. 
    - **Plan mitygacji:** Zaprojektowanie bazy danych z uniwersalnymi polami i przeliczaniem jednostek "w locie" po stronie frontendu (zależnie od ustawień użytkownika). 
