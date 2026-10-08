# Car Scroll Hero

> Built by Rose Seby

![Hero demo](./docs/hero.gif)
**Live:** https://car-scroll-hero-two.vercel.app


## Design Intent
Most scroll heroes move one object. I wanted the page to feel like turning a key: the headlights wake up,
the title melts upward, the gauge climbs, and the room shifts from navy to black to red as speed builds.
Every layer reads the same scroll progress, so the whole scene accelerates together.

## Design Decisions
**1. Sticky + 250vh track, not GSAP `pin`.** Pinning injects a spacer and inline positioning, which causes
address-bar jumps on iOS. CSS sticky lets the browser own the pin; GSAP only maps progress. The cost: no
ancestor may set `overflow: hidden`. 250vh gives about 1.5 screens of travel, enough for the car to cross
without the scroll feeling endless.

**2. Scrub 1.5 on desktop, 0.5 on touch.** The lag gives the motion weight. On a trackpad it reads as
cinematic; under a thumb it reads as unresponsive, so touch gets a tighter follow.

**3. Two nested spans per letter.** The outer span takes scroll motion, the inner takes the intro, so the two
tweens never fight over one transform. The cost is ~15 extra DOM nodes; `aria-label` on the `h1` keeps
screen readers reading one word.

**Bonus tradeoff:** the background shift is stacked layers with animated opacity, not `background-color`,
which would repaint every frame. The gauge is a rotating needle, not a stroke fill, for the same reason.

## What I'd Do With More Time
1. Scroll-linked engine audio via Web Audio, pitch mapped to progress, with a mute toggle.
2. A lightweight three.js car model so the camera can orbit as it passes.
3. Velocity-based skew using ScrollTrigger's `getVelocity()` so a hard scroll leans the car.

## Performance Notes
- JS bundle: _paste the `npm run build` output here._
- Lighthouse (mobile / desktop): _fill in after running it._
- Devices tested: _list real devices and browsers._
- Only `transform` and `opacity` are animated. Blurs are static CSS filters. No hand-written scroll listeners.

## Notes to the Reviewer
- The car is a placeholder SVG (no licence issues). Swap `src/assets/car.svg` for any transparent PNG and update the width/height attributes in `Hero.jsx`.
- With `prefers-reduced-motion: reduce` the hero renders as a static, fully visible composition.
- Known limitation: very short landscape phone viewports compress the title and stats.
- Tested: _confirm Chrome, Safari, Firefox, iOS Safari, Android Chrome._

## Setup
    npm install
    npm run dev

## Deploy
This repo includes a GitHub Pages workflow. Push to `main`, then in GitHub choose
Settings -> Pages -> Source: `GitHub Actions`.

Manual deploy is also available:

    git init && git add . && git commit -m "feat: scroll-driven car hero"
    git branch -M main
    git remote add origin https://github.com/rosesebyk/car-scroll-hero.git
    git push -u origin main
    npm run deploy

For the manual deploy path, choose Settings -> Pages -> Deploy from branch -> `gh-pages` / root.
