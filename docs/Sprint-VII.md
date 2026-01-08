# Plan Sprintu nr 7

**Data:** 2025-12-01  
**Okres trwania:** 01.12.2025 - 07.12.2025  
**Uczestnicy:** Wszyscy członkowie zespołu

## 1. Cel Sprintu (Sprint Goal)
> Wdrożenie zaawansowanej logiki walidacji akwariów oraz refaktoryzacja identyfikatorów na UUID.

## 2. Wybrane Historyjki Użytkownika (Backlog Sprintu)

### Historyjka 1: [LOGIC-01] - System Ostrzeżeń
**Opis:** Jako Użytkownik, chcę otrzymywać ostrzeżenia, aby uniknąć błędów w prowadzeniu akwarium.
* **Priorytet:** Średni
* **Estymacja:** 8 Story Points

**Kryteria akceptacji:**
- [ ] Funkcja zwracająca ostrzeżenia o nieprawidłowych akwariach działa.

### Historyjka 2: [ARCH-01] - Migracja UUID
**Opis:** Jako System, chcę używać UUID, aby zapewnić unikalność rekordów.
* **Priorytet:** Średni
* **Estymacja:** 3 Story Points

**Kryteria akceptacji:**
- [ ] ID użytkownika w akwariach zmienione na UUID4.

### Historyjka 3: [ADMIN-01] - Panel Admina
**Opis:** Jako Administrator, chcę mieć sprawny panel, aby zarządzać systemem.
* **Priorytet:** Niski
* **Estymacja:** 5 Story Points

**Kryteria akceptacji:**
- [ ] Zmiany w panelu administratora wdrożone.

---
**Łączna suma Story Points:** 16 SP
---

## 3. Podział na zadania

### Zadania dla Historyjki 1: System Ostrzeżeń
- [ ] Dodaj funkcję która na podstawie danych w tabelce zwraca ostrzeżenia o nieprawidłowych akwariach (**Robertkuzba**)

### Zadania dla Historyjki 2: Migracja UUID
- [ ] ZMIENIĆ ID USER W AKWARIACH NA UUID4 (**Robertkuzba**)