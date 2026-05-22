## Versículo del Día — Fase 1

App web mobile-first (preparado para Capacitor depois), em espanhol, sem backend. Persistência via `localStorage`. Versículos vêm de um JSON local. Sem login, sem Cloud.

### Escopo da Fase 1
1. **Onboarding** (3 slides) — exibido apenas na primeira visita.
2. **Home** — versículo do dia + streak + compartilhar + "Leer más" + placeholder de anúncio.
3. **Configurações** — horário de notificação, tradução, tema (claro/escuro/sépia), avaliar, compartilhar.

**Fora da Fase 1** (entregas seguintes, individuais): Planos de Leitura, Loja/Premium, Widget Preview.

### Design system
- Paleta em `src/styles.css` via tokens `oklch`:
  - `--primary` azul profundo `#1a3a5c`
  - `--accent` dourado `#c9a84c`
  - `--background` branco / sépia `#f4ecd8` / dark `#0e1b2a`
- Três temas via classe no `<html>`: `light`, `dark`, `sepia` (toggle salvo em localStorage).
- Tipografia: **Cormorant Garamond** (serifa, versículos) + **Inter** (sans, UI). Carregadas via `<link>` do Google Fonts no `__root.tsx`.
- Estética adulta, premium, espaçada — não infantil.
- Ícone do app (favicon/PWA): livro aberto com raio dourado, gerado via `imagegen`.

### Arquitetura de rotas (TanStack Start)
```text
src/routes/
  __root.tsx          → shell + fontes + provider de tema
  index.tsx           → redireciona para /onboarding ou /home
  onboarding.tsx      → 3 slides com carrossel
  home.tsx            → versículo do dia
  reader.tsx          → "Leer más" (capítulo completo)
  settings.tsx        → preferências
```
Layout mobile-first: container `max-w-md mx-auto`, barra inferior fixa com 2 tabs (Home / Ajustes).

### Dados
- `src/data/verses.es.json` — array de ~150 versículos curados em espanhol (RV1960-style domínio público / paráfrase neutra), com `reference`, `text`, `book`, `chapter`, `verse`.
- Versículo do dia = índice determinístico por data: `dayOfYear % verses.length`. Garante mesma exibição o dia todo, troca à meia-noite local.
- `src/data/chapters/` — alguns capítulos completos em JSON para o "Leer más" da Fase 1 (cobertura limitada; capítulos sem dataset mostram aviso "Capítulo no disponible aún").

### Persistência (localStorage)
| Chave | Conteúdo |
|---|---|
| `vdd:onboarded` | boolean |
| `vdd:translation` | `"RV1960"` \| `"NVI"` \| `"BJ"` (Fase 1 só RV ativa, outras marcadas "Próximamente") |
| `vdd:theme` | `"light"` \| `"dark"` \| `"sepia"` |
| `vdd:notifyTime` | `"HH:mm"` |
| `vdd:streak` | `{ count: number, lastOpenISO: string }` |

Hook `useStreak()` incrementa quando `lastOpen` é o dia anterior, mantém se for hoje, reseta se houver gap > 1 dia.

### Telas em detalhe

**Onboarding** (`/onboarding`)
- Carrossel com 3 passos, dots indicadores, botões "Saltar" / "Siguiente" / "Empezar".
- Slide 3: 3 cards de tradução (RV1960 selecionado por padrão; NVI e BJ visíveis mas marcadas "Próximamente").
- Ao concluir → grava `vdd:onboarded=true` + tradução escolhida → vai para `/home`.

**Home** (`/home`)
- Cabeçalho discreto com data em espanhol ("martes, 22 de mayo").
- Card central: texto do versículo em serifa grande (~28px), referência abaixo em dourado.
- Badge de streak: "Llevas X días con la Palabra" (chama em dourado quando ≥ 3).
- Botões: `Leer más` (navega para `/reader?ref=...`), `Compartir` (Web Share API com fallback para copiar texto).
- Rodapé: placeholder `<AdBanner />` (div estilizada "Espacio publicitario").

**Reader** (`/reader`)
- Mostra capítulo completo quando disponível no dataset; senão, mensagem amigável + botão voltar.

**Settings** (`/settings`)
- Input `time` para horário da notificação (salvo localmente; notificação real fica para fase nativa).
- Select de tradução.
- Toggle de 3 temas (chips visuais).
- Links: "Valora la app" (`window.open` de placeholder), "Comparte con amigos" (Web Share).

### Componentes novos
- `components/VerseCard.tsx`
- `components/StreakBadge.tsx`
- `components/ThemeProvider.tsx` (aplica classe no `<html>`)
- `components/BottomNav.tsx`
- `components/AdBanner.tsx` (placeholder)
- `components/OnboardingCarousel.tsx`
- `hooks/useDailyVerse.ts`
- `hooks/useStreak.ts`
- `hooks/useLocalStorage.ts`
- `lib/verses.ts` (helpers de seleção diária)

### Preparação para Capacitor (sem instalar agora)
- Manter tudo client-side e roteamento que funcione em file:// (sem loaders server-side).
- Evitar APIs server-only nas telas da Fase 1.
- Adicionar `viewport` correto e PWA-friendly meta no `__root.tsx`.

### Notas técnicas
- Sem Lovable Cloud, sem server functions.
- Imagem do ícone gerada em `src/assets/app-icon.png`.
- Fontes via Google Fonts CDN.
- A11y: contraste verificado nos 3 temas, `aria-label` nos botões de ação.

### Próximas fases (para aprovação separada após esta)
1. Planos de Leitura
2. Loja/Premium
3. Widget Preview + instruções
4. Capacitor wrap + AdMob + notificações nativas reais
