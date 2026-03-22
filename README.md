<div align="center">

<img src="resources/imgs/menu/title.png" alt="Brick Breaker" width="400"/>

<br/>

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

*Adaptação do icónico jogo Breakout, desenvolvido como estudo aprofundado de manipulação DOM em tempo real.*

</div>

---

## 🎮 Sobre o Projeto

**BrickBreaker-JS** é uma recriação do clássico jogo Breakout, construída inteiramente em **HTML, CSS e JavaScript puro** — sem frameworks, sem bibliotecas de jogo, sem canvas. Toda a lógica, física e renderização acontece diretamente sobre elementos do DOM.

O projeto nasceu como um estudo prático sobre o que é possível alcançar em front-end puro: desde a construção de um game loop até à deteção de colisões e gestão de estado em tempo real.

---

## ✨ Funcionalidades

- 🕹️ **Controlos múltiplos** — teclado (setas / WASD), rato e ecrã táctil
- 🧱 **Tijolos variados** — normais, resistentes (2 hits) e indestrutíveis
- ⚡ **Power-ups** — vida extra e outros apanhados em queda
- 📈 **Sistema de níveis** — velocidade e dificuldade aumentam progressivamente
- ✖️ **Multiplicador de score** — combos por acertos consecutivos
- 🎵 **Banda sonora dinâmica** — músicas diferentes por fase do jogo (menu, jogo, level up, game over)
- ⭐ **Fundo gerado proceduralmente** — estrelas criadas com SVG dinâmico
- 💫 **Animações DOM** — entrada dos tijolos, nível, pontos extra, tudo em CSS/JS puro
- 📱 **Responsivo** — adaptado a diferentes tamanhos de ecrã via `rem` e media queries

---

## 🔧 Tecnologias

| Tecnologia | Utilização |
|---|---|
| **HTML5** | Estrutura e elementos do jogo (sem `<canvas>`) |
| **CSS3** | Animações, gradientes cónicos rotativos, layout responsivo |
| **JavaScript (ES6+)** | Game loop, física da bola, deteção de colisões, DOM manipulation |
| **Font Awesome** | Ícone de som no menu |

> Nenhuma biblioteca de jogo foi usada. A física, o game loop e toda a lógica foram implementados de raiz.

---

## ⚙️ Como Executar

Por ser front-end puro, basta abrir o `index.html` num browser:

```bash
# Clona o repositório
git clone https://github.com/Raul-Paiva/BrickBreaker-JS.git

# Abre o ficheiro diretamente
# (ou usa um servidor local como Live Server no VS Code)
```

> ⚠️ Alguns browsers bloqueiam áudio sem interação do utilizador. Usa o botão de som no menu para ativar a música.

---

## 🎯 Destaques Técnicos

**Game Loop** — Um `setInterval` central corre a cada 10ms e executa uma lista de funções registadas dinamicamente (`runningFunctions[]`), permitindo adicionar e remover comportamentos (movimento da bola, power-ups, animações) sem parar o loop.

**Física sem Canvas** — A bola é um elemento `<img>` posicionado com `position: absolute`. A deteção de colisões é feita geometricamente, calculando o lado do tijolo atingido com base na trajetória da bola.

**Responsividade via `rem`** — Todas as medidas do jogo (posição da bola, paddle, tijolos) usam `rem`, calculado dinamicamente. Quando o `font-size` root muda com as media queries, o jogo escala automaticamente.

**Animações CSS puras** — O efeito de borda animada nos elementos usa `conic-gradient` com `@property` (CSS Houdini) para animar um ângulo como variável CSS nativa.

---

## 🎨 Créditos

| Categoria | Autor / Fonte |
|---|---|
| **Código** | [Raul Paiva](https://github.com/Raul-Paiva/BrickBreaker-JS) |
| **Assets gráficos** | [imaginelabs @ OpenGameArt](https://opengameart.org/content/breakout-brick-breaker-tile-set-free) |
| **Corações** | [ArtBIT @ OpenGameArt](https://opengameart.org/content/healthbar-sprite) |
| **Música do menu** | [Jan125 @ OpenGameArt](https://opengameart.org/content/some-kind-of-aceattorney-ish-music-thingie) |
| **Música in-game** | [Technodono](https://opengameart.org/content/breakout-0) · [Mopz](https://opengameart.org/content/breakout-music) · [SpringSpring](https://opengameart.org/content/bedtime-breakout-theme) |
| **Game Over** | [Cleyton Kauffman](https://opengameart.org/content/game-over-theme) · [Joseph Pueyo](https://opengameart.org/content/this-game-is-over) |
| **Level Up** | [Bart Kelsey @ OpenGameArt](https://opengameart.org/content/level-up-sound-effects) |
| **Countdown** | [jalastram @ OpenGameArt](https://opengameart.org/content/gui-sound-effects-4) |
| **Títulos / texto** | [CoolText.com](https://cooltext.com/) |
| **Tutorial CSS** | [Kevin Powell](https://www.youtube.com/watch?v=-VOUK-xFAyk&t=2s) |
| **README** | [Claude AI](https://claude.ai/) |

---

<div align="center">
  <sub>Desenvolvido por <a href="https://github.com/Raul-Paiva">Raul Paiva</a></sub>
</div>
