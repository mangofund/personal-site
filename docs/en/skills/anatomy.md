---
title: "Isometric Anatomy"
description: "Draw a technical idea as an interactive isometric instrument."
updated: 2026-10-19
aside: false
pageClass: skill-browse
---

<SkillDetail skill-id="anatomy" />

## What it does

Isometric Anatomy turns a technical idea into a small interactive instrument drawn in isometric projection. Dials, knobs, and rails move when the reader touches them, and every number on the figure is driven by the same model as the moving parts — change a value and the instrument responds, so the reader sees the mechanism instead of reading about it.

The output is a single self-contained SVG figure. There is no framework to install and no runtime dependency: the same file works in a plain page, in React, or in Next.js. That makes it a good fit for a hero figure on a technical blog, a docs page, or a landing page — anywhere the point is to explain how a system, an algorithm, or a component works, and a static diagram would leave the reader guessing.

## When to use it — and when not to

Use it when the explanation itself is the product: the reader needs to feel how the parts connect, not just see a picture of them. It suits the Linear-style premium technical illustration this site uses for its feature figures — the kind of figure that carries a page on its own.

Do not use it for a static structural diagram — that is what Diagram Design is for — or for a cover image, which belongs to Cover Image Gen, or for UI screens, which belong to AI Interface Design. The point of this skill is motion tied to a model; if nothing needs to move, a simpler figure will do the job better.

## How to use it

Copy the skill and hand it to your agent. Name the technical idea and the key numbers behind it, then open the result in the browser and check that the parts move with the numbers. If a dial turns and the figure does not follow, the model is wrong — fix the model, not the drawing.
