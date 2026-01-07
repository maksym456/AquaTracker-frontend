# Raport Event Storming

---

## 1. Legenda Mapowania
Na podstawie legendy z diagramu:
* **Zdarzenia (Events):** Karteczki pomarańczowe ("Zdarzenie systemowe").
* **Komendy (Commands):** Karteczki żółte ("Aktywność").
* **Aktorzy (Actors):** Karteczki zielone ("Użytkownik", "Administrator").

---

## 2. Zdarzenia (Events)
*Fakty, które zaszły w systemie (stan przeszły).*

### Rejestracja i Logowanie
* Przy rejestracji użytkownik dodanie do AWS cognito 
* Potwierdzenie konta poprzez email 
* Aktywowanie konta 
* Sprawdzenie poprawności danych 
* Błąd walidacji danych 
* Wpuszczenie użytkownika do systemu 

### Zarządzanie Akwarium
* Dodanie ryby do akwarium 
* Dodanie rośliny do akwarium 

### Kolaboracja
* Wysłanie zaproszenia

### Administracja
* Sprawdzanie logów 
* Usunięcie użytkowników z bazy danych 
* Modyfikacja/Usunięcie danych systemowych z bazy danych 

---

## 3. Komendy (Commands)
*Intencje użytkownika lub akcje wywołujące zmiany w systemie.*

### Aktor: Użytkownik
**Konto i Dostęp:**
* Stworzenie konta poprzez Facebook'a 
* Stworzenie konta poprzez e-mail 
* Logowanie użytkownika poprzez Facebook'a 
* Logowanie użytkownika poprzez e-mail 

**Baza Wiedzy (Ryby i Rośliny):**
* Wybranie zakładki "Fish Database" 
* Znalezienie ryby na "karuzeli" 
* Znalezienie ryby na panelu bocznym 
* Wybranie zakładki "Plant Database" 
* Znalezienie rośliny na "karuzeli" 
* Znalezienie rośliny na panelu bocznym 

**Zarządzanie Akwarium:**
* Wybranie zakładki "Aquariums" 
* Kliknięcie przycisku "Create Aquarium" 
* Ustawienie parametrów:
    * Water Type
    * Water Temperature
    * Biotype
    * pH
    * Water Hardness
* Utworzenie akwarium przyciskiem "Create"
* Wejście w utworzone akwarium 
* Wyświetlenie kompatybilności oraz statystyk akwarium 
* Dodawanie ryb oraz roślin 

**Kolaboracja:**
* Wybranie zakładki "Contacts" 
* Wpisanie emaila w zapraszającym formularzu 
* Zaproś osobę do współpracy przy akwarium 

### Aktor: Administrator
**Panel Administracyjny:**
* Sprawdzenie listy użytkowników 
* Przeglądanie danych użytkowników 
* Usuwanie użytkowników 
* Sprawdzenie danych systemowych 

---

## 4. Agregaty (Aggregates)
*Logiczne grupy spójności biznesowej wywnioskowane z diagramu.*

1.  **Konto Użytkownika (User Account):**
    * Obsługuje procesy rejestracji (FB/Email), integrację z AWS Cognito oraz logowanie.
2.  **Akwarium (Aquarium):**
    * Główny obiekt posiadający stan (parametry wody: pH, temp, typ) oraz zawartość (ryby, rośliny). Obsługuje logikę kompatybilności.
3.  **Katalog Gatunków (Species Catalog):**
    * Obsługuje wyszukiwanie (Fish Database, Plant Database) poprzez różne widoki (karuzela, panel boczny).
4.  **Panel Administratora (Admin Context):**
    * Odseparowany kontekst do zarządzania użytkownikami, logami i danymi systemowymi.

---

## 5. Polityki (Policies)
*Reguły biznesowe typu "Jeśli X to Y" wynikające ze strzałek przepływu.*

* **Polityka Integracji AWS:**
  > **Gdy** następuje rejestracja użytkownika, **wtedy** dodaj użytkownika do usługi AWS Cognito
* **Polityka Logowania:**
  > **Gdy** użytkownik próbuje się zalogować, **wtedy** następuje sprawdzenie poprawności danych. Jeśli dane są poprawne -> Wpuszczenie do systemu. Jeśli błędne -> Błąd walidacji.
* **Polityka Aktywacji:**
  > **Po** potwierdzeniu konta przez email, **następuje** aktywowanie konta.
* **Polityka Analizy Akwarium:**
  > **Po** wejściu w utworzone akwarium, **system musi** wyświetlić kompatybilność oraz statystyki zbiornika.