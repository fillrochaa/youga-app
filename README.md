# Youga App

Vídeo-aulas de yoga prescritas como receita de bem-estar. A médica monta a
programação; a usuária acompanha o cronograma no calendário e assiste às
aulas (vídeos verticais embedados do YouTube).

## Rodar

```bash
npm install
npm run dev
```

## Estrutura

- `src/data/schedule.ts` — a "receita": aulas, grade semanal e notas da médica.
  **Para trocar um vídeo**, edite o campo `videoId` da aula (use o ID de um
  YouTube Short vertical — o player 9:16 ocupa a tela inteira).
- `src/lib/storage.ts` — progresso da usuária (localStorage).
- `src/components/` — Header, PrescriptionCard, WeekCalendar, SessionList, Player.
- `src/styles/global.css` — design system (glassmorphism, tons terrosos,
  Archivo pesada/leve + Great Vibes cursiva).

## Design system

- **Estilo:** glassmorphism minimalista sobre gradiente terroso
- **Cores:** areia, creme, taupe, argila (clay), oliva, cacau
- **Fontes:** Archivo (peso 250 leve / 800 pesada, caixa alta no display)
  e Great Vibes (cursiva de contraste)
- **Mobile first:** coluna central de 430px, safe areas de iOS respeitadas
