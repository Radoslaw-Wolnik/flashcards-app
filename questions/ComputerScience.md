## **Teoretyczne Podstawy Informatyki**

#### **1. 📘 Wyrażenia regularne – definicja**
Wyrażenie regularne to **formuła opisująca zbiór ciągów symboli** (język regularny) nad skończonym alfabetem. Definiuje się je rekurencyjnie:  
- **Baza:**  
  - `∅` (zbiór pusty), `ε` (słowo puste), `a` (pojedynczy symbol).  
- **Operacje:**  
  - **Suma (alternatywa):** `R + S` = `R|S` (np. `a|b` = {a, b}).  
  - **Katenacja:** `R ∘ S` (np. `a ∘ b` = {ab}).  
  - **Gwiazdka Kleene’ego:** `R*` (np. `a*` = {ε, a, aa, aaa, ...}).  

**Formalnie:** Języki regularne to najmniejsza klasa języków zawierająca `∅`, `{ε}`, `{a}` dla każdego symbolu `a`, i zamknięta na sumę, katenację i gwiazdkę Kleene’ego.

---

#### **2. 💡 Przykłady wyrażeń regularnych oraz ich zastosowań**
**Przykłady:**  
- `a(b|c)*` – wszystkie ciągi zaczynające się od `a`, po którym występuje dowolna kombinacja `b` i `c` (np. `a`, `ab`, `ac`, `abbc`).  
- `[0-9]{3}-[0-9]{2}` – kody numeryczne w formacie `XXX-XX` (np. `123-45`).  
- `\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b` – adresy email.  

**Zastosowania:**  
- **Walidacja danych:** Sprawdzanie poprawności formatu (np. adresy email, numery telefonów).  
- **Wyszukiwanie wzorców:** W edytorach tekstu (`grep`, `sed`), analizie logów.  
- **Tokenizacja w kompilatorach:** Rozpoznawanie leksemów (np. identyfikatory `[a-zA-Z_][a-zA-Z0-9_]*`).  

---

#### **3. 💡 Automaty skończone deterministyczne i niedeterministyczne**
**a) DFA (Deterministyczny automat skończony):**  
- **Definicja:** Piątka `(Q, Σ, δ, q₀, F)`, gdzie:  
  - `Q` – skończony zbiór stanów,  
  - `Σ` – alfabet,  
  - `δ: Q × Σ → Q` – funkcja przejścia,  
  - `q₀` – stan początkowy,  
  - `F ⊆ Q` – stany akceptujące.  
- **Działanie:** Dla każdego stanu i symbolu istnieje **dokładnie jedno** przejście.  
- **Przykład:** Automat akceptujący ciągi kończące się na `ab`:  
  ![DFA](https://i.imgur.com/8zX9J0m.png)  

**b) NFA (Niedeterministyczny automat skończony):**  
- **Definicja:** Piątka `(Q, Σ, δ, q₀, F)`, ale `δ: Q × (Σ ∪ {ε}) → P(Q)` (zbiór stanów).  
- **Działanie:** Może mieć **wiele przejść** dla jednego symbolu (lub `ε`-przejścia).  
- **Przykład:** Automat akceptujący ciągi zawierające `ab`:  
  ![NFA](https://i.imgur.com/5WYkL7f.png)  

**Kluczowe różnice:**  
| Właściwość       | DFA                          | NFA                          |  
|------------------|------------------------------|------------------------------|  
| Przejścia        | Deterministyczne             | Niedeterministyczne          |  
| `ε`-przejścia    | Niedozwolone                 | Dozwolone                    |  
| Złożoność stanów | Więcej stanów                | Mniej stanów                 |  
| Konwersja        | –                            | Każdy NFA da się przekształcić na równoważny DFA |  

---

#### **4. 💡 Gramatyki bezkontekstowe i języki bezkontekstowe; zastosowania**
**a) Gramatyka bezkontekstowa (CFG):**  
- **Definicja:** Czworka `(V, Σ, P, S)`, gdzie:  
  - `V` – symbole nieterminalne (zmienne),  
  - `Σ` – symbole terminalne (alfabet),  
  - `P` – reguły produkcji postaci `A → α` (`A ∈ V`, `α ∈ (V ∪ Σ)*`),  
  - `S` – symbol startowy.  
- **Przykład:** Gramatyka dla języka `{aⁿbⁿ | n ≥ 1}`:  
  ```  
  S → aSb | ab  
  ```  

**b) Język bezkontekstowy (CFL):**  
- Język generowany przez CFG.  
- **Przykłady:**  
  - Język poprawnych nawiasów: `S → (S) | SS | ε`.  
  - Proste wyrażenia arytmetyczne: `E → E + E | E * E | (E) | id`.  

**c) Zastosowania:**  
- **Kompilatory:** Parsowanie składniowe (np. drzewa składniowe w Pythonie/Java).  
- **Lingwistyka komputerowa:** Modelowanie struktur zdaniowych.  
- **Formaty danych:** Walidacja JSON/XML (za pomocą rozszerzonych gramatyk).  

---

#### **5. 💡 Maszyna Turinga i klasa języków akceptowanych przez maszyny Turinga**
**a) Maszyna Turinga (MT):**  
- **Definicja:** Siódemka `(Q, Σ, Γ, δ, q₀, B, F)`, gdzie:  
  - `Q` – stany,  
  - `Σ` – alfabet wejściowy,  
  - `Γ` – alfabet taśmowy (`Σ ⊆ Γ`),  
  - `δ: Q × Γ → Q × Γ × {L, R}` – funkcja przejścia (L=lewo, R=prawo),  
  - `q₀` – stan początkowy,  
  - `B ∈ Γ` – symbol pusty,  
  - `F ⊆ Q` – stany akceptujące.  
- **Działanie:** Nieskończona taśma, głowica czyta/zapisuje symbole i przesuwa się.  

**b) Klasa języków:**  
- **Języki rekurencyjnie przeliczalne (RE):** Akceptowane przez MT (dowolne zatrzymanie).  
- **Języki rekurencyjne:** Akceptowane przez MT, które **zawsze się zatrzymują**.  

**c) Moc obliczeniowa:**  
- MT rozpoznaje wszystkie języki, dla których istnieje **algorytm** (hipoteza Churcha-Turinga).  
- **Przykład:** Język `{aⁿbⁿcⁿ | n ≥ 0}` jest rozpoznawany przez MT, ale nie przez gramatyki bezkontekstowe.  

---

#### **6. 📘 Hierarchia Chomsky’ego**
Klasyfikacja gramatyk formalnych i odpowiadających im języków:  

| Typ  | Gramatyka          | Automat               | Język                     | Przykład               |  
|------|--------------------|-----------------------|---------------------------|------------------------|  
| **0**| Unrestricted       | Maszyna Turinga      | RE (rekurencyjnie przeliczalne) | `{aⁿbⁿcⁿ \| n ≥ 0}` |  
| **1**| Kontekstowa        | Liniowo ograniczony  | Kontekstowy               | `{aⁿbⁿcᵐ \| n, m ≥ 0}`|  
| **2**| Bezkontekstowa     | Automat ze stosem    | Bezkontekstowy (CFL)      | `{aⁿbⁿ \| n ≥ 0}`     |  
| **3**| Regularna          | DFA/NFA              | Regularny                 | `{aⁿ \| n ≥ 0}`       |  

**Kluczowe własności:**  
- **Hierarchia inkluzyjna:** Typ 3 ⊂ Typ 2 ⊂ Typ 1 ⊂ Typ 0.  
- **Moc obliczeniowa:** Maleje od Typu 0 (najsilniejszy) do Typu 3 (najsłabszy).  

---


## **Języki Programowania I**  

#### **1. 📘 Podstawowe typy danych w języku C**
Podstawowe typy wbudowane w C:  
- **`int`**: Liczby całkowite (np. `42`, `-7`). Rozmiar: zwykle 4 bajty.  
- **`float`**: Liczby zmiennoprzecinkowe pojedynczej precyzji (np. `3.14f`). Rozmiar: 4 bajty.  
- **`double`**: Liczby zmiennoprzecinkowe podwójnej precyzji (np. `2.71828`). Rozmiar: 8 bajtów.  
- **`char`**: Pojedynczy znak (np. `'A'`, `'\0'`). Rozmiar: 1 bajt.  
- **`void`**: Brak typu (używany w funkcjach bez zwracanej wartości).  
- **Modyfikatory:** `short`, `long`, `signed`, `unsigned` (np. `unsigned int`, `long double`).  

**Przykład:**  
```c
int age = 30;  
float pi = 3.14159f;  
char grade = 'A';  
```

---

#### **2. 📘 Instrukcje sterujące języka C**
Klasy instrukcji sterujących:  
- **Warunkowe:**  
  - `if`/`else`:  
    ```c
    if (x > 0) printf("Dodatnie");  
    else if (x == 0) printf("Zero");  
    else printf("Ujemne");  
    ```  
  - `switch`:  
    ```c
    switch (op) {  
        case '+': result = a + b; break;  
        case '-': result = a - b; break;  
        default: printf("Nieznana operacja");  
    }  
    ```  
- **Pętle:**  
  - `for`: `for (int i = 0; i < 10; i++) { ... }`  
  - `while`: `while (i < 10) { ... }`  
  - `do-while`: `do { ... } while (i < 10);`  
- **Skoki:**  
  - `break` (przerywa pętlę/`switch`),  
  - `continue` (pomija bieżącą iterację),  
  - `goto` (skok do etykiety).  

---

#### **3. 📘 Struktura programu w języku C**
Typowa struktura programu:  
```c
#include <stdio.h>  // Dyrektywy preprocesora (nagłówki)  

#define PI 3.14     // Definicje stałych  

int global_var;      // Zmienne globalne  

void funkcja();      // Deklaracje funkcji  

int main() {         // Funkcja główna (entry point)  
    int lokalna = 5; // Zmienne lokalne  
    funkcja();  
    return 0;        // Kod powrotu  
}  

void funkcja() {     // Definicja funkcji  
    printf("Hello");  
}  
```  
**Kluczowe elementy:**  
- **`#include`**: Dołączanie bibliotek (np. `<stdio.h>` dla I/O).  
- **`main()`**: Punkt startowy programu.  
- **Funkcje**: Definicje + deklaracje.  
- **Zmienne**: Globalne (widoczne wszędzie) vs lokalne (widoczne w bloku).  

---

#### **4. 💡 Funkcje rekurencyjne (z przykładami)**
**Definicja:** Funkcja wywołująca samą siebie, z warunkiem stopu.  
**Przykład 1: Silnia**  
```c
int silnia(int n) {  
    if (n <= 1) return 1;     // Warunek stopu  
    else return n * silnia(n - 1); // Rekurencja  
}  
```  
**Przykład 2: Fibonacci**  
```c
int fib(int n) {  
    if (n <= 0) return 0;  
    else if (n == 1) return 1;  
    else return fib(n - 1) + fib(n - 2);  
}  
```  
**Zastosowania:** Algorytmy "dziel i zwyciężaj" (np. przeszukiwanie binarne, sortowanie przez scalanie).  

---

#### **5. 💡 Zasięg zmiennych i funkcji w programach napisanych w języku C**   
**Rodzaje zasięgu:**  
- **Lokalny (automatyczny):**  
  - Zmienne wewnątrz funkcji/bloku (`{}`).  
  - Widoczne **tylko w tym bloku**.  
  - Niszczone po wyjściu z bloku.  
  ```c
  void funkcja() {  
      int x = 10; // Lokalna, widoczna tylko w funkcja()  
  }  
  ```  
- **Globalny (zewnętrzny):**  
  - Zmienne zadeklarowane poza funkcjami.  
  - Widoczne **od punktu deklaracji do końca pliku**.  
  ```c
  int global = 5; // Globalna  

  void foo() {  
      global++; // Można modyfikować  
  }  
  ```  
- **`static`:**  
  - Dla zmiennych: Zachowuje wartość między wywołaniami funkcji.  
  - Dla funkcji: Widoczna tylko w pliku, gdzie zadeklarowana.  
  ```c
  void counter() {  
      static int count = 0; // Inicjalizacja raz!  
      count++;  
      printf("%d", count); // 1, 2, 3...  
  }  
  ```  

---

#### **6. 📘 Etapy kompilacji programów w języku C**
4 etapy kompilacji:  
1. **Preprocesing:**  
   - Rozwijanie makr (`#define`), dołączanie plików nagłówkowych (`#include`).  
   - Polecenie: `gcc -E plik.c -o plik.i` (generuje plik `.i`).  
2. **Kompilacja właściwa:**  
   - Translacja kodu C do kodu asemblera.  
   - Polecenie: `gcc -S plik.i -o plik.s` (generuje plik `.s`).  
3. **Asemblacja:**  
   - Konwersja kodu asemblera do kodu maszynowego (obiektowy).  
   - Polecenie: `gcc -c plik.s -o plik.o` (generuje plik `.o`).  
4. **Linkowanie:**  
   - Łączenie plików obiektowych z bibliotekami (np. `libc.so`).  
   - Polecenie: `gcc plik.o -o program` (generuje plik wykonywalny).  

---

#### **7. 💡 Sposób reprezentacji napisów w języku C oraz podstawowe funkcje standardowej biblioteki do przetwarzania napisów**
**Reprezentacja napisów:**  
- Napisy w C to **tablice `char` zakończone znakiem `'\0'` (null-terminator)**.  
- Przykład:  
  ```c
  char str[] = "Hello"; // Tablica: {'H','e','l','l','o','\0'}  
  ```  

**Podstawowe funkcje (`<string.h>`):**  
- **`strlen(str)`**: Zwraca długość napisu (bez `'\0'`).  
- **`strcpy(dest, src)`**: Kopiuje napis `src` do `dest`.  
- **`strcat(dest, src)`**: Łączy `src` z końcem `dest`.  
- **`strcmp(s1, s2)`**: Porównuje napisy (zwraca 0 jeśli równe).  
- **`strstr(haystack, needle)`**: Wyszukuje podnapis.  

**Przykład użycia:**  
```c
#include <string.h>  

int main() {  
    char s1[20] = "Ala ma ";  
    char s2[] = "kota";  
    strcat(s1, s2); // "Ala ma kota"  
    printf("%d", strlen(s1)); // 10  
}  
```  

---

#### **8. 💡 Obsługa plików w języku C**
**Operacje na plikach:**  
1. **Otwarcie pliku:** `FILE *fopen(const char *filename, const char *mode);`  
   - Tryby: `"r"` (czytanie), `"w"` (zapis, nadpisuje), `"a"` (dopisywanie), `"r+"` (read/write).  
   ```c
   FILE *file = fopen("dane.txt", "r");  
   if (file == NULL) perror("Błąd otwarcia");  
   ```  
2. **Czytanie/zapis:**  
   - Tekstowe: `fprintf(file, "Liczba: %d", 42)`, `fscanf(file, "%d", &x)`.  
   - Binarne: `fwrite(buffer, sizeof(int), 5, file)`, `fread(...)`.  
3. **Pozycja w pliku:**  
   - `fseek(file, offset, SEEK_SET)` (przesuwa wskaźnik pliku).  
   - `ftell(file)` (zwraca aktualną pozycję).  
4. **Zamknięcie pliku:** `fclose(file)`.  

**Przykład kopiowania pliku:**  
```c
FILE *src = fopen("źródło.txt", "r");  
FILE *dest = fopen("kopia.txt", "w");  
char ch;  
while ((ch = fgetc(src)) != EOF) fputc(ch, dest);  
fclose(src); fclose(dest);  
```  

---

#### **9. 💡 Definiowanie złożonych typów danych w języku C (struktury, unie i pola bitowe)**
**a) Struktury (`struct`):**  
- Grupują zmienne różnych typów.  
```c
struct Student {  
    char name[50];  
    int age;  
    float avg_grade;  
};  

struct Student s1 = {"Jan", 20, 4.5};  
printf("%s", s1.name);  
```  

**b) Unie (`union`):**  
- Wszystkie pola współdzielą tę samą pamięć (rozmiar = rozmiar największego pola).  
```c
union Data {  
    int i;  
    float f;  
    char str[20];  
};  

union Data d;  
d.i = 10; // d.f i d.str są teraz "nadpisane"  
```  

**c) Pola bitowe:**  
- Pozwalają definiować zmienne o określonej liczbie bitów.  
```c
struct Flags {  
    unsigned int is_ready : 1; // 1 bit  
    unsigned int count : 4;    // 4 bity (wartości 0-15)  
};  
```  

---

#### **10. 💡 Alokacja pamięci w języku C**
**Funkcje zarządzania pamięcią (`<stdlib.h>`):**  
- **`malloc(size)`**: Alokuje `size` bajtów (nie inicjalizuje).  
- **`calloc(n, size)`**: Alokuje `n * size` bajtów (inicjalizuje zerami).  
- **`realloc(ptr, new_size)`**: Zmienia rozmiar bloku pamięci.  
- **`free(ptr)`**: Zwalnia pamięć.  

**Przykład tablicy dynamicznej:**  
```c
int *arr = (int*) malloc(5 * sizeof(int)); // Alokacja  
if (arr == NULL) exit(1);  

arr[0] = 10;  
arr = (int*) realloc(arr, 10 * sizeof(int)); // Rozszerzenie  

free(arr); // Zwolnienie pamięci!  
```  
**Uwaga:** Brak `free` → wyciek pamięci (memory leak).  

---

#### **11. 💡 Wskaźniki w języku C. Związek między tablicami a wskaźnikami**
**Podstawy wskaźników:**  
- Wskaźnik przechowuje **adres pamięci** zmiennej.  
```c
int x = 10;  
int *ptr = &x; // ptr przechowuje adres x  
printf("%d", *ptr); // Dereferencja: 10  
*ptr = 20; // Modyfikacja x przez wskaźnik  
```  

**Związek tablice ↔ wskaźniki:**  
- **Nazwa tablicy** jest wskaźnikiem do jej pierwszego elementu:  
  ```c
  int arr[3] = {1, 2, 3};  
  int *p = arr; // p == &arr[0]  
  printf("%d", *(p + 1)); // arr[1] = 2  
  ```  
- **Arytmetyka wskaźników:**  
  - `ptr + n` przesuwa wskaźnik o `n * sizeof(typ)` bajtów.  
- **Tablice 2D:**  
  ```c
  int matrix[2][3] = {{1,2,3}, {4,5,6}};  
  int (*ptr)[3] = matrix; // Wskaźnik do tablicy 3-elementowej  
  printf("%d", ptr[1][2]); // 6  
  ```  

**Kluczowa różnica:**  
- `sizeof(arr)` zwraca **rozmiar całej tablicy**, podczas gdy `sizeof(ptr)` zwraca rozmiar wskaźnika (np. 8 bajtów na x64).  

---

## **Języki Programowania II**  

#### **1. 💡 Typy proste i obiektowe w języku Java**  
**Answer:**  
**a) Typy proste (prymitywne):**  
- 8 podstawowych typów: `byte`, `short`, `int`, `long`, `float`, `double`, `char`, `boolean`.  
- Przechowywane **na stosie**, bez metod.  
- **Autoboxing/Autounboxing** (automatyczna konwersja na obiekty i z powrotem):  
  ```java
  int x = 5;                     // Typ prosty
  Integer obj = x;                // Autoboxing (int → Integer)
  int y = obj;                    // Unboxing (Integer → int)
  ```

**b) Typy obiektowe:**  
- Klasy (np. `String`, `ArrayList`), interfejsy, tablice.  
- Przechowywane **na stercie**, mają metody i pola.  
- Domyślna wartość: `null`.  
  ```java
  String text = new String("Hello");  // Obiekt
  String name = "Java";               // Literał łańcuchowy (też obiekt)
  ```

**Kluczowa różnica:**  
```java
int a = 5;                           // Typ prosty
Integer b = new Integer(5);          // Typ obiektowy
System.out.println(a == b);          // true (autounboxing)
System.out.println(b.equals(5));     // true
```

---

#### **2. 💡 Użycie słów kluczowych: `abstract`, `final`, `static`**
**a) `abstract`:**  
- **Klasa:** Nie można tworzyć instancji, służy jako baza dla podklas.  
- **Metoda:** Brak implementacji, musi być nadpisana w podklasie.  
  ```java
  abstract class Animal {
      abstract void makeSound();  // Metoda abstrakcyjna
  }
  ```

**b) `final`:**  
- **Klasa:** Nie można dziedziczyć (np. `String`).  
- **Metoda:** Nie można nadpisać.  
- **Zmienna:** Stała (niezmienialna).  
  ```java
  final class MathUtils {}          // Klasa finalna
  final double PI = 3.14159;        // Stała
  ```

**c) `static`:**  
- Należy do **klasy**, a nie instancji.  
- Współdzielone przez wszystkie obiekty klasy.  
  ```java
  class Counter {
      static int count = 0;         // Współdzielone pole
      Counter() { count++; }
      static void reset() { count = 0; } // Metoda statyczna
  }
  ```

---

#### **3. 💡 Sposoby zabezpieczania dostępu do komponentów klas i obiektów w Java**   
**Modyfikatory dostępu:**  
- **`private`**: Dostęp tylko w tej samej klasie.  
- **`protected`**: Dostęp w pakiecie + podklasach.  
- **`public`**: Dostęp wszędzie.  
- **Brak modyfikatora (domyślny)**: Dostęp tylko w pakiecie.  

**Przykład:**  
```java
public class BankAccount {
    private double balance;          // Pole prywatne

    public double getBalance() {     // Publiczny getter
        return balance;
    }

    protected void setBalance(double amount) { // Protected setter
        if (amount > 0) balance = amount;
    }
}
```

**Zasada hermetyzacji:** Pola prywatne + publiczne metody dostępowe (getters/setters).

---

#### **4. 💡 Polimorfizm w językach obiektowych (na przykładach)**   
**Definicja:** Zdolność obiektu do przyjmowania wielu form.  
**a) Przesłanianie metod (Override):**  
```java
class Animal {
    void makeSound() { System.out.println("Some sound"); }
}

class Dog extends Animal {
    @Override
    void makeSound() { System.out.println("Bark!"); } // Nadpisanie
}

Animal myPet = new Dog();
myPet.makeSound();  // "Bark!" (polimorfizm runtime)
```

**b) Przeciążanie metod (Overload):**  
```java
class Calculator {
    int add(int a, int b) { return a + b; }
    double add(double a, double b) { return a + b; } // Inne parametry
}
```

**c) Polimorfizm przez interfejsy:**  
```java
interface Shape {
    double area();
}

class Circle implements Shape {
    public double area() { return Math.PI * radius * radius; }
}

class Square implements Shape {
    public double area() { return side * side; }
}
```

---

#### **5. 💡 Pakiety i interfejsy w Javie**
**a) Pakiety:**  
- Organizują klasy w grupy (np. `java.util`, `com.mojafirma.model`).  
- Zapobiegają konfliktom nazw.  
- **Import:**  
  ```java
  import java.util.ArrayList;  // Import pojedynczej klasy
  import java.util.*;          // Import całego pakietu
  ```

**b) Interfejsy:**  
- Definiują **kontrakt** (metody bez implementacji).  
- Umożliwiają wielodziedziczenie zachowań.  
```java
interface Drawable {
    void draw();  // Metoda abstrakcyjna
    default void resize() {   // Metoda domyślna (Java 8+)
        System.out.println("Resizing...");
    }
}

class Circle implements Drawable {
    public void draw() { /* implementacja */ }
}
```

---

#### **6. 💡 Tworzenie i synchronizacja wątków w Javie**
**a) Tworzenie wątków:**  
- **Rozszerzenie klasy `Thread`:**  
  ```java
  class MyThread extends Thread {
      public void run() {
          System.out.println("Wątek działa");
      }
  }
  new MyThread().start();
  ```
- **Implementacja `Runnable` (lepsza praktyka):**  
  ```java
  new Thread(() -> {
      System.out.println("Lambda wątek");
  }).start();
  ```

**b) Synchronizacja:**  
- Chroni przed **współbieżnym dostępem** do zasobów.  
- **Słowo kluczowe `synchronized`:**  
  ```java
  class Counter {
      private int count = 0;
      
      public synchronized void increment() { // Synchronizowana metoda
          count++;
      }
  }
  ```
- **Blok synchronizowany:**  
  ```java
  synchronized (lockObject) {  // Jawna blokada
      // Krytyczna sekcja
  }
  ```

---

#### **7. 💡 Podstawy programowania generycznego w Javie (na podstawie kolekcji)**
**Generyki (Generics):**  
- Pozwalają tworzyć **typowe bezpieczne** klasy/interfejsy.  
- Eliminują konieczność rzutowania.  

**Przykład z kolekcjami:**  
```java
List<String> names = new ArrayList<>(); // Typ bezpieczny
names.add("Anna");
// names.add(42); // Błąd kompilacji!
String first = names.get(0); // Bez rzutowania
```

**Własna klasa generyczna:**  
```java
class Box<T> {
    private T content;
    void setContent(T content) { this.content = content; }
    T getContent() { return content; }
}

Box<Integer> intBox = new Box<>();
intBox.setContent(42);
```

**Wildcards (`?`):**  
```java
void printList(List<?> list) { // Akceptuje listę dowolnego typu
    for (Object item : list) System.out.println(item);
}
```

---


## **Matematyka Dyskretna**

#### **1. 💡 Metoda indukcji matematycznej**

**Definicja:** Dowodzenie twierdzeń dla liczb naturalnych przez:

1. **Baza indukcyjna:** Sprawdzenie prawdziwości dla $n\_0$ (np. $n=1$).
2. **Krok indukcyjny:**

   * **Założenie (hipoteza indukcyjna):** Twierdzenie prawdziwe dla $n = k$.
   * **Dowód:** Pokaż prawdziwość dla $n = k+1$.

**Przykład:** Dowód, że

$$
1 + 2 + \dots + n = \frac{n(n+1)}{2}.
$$

* **Baza:** Dla $n=1$:

$$
1 = \frac{1 \cdot 2}{2} = 1.
$$

* **Krok:**
  Załóżmy, że dla pewnego $k$ zachodzi:

$$
\sum_{i=1}^k i = \frac{k(k+1)}{2}.
$$

Wtedy:

$$
\sum_{i=1}^{k+1} i = \sum_{i=1}^k i + (k+1)
= \frac{k(k+1)}{2} + (k+1)
= \frac{(k+1)(k+2)}{2}.
\quad \blacksquare
$$

---

#### **2. 💡 Sposoby kodowania liczb w komputerze**

**a) Liczby całkowite:**

* **Uzupełnienie do dwóch (two's complement):**

  * Najstarszy bit: znak (0 – dodatnia, 1 – ujemna).
  * Przykład: $-3$ w 4 bitach:

$
3 = 0011 \;\to\; \text{odwróć bity: }1100 \;\to\; +1: 1101
$

* **Kod BCD (Binary-Coded Decimal):**
  Każda cyfra dziesiętna kodowana 4 bitami (np. $12 \to 0001,0010$).

**b) Liczby rzeczywiste:**

* **Reprezentacja zmiennoprzecinkowa (IEEE 754):**
  Składniki: znak ($S$), wykładnik ($E$), mantysa ($M$).
  Wartość:

$
(-1)^S \times 1.M \times 2^{E - \text{bias}}
$

  Dla formatu float (32 bity): $S=1$ bit, $E=8$ bitów, $M=23$ bitów.

---

#### **3. 💡 Zasada szufladkowa Dirichleta**

**Treść:** Jeśli $n$ obiektów umieszczamy w $m$ szufladach i $n > m$, to co najmniej jedna szuflada zawiera $\lceil n/m \rceil$ obiektów.

**Przykłady:**

1. Wśród 13 osób co najmniej 2 urodziły się w tym samym miesiącu ($13 > 12$).
2. Dowód, że w grupie 6 osób są 3 znajomych lub 3 obcych (graf $K\_6$ z krawędziami w 2 kolorach).

---

#### **4. 💡 Liczba ciągów, funkcji i podzbiorów**

* **Permutacje (ciągi bez powtórzeń):**

$$
P(n) = n! \\
(\text{np. dla }n=3:\ 123, 132, 213, \dots)
$$

* **Wariacje z powtórzeniami:**

$$
W_n^k = n^k \\
(\text{np. }n=2,k=2:\ 00,01,10,11)
$$

* **Funkcje }f: A \to B{:**

$$
|B|^{|A|} \quad (|A|=k,|B|=n)
$$

* **Podzbiory:**

$$
2^n \quad (\emptyset,\{1\},\{2\},\{1,2\})
$$

* **Kombinacje (podzbiory $k$-elementowe):**

$$
\binom{n}{k} = \frac{n!}{k!(n-k)!} \\
(\text{np. }n=3,k=2:\ \{1,2\},\{1,3\},\{2,3\})
$$

---

#### **5. 💡 Kongruencja modulo i pierścień $\mathbb{Z}\_m$**

**Kongruencja:**

$$
a \equiv b \pmod{m} \iff m \mid (a - b).
$$

**Pierścień $\mathbb{Z}\_m$:** Zbiór reszt ${0,1,\dots,m-1}$ z dodawaniem i mnożeniem modulo $m$.

**Element odwrotny:** $a^{-1}$ istnieje wtedy i tylko wtedy, gdy $\gcd(a,m)=1$.

* **Algorytm Euklidesa (rozszerzony):** Znajdź $x,y$ takie, że $ax + my = 1$. Wtedy $x \equiv a^{-1} \pmod{m}$.

**Przykład:** $3^{-1} \bmod 11$:

$$
11 = 3\cdot3 + 2,\;3=2\cdot1+1,\;1=3-2\cdot1=4\cdot3-1\cdot11
$$

Zatem $3^{-1} \equiv 4 \pmod{11}$.

---

#### **6. 📘 Funkcja Eulera $\phi(n)$**

**Definicja:** Liczba liczb w ${1,2,\dots,n}$ względnie pierwszych z $n$.
**Wzór:** Jeśli $n=\prod\_{i=1}^r p\_i^{k\_i}$, to

$$
\phi(n) = n \prod_{i=1}^r \Bigl(1 - \frac{1}{p_i}\Bigr).
$$

**Własności:**

1. $\phi(p)=p-1$ dla liczby pierwszej $p$.
2. $\phi(p^k)=p^k-p^{k-1}$.
3. Jeśli $\gcd(a,b)=1$, to $\phi(ab)=\phi(a)\phi(b)$.
4. **Twierdzenie Eulera:** Jeśli $\gcd(a,n)=1$, to $a^{\phi(n)}\equiv1\pmod{n}$.

**Przykład:** $\phi(10)=4$ (liczby: 1,3,7,9).

---

#### **7. 💡 Algorytm RSA**

1. Wybierz dwie duże liczby pierwsze $p,q$.
2. Oblicz $n=pq$ oraz $\phi(n)=(p-1)(q-1)$.
3. Wybierz $e$ takie, że $1\<e<\phi(n)$ i $\gcd(e,\phi(n))=1$.
4. Znajdź $d$ takie, że $ed\equiv1\pmod{\phi(n)}$.

> **Klucz publiczny:** $(e,n)$
> **Klucz prywatny:** $(d,n)$

* **Szyfrowanie:** $C = M^e \bmod n$.
* **Deszyfrowanie:** $M = C^d \bmod n$.

---

#### **8. 📘 Sieci boolowskie**

Graf skierowany acykliczny (DAG), w którym wierzchołki to bramki logiczne (AND, OR, NOT, XOR), a krawędzie to połączenia.

**Przykłady:**

* **XOR:**

$$
A \oplus B = (A \land \neg B) \lor (\neg A \land B).
$$

```text
A --|       \
     | AND |-- OR --> Wynik
B --|______/
```

* **Półsumator:**

```text
S = A \oplus B
C = A \land B
```

---

#### **9. 📘 Funkcje parzystości**

**Definicje:**

* Parzysta: $f(-x)=f(x)$.
* Nieparzysta: $f(-x)=-f(x)$.

**Własności:**

1. Suma funkcji parzystych jest parzysta.
2. Iloczyn funkcji parzystej i nieparzystej jest nieparzysty.
3. Dowolną funkcję można rozłożyć:

$$
f(x)=\frac{f(x)+f(-x)}{2}+\frac{f(x)-f(-x)}{2}.
$$

**Przykłady:**

* Parzysta: $x^2$.
* Nieparzysta: $x^3$.

---

#### **10. 💡 Drzewa i przeszukiwanie**

**Drzewo:** Spójny, acykliczny graf.
**BST:** Lewe poddrzewo ≤ korzeń < prawe poddrzewo.

**Algorytmy DFS:**

* **In-order:** lewe → korzeń → prawe
* **Pre-order:** korzeń → lewe → prawe
* **Post-order:** lewe → prawe → korzeń

**BFS:** Przeszukiwanie poziomami.

**Złożoność (BST):** $O(h)$, gdzie $h$ to wysokość drzewa (dla zrównoważonego: $O(\log n)$).

---

#### **11. 💡 Rekurencja**

Funkcja wywołująca samą siebie z mniejszym problemem.

**Przykłady algorytmów:**

````python
# Silnia
```python
def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n-1)
````

````python
# Ciąg Fibonacciego
```python
def fib(n):
    if n <= 1:
        return n
    return fib(n-1) + fib(n-2)
````

```python
# Przeszukiwanie BST (in-order)
def inorder(node):
    if node:
        inorder(node.left)
        print(node.value)
        inorder(node.right)
```

**Struktura definicyjna:**

* Baza: wartość dla najmniejszego argumentu (np. $f(0)=1$).
* Krok: wyrażenie $f(n)$ przez wartości $f(k)$ dla $k<n$.

---


## **Algorytmy i Struktury Danych**  

#### **1. 📘 Złożoność czasowa algorytmów sortowania**
**Kluczowe algorytmy i ich złożoności:**  
| Algorytm          | Złożoność (avg) | Złożoność (worst) | Stabilny? | Uwagi                          |  
|-------------------|-----------------|-------------------|-----------|--------------------------------|  
| **Quicksort**     | $O(n \log n)$ | $O(n^2)$        | ❌        | W miejscu, pivot losowy        |  
| **Mergesort**     | $O(n \log n)$ | $O(n \log n)$   | ✅        | Wymaga $O(n)$ pamięci        |  
| **Heapsort**      | $O(n \log n)$ | $O(n \log n)$   | ❌        | W miejscu, wykorzystuje kopiec |  
| **Insertion Sort**| $O(n^2)$      | $O(n^2)$        | ✅        | Szybki dla małych $n$        |  
| **Counting Sort** | $O(n + k)$    | $O(n + k)$      | ✅        | Tylko liczby całkowite         |  
| **Radix Sort**    | $O(d \cdot (n + k))$ | $O(d \cdot (n + k))$ | ✅ | Dla liczb/łańcuchów |  

**Przykład:**  
- **Quicksort:**  
  ```python
  def quicksort(arr):
      if len(arr) <= 1: return arr
      pivot = arr[len(arr)//2]
      left = [x for x in arr if x < pivot]
      middle = [x for x in arr if x == pivot]
      right = [x for x in arr if x > pivot]
      return quicksort(left) + middle + quicksort(right)
  ```

---

#### **2. 💡 Drzewa poszukiwań binarnych (BST i czerwono-czarne): definicja i złożoność operacji**   
**a) Standard BST:**  
- **Definicja:** Dla każdego węzła:
  - Lewe poddrzewo $\leq$ węzeł  
  - Prawe poddrzewo $>$ węzeł
- **Operacje:**  
  - Wstawianie: $O(h)$  
  - Usuwanie: $O(h)$  
  - Wyszukiwanie: $O(h)$  
  - $h$ – wysokość drzewa (w najgorszym przypadku $O(n)$, gdy drzewo zdegenerowane).  

**b) Drzewa czerwono-czarne (RBT):**  
- **Definicja:** Samorównoważące BST z dodatkowymi właściwościami:  
  1. Każdy węzeł jest **czerwony** lub **czarny**.  
  2. Korzeń i liście (NULL) są **czarne**.  
  3. Czerwony węzeł ma **czarne dzieci**.  
  4. Każda ścieżka do liścia ma **tę samą liczbę czarnych węzłów** (czarna wysokość).  
- **Operacje:**  
  - Wstawianie/usuwanie: $O(\log n)$ (rotacje i przemalowania zachowują właściwości).  
  - Wyszukiwanie: $O(\log n)$.  

**Porównanie:**  
| Właściwość       | BST          | Czerwono-czarne |  
|------------------|--------------|-----------------|  
| Wysokość         | $O(n)$     | $O(\log n)$   |  
| Gwarancja        | Brak         | Zrównoważone    |  
| Zastosowania     | Proste przypadki | Systemy czasu rzeczywistego |  

---


#### **3. 💡 B‑drzewa: definicja i złożoność operacji**

**Definicja:** Samorównoważące drzewo dla systemów dyskowych (duże dane):

* Każdy węzeł (oprócz korzenia) ma $\geq t-1$ i $\leq 2t-1$ kluczy ($t$ – stopień).
* Wszystkie liście na tej samej głębokości.
* Węzeł z $k$ kluczami ma $k+1$ dzieci.

**Operacje:**

* **Wyszukiwanie:** $O(\log n)$ (przeszukiwanie binarne we wnętrzu węzła).
* **Wstawianie:** $O(\log n)$ (ew. podział węzłów „w górę”).
* **Usuwanie:** $O(\log n)$ (ew. łączenie węzłów).

**Zastosowania:** Systemy plików (ext4, NTFS), bazy danych (np. indeksy w MySQL).

**Przykład (t = 2):**

```text
      [10, 20]
     /   |    \
  [5]  [15]  [25, 30]
```

---

#### **4. 💡 Tablice z haszowaniem: idea i sposoby rozwiązywania konfliktów**

**Idea haszowania:**

* Funkcja $h\colon \text{klucz}\to \text{indeks}$ w tablicy.
* Idealna złożoność: $O(1)$ dla wstawiania, usuwania i wyszukiwania.

**Metody rozwiązywania konfliktów:**

1. **Adresowanie otwarte (open addressing):**

   * **Liniowe:**

     $$
       h(k,i) = \bigl(h'(k) + i\bigr)\bmod m.
     $$
   * **Kwadratowe:**

     $$
       h(k,i) = \bigl(h'(k) + c_1\,i + c_2\,i^2\bigr)\bmod m.
     $$
   * **Podwójne haszowanie:**

     $$
       h(k,i) = \bigl(h_1(k) + i\cdot h_2(k)\bigr)\bmod m.
     $$

2. **Łańcuchowanie (chaining):**  
   - Każdy slot tablicy to lista elementów o tym samym haszu.  
   ```python
   class HashTable:
       def __init__(self, size):
           self.table = [[] for _ in range(size)]
       def insert(self, key, value):
           index = hash(key) % len(self.table)
           self.table[index].append((key, value))
   ```

**Złożoność (avg):**  
- Przy równomiernym haszowaniu: $O(1 + \alpha)$, gdzie $\alpha = n/m$ (współczynnik wypełnienia).  

---

#### **5. 💡 Kopce binarne i ich zastosowania**
**Definicja:** Kompletne drzewo binarne spełniające własność kopca:  
- **Kopiec min:** Wartość węzła $\leq$ wartości dzieci.  
- **Kopiec max:** Wartość węzła $\geq$ wartości dzieci.  
- **Reprezentacja:** Tablica (dziecko $i$: $2i+1$, $2i+2$; rodzic: $\lfloor (i-1)/2 \rfloor$).  

**Operacje:**  
- `insert`: $O(\log n)$ (przesianie w górę).  
- `extract_min/max`: $O(\log n)$ (przesianie w dół).  
- `build_heap`: $O(n)$.  

**Zastosowania:**  
1. **Kolejka priorytetowa** (np. w algorytmie Dijkstry).  
2. **Heapsort**.  
3. **Znajdowanie $k$-tego największego elementu**.  

**Przykład kopca min:**  
```
        1  
      /   \  
     3     5  
    / \   /  
   4   8 7  
```

---

#### **6. 💡 Stosy i kolejki: definicja i typowe implementacje**
**a) Stos (LIFO):**  
- **Definicja:** Dodawanie (`push`) i usuwanie (`pop`) z **tego samego końca** (wierzchołek).  
- **Operacje:**  
  - `push(item)`: $O(1)$  
  - `pop()`: $O(1)$  
  - `peek()`: Zwraca wierzchołek bez usuwania.  
- **Implementacje:**  
  - Tablica dynamiczna (z realokacją).  
  - Lista jednokierunkowa.  
  ```python
  stack = []
  stack.append(1)  # push
  stack.pop()      # pop
  ```

**b) Kolejka (FIFO):**  
- **Definicja:** Dodawanie (`enqueue`) z **tyłu**, usuwanie (`dequeue`) z **przodu**.  
- **Operacje:**  
  - `enqueue(item)`: $O(1)$  
  - `dequeue()`: $O(1)$  
- **Implementacje:**  
  - Lista dwukierunkowa.  
  - Tablica z dwoma wskaźnikami (front/rear) i cyklicznym buforem.  
  ```python
  from collections import deque
  queue = deque()
  queue.append(1)   # enqueue
  queue.popleft()   # dequeue
  ```

**Zastosowania:**  
- **Stos:** Parsowanie wyrażeń, rekurencja/iteracja, cofanie operacji.  
- **Kolejka:** Buforowanie, BFS, systemy kolejkowania.  

---


## **Systemy Operacyjne**  

#### **1. 💡 Znaczenie praw specjalnych o kodach "s" i "t" w systemach Unix/Linux/BSD**
**a) `s` (SetUID/SetGID):**  
- **SetUID (`s` w uprawnieniach właściciela):**  
  - Plik wykonywany z `s` (np. `-rwsr-xr-x`) uruchamia się z uprawnieniami **właściciela**, a nie użytkownika.  
  - Przykład: `passwd` (może modyfikować `/etc/shadow` jako root).  
  ```bash
  chmod u+s plik  # Ustawia SetUID
  ```
- **SetGID (`s` w uprawnieniach grupy):**  
  - Dla plików: Uruchamia z uprawnieniami **grupy właściciela**.  
  - Dla katalogów: Nowe pliki dziedziczą **grupę katalogu** (np. współdzielone foldery).  
  ```bash
  chmod g+s katalog  # Ustawia SetGID
  ```

**b) `t` (Sticky Bit):**  
- Dla katalogów: Tylko **właściciel pliku/katalogu** może usuwać/zmieniać nazwy swoich plików.  
- Przykład: Katalog `/tmp` (wszyscy mogą tworzyć pliki, ale nie usuwać cudzych).  
  ```bash
  drwxrwxrwt   # "t" na końcu uprawnień
  chmod +t /tmp  # Ustawia Sticky Bit
  ```

**Bezpieczeństwo:**  
- `s`/`t` zmniejszają ryzyko przypadkowego nadpisania/usuwań.  
- Nadużycie SetUID może prowadzić do eskalacji uprawnień (np. gdy plik z `s` ma luki).  

---

#### **2. 💡 Budowa systemu plików w systemach Unix/Linux**
**Hierarchia katalogów (FHS – Filesystem Hierarchy Standard):**  
| Ścieżka          | Zawartość                                                                 |  
|------------------|---------------------------------------------------------------------------|  
| `/`              | Katalog główny (root)                                                     |  
| `/bin`           | Podstawowe binarne polecenia (ls, cp)                                     |  
| `/etc`           | Pliki konfiguracyjne systemu                                              |  
| `/home`          | Katalogi domowe użytkowników                                              |  
| `/var`           | Dane zmienne (logi, cache, bazy danych)                                   |  
| `/dev`           | Pliki urządzeń (np. `/dev/sda` – dysk)                                    |  
| `/proc`          | Wirtualny system plików z informacjami o procesach/jądrze                 |  
| `/usr`           | Zasoby użytkownika (aplikacje, biblioteki, dokumentacja)                 |  

**Struktura inode:**  
- Każdy plik/katalog ma **inode** (metadane: rozmiar, uprawnienia, wskaźniki do bloków danych).  
- **Twarde dowiązania:** Wiele nazw plików do jednego inode.  
- **Miękkie dowiązania (symlink):** Wskaźnik do ścieżki (inny inode).  

**Przykład:**  
```bash
$ ls -i /etc/passwd  # Wyświetla numer inode
13245 /etc/passwd
```

---

#### **3. 💡 Koncepcja procesu w systemie operacyjnym**
**Definicja:** Proces to **wykonywane wystąpienie programu** z własną przestrzenią adresową, zasobami i stanem.  

**Stany procesu:**  
1. **Running:** Wykonywany na CPU.  
2. **Ready:** Gotowy do wykonania (czeka na przydział CPU).  
3. **Blocked:** Czeka na zdarzenie (np. I/O).  
4. **Zombie:** Zakończony, ale rekord jeszcze w tablicy procesów.  

**Struktura procesu:**  
- **PID (Process ID):** Unikalny identyfikator.  
- **PPID (Parent PID):** PID procesu-rodzica.  
- **Przestrzeń adresowa:** Kod, dane, stos, sterta.  
- **Kontekst:** Zawartość rejestrów CPU.  

**Narzędzia:**  
```bash
ps aux      # Lista procesów  
top         # Monitorowanie w czasie rzeczywistym  
pstree      # Drzewo procesów  
```

**Komunikacja międzyprocesowa (IPC):**  
- Potoki (`|`), gniazda, pamięć współdzielona, kolejki komunikatów.  

---

#### **4. 💡 Bash jako język programowania**
Bash to interpreter poleceń z możliwością pisania skryptów.  

**Kluczowe funkcje:**  
- **Zmienne:**  
  ```bash
  name="Jan"        # Przypisanie  
  echo "Witaj, $name"  # Odwołanie  
  ```
- **Struktury sterujące:**  
  ```bash
  # Warunkowe:  
  if [ "$a" -gt "$b" ]; then  
    echo "a > b"  
  fi  

  # Pętle:  
  for i in {1..5}; do  
    echo $i  
  done  

  while [ $counter -lt 5 ]; do  
    echo $counter  
    ((counter++))  
  done  
  ```
- **Funkcje:**  
  ```bash
  greet() {  
    echo "Witaj, $1!"  
  }  
  greet "Anna"  
  ```
- **Przetwarzanie tekstu:**  
  ```bash
  echo "Ala ma kota" | cut -d ' ' -f 2  # "ma"  
  grep "error" log.txt                  # Filtruje linie  
  ```

**Zastosowania:**  
- Automatyzacja zadań (backupy, deploy),  
- Konfiguracja systemu (np. skrypty startowe).  

---

#### **5. 💡 Zasada działania macierzy RAID**
**RAID (Redundant Array of Independent Disks):** Łączenie dysków w celu zwiększenia wydajności/niezawodności.  

| Typ   | Minimalna liczba dysków | Zasada działania                     | Zalety                                 | Wady                          |  
|-------|-------------------------|--------------------------------------|----------------------------------------|-------------------------------|  
| **RAID 0** | 2 | **Striping** (dane dzielone na bloki rozkładane równolegle) | Wysoka wydajność | Brak redundancji – awaria 1 dysku niszczy dane |  
| **RAID 1** | 2 | **Mirroring** (pełne dublowanie danych) | Odporność na awarie 1 dysku | 50% pojemności tracone na redundancję |  
| **RAID 5** | 3 | **Striping + parity distributed** (parzystość rozproszona) | Odporność na awarię 1 dysku, dobra wydajność czytania | Wolne zapisy (obliczanie parzystości) |  
| **RAID 6** | 4 | Jak RAID 5, ale z **dwiema parzystościami** | Odporność na awarie 2 dysków | Większy narzut pojemności |  
| **RAID 10** | 4 | **Mirroring + striping** (RAID 1+0) | Szybkość + odporność | Wysoki koszt (50% pojemności na redundancję) |  

**Przykład RAID 5:**  
```
Dysk1: Blok1, Blok4, Parzystość(B7,B10)  
Dysk2: Blok2, Parzystość(B5,B8), Blok10  
Dysk3: Parzystość(B1,B4), Blok3, Blok6  
```  
- Awaria 1 dysku → odtworzenie danych z parzystości.  

---

## **Architektura Komputerów**  

#### **1. 💡 Wykorzystanie rejestrów procesora (na przykładzie programu przetwarzającego łańcuchy znaków)**
Rejestry procesora to szybkie komórki pamięci wewnątrz CPU używane do tymczasowego przechowywania danych, adresów i wyników operacji.  

**Przykład programu w asemblerze x86 (kopiowanie łańcucha `src` do `dest`):**  
```assembly
section .data
    src db "Hello", 0   ; Źródłowy łańcuch
    dest times 6 db 0   ; Docelowy bufor

section .text
global _start
_start:
    mov esi, src        ; ESI = adres początku src (rejestr źródłowy)
    mov edi, dest       ; EDI = adres początku dest (rejestr docelowy)
    mov ecx, 6          ; ECX = licznik (długość łańcucha)

copy_loop:
    mov al, [esi]       ; AL (bajt z rejestru AX) = bieżący znak z src
    mov [edi], al       ; Zapisz AL do dest
    inc esi             ; ESI++ (przesuń wskaźnik źródłowy)
    inc edi             ; EDI++ (przesuń wskaźnik docelowy)
    dec ecx             ; ECX-- (dekrementuj licznik)
    jnz copy_loop       ; Skocz jeśli ECX != 0 (flaga ZF=0)

exit:
    mov eax, 1          ; Syscall exit
    int 0x80
```

**Wykorzystane rejestry i ich role:**  
| Rejestr | Rola                                                                 |  
|---------|----------------------------------------------------------------------|  
| **ESI** | **Rejestr źródłowy** – przechowuje adres bieżącego znaku w `src`.    |  
| **EDI** | **Rejestr docelowy** – przechowuje adres bieżącej pozycji w `dest`.  |  
| **ECX** | **Licznik** – śledzi pozostałe iteracje.                             |  
| **AL**  | **Rejestr akumulatora (8-bitowy)** – tymczasowo przechowuje znak.    |  
| **EFLAGS** | **Rejestr flag** – `dec ecx` ustawia flagę `ZF` (Zero Flag), używaną przez `jnz`. |  

**Kluczowe operacje:**  
- `mov`: Przenosi dane między pamięcią a rejestrami.  
- `inc`/`dec`: Inkrementacja/dekrementacja rejestrów.  
- `jnz`: Skok warunkowy (Jump if Not Zero) – kontrola przepływu.  

---

#### **2. 📘 Przykłady instrukcji arytmetycznych i logicznych asemblera**
**a) Instrukcje arytmetyczne:**  
| Instrukcja   | Składnia          | Działanie                     |  
|--------------|-------------------|-------------------------------|  
| `ADD`        | `ADD dst, src`    | `dst = dst + src`             |  
| `SUB`        | `SUB dst, src`    | `dst = dst - src`             |  
| `MUL`        | `MUL reg`         | `AX = AL * reg` (8-bit)       |  
| `DIV`        | `DIV reg`         | `AL = AX / reg` (iloraz)      |  

**b) Instrukcje logiczne:**  
| Instrukcja   | Składnia          | Działanie                     |  
|--------------|-------------------|-------------------------------|  
| `AND`        | `AND dst, src`    | `dst = dst & src` (bitowe AND)|  
| `OR`         | `OR dst, src`     | `dst = dst \| src` (bitowe OR)|  
| `XOR`        | `XOR dst, src`    | `dst = dst ⊕ src` (XOR)       |  
| `NOT`        | `NOT op`          | `op = ~op` (negacja bitowa)   |  

**Przykład działania `ADD`:**  
```assembly
mov eax, 5      ; EAX = 5
mov ebx, 3      ; EBX = 3
add eax, ebx    ; EAX = EAX + EBX → EAX = 8
```
**Rejestr flag po `ADD`:**  
- **CF (Carry Flag):** 1 jeśli wystąpiło przeniesienie.  
- **ZF (Zero Flag):** 1 jeśli wynik = 0.  
- **OF (Overflow Flag):** 1 jeśli przekroczono zakres.  

---

#### **3. 💡 Typy przerwań w procesorach x86**
Przerwania to mechanizm zatrzymania bieżącego wykonania programu w celu obsługi zdarzeń.  

| Typ przerwania     | Źródło                                  | Przykłady                                   |  
|--------------------|-----------------------------------------|--------------------------------------------|  
| **Sprzętowe (IRQ)**| Urządzenia zewnętrzne (klawiatura, dysk)| IRQ0: Timer systemowy, IRQ1: Klawiatura     |  
| **Programowe**     | Instrukcja `INT` w kodzie               | `INT 0x80`: Wywołanie systemowe w Linuxie   |  
| **Wyjątki**        | Błędy procesora                         | `#DE` (Dzielenie przez zero), `#PF` (Błąd strony) |  

**Cykl obsługi przerwania:**  
1. Zapis stanu procesora (rejestry) na stosie.  
2. Pobranie adresu procedury obsługi przerwania z **tablicy wektorów przerwań (IVT)**.  
3. Wykonanie procedury obsługi.  
4. Przywrócenie stanu procesora (`IRET`).  

**Przykład wywołania systemowego w Linuxie (przerwanie `0x80`):**  
```assembly
mov eax, 1  ; Numer syscall (exit)
mov ebx, 0  ; Kod powrotu
int 0x80    ; Przerwanie → kernel obsługuje wywołanie
```

---

#### **4. 💡 Wsparcie zarządzania pamięcią wirtualną w procesorach x86**   
Pamięć wirtualna to abstrakcja, która mapuje adresy wirtualne na fizyczne.  

**Mechanizmy w x86:**  
1. **Segmentacja:**  
   - Pamięć podzielona na segmenty (kod, dane, stos).  
   - Rejestry segmentowe: `CS` (code), `DS` (data), `SS` (stack).  
   - **Adres fizyczny = bazowy adres segmentu + offset**.  

2. **Stronicowanie (kluczowe dla pamięci wirtualnej!):**  
   - Pamięć podzielona na **strony** (4 KB) i **ramki**.  
   - **Struktury danych:**  
     - **Page Directory (PD):** Tablica 1024 wpisów, każdy wskazuje na Page Table.  
     - **Page Table (PT):** Tablica 1024 wpisów, każdy zawiera **adres ramki fizycznej + flagi**.  
   - **Translacja adresu (32-bit):**  
     ```
     Adres wirtualny: [ 10 bitów PD | 10 bitów PT | 12 bitów offset ]
        ↓
     CR3 rejestr → Page Directory → Page Table → Ramka fizyczna
     ```  
   - **Flagi w PT:**  
     - `P` (Present): 1 jeśli strona jest w pamięci.  
     - `R/W`: Uprawnienia (read/write).  
     - `U/S`: Tryb użytkownika/jądra.  

**Rola procesora:**  
- **MMU (Memory Management Unit):** Sprzętowa jednostka tłumacząca adresy.  
- **TLB (Translation Lookaside Buffer):** Cache translacji adresów.  
- **Faulty:** Jeśli `P=0` → **#PF (Page Fault)** → system operacyjny ładuje stronę z dysku.  

**Przykład: Obsługa Page Fault w systemie operacyjnym:**  
1. System wstrzymuje proces.  
2. Ładuje brakującą stronę z pliku strony (`/swap`) do wolnej ramki.  
3. Aktualizuje wpis w Page Table.  
4. Wznawia wykonanie procesu.  

---

## **Sieci Komputerowe**  

#### **1. 📘 Model ISO-OSI stosu protokołów komunikacyjnych**
Model ISO/OSI to **7-warstwowa architektura** standardów komunikacji sieciowej:  
1. **Fizyczna (Physical):** Przesył bitów przez medium (kabel, WiFi).  
   - Przykład: Ethernet (RJ45), DSL.  
2. **Łącza danych (Data Link):** Ramkowanie, adresacja MAC, kontrola błędów.  
   - Przykład: Ethernet (MAC), PPP.  
3. **Sieciowa (Network):** Routing między sieciami, adresacja logiczna (IP).  
   - Przykład: IP, ICMP, routery.  
4. **Transportowa (Transport):** Komunikacja end-to-end, kontrola przepływu.  
   - Przykład: TCP (połączeniowy), UDP (bezpołączeniowy).  
5. **Sesji (Session):** Zarządzanie sesjami (np. uruchamianie/kończenie połączeń).  
   - Przykład: NetBIOS, RPC.  
6. **Prezentacji (Presentation):** Translacja danych (szyfrowanie, kompresja).  
   - Przykład: SSL/TLS, JPEG.  
7. **Aplikacji (Application):** Interfejs dla użytkownika.  
   - Przykład: HTTP, FTP, SMTP.  

**Kluczowa zasada:** Warstwy komunikują się z odpowiadającymi warstwami na innych urządzeniach (encapsulation/decapsulation).  

---

#### **2. 💡 Charakterystyka modelu klient-serwer**
**Architektura:**  
- **Klient:** Inicjuje żądania (np. przeglądarka).  
- **Serwer:** Odbiera żądania, przetwarza, zwraca odpowiedzi (np. serwer WWW).  

**Cechy:**  
| Aspekt               | Klient                          | Serwer                     |  
|----------------------|---------------------------------|----------------------------|  
| **Rola**             | Konsument usług                 | Dostawca usług             |  
| **Inicjatywa**       | Aktywny (wysyła żądania)        | Pasywny (czeka na żądania) |  
| **Zasoby**           | Ograniczone                     | Wysokiej dostępności       |  
| **Przykłady**        | Przeglądarka, aplikacja mobilna | Apache, Nginx, bazy danych |  

**Zalety:**  
- Centralne zarządzanie danymi.  
- Łatwa skalowalność serwera.  
- Bezpieczeństwo (autoryzacja centralna).  

**Wady:**  
- Punkt awarii (serwer).  
- Koszt utrzymania infrastruktury.  

**Przeciwieństwo:** **P2P (peer-to-peer)** – każdy węzeł jest klientem i serwerem (np. BitTorrent).  

---

#### **3. 📘 Pojęcie topologii fizycznej sieci komputerowych, przykłady topologii**
**Topologia fizyczna** = układ fizycznych połączeń między urządzeniami.  

| Typ topologii      | Opis                                                                 | Zalety/Wady                                                                 |  
|--------------------|----------------------------------------------------------------------|-----------------------------------------------------------------------------|  
| **Gwiazda (Star)** | Wszystkie urządzenia podłączone do centralnego huba/switche.         | **+** Łatwa diagnostyka<br>**-** Awaria huba paraliżuje sieć               |  
| **Pierścień (Ring)**| Urządzenia połączone w zamknięty pierścień (dane krążą w pętli).     | **+** Brak kolizji<br>**-** Awaria jednego urządzenia blokuje sieć         |  
| **Szyna (Bus)**    | Wszystkie urządzenia podłączone do jednej magistrali kablowej.       | **+** Niski koszt<br>**-** Kolizje danych; awaria kabla paraliżuje sieć    |  
| **Siatka (Mesh)**  | Każde urządzenie ma bezpośrednie połączenie z wieloma innymi.        | **+** Nadmiarowość (odporność na awarie)<br>**-** Wysoki koszt okablowania |  
| **Drzewo (Tree)**  | Hierarchia urządzeń (np. gwiazdy połączone magistralą).              | **+** Skalowalność<br>**-** Złożona konfiguracja                           |  

**Przykład zastosowania:**  
- **Biuro:** Topologia gwiazdy (łatwe zarządzanie).  
- **Internet:** Topologia siatki (odporność na awarie).  

---

#### **4. 💡 Organizacja domen w sieci Internet**
**Domena** = czytelna dla człowieka nazwa zastępująca adres IP (np. `google.com`).  

**Hierarchia DNS:**  
1. **Root (.)**: Najwyższy poziom (serwery root zarządzane przez IANA).  
2. **TLD (Top-Level Domain)**:  
   - `gTLD`: `.com`, `.org`, `.net`  
   - `ccTLD`: `.pl`, `.de`, `.jp`  
   - `nTLD`: `.app`, `.blog`  
3. **Domeny drugiego poziomu**: `example.com`, `wikipedia.org`  
4. **Subdomeny**: `shop.example.com`, `en.wikipedia.org`  

**Proces rozwiązywania nazw DNS:**  
1. Klient pyta **rekurencyjny resolver** (np. dostawcy internetu).  
2. Resolver pyta **root serwer** o adres serwera TLD dla `.com`.  
3. Resolver pyta **serwer TLD** o adres serwera `example.com`.  
4. Resolver pyta **serwer autorytatywny** `example.com` o adres `www.example.com`.  
5. Resolver zwraca adres IP klientowi.  

**Zarządzanie:**  
- **ICANN**: Nadzór nad TLD.  
- **Rejestratorzy**: Sprzedają domeny (np. GoDaddy).  

---

#### **5. 💡 Porównanie działania protokołów TCP i UDP**

| Kryterium          | TCP (Transmission Control Protocol)       | UDP (User Datagram Protocol)        |  
|--------------------|-------------------------------------------|--------------------------------------|  
| **Połączenie**     | Połączeniowe (handshake: SYN-SYN/ACK-ACK) | Bezpołączeniowe                      |  
| **Niezawodność**   | Gwarantuje dostarczenie (retransmisje)    | Brak gwarancji                       |  
| **Kolejność danych**| Zachowuje kolejność pakietów             | Nie zachowuje kolejności             |  
| **Kontrola przepływu**| Tak (dostosowuje szybkość)             | Nie                                  |  
| **Nagłówek**       | 20-60 bajtów (złożony)                   | 8 bajtów (prosty)                    |  
| **Przepustowość**  | Wolniejszy (narzut)                      | Szybszy (mniejszy narzut)            |  
| **Zastosowania**   | HTTP, FTP, SSH, email                    | DNS, VoIP, streaming, gry online     |  

**Przykład TCP:**  
```  
Klient: SYN →  
Serwer: SYN-ACK →  
Klient: ACK + dane  
```  
**Przykład UDP:**  
```  
Klient: DANE → (bez potwierdzenia)  
```  

---

#### **6. 📘 Protokoły poczty elektronicznej**
**a) SMTP (Simple Mail Transfer Protocol):**  
- **Port:** 25 (lub 465/587 dla szyfrowania).  
- **Funkcja:** Wysyłanie wiadomości między serwerami.  
- **Przepływ:**  
  ```  
  Nadawca → Serwer SMTP nadawcy → Serwer SMTP odbiorcy → Skrzynka odbiorcy  
  ```  

**b) POP3 (Post Office Protocol v3):**  
- **Port:** 110 (lub 995 dla SSL).  
- **Funkcja:** Pobieranie wiadomości **z serwera na lokalne urządzenie** (usuwa z serwera).  
- **Komendy:** `USER`, `PASS`, `RETR`, `DELE`.  

**c) IMAP (Internet Message Access Protocol):**  
- **Port:** 143 (lub 993 dla SSL).  
- **Funkcja:** Zarządzanie wiadomościami **bezpośrednio na serwerze** (synchronizacja między urządzeniami).  
- **Zalety:** Obsługa folderów, wyszukiwanie po stronie serwera.  

**Format wiadomości (MIME):**  
- **Struktura:**  
  ```  
  Nagłówki (From, To, Subject)  
  Pusta linia  
  Ciało wiadomości (tekst/HTML/załączniki)  
  ```  
- **Kodowanie:** Base64 dla załączników binarnych.  

---


## **Bazy Danych**  

#### **1. 📘 Pojęcia klucza w relacyjnych bazach danych i słowa kluczowe w SQL**
**Klucze:**  
- **Klucz główny (Primary Key):** Unikalnie identyfikuje wiersz w tabeli (np. `id`).  
  ```sql
  CREATE TABLE Users (
      id INT PRIMARY KEY,  -- Definicja klucza
      name VARCHAR(50)
  );
  ```  
- **Klucz obcy (Foreign Key):** Wskazuje na klucz główny innej tabeli, tworząc relację.  
  ```sql
  CREATE TABLE Orders (
      order_id INT PRIMARY KEY,
      user_id INT REFERENCES Users(id)  -- Klucz obcy
  );
  ```  
- **Klucz kandydujący (Candidate Key):** Zbiór atrybutów mogących pełnić rolę klucza głównego (np. `email` lub `pesel`).  
- **Nadklucz (Super Key):** Nadzbiór klucza kandydującego (np. `id + email`).  

**Słowa kluczowe SQL:**  
- `PRIMARY KEY`  
- `FOREIGN KEY ... REFERENCES`  
- `UNIQUE` (dla kluczy kandydujących)  

---

#### **2. 📘 Warunki poprawności (więzy) dla tabel baz danych**
**Więzy integralności:**  
| Typ więzu              | Opis                                                                 | Przykład SQL                                  |  
|------------------------|----------------------------------------------------------------------|-----------------------------------------------|  
| **Encja (NOT NULL)**   | Kolumna nie może być pusta.                                          | `name VARCHAR(50) NOT NULL`                   |  
| **Domeny (CHECK)**     | Wartość musi spełniać warunek.                                       | `age INT CHECK (age >= 18)`                   |  
| **Klucza (UNIQUE)**    | Wartości w kolumnie muszą być unikalne.                              | `email VARCHAR(100) UNIQUE`                   |  
| **Referencyjna (FOREIGN KEY)** | Wartość w kolumnie musi istnieć w innej tabelie.                   | `FOREIGN KEY (dept_id) REFERENCES Departments(id)` |  

**Przykład złożonego więzu:**  
```sql
CREATE TABLE Employees (
    id INT PRIMARY KEY,
    salary DECIMAL(10,2) CHECK (salary > 0),
    dept_id INT NOT NULL,
    FOREIGN KEY (dept_id) REFERENCES Departments(id)
);
```

---

#### **3. 💡 Pojęcie transakcji, własności transakcji, przykłady negatywnych zjawisk**
**Transakcja:** Sekwencja operacji traktowana jako **niepodzielna jednostka pracy** (np. przelew bankowy).  

**Własności ACID:**  
| Własność       | Opis                                                                 |  
|----------------|----------------------------------------------------------------------|  
| **Atomowość (Atomicity)** | Transakcja wykonuje się w całości lub wcale (cofnięcie przy błędzie). |  
| **Spójność (Consistency)** | Transakcja prowadzi bazę z jednego stanu spójnego w inny.           |  
| **Izolacja (Isolation)** | Współbieżne transakcje nie wpływają na siebie.                      |  
| **Trwałość (Durability)** | Po zatwierdzeniu zmiany są permanentne.                             |  

**Negatywne zjawiska bez transakcji:**  
- **Brudne odczyty (Dirty Reads):** Odczyt niezatwierdzonych danych (np. odczyt anulowanego przelewu).  
- **Nierepeatowalne odczyty (Non-repeatable Reads):** Różne wyniki przy powtórzeniu odczytu (np. zmiana salda podczas odczytu).  
- **Odczyty fantomowe (Phantom Reads):** Pojawienie się nowych wierszy między odczytami (np. nowy użytkownik podczas generowania raportu).  

**SQL:**  
```sql
BEGIN TRANSACTION;  -- Start transakcji
UPDATE Accounts SET balance = balance - 100 WHERE id = 1;
UPDATE Accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;  -- Zatwierdź
-- ROLLBACK; -- Cofnij w przypadku błędu
```

---

#### **4. 💡 Negatywne strony redundancji w bazach danych, przykłady, sposoby zwalczania**
**Redundancja = powielanie danych.**  
**Negatywne skutki:**  
- **Niespójność danych:** Aktualizacja w jednym miejscu, brak w innym (np. zmiana adresu klienta w `Orders`, ale nie w `Users`).  
- **Marnotrawstwo miejsca:** Powielone dane zajmują przestrzeń.  
- **Trudności w utrzymaniu:** Złożone aktualizacje.  

**Przykład redundancji:**  
Tabela `Orders` przechowuje:  
| `order_id` | `user_name` | `user_address` | ... |  
|------------|-------------|----------------|-----|  
| 101        | Jan Kowalski| Kraków         | ... |  

*Problem:* Jeśli adres użytkownika zmieni się w `Users`, `Orders` będzie przechowywać starą wartość.  

**Sposoby zwalczania:**  
1. **Normalizacja bazy danych:**  
   - **1NF:** Brak powtarzających się grup.  
   - **2NF:** Usuń zależności częściowe (klucz główny → atrybuty).  
   - **3NF:** Usuń zależności przechodnie (np. `user_id → user_address`).  
2. **Relacje zamiast powielania:**  
   ```sql
   CREATE TABLE Users (id INT PRIMARY KEY, name VARCHAR, address VARCHAR);
   CREATE TABLE Orders (id INT PRIMARY KEY, user_id INT REFERENCES Users(id));
   ```  
3. **Widoki (VIEW):** Łączenie danych bez fizycznej redundancji.  

---

#### **5. 💡 Realizacja operacji rzutu i wyboru relacji w SQL; inne operacje**
**a) Rzut (PROJECT):** Wybór kolumn.  
- SQL: `SELECT kolumna1, kolumna2 FROM tabela`  
  ```sql
  SELECT name, email FROM Users;  -- Rzut na kolumny name, email
  ```  

**b) Wybór (SELECT):** Filtrowanie wierszy.  
- SQL: `SELECT ... WHERE warunek`  
  ```sql
  SELECT * FROM Orders WHERE total > 100;  -- Wybór wierszy spełniających warunek
  ```  

**c) Inne operacje algebry relacji w SQL:**  
| Operacja          | Algebra relacji | SQL                                     |  
|-------------------|-----------------|-----------------------------------------|  
| **Złączenie (JOIN)** | $R \bowtie S$ | `SELECT * FROM R JOIN S ON R.id=S.id`   |  
| **Suma (UNION)**  | $R \cup S$    | `SELECT ... UNION SELECT ...`           |  
| **Różnica (EXCEPT)**| $R - S$      | `SELECT ... EXCEPT SELECT ...`          |  
| **Iloczyn kartezjański** | $R \times S$ | `SELECT * FROM R, S`                  |  

**Przykład złączenia:**  
```sql
SELECT Users.name, Orders.total 
FROM Users 
JOIN Orders ON Users.id = Orders.user_id;  -- Połączenie tabel
```

---

#### **6. 📘 Rodzaje związków w relacyjnych bazach danych i realizacja w SQL**
**Trzy rodzaje związków:**  
1. **1:1 (jeden do jednego):**  
   - *Przykład:* Użytkownik ma jeden profil.  
   - **Realizacja w SQL:** Wspólny klucz główny lub klucz obcy z `UNIQUE`.  
     ```sql
     CREATE TABLE Users (id INT PRIMARY KEY, ...);
     CREATE TABLE Profiles (
         user_id INT PRIMARY KEY REFERENCES Users(id), 
         bio TEXT
     );
     ```  

2. **1:N (jeden do wielu):**  
   - *Przykład:* Dział ma wielu pracowników.  
   - **Realizacja w SQL:** Klucz obcy w tabeli "wiele".  
     ```sql
     CREATE TABLE Departments (id INT PRIMARY KEY);
     CREATE TABLE Employees (
         id INT PRIMARY KEY,
         dept_id INT REFERENCES Departments(id)  -- Klucz obcy
     );
     ```  

3. **N:M (wiele do wielu):**  
   - *Przykład:* Student ma wiele kursów, kurs ma wielu studentów.  
   - **Realizacja w SQL:** Tabela łącząca z kluczami obcymi.  
     ```sql
     CREATE TABLE Students (id INT PRIMARY KEY);
     CREATE TABLE Courses (id INT PRIMARY KEY);
     CREATE TABLE Enrollments (
         student_id INT REFERENCES Students(id),
         course_id INT REFERENCES Courses(id),
         PRIMARY KEY (student_id, course_id)  -- Klucz złożony
     );
     ```  

---

#### **7. 💡 Problemy usuwania przy kluczu obcym i rozwiązania**   
**Problem:** Usunięcie rekordu, do którego odwołują się inne tabele, narusza integralność.  
*Przykład:*  
```sql
DELETE FROM Users WHERE id = 1;  -- Błąd, jeśli Orders odwołuje się do user_id=1
```  

**Rozwiązania (ON DELETE):**  
| Opcja             | Działanie                                                                 | Przykład SQL                                      |  
|-------------------|---------------------------------------------------------------------------|---------------------------------------------------|  
| **RESTRICT**      | Blokuje usunięcie (domyślne).                                             | `FOREIGN KEY ... ON DELETE RESTRICT`              |  
| **CASCADE**       | Automatycznie usuwa powiązane rekordy.                                     | `FOREIGN KEY ... ON DELETE CASCADE`               |  
| **SET NULL**      | Ustawia klucz obcy na `NULL` w powiązanych rekordach.                     | `FOREIGN KEY ... ON DELETE SET NULL`              |  
| **SET DEFAULT**   | Ustawia klucz obcy na wartość domyślną w powiązanych rekordach.           | `FOREIGN KEY ... ON DELETE SET DEFAULT`           |  
| **NO ACTION**     | Jak `RESTRICT` (standard SQL).                                            | `FOREIGN KEY ... ON DELETE NO ACTION`             |  

**Przykład z `CASCADE`:**  
```sql
CREATE TABLE Orders (
    id INT PRIMARY KEY,
    user_id INT REFERENCES Users(id) ON DELETE CASCADE  -- Usuń zamówienia, gdy użytkownik jest usuwany
);
```  

---

## **Podstawy Inżynierii Oprogramowania**  

#### **1. 💡 Przypadki użycia (use cases) w UML: notacja, zastosowania, diagram dla bankomatu**
**Definicja:** Przypadki użycia opisują **interakcje między aktorami a systemem** w celu osiągnięcia konkretnego celu.  
- **Aktor:** Rola zewnętrzna (człowiek/system) inicjująca interakcję (np. "Klient", "Bank").  
- **Przypadek użycia:** Funkcjonalność systemu (np. "Wypłata gotówki").  

**Notacja UML:**  
- **Aktor:** Stick figure (🧍).  
- **Przypadek użycia:** Elipsa z nazwą.  
- **Relacje:**  
  - `→` (Asocjacja): Aktor wywołuje przypadek użycia.  
  - `⪧` (Include): Wymagane wywołanie innego przypadku (np. "Weryfikuj PIN" musi być w "Wypłata gotówki").  
  - `⪦` (Extend): Opcjonalne rozszerzenie (np. "Drukuj potwierdzenie" rozszerza "Wypłata gotówki").  

**Diagram dla bankomatu:**  
```  
[Klient] → (Wypłata gotówki) 
(Wypłata gotówki) ⪧ (Weryfikuj PIN)  
(Wypłata gotówki) ⪦ (Drukuj potwierdzenie)  
[Bank] → (Aktualizuj saldo)  
```  
**Zastosowania:**  
- Identyfikacja wymagań funkcjonalnych.  
- Komunikacja z interesariuszami (np. klientem).  

---

#### **2. 💡 Diagram klas w UML: składnia, zastosowania, diagram dla programu opisującego samochód**   
**Definicja:** Diagram klas modeluje **strukturę systemu** (klasy, atrybuty, metody, relacje).  

**Składnia:**  
- **Klasa:** Prostokąt z sekcjami: `Nazwa | Atrybuty | Metody()`.  
- **Relacje:**  
  - **Asocjacja:** Linia (np. `Samochód — Silnik`).  
  - **Agregacja:** ◇ (część może istnieć bez całości, np. `Warsztat ◇— Samochód`).  
  - **Kompozycja:** ◆ (część niszczona z całością, np. `Samochód ◆— Koło`).  
  - **Dziedziczenie:** △ (strzałka pusta, np. `Pojazd ←△ Samochód`).  

**Diagram dla programu "Samochód":**  
```  
[Pojazd]  
△  
[Samochód]  
| marka: String  
| model: String  
| start()  
|  
◆— [Silnik]  
| typ: String  
| pojemność: Float  
|  
◇— [Kierowca]  
| imię: String  
|  
```  
**Zastosowania:**  
- Projektowanie struktury obiektowej.  
- Dokumentacja architektury systemu.  

---

#### **3. 💡 Diagram sekwencji w UML: składnia, zastosowania, diagram dla scenariusza bankomatu**   
**Definicja:** Diagram sekwencji pokazuje **kolejność komunikatów między obiektami** w scenariuszu.  

**Składnia:**  
- **Obiekty:** Prostokąt z nazwą (`:Klasa`).  
- **Linia życia:** Linia przerywana od obiektu.  
- **Komunikat:** Strzałka:  
  - `→` (Synchroniczny, oczekuje odpowiedzi).  
  - `⤍` (Asynchroniczny, bez oczekiwania).  
- **Aktywacja:** Prostokąt na linii życia (czas wykonania).  

**Diagram dla scenariusza "Wypłata gotówki":**  
```  
[Klient]       [:Bankomat]       [:SystemBankowy]  
   | → Włóż kartę       |                   |  
   | ← Wprowadź PIN     |                   |  
   | → PIN: "1234"      | → Sprawdź PIN()   |  
   |               | ←----- Poprawny ----|  
   | → Kwota: 500  | → Sprawdź saldo()  |  
   |               | ←----- Saldo OK ---|  
   | ← Wypłata gotówki | → Zaktualizuj saldo()  
```  
**Zastosowania:**  
- Projektowanie logiki biznesowej.  
- Testowanie scenariuszy.  

---

#### **4. 💡 Diagram stanu w UML: składnia, zastosowania, diagram dla automatu z napojami**
**Definicja:** Diagram stanów modeluje **zachowanie obiektu w reakcji na zdarzenia**.  

**Składnia:**  
- **Stan:** Zaokrąglony prostokąt (np. "Oczekiwanie").  
- **Przejście:** Strzałka z etykietą `zdarzenie [warunek] / akcja`.  
- **Stany specjalne:**  
  - ● (Stan początkowy).  
  - ⬭ (Stan końcowy).  

**Diagram dla automatu z napojami:**  
```  
● → [Oczekiwanie]  
|   "Wybierz napój" [brak monety] → [Błąd: "Wrzuć monetę"]  
|   "Wrzuć monetę" / suma += wartość → [Akceptacja monet]  
|   "Wybierz napój" [suma >= cena] / wydaj napój → [Wydawanie napoju] → ⬭  
|   "Wybierz napój" [suma < cena] → [Błąd: "Niewystarczająca kwota"]  
```  
**Zastosowania:**  
- Modelowanie zachowania urządzeń (np. automaty).  
- Implementacja maszyn stanowych w kodzie.  

---

#### **5. 💡 Podstawowe fazy tworzenia oprogramowania; charakteryzacja co najmniej trzech modeli cyklu życia**
**Fazy tworzenia oprogramowania:**  
1. **Zbieranie wymagań:** Definicja potrzeb klienta.  
2. **Projektowanie:** Architektura systemu (diagramy UML).  
3. **Implementacja:** Kodowanie.  
4. **Testowanie:** Weryfikacja poprawności.  
5. **Wdrożenie:** Instalacja u klienta.  
6. **Utrzymanie:** Naprawa błędów i aktualizacje.  

**Modele cyklu życia:**  
| Model          | Charakterystyka                                                                 | Zalety/Wady                                  |  
|----------------|---------------------------------------------------------------------------------|----------------------------------------------|  
| **Kaskadowy**  | Fazy wykonują się **liniowo** (zakończenie jednej → start następnej).          | **+** Prosta dokumentacja<br>**-** Brak elastyczności, zmiany trudne |  
| **Iteracyjny** | System budowany **w cyklach** (każda iteracja dostarcza działający podsystem). | **+** Elastyczność na zmiany<br>**-** Złożone zarządzanie |  
| **Agile (Scrum)**| **Przyrosty** (sprinty 2-4 tyg.), codzienne spotkania, backlog zadań.         | **+** Szybka reakcja na zmiany<br>**-** Wymaga zaangażowania klienta |  
| **Spiralny**   | Połączenie kaskadowego i iteracyjnego + **analiza ryzyka** w każdej iteracji.  | **+** Skupienie na ryzykach<br>**-** Wysokie koszty |  

**Przykład Agile/Scrum:**  
- **Sprint Planning:** Wybór zadań z backlogu.  
- **Daily Stand-up:** 15-minutowe spotkanie (co zrobiłem? co zrobię? blokady?).  
- **Sprint Review:** Prezentacja przyrostu klientowi.  
- **Retrospective:** Usprawnienia procesu.  

---

