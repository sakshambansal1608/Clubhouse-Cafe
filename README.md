# Clubhouse Cafe — Jalandhar

A premium, single-page website for **Clubhouse Cafe**, Ground Floor, The Elite City Center, Model Town Rd, Abadpura, Model Town, Jalandhar, Punjab 144001.

Static site: plain HTML, CSS and JavaScript. No build step, no framework, no bundler.

## Quick start

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

### Deploy on GitHub Pages

1. Push this folder to a repository.
2. Settings → Pages → Source: *Deploy from a branch* → `main` / `root`.
3. The included `.nojekyll` file keeps Pages from rewriting the asset folders.

Any static host works too (Netlify, Vercel, Cloudflare Pages, cPanel).

## Structure

```
index.html              markup, metadata, structured data
assets/css/styles.css   all styling, including responsive and reduced-motion rules
assets/js/main.js       menu, reservation flow, gallery, animation, 3D dish models
assets/img/*.webp       photography and menu images
```

## What's on the page

- **Hero** — full-bleed café photograph with mouse parallax and a scroll-driven push-in.
- **Reservation request** — a modal with a custom calendar, time slots, guest counter, validation and a confirmation screen. It is deliberately a *request*, not a confirmed booking (see below).
- **Menu** — 335 items across 8 tabs and 50 categories, with search across every dish.
- **Signatures** — five dishes; three shown as photographs, two rendered live in 3D (Three.js).
- **Gallery** — 14 photographs with a lightbox (keyboard arrows, Esc, swipe).
- **Reviews, location, footer** — rating, Google-review quotes, address, map, opening hours.

## Connecting a real reservation backend

The reservation flow is front-end only. Two objects in `assets/js/main.js` isolate everything you need to replace:

```js
AvailabilityService.getSlots(dateISO)   // returns [{time:'19:30', label:'7:30 PM', status:'available'|'unavailable'}]
ReservationService.submit(reservation)  // returns the saved reservation
```

`getSlots` currently generates demo availability. Point it at your API:

```js
getSlots: function (dateISO) {
  return fetch('/api/availability?date=' + dateISO).then(function (r) { return r.json(); });
}
```

`submit` currently resolves after a delay. Point it at Firebase, Supabase or your own endpoint, keeping the reservation shape:

```js
{ date, time, guests, name, phone, specialRequest, status }   // status: 'pending'
```

Until a backend confirms bookings, keep the wording as **"reservation request"**. The UI says the café will confirm; do not change that to imply a table is booked.

## Updating content

- **Menu** — edit `MENU_GROUPS` in `assets/js/main.js`. Each item is `["Name", price, "Description"]`; prices are plain numbers in rupees.
- **Photos** — drop a new file into `assets/img/` and update the matching key in the `PHOTOS` map at the top of `main.js`. Keys are used by `data-photo` attributes in `index.html` and by the gallery and menu data.
- **Business details** — phone, address and hours appear in `index.html` (including the JSON-LD block) and in `ADDRESS` / phone links in `main.js`.

## Accessibility and performance notes

- Keyboard support throughout: focus trapping in the modal, menu page and lightbox; Esc to close; arrow keys in the calendar, time slots, menu tabs and gallery.
- `prefers-reduced-motion` disables parallax, 3D animation loops and transitions.
- Images are WebP; the hero image is preloaded; the 3D scene pauses when off-screen or when the tab is hidden.
- Third-party code is limited to Three.js and GSAP from cdnjs, plus Google Fonts. No analytics, trackers, cookies or storage; nothing the visitor types leaves the browser.

## Before going live

- Replace the relative `og:image` in `index.html` with an absolute URL.
- Add Instagram and Facebook links in the footer (currently marked "link to be added").
- Confirm menu prices with the café — prices came from a supplied list and may differ from in-café pricing. The menu page already carries a note about this.

## Content

Photographs, menu, prices and brand belong to Clubhouse Cafe and are included here for their own website. The code is free to adapt for this project.
