## Onboarding revisado — 7 passos + tooltips na Home

Reescreve `src/routes/onboarding.tsx` do zero (substituição completa) e adiciona sequência de tooltips na Home na primeira abertura pós-onboarding.

### Rotas / arquivos
- `src/routes/onboarding.tsx` — reescrita completa, 7 passos em uma única rota controlada por state (`step: 0..6`).
- `src/components/OnboardingTooltips.tsx` — novo, sequência de 4 tooltips com overlay + spotlight, renderizado condicionalmente na Home.
- `src/routes/home.tsx` — inclui `<OnboardingTooltips />` no topo do return, com `data-tooltip-id` nos 4 alvos (chip de mood, saldo de gracias, card "¿Qué hay en tu corazón hoy?", aba Mural do BottomNav).
- `src/components/BottomNav.tsx` — adiciona `data-tooltip-id="nav-mural"` no link do Mural.
- `src/lib/storage.ts` — adiciona chaves ao `STORAGE_KEYS`: `userName` (já existe), `currentMood`, `tradition`, `tooltipsShown`.
- `src/routes/index.tsx` — continua redirecionando via `vdd:onboarded`.

### Persistência (localStorage, padrão `vdd:*`)
| Chave | Valor |
|---|---|
| `vdd:onboarded` | `true` ao terminar passo 7 |
| `vdd:user_name` | string do passo 2 |
| `vdd:current_mood` | mood do passo 3 (mesma chave usada pela Home) |
| `vdd:tradition` | `"catolico" \| "evangelico" \| "cristiano" \| "explorando"` |
| `vdd:gracias` | credita +30 ao terminar |
| `vdd:tooltips_shown` | `true` após 4º tooltip |
| `vdd:translation` | mantém `"RV1960"` por padrão |

### Passos
1. **Boas-vindas** — logo circular 80px #1a3a5c, título serifado "Clama a Él", subtítulo itálico Jer 33:3, botão azul "Comenzar mi camino →".
2. **Nome** — input central borda dourada ao focar, botão desabilitado até ter texto.
3. **Mood** — grid 3×4 dos 12 chips com emoji; selecionado #1a3a5c/branco.
4. **Tradição** — 4 cards verticais (Católico/Evangélico/Cristiano/Explorando); selecionado borda #1a3a5c + fundo #f0f4f8.
5. **Explicação das gracias** — moeda ⭐ 64px com brilho, dois blocos lado a lado (verde "Cómo ganarlas" / azul "Para qué usarlas"), rodapé itálico "Como monedas de fe…", botão "Entendido →".
6. **Widget** — preview do card com overlay #1a3a5c/0.6, 3 passos de instrução, botões "Ver todos los widgets →" (leva a `/widgets` e marca onboarded) e "Hacer después".
7. **30 gracias** — gradiente #faf7f2→#fef3c7, 8 estrelas caindo (CSS keyframes staggered), número 72px dourado, botão finaliza: grava tudo + `vdd:gracias +=30` + navega para `/home`.

Header do onboarding: barra de progresso com 7 bolinhas (a atual em #c9a84c). Fundo `#faf7f2` em todos os passos, transições `animate-fade-in` entre steps.

### Tooltips (Home, primeira abertura)
Componente `OnboardingTooltips` monta se `vdd:onboarded===true` && `vdd:tooltips_shown!==true`. Overlay preto/60, "spotlight" via clip-path (retângulo do `getBoundingClientRect()` do alvo). Tooltip card branco com sombra abaixo/acima do alvo, texto #2c1810, botão azul. Sequência: mood → gracias → card conversa → aba Mural. No 4º "Comenzar ✨" grava `vdd:tooltips_shown=true`.

Elementos alvo recebem atributo `data-tooltip-id` já existente no DOM da Home:
- `data-tooltip-id="mood-chip"` no chip de humor
- `data-tooltip-id="gracias-balance"` no badge de saldo do header
- `data-tooltip-id="heart-card"` no card "¿Qué hay en tu corazón hoy?"
- `data-tooltip-id="nav-mural"` no link Mural do `BottomNav`

### Detalhes técnicos
- Todos os estilos inline com hex exatos do brief (não uso tokens semânticos, pois o brief fixa cores concretas).
- Animação de estrelas: 8 `<span>` posicionados absolutos, `animation: star-fall 2s ease-out forwards` com `animation-delay` staggered 0–1.4s.
- Animação de brilho da moeda: `@keyframes coin-glow` já pode reusar padrão pulse; adiciono em `src/styles.css`.
- Botão "Siguiente" desabilitado usa `opacity-40 cursor-not-allowed`.
- Ao terminar passo 7, tudo é persistido de uma vez em um único `writeLS` sequencial e depois `navigate({ to: "/home", replace: true })`.
- Rota `/onboarding` mantém o mesmo path — nada quebra no `src/routes/index.tsx`.

### O que **não** faço nesta entrega
- Não altero a página `/widgets` nem a home além de: (a) inserir `<OnboardingTooltips />` e (b) marcar os 4 alvos com `data-tooltip-id`.
- Não mexo em Mural, Gracias, Diário, etc.
- Não altero o BottomNav além do `data-tooltip-id` na aba Mural.

Aprova este plano para eu implementar?
