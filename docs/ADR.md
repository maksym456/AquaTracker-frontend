## ADR-001: Wybór Stosu Technologicznego Frontendu

> **Status:** Zaakceptowana
> **Data:** 30.10.2025
> **Autorzy:** Natalia Klimaszewska, Maksym Wilk, Jakub Janiec, Robert Kuźba, Bartosz Dobroś

### 1. Kontekst

Aplikacja do zarządzania akwariami wymaga nowoczesnego, wydajnego i responsywnego interfejsu użytkownika (UI). Kluczowe wymagania to możliwość łatwego tworzenia dynamicznych stron i komponentów, a także osiągnięcie spójnego i estetycznego wyglądu przy jednoczesnym skróceniu czasu implementacji wizualnej. Zespół ma doświadczenie i wiedzę w zakresie JavaScript.

### 2. Rozważane opcje

**Opcja 1: Next.js + JavaScript + Tailwind CSS**

* **Zalety:**
* `[+]` **Next.js:** Prosta integracja z Reactem, wysoka wydajność oraz możliwość łatwego tworzenia dynamicznych stron i komponentów.
* `[+]` **Tailwind CSS:** Umożliwia szybkie tworzenie nowoczesnych interfejsów i spójny wygląd aplikacji bez pisania dużej ilości własnego kodu CSS.
* `[+]` **JavaScript:** Popularność, uniwersalność i znajomość w zespole.


* **Wady:**
* `[-]` Wymaga nauki specyfiki frameworku Next.js (np. serwerowe renderowanie).



### 3. Decyzja

Wybieramy **Next.js, JavaScript i bibliotekę Tailwind CSS** jako główny stos technologiczny Frontendu.

### 4. Uzasadnienie

Wybór Next.js został dokonany ze względu na jego wydajność oraz zdolność do łatwego tworzenia dynamicznych stron i komponentów, co jest kluczowe dla złożonego interfejsu aplikacji. Dodatkowo Tailwind CSS skróci czas tworzenia interfejsów i zapewni spójny wygląd aplikacji, co jest priorytetem dla szybkiego wdrożenia. JavaScript został wybrany ze względu na znajomość wśród członków zespołu.

### 5. Konsekwencje

**Pozytywne**

* `[+]` Wysoka wydajność aplikacji front-endowej.
* `[+]` Szybki proces tworzenia interfejsu użytkownika (UI).
* `[+]` Wykorzystanie znanej technologii (JavaScript) przez zespół.

**Negatywne**

* `[-]` Konieczność wdrożenia w zasady użycia narzędzia Tailwind CSS.

---

## ADR-002: Wybór Stosu Technologicznego Backendu i Infrastruktury

> **Status:** Zaakceptowana
> **Data:** 30.10.2025
> **Autorzy:** Natalia Klimaszewska, Maksym Wilk, Jakub Janiec, Robert Kuźba, Bartosz Dobroś

### 1. Kontekst

Celem jest stworzenie bezpiecznego backendu dla ww. projektu. Najważniejszymi wymaganiami są: obsługa systemu logowania i rejestracji, przechowywanie dużej ilości danych (akwaria, gatunki, statystyki) oraz monitoring działania aplikacji. Kluczowym celem niefunkcjonalnym jest rozwój kompetencji zespołu w ww. technologiach.

### 2. Rozważane opcje

**Opcja 1: Java + Azure + PostgreSQL**

* **Zalety:**
* `[+]` **Java:** Zgodność z celem zespołu, jakim jest nauka i rozwój kompetencji.
* `[+]` **Azure:** Zapewnia gotową infrastrukturę do hostowania, zarządzania bazą danych oraz integracji z usługami.
* `[+]` **Azure App Service and Azure Functions:** Pozwala uniknąć tworzenia własnego systemu uwierzytelniania, zwiększając bezpieczeństwo i skracając czas implementacji logowania.
* `[+]` **Azure SQL Database:** Łatwa integracja z usługami Azure i zapewnia bezpieczne, skalowalne przechowywanie danych.
* `[+]` **Azure Monitor Logs:** Umożliwia monitorowanie działania aplikacji i analizowanie błędów bez tworzenia własnych narzędzi do logowania.


* **Wady:**
* `[-]` Zależność od dostawcy chmury (Vendor Lock-in).



**Opcja 2: Java + AWS + PostgreSQL (wybrana)**

* **Zalety:**
* `[+]` PostgreSQL to dojrzała i stabilna relacyjna baza danych.
* `[+]` Spełnia główny cel zespołu, jakim jest rozwój kompetencji w Java.


* **Wady:**
* `[-]` Zależność od dostawcy chmury (Vendor Lock-in).



### 3. Decyzja

Wybieramy **Java** jako główny język backendu, **AWS** jako platformę chmurową oraz **PostgreSQL** jako główną bazę danych.

### 4. Uzasadnienie

Decyzja jest podyktowana przede wszystkim chęcią nauki oraz rozwoju kompetencji członków zespołu w ww. technologiach. Wybór ekosystemu AWS pozwala wykorzystać gotową infrastrukturę, co zwiększa bezpieczeństwo, skraca czas implementacji i minimalizuje konieczność tworzenia własnych, systemowych narzędzi.

### 5. Konsekwencje

**Pozytywne**

* `[+]` Zrealizowanie celu rozwojowego zespołu w technologii Java.
* `[+]` Zwiększone bezpieczeństwo dzięki wykorzystaniu gotowych i sprawdzonych usług AWS do autoryzacji.
* `[+]` Uproszczone zarządzanie i monitoring aplikacji dzięki usługom chmurowym (np. AWS).
* `[+]` Zapewnienie bezpiecznego i skalowalnego przechowywania danych (PostgreSQL Database).

**Negatywne**

* `[-]` Silne powiązanie aplikacji z ekosystemem AWS (Vendor Lock-in).
* `[-]` Potencjalnie wyższe koszty utrzymania w chmurze w porównaniu do tańszych rozwiązań hostingowych (tylko pierwszy rok jest za darmo).