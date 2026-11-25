# Espaço Villa Girassol — Landing page

Landing page do espaço de eventos em Brodowski/SP. React + TypeScript + Tailwind CSS (Vite).

## Rodar

```
npm install
npm run dev      # http://localhost:5173
npm run build    # gera a pasta dist/ para publicar (Vercel, Netlify, Hostinger…)
```

## Editar conteúdo

**Todo o conteúdo fica em `src/data/site.ts`**: textos, WhatsApp, endereço, horários,
opções de evento, preços, períodos, datas indisponíveis e fotos.

- `price: null` → mostra "Sob consulta" e o botão "Solicitar valores". Informe um número (ex.: `2500`) para exibir o valor.
- `capacity` / `duration` / `hours` / `location.street`: `null` mostra "A confirmar".
- `booking.unavailableDates`: datas já reservadas, ex.: `['2026-12-12', '2026-12-19']`.
- `booking.closedWeekdays`: dias da semana sem eventos (0 = domingo … 6 = sábado).
- `booking.minAdvanceDays`: antecedência mínima para solicitar uma data.
- `contact.instagram` / `facebook` / `email`: quando preenchidos, aparecem no rodapé.
- Fotos: troque as URLs por fotos reais (pode colocar arquivos em `public/fotos/` e usar `/fotos/nome.jpg`)
  e marque `illustrative: false` para remover o selo "Imagem ilustrativa".

## Dados usados

Ficha do Google Maps (https://maps.app.goo.gl/HsGepaM1E81pVa6c7), folheto oficial e Instagram @espacovillagirassol:
Estrada Estela de Lourdes, Brodowski/SP, 14340-150 · piscina aquecida · área gourmet com churrasqueira e
cozinha equipada · 2 suítes · estacionamento amplo e privativo · locação a partir de novembro de 2026.
Preços e horários: informados pelo WhatsApp (por isso aparecem como "Sob consulta").

## Fotos

- As 2 fotos reais vêm da ficha do Google Maps por link direto. Se um dia deixarem de carregar, salve as fotos em
  `public/fotos/` e troque as URLs em `site.ts` (ex.: `src: '/fotos/piscina.jpg'`).
- As demais são ilustrativas (Unsplash), com o selo "Imagem ilustrativa". Para trocar por fotos do Instagram,
  salve os arquivos em `public/fotos/` e marque `illustrative: false`.
- `focus` ajusta o enquadramento do recorte (ex.: `'center 15%'`).

## Estrutura

```
src/
  data/site.ts          conteúdo editável (futuro: vir de API/painel admin)
  lib/utils.ts          formatação, links de WhatsApp e Maps
  lib/useReveal.ts      animações ao rolar
  components/
    Header, Hero, About, Gallery (lightbox), Options,
    Calendar, Booking (passos + resumo + WhatsApp),
    Location (mapa), Contact (+ Footer), WhatsAppFab, Toast
```

A disponibilidade é calculada em `getDayStatus()` (`Calendar.tsx`). Para integrar um sistema de reservas,
basta trocar essa função por uma consulta à API. Sem integração, o envio é sempre tratado como **solicitação**,
não como confirmação.

Acessibilidade: navegação por teclado (inclusive setas no calendário), rótulos nos campos, textos alternativos,
foco visível e respeito a `prefers-reduced-motion`.
