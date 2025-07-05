## **Analiza Matematyczna**

#### **1. 📘 Podaj definicję granicy ciągu liczbowego. Sformułuj treść twierdzenia o trzech ciągach.**  
**Definicja granicy ciągu**:  
Ciąg liczbowy $(a_n)$ ma granicę $g \in \mathbb{R}$ (ozn. $\lim_{n \to \infty} a_n = g$), jeśli:  
$$
\forall \varepsilon > 0  \ \exists N \in \mathbb{N}  \ \forall n > N : |a_n - g| < \varepsilon.
$$  
**Twierdzenie o trzech ciągach**:  
Jeśli dla ciągów $(a_n)$, $(b_n)$, $(c_n)$ zachodzi:  
1. $\exists N_0 \ \forall n > N_0 : a_n \leq b_n \leq c_n$,  
2. $\lim_{n \to \infty} a_n = \lim_{n \to \infty} c_n = g$,  
to $\lim_{n \to \infty} b_n = g$.

---

#### **2. 📘 Podaj definicję pochodnej funkcji jednej zmiennej. Sformułuj twierdzenie o wartości średniej Lagrange’a.**  
**Definicja pochodnej**:  
Pochodną funkcji $f$ w punkcie $x_0$ nazywamy granicę:  
$$
f'(x_0) = \lim_{h \to 0} \frac{f(x_0 + h) - f(x_0)}{h}, \quad \text{o ile istnieje}.
$$  
**Twierdzenie Lagrange’a**:  
Jeśli funkcja $f$ jest:  
1. Ciągła w przedziale domkniętym $[a,b]$,  
2. Różniczkowalna w przedziale otwartym $(a,b)$,  
to istnieje $c \in (a,b)$ takie, że:  
$$
f'(c) = \frac{f(b) - f(a)}{b - a}.
$$

---

#### **3. 💡 Omów pojęcie ekstremum lokalnego funkcji jednej zmiennej. Podaj warunek konieczny i wystarczający jego istnienia.**  
**Ekstremum lokalne**:  
- **Minimum lokalne**: $f(x_0) \leq f(x)$ dla $x$ w otoczeniu $x_0$.  
- **Maksimum lokalne**: $f(x_0) \geq f(x)$ dla $x$ w otoczeniu $x_0$.  

**Warunek konieczny (Fermata)**:  
Jeśli $f$ ma ekstremum lokalne w $x_0$ i jest różniczkowalna w $x_0$, to $f'(x_0) = 0$.  

**Warunki wystarczające**:  
1. **Pierwsza pochodna**:  
   - Jeśli $f'(x)$ zmienia znak z $-$ na $+$ w $x_0$, to $f$ ma minimum lokalne w $x_0$.  
   - Jeśli $f'(x)$ zmienia znak z $+$ na $-$ w $x_0$, to $f$ ma maksimum lokalne w $x_0$.  

2. **Druga pochodna**:  
   - Jeśli $f'(x_0) = 0$ i $f''(x_0) > 0$, to $f$ ma minimum lokalne w $x_0$.  
   - Jeśli $f'(x_0) = 0$ i $f''(x_0) < 0$, to $f$ ma maksimum lokalne w $x_0$.

---

#### **4. 📘 Podaj warunek konieczny zbieżności szeregu liczbowego oraz dwa kryteria jego zbieżności.**  
**Warunek konieczny zbieżności**:  
Jeśli szereg $\sum_{n=1}^{\infty} a_n$ jest zbieżny, to $\lim_{n \to \infty} a_n = 0$.  

**Kryteria zbieżności**:  
1. **Kryterium porównawcze**:  
   Jeśli $0 \leq a_n \leq b_n$ i $\sum b_n$ zbieżny, to $\sum a_n$ zbieżny.  
2. **Kryterium d’Alemberta (ilorazowe)**:  
   Jeśli $\lim_{n \to \infty} \left| \frac{a_{n+1}}{a_n} \right| = g$:  
   - $g < 1$ → szereg zbieżny,  
   - $g > 1$ → szereg rozbieżny.

---

#### **5. 💡 Wyjaśnij pojęcia: funkcja pierwotna, całka nieoznaczona. Podaj wzór na całkowanie przez części.**  
**Funkcja pierwotna**:  
Funkcja $F$ jest pierwotną funkcji $f$ w przedziale $I$, jeśli $\forall x \in I: F'(x) = f(x)$.  

**Całka nieoznaczona**:  
Zbiór wszystkich funkcji pierwotnych $f$ oznaczamy $\int f(x)  dx = F(x) + C$, gdzie $C$ – stała.  

**Całkowanie przez części**:  
$$
\int u  dv = uv - \int v  du, \quad \text{gdzie } u = u(x),  dv = v'(x)  dx.
$$  
*Przykład*:  
$\int x e^x  dx = x e^x - \int e^x  dx = x e^x - e^x + C$.

---

#### **6. 💡 Podaj interpretację geometryczną całki oznaczonej. Sformułuj podstawowy wzór rachunku różniczkowego i całkowego.**  
**Interpretacja geometryczna**:  
Całka oznaczona $\int_a^b f(x)  dx$ to pole obszaru ograniczonego:  
- osią $OX$,  
- prostymi $x = a$ i $x = b$,  
- wykresem funkcji $f(x)$ (dla $f(x) \geq 0$).  

**Podstawowe twierdzenie rachunku całkowego (Newtona-Leibniza)**:  
Jeśli $f$ jest ciągła w $[a,b]$ i $F$ jest jej funkcją pierwotną, to:  
$$
\int_a^b f(x)  dx = F(b) - F(a).
$$

---


## **Algebra Liniowa**

#### **1. 📘 Podaj definicję postaci algebraicznej oraz definicję postaci trygonometrycznej liczby zespolonej. Podaj też własności działań na liczbach zespolonych w postaci trygonometrycznej.**  
**Postać algebraiczna**:  
Liczba zespolona $ z = a + bi $, gdzie:  
- $ a, b \in \mathbb{R} $ – część rzeczywista (Re) i urojona (Im),  
- $ i $ – jednostka urojona ($ i^2 = -1 $).  

**Postać trygonometryczna**:  
$ z = r(\cos \varphi + i \sin \varphi) $, gdzie:  
- $ r = |z| = \sqrt{a^2 + b^2} $ – moduł,  
- $ \varphi = \arg z $ – argument (kąt z osią Re).  

**Własności działań w postaci trygonometrycznej**:  
- **Mnożenie**:  
  $$
  z_1 \cdot z_2 = r_1 r_2 \left[ \cos(\varphi_1 + \varphi_2) + i \sin(\varphi_1 + \varphi_2) \right]
  $$  
- **Dzielenie**:  
  $$
  \frac{z_1}{z_2} = \frac{r_1}{r_2} \left[ \cos(\varphi_1 - \varphi_2) + i \sin(\varphi_1 - \varphi_2) \right]
  $$  
- **Potęgowanie (wzór de Moivre’a)**:  
  $$
  z^n = r^n \left[ \cos(n\varphi) + i \sin(n\varphi) \right]
  $$  
- **Pierwiastkowanie**:  
  $$
  \sqrt[n]{z} = \sqrt[n]{r} \left[ \cos\left(\frac{\varphi + 2k\pi}{n}\right) + i \sin\left(\frac{\varphi + 2k\pi}{n}\right) \right], \quad k=0,1,\dots,n-1.
  $$

---

#### **2. 📘 Podaj definicje i własności podstawowych działań na macierzach.**  
**Definicje działań**:  
- **Dodawanie**: $ [A + B]_{ij} = a_{ij} + b_{ij} $ (macierze tych samych wymiarów).  
- **Mnożenie przez skalar**: $ [cA]_{ij} = c \cdot a_{ij} $.  
- **Mnożenie macierzy**: $ [A \cdot B]_{ij} = \sum_{k} a_{ik} b_{kj} $ (liczba kolumn $A$ = liczba wierszy $B$).  
- **Transpozycja**: $ [A^T]_{ij} = a_{ji} $.  

**Własności**:  
- **Dodawanie**: przemienne ($A+B=B+A$), łączne ($A+(B+C)=(A+B)+C$).  
- **Mnożenie macierzy**: łączne ($A(BC)=(AB)C$), **nie** przemienne ($AB \neq BA$).  
- **Rozdzielność**: $A(B+C) = AB + AC$.  
- **Transpozycja**: $(AB)^T = B^T A^T$, $(A^T)^T = A$.

---

#### **3. 💡 Podaj definicję i własności macierzy odwrotnej oraz omów metody wyznaczania macierzy odwrotnej.**  
**Definicja**:  
Macierz $ A^{-1} $ jest odwrotna do $ A $ (kwadratowej), jeśli:  
$$
A \cdot A^{-1} = A^{-1} \cdot A = I \quad (\text{macierz jednostkowa}).
$$  
**Własności**:  
- $(A^{-1})^{-1} = A$,  
- $(AB)^{-1} = B^{-1} A^{-1}$,  
- $(A^T)^{-1} = (A^{-1})^T$.  

**Metody wyznaczania**:  
1. **Wzór z dopełnień algebraicznych**:  
   $$
   A^{-1} = \frac{1}{\det A} \cdot (\text{macierz dopełnień})^T.
   $$  
2. **Metoda Gaussa-Jordana**:  
   - Tworzymy macierz blokową $[A | I]$,  
   - Redukujemy $A$ do postaci jednostkowej operacjami wierszowymi,  
   - Po redukcji blok prawy to $A^{-1}$.  
3. **Warunek istnienia**: $\det A \neq 0$ (macierz nieosobliwa).

---

#### **4. 📘 Przedstaw podstawowe własności i metody obliczania wyznacznika macierzy kwadratowej.**  
**Własności wyznacznika ($\det A$)**:  
- $\det(AB) = \det A \cdot \det B$,  
- $\det(A^T) = \det A$,  
- Zamiana wierszy/kolumn zmienia znak $\det$,  
- $\det(cA) = c^n \det A$ (dla macierzy $n \times n$).  

**Metody obliczania**:  
- **Rozwinięcie Laplace’a** (względem $i$-tego wiersza):  
  $$
  \det A = \sum_{j=1}^n (-1)^{i+j} a_{ij} \cdot M_{ij},
  $$  
  gdzie $M_{ij}$ – minor (wyznacznik podmacierzy bez $i$-tego wiersza i $j$-tej kolumny).  
- **Metoda Gaussa**:  
  - Sprowadzamy macierz do postaci trójkątnej operacjami wierszowymi (bez skalowania!),  
  - $\det A$ = iloczyn elementów na przekątnej.  

---

#### **5. 💡 Omów różne metody rozwiązywania układów równań liniowych.**  
**Układ $n$ równań z $n$ niewiadomymi**: $ A\mathbf{x} = \mathbf{b} $.  
1. **Metoda Cramera** (tylko gdy $\det A \neq 0$):  
   $$
   x_k = \frac{\det A_k}{\det A},
   $$  
   gdzie $A_k$ – macierz $A$ z $k$-tą kolumną zastąpioną wektorem $\mathbf{b}$.  
2. **Metoda macierzy odwrotnej** (tylko gdy $\det A \neq 0$):  
   $$
   \mathbf{x} = A^{-1} \mathbf{b}.
   $$  
3. **Metoda eliminacji Gaussa**:  
   - Tworzymy macierz rozszerzoną $[A | \mathbf{b}]$,  
   - Sprowadzamy do postaci schodkowej (górnotrójkątnej),  
   - Rozwiązujemy od ostatniego równania w górę.  
4. **Metoda Gaussa-Jordana**:  
   - Redukujemy macierz rozszerzoną do postaci jednostkowej,  
   - Wektor rozwiązań w ostatniej kolumnie.

---

#### **6. 💡 Omów najważniejsze podprzestrzenie wektorowe związane z macierzą, sposoby wyznaczania tych podprzestrzeni, ich bazy i wymiary.**  
**Kluczowe podprzestrzenie** (dla macierzy $A_{m \times n}$):  
1. **Przestrzeń kolumnowa (obraz)**:  
   - $\text{Col}(A) = \{ A\mathbf{x} \mid \mathbf{x} \in \mathbb{R}^n \}$,  
   - **Baza**: kolumny liniowo niezależne z $A$ (po redukcji do postaci schodkowej),  
   - **Wymiar**: $\text{rk}(A)$ (rząd macierzy).  
2. **Przestrzeń wierszowa**:  
   - $\text{Row}(A) = \text{Col}(A^T)$,  
   - **Baza**: niezerowe wiersze z zredukowanej postaci schodkowej,  
   - **Wymiar**: $\text{rk}(A)$.  
3. **Jądro (jądro)**:  
   - $\text{Ker}(A) = \{ \mathbf{x} \mid A\mathbf{x} = \mathbf{0} \}$,  
   - **Baza**: rozwiązania bazowe układu jednorodnego,  
   - **Wymiar**: $n - \text{rk}(A)$ (twierdzenie o rzędzie).

---

#### **7. 💡 Przedstaw podstawowe własności i zastosowania iloczynu skalarnego wektorów.**  
**Definicja** (w $\mathbb{R}^n$):  
$$
\mathbf{u} \cdot \mathbf{v} = \sum_{i=1}^n u_i v_i = \|\mathbf{u}\| \|\mathbf{v}\| \cos \theta,
$$  
gdzie $\theta$ – kąt między wektorami.  

**Własności**:  
- Przemienność: $\mathbf{u} \cdot \mathbf{v} = \mathbf{v} \cdot \mathbf{u}$,  
- Rozdzielność: $\mathbf{u} \cdot (\mathbf{v} + \mathbf{w}) = \mathbf{u} \cdot \mathbf{v} + \mathbf{u} \cdot \mathbf{w}$,  
- Homogeniczność: $(c\mathbf{u}) \cdot \mathbf{v} = c (\mathbf{u} \cdot \mathbf{v})$.  

**Zastosowania**:  
- **Ortogonalność**: $\mathbf{u} \cdot \mathbf{v} = 0 \iff \mathbf{u} \perp \mathbf{v}$,  
- **Rzut wektora**: $\text{proj}_{\mathbf{v}} \mathbf{u} = \left( \frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{v}\|^2} \right) \mathbf{v}$,  
- **Norma (długość)**: $\|\mathbf{u}\| = \sqrt{\mathbf{u} \cdot \mathbf{u}}$,  
- **Nierówność Cauchy’ego-Schwarza**: $|\mathbf{u} \cdot \mathbf{v}| \leq \|\mathbf{u}\| \|\mathbf{v}\|$.

---


## **Rachunek prawdopodobieństwa**

#### **1. 💡 Podaj definicje miary probabilistycznej i omów jej własności.**  
**Definicja**:  
Miarą probabilistyczną na przestrzeni mierzalnej $(\Omega, \mathcal{F})$ nazywamy funkcję $P: \mathcal{F} \to [0,1]$ spełniającą:  
1. **Nieujemność**: $P(A) \geq 0$ dla każdego $A \in \mathcal{F}$  
2. **Normalizacja**: $P(\Omega) = 1$  
3. **Przeliczalna addytywność**: Dla dowolnego ciągu zbiorów rozłącznych $A_1, A_2, \dots \in \mathcal{F}$:  
   $$
   P\left( \bigcup_{i=1}^{\infty} A_i \right) = \sum_{i=1}^{\infty} P(A_i)
   $$

**Własności**:  
- $P(\emptyset) = 0$  
- **Monotoniczność**: Jeśli $A \subseteq B$, to $P(A) \leq P(B)$  
- **Podaddytywność**: $P\left( \bigcup_{i=1}^n A_i \right) \leq \sum_{i=1}^n P(A_i)$  
- **Zasada włączeń i wyłączeń**:  
  $$
  P\left( \bigcup_{i=1}^n A_i \right) = \sum_{i} P(A_i) - \sum_{i<j} P(A_i \cap A_j) + \cdots + (-1)^{n+1} P(A_1 \cap \cdots \cap A_n)
  $$  
- **Ciągłość z dołu**: Jeśli $A_1 \subseteq A_2 \subseteq \cdots$, to $P\left( \bigcup_{i=1}^{\infty} A_i \right) = \lim_{n \to \infty} P(A_n)$  
- **Ciągłość z góry**: Jeśli $A_1 \supseteq A_2 \supseteq \cdots$, to $P\left( \bigcap_{i=1}^{\infty} A_i \right) = \lim_{n \to \infty} P(A_n)$.

---

#### **2. 📘 Podaj wzór Bayesa.**  
**Wzór Bayesa**: Dla zdarzeń $A, B$ o $P(B) > 0$:  
$$
P(A|B) = \frac{P(B|A) \cdot P(A)}{P(B)}
$$  
**Rozszerzenie dla układu zupełnego zdarzeń**:  
Jeśli $H_1, \dots, H_n$ są rozłączne, $\bigcup_{i=1}^n H_i = \Omega$, i $P(H_i) > 0$, to:  
$$
P(H_k|A) = \frac{P(A|H_k) P(H_k)}{\sum_{i=1}^n P(A|H_i) P(H_i)}
$$

---

#### **3. 📘 Podaj definicję wartości oczekiwanej zmiennej losowej i wymień jej własności.**  
**Definicja**:  
- **Dyskretna zmienna losowa** (przyjmująca wartości $x_i$ z prawd. $p_i$):  
  $$
  E(X) = \sum_{i} x_i \cdot p_i
  $$  
- **Ciągła zmienna losowa** (z gęstością $f(x)$):  
  $$
  E(X) = \int_{-\infty}^{\infty} x \cdot f(x)  dx
  $$  

**Własności**:  
- **Liniowość**: $E(aX + bY) = aE(X) + bE(Y)$  
- **Monotoniczność**: Jeśli $X \leq Y$ p.n., to $E(X) \leq E(Y)$  
- **Twierdzenie o całkowaniu**: $E(g(X)) = \sum_i g(x_i) p_i$ (dyskretna) lub $E(g(X)) = \int_{-\infty}^{\infty} g(x) f(x)  dx$ (ciągła)  
- **Niezależność**: Jeśli $X,Y$ niezależne, to $E(XY) = E(X)E(Y)$  
- **Stała**: $E(c) = c$ dla $c \in \mathbb{R}$.

---

#### **4. 📘 Podaj definicję dystrybuanty zmiennej losowej i omów jej własności.**  
**Definicja**:  
Dystrybuantą zmiennej losowej $X$ nazywamy funkcję $F_X: \mathbb{R} \to [0,1]$:  
$$
F_X(x) = P(X \leq x)
$$  

**Własności**:  
1. **Niemalejąca**: $x_1 < x_2 \implies F_X(x_1) \leq F_X(x_2)$  
2. **Prawostronnie ciągła**: $\lim_{y \to x^+} F_X(y) = F_X(x)$  
3. **Granice**:  
   $$
   \lim_{x \to -\infty} F_X(x) = 0, \quad \lim_{x \to \infty} F_X(x) = 1
   $$  
4. **Obliczanie prawdopodobieństw**:  
   $$
   P(a < X \leq b) = F_X(b) - F_X(a)
   $$  
5. **Związek z gęstością** (dla ciągłych):  
   $$
   f_X(x) = \frac{d}{dx} F_X(x) \quad \text{(tam gdzie istnieje)}
   $$

---

#### **5. 📘 Podaj definicję funkcji prawdopodobieństwa (dyskretna) i gęstości (ciągła) zmiennej losowej oraz omów ich własności.**  
**Funkcja prawdopodobieństwa** (dla dyskretnej zmiennej losowej):  
Funkcja $p: \mathbb{R} \to [0,1]$ taka, że:  
$$
p(x_i) = P(X = x_i) \quad \text{oraz} \quad \sum_{i} p(x_i) = 1
$$  
**Własności**:  
- $p(x) = 0$ dla $x \notin \{x_i\}$  
- $P(X \in A) = \sum_{x_i \in A} p(x_i)$.

**Funkcja gęstości** (dla ciągłej zmiennej losowej):  
Funkcja $f: \mathbb{R} \to [0,\infty)$ taka, że:  
$$
P(a \leq X \leq b) = \int_a^b f(x)  dx \quad \text{oraz} \quad \int_{-\infty}^{\infty} f(x)  dx = 1
$$  
**Własności**:  
- $f(x) \geq 0$  
- $P(X = a) = 0$ dla każdego $a \in \mathbb{R}$  
- $F_X(x) = \int_{-\infty}^x f(t)  dt$.

---

#### **6. 📘 Podaj przykłady rozkładów dyskretnych i ciągłych zmiennych losowych.**  
**Rozkłady dyskretne**:  
1. **Bernoulliego** ($X \sim \text{Ber}(p)$):  
   - $P(X=1) = p$, $P(X=0) = 1-p$  
   - Przykład: wynik pojedynczego rzutu monetą  
2. **Dwumianowy** ($X \sim \text{Bin}(n,p)$):  
   - $P(X=k) = \binom{n}{k} p^k (1-p)^{n-k}$  
   - Przykład: liczba sukcesów w $n$ próbach Bernoulliego  
3. **Poissona** ($X \sim \text{Pois}(\lambda)$):  
   - $P(X=k) = e^{-\lambda} \frac{\lambda^k}{k!}$  
   - Przykład: liczba klientów w sklepie w ciągu godziny  
4. **Geometryczny** ($X \sim \text{Geom}(p)$):  
   - $P(X=k) = (1-p)^{k-1} p$  
   - Przykład: liczba prób do pierwszego sukcesu  

**Rozkłady ciągłe**:  
1. **Jednostajny** ($X \sim \mathcal{U}(a,b)$):  
   - $f(x) = \frac{1}{b-a}$ dla $x \in [a,b]$  
   - Przykład: losowy punkt na odcinku $[a,b]$  
2. **Normalny** ($X \sim \mathcal{N}(\mu,\sigma^2)$):  
   - $f(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{(x-\mu)^2}{2\sigma^2}}$  
   - Przykład: wzrost w populacji  
3. **Wykładniczy** ($X \sim \text{Exp}(\lambda)$):  
   - $f(x) = \lambda e^{-\lambda x}$ dla $x \geq 0$  
   - Przykład: czas oczekiwania na zdarzenie  
4. **Gamma** ($X \sim \Gamma(\alpha,\beta)$):  
   - $f(x) = \frac{\beta^\alpha}{\Gamma(\alpha)} x^{\alpha-1} e^{-\beta x}$  
   - Przykład: czas oczekiwania na $k$ zdarzeń Poissona.

---

#### **7. 📘 Podaj definicję wariancji i odchylenia standardowego zmiennej losowej oraz wymień ich własności.**  
**Definicja wariancji**:  
$$
\text{Var}(X) = E\left[(X - E[X])^2\right] = E[X^2] - (E[X])^2
$$  
**Własności wariancji**:  
- $\text{Var}(c) = 0$ dla stałej $c$  
- $\text{Var}(aX + b) = a^2 \text{Var}(X)$  
- Jeśli $X,Y$ niezależne, to $\text{Var}(X + Y) = \text{Var}(X) + \text{Var}(Y)$  
- $\text{Var}(X) \geq 0$  

**Definicja odchylenia standardowego**:  
$$
\sigma_X = \sqrt{\text{Var}(X)}
$$  
**Własności odchylenia standardowego**:  
- $\sigma_{aX + b} = |a| \sigma_X$  
- Interpretacja: miara dyspersji wokół wartości oczekiwanej.

---

### Kluczowe koncepcje  
- **Miary probabilistyczne**: Fundament teorii prawdopodobieństwa (aksjomatyka Kołmogorowa).  
- **Wzór Bayesa**: Podstawa wnioskowania bayesowskiego.  
- **Wartość oczekiwana**: "Środek ciężkości" rozkładu.  
- **Dystrybuanta**: Uniwersalny opis rozkładu (działa dla wszystkich typów zmiennych).  
- **Wariancja**: Kluczowa miara ryzyka w finansach i statystyce.  

---

## **Statystyka Matematyczna**

#### **1. 💡 Omów miary położenia i zmienności danych.**  
**Miary położenia**:  
- **Średnia arytmetyczna**:  
  $$
  \bar{x} = \frac{1}{n} \sum_{i=1}^n x_i
  $$  
  *Zalety*: Wrażliwa na wszystkie dane. *Wady*: Wrażliwa na wartości skrajne.  
- **Mediana**: Wartość środkowa w uporządkowanym zbiorze danych.  
  *Zastosowanie*: Odporne na outliers (np. przy danych o rozkładzie skośnym).  
- **Dominanta (moda)**: Najczęściej występująca wartość.  

**Miary zmienności**:  
- **Wariancja**:  
  $$
  s^2 = \frac{1}{n} \sum_{i=1}^n (x_i - \bar{x})^2
  $$  
- **Odchylenie standardowe**: $ s = \sqrt{s^2} $ – interpretowalne w jednostkach danych.  
- **Rozstęp**: $ R = x_{\text{max}} - x_{\text{min}} $.  
- **IQR (międzykwartylowy)**: $ Q_3 - Q_1 $ – odporność na outliers.  

**Przykład**:  
Dla danych $[2, 4, 4, 6, 8]$:  
- Średnia: $4.8$, Mediana: $4$, Moda: $4$, Wariancja: $4.8$, Odchylenie: $2.19$, IQR: $4$.

---

#### **2. 💡 Omów graficzną prezentację danych.**  
**Wykresy dla danych jakościowych**:  
- **Wykres kołowy**: Proporcje kategorii (np. udział procentowy preferencji).  
- **Wykres słupkowy**: Porównanie częstości kategorii.  

**Wykresy dla danych ilościowych**:  
- **Histogram**: Rozkład częstości przedziałów wartości (np. przedziały wzrostu).  
- **Boxplot (wykres pudełkowy)**:  
  - Linia środkowa: Mediana ($Q_2$).  
  - "Pudełko": $Q_1$ do $Q_3$.  
  - "Wąsy": Zakres danych (z wyłączeniem outliers).  
  - **Outliers**: Punkty poza $1.5 \times \text{IQR}$.  
- **Wykres rozrzutu (scatter plot)**: Zależność między dwiema zmiennymi (np. wzrost vs. waga).  

**Przykład**:  
Boxplot dla danych $[10, 12, 12, 13, 14, 15, 16, 20]$:  
- $Q_1 = 12$, $Q_2 = 13.5$, $Q_3 = 15.5$, IQR = $3.5$, Outlier: $20$.

---

#### **3. 💡 Omów weryfikację hipotez dotyczących frakcji.**  
**Kroki testowania hipotezy o frakcji $p$**:  
1. **Formułowanie hipotez**:  
   - $H_0: p = p_0$ (np. $p_0 = 0.5$ – "50% wyborców preferuje kandydata").  
   - $H_1: p \neq p_0$ (dwustronna) lub $H_1: p > p_0$ (jednostronna).  
2. **Statystyka testowa** (dla dużych prób, $np_0 \geq 5$ i $n(1-p_0) \geq 5$):  
   $$
   Z = \frac{\hat{p} - p_0}{\sqrt{\frac{p_0(1-p_0)}{n}}}, \quad \hat{p} = \frac{\text{liczba sukcesów}}{n}
   $$  
3. **Decyzja**:  
   - Porównaj $|Z|$ z wartością krytyczną $z_{\alpha/2}$ (np. $1.96$ dla $\alpha = 0.05$).  
   - Jeśli $|Z| > z_{\alpha/2}$, odrzucamy $H_0$.  

**Przykład**:  
Dla $n=100$, $\hat{p}=0.6$, $p_0=0.5$:  
$$
Z = \frac{0.6 - 0.5}{\sqrt{\frac{0.5 \times 0.5}{100}}} = 2.0 \quad (\text{Odrzucamy } H_0 \text{ dla } \alpha=0.05).
$$

---

#### **4. 💡 Omów weryfikację hipotez dotyczących średniej.**  
**Test dla średniej ($\mu$) w rozkładzie normalnym**:  
1. **Hipotezy**:  
   - $H_0: \mu = \mu_0$, $H_1: \mu \neq \mu_0$.  
2. **Statystyka testowa**:  
   - **Znane $\sigma$**:  
     $$
     Z = \frac{\bar{X} - \mu_0}{\sigma/\sqrt{n}}
     $$  
   - **Nieznane $\sigma$**:  
     $$
     t = \frac{\bar{X} - \mu_0}{s/\sqrt{n}} \quad (\text{rozkład } t\text{-Studenta z } n-1 \text{ stopniami swobody}).
     $$  
3. **Decyzja**:  
   - Porównaj statystykę z wartością krytyczną ($z_{\alpha/2}$ lub $t_{\alpha/2, n-1}$).  

**Przykład**:  
Dane: $\bar{x}=105$, $\mu_0=100$, $s=10$, $n=25$:  
$$
t = \frac{105 - 100}{10/\sqrt{25}} = 2.5 \quad (\text{Odrzucamy } H_0 \text{ dla } t_{0.025,24} \approx 2.064).
$$

---

#### **5. 💡 Omów weryfikację hipotez dotyczących odchylenia standardowego.**  
**Test dla wariancji ($\sigma^2$) w rozkładzie normalnym**:  
1. **Hipotezy**:  
   - $H_0: \sigma^2 = \sigma_0^2$, $H_1: \sigma^2 \neq \sigma_0^2$.  
2. **Statystyka testowa**:  
   $$
   \chi^2 = \frac{(n-1)s^2}{\sigma_0^2} \quad (\text{rozkład chi-kwadrat z } n-1 \text{ stopniami swobody}).
   $$  
3. **Decyzja**:  
   - Porównaj $\chi^2$ z wartościami krytycznymi $\chi^2_{\alpha/2, n-1}$ i $\chi^2_{1-\alpha/2, n-1}$.  

**Przykład**:  
Dla $n=30$, $s^2=4$, $\sigma_0^2=3$:  
$$
\chi^2 = \frac{29 \times 4}{3} \approx 38.67 \quad (\text{Odrzucamy } H_0 \text{ jeśli } \chi^2 > 45.72 \text{ lub } \chi^2 < 16.05 \text{ dla } \alpha=0.05).
$$

---

#### **6. 💡 Omów weryfikację hipotez dotyczących niezależności dwóch zmiennych.**  
**Test chi-kwadrat niezależności**:  
1. **Hipotezy**:  
   - $H_0$: Zmienne są niezależne, $H_1$: Zmienne są zależne.  
2. **Statystyka testowa**:  
   $$
   \chi^2 = \sum \frac{(O_{ij} - E_{ij})^2}{E_{ij}}, \quad E_{ij} = \frac{(\text{suma wiersza } i) \times (\text{suma kolumny } j)}{n}
   $$  
   gdzie $O_{ij}$ – obserwowane częstości, $E_{ij}$ – częstości oczekiwane przy niezależności.  
3. **Decyzja**:  
   - Porównaj $\chi^2$ z wartością krytyczną $\chi^2_{\alpha, (r-1)(c-1)}$ ($r$ – liczba wierszy, $c$ – kolumn).  

**Przykład**:  
Tabela $2 \times 2$ dla płci a preferencji produktu:  
$$
\chi^2 = \frac{(50-40)^2}{40} + \frac{(30-40)^2}{40} + \cdots \quad (\text{Odrzucamy } H_0 \text{ jeśli } \chi^2 > 3.84).
$$

---

### Kluczowe wnioski  
- **Miary statystyczne**: Średnia i mediana uzupełniają się w opisie danych.  
- **Wizualizacja**: Boxplot pokazuje rozkład i outliers efektywniej niż histogram.  
- **Testowanie hipotez**:  
  - Dla frakcji używamy testu $Z$, dla średniej – $Z$ lub $t$, dla wariancji – $\chi^2$.  
  - Test chi-kwadrat jest uniwersalny dla tabel kontyngencji.  

---


## **Analiza Danych i Metody Numeryczne**

#### **1. 💡 Omów zagadnienie interpolacji wielomianowej. Podaj algorytm Lagrange'a lub Newtona.**  
**Interpolacja wielomianowa**:  
Cel: Znalezienie wielomianu $P_n(x)$ stopnia $\leq n$, który przechodzi przez $n+1$ punktów $(x_i, y_i)$ (tzn. $P_n(x_i) = y_i$).  

**Algorytm Lagrange'a**:  
1. **Wielomian bazowy**:  
   $$
   \ell_i(x) = \prod_{\substack{j=0 \\ j \neq i}}^{n} \frac{x - x_j}{x_i - x_j}
   $$  
2. **Wielomian interpolacyjny**:  
   $$
   P_n(x) = \sum_{i=0}^{n} y_i \cdot \ell_i(x)
   $$  
   *Przykład*: Dla punktów $(-1,1), (0,0), (1,1)$:  
   $$
   P_2(x) = 1 \cdot \frac{x(x-1)}{2} + 0 \cdot \frac{(x+1)(x-1)}{-1} + 1 \cdot \frac{(x+1)x}{2} = x^2
   $$  

**Algorytm Newtona**:  
1. **Ilorazy różnicowe**:  
   - $f[x_i] = y_i$  
   - $f[x_i,x_j] = \frac{f[x_j]-f[x_i]}{x_j-x_i}$  
   - $f[x_i,x_j,x_k] = \frac{f[x_j,x_k]-f[x_i,x_j]}{x_k-x_i}$  
2. **Wielomian**:  
   $$
   P_n(x) = f[x_0] + f[x_0,x_1](x-x_0) + f[x_0,x_1,x_2](x-x_0)(x-x_1) + \cdots
   $$  
   *Zaleta*: Dodanie nowego punktu wymaga tylko jednego dodatkowego składnika.  

---

#### **2. 💡 Omów numeryczne rozwiązywanie równań nieliniowych, w szczególności metodę iteracji prostych lub metodę Newtona.**  
**Metoda iteracji prostych**:  
1. Przekształć $f(x)=0$ do postaci $x = g(x)$.  
2. Iteruj: $x_{k+1} = g(x_k)$.  
   *Warunek zbieżności*: $|g'(x)| < 1$ w otoczeniu pierwiastka.  
   *Przykład*: Dla $x = e^{-x}$:  
   $$
   x_{k+1} = e^{-x_k}, \quad x_0 = 0.5 \to x_1 \approx 0.6065 \to x_2 \approx 0.5452 \to \cdots
   $$  

**Metoda Newtona (stycznych)**:  
1. Iteracja:  
   $$
   x_{k+1} = x_k - \frac{f(x_k)}{f'(x_k)}
   $$  
2. *Zbieżność*: Kwadratowa, gdy $f'(x^*) \neq 0$.  
   *Przykład*: Dla $f(x) = x^2 - 2$:  
   $$
   x_{k+1} = x_k - \frac{x_k^2 - 2}{2x_k} = \frac{x_k}{2} + \frac{1}{x_k}, \quad x_0 = 1 \to x_1 = 1.5 \to x_2 \approx 1.4167
   $$  

---

#### **3. 💡 Omów numeryczne rozwiązywanie układów równań liniowych, w szczególności metodę Jacobiego lub metodę Gaussa-Seidla.**  
**Metoda Jacobiego**:  
1. Rozkład macierzy: $A = D + R$ ($D$ – diagonalna, $R$ – reszta).  
2. Iteracja:  
   $$
   \mathbf{x}^{(k+1)} = D^{-1} \left( \mathbf{b} - R \mathbf{x}^{(k)} \right)
   $$  
   *Współrzędnie*:  
   $$
   x_i^{(k+1)} = \frac{1}{a_{ii}} \left( b_i - \sum_{j \neq i} a_{ij} x_j^{(k)} \right)
   $$  

**Metoda Gaussa-Seidla**:  
Wykorzystuje najnowsze przybliżenia:  
$$
x_i^{(k+1)} = \frac{1}{a_{ii}} \left( b_i - \sum_{j=1}^{i-1} a_{ij} x_j^{(k+1)} - \sum_{j=i+1}^{n} a_{ij} x_j^{(k)} \right)
$$  
*Przykład*: Dla układu:  
$$
\begin{cases}
4x_1 - x_2 = 3 \\
-2x_1 + 5x_2 = 2
\end{cases}
$$  
- **Jacobi**: $x_1^{(1)} = \frac{3 + x_2^{(0)}}{4}, \quad x_2^{(1)} = \frac{2 + 2x_1^{(0)}}{5}$  
- **Gauss-Seidel**: $x_1^{(1)} = \frac{3 + x_2^{(0)}}{4}, \quad x_2^{(1)} = \frac{2 + 2x_1^{(1)}}{5}$  

---

#### **4. 💡 Omów metodę najmniejszych kwadratów, w szczególności metodę regresji liniowej.**  
**Cel**: Minimalizacja sumy kwadratów odchyleń (residuów) między danymi a modelem.  

**Regresja liniowa** ($y = ax + b$):  
1. Funkcja błędu:  
   $$
   S(a,b) = \sum_{i=1}^{n} (y_i - (a x_i + b))^2
   $$  
2. Równania normalne:  
   $$
   \begin{cases}
   a \sum x_i^2 + b \sum x_i = \sum x_i y_i \\
   a \sum x_i + b \cdot n = \sum y_i
   \end{cases}
   $$  
3. Rozwiązanie:  
   $$
   a = \frac{n \sum x_i y_i - \sum x_i \sum y_i}{n \sum x_i^2 - (\sum x_i)^2}, \quad b = \bar{y} - a \bar{x}
   $$  

**Przykład**:  
Dane: $(1,1), (2,2), (3,2)$:  
- $\sum x_i = 6$, $\sum y_i = 5$, $\sum x_i y_i = 1\cdot1 + 2\cdot2 + 3\cdot2 = 11$, $\sum x_i^2 = 14$  
- $a = \frac{3 \cdot 11 - 6 \cdot 5}{3 \cdot 14 - 36} = \frac{3}{6} = 0.5$, $b = \frac{5}{3} - 0.5 \cdot 2 \approx 0.833$  
- Model: $y = 0.5x + 0.833$  

---

### Kluczowe wnioski  
- **Interpolacja**:  
  - Lagrange: Prosty koncepcyjnie, ale kosztowny obliczeniowo ($O(n^2)$).  
  - Newton: Elastyczny przy dodawaniu punktów.  
- **Równania nieliniowe**:  
  - Iteracja prosta: Łatwa implementacja, ale wolna zbieżność.  
  - Newton: Szybki, ale wymaga pochodnej.  
- **Układy liniowe**:  
  - Jacobi: Równoległy, ale wolniejszy.  
  - Gauss-Seidel: Szybszy, ale sekwencyjny.  
- **MNK**:  
  - Podstawowe narzędzie w data science (np. trend liniowy w danych).  

---
