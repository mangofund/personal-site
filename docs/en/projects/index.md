---
title: Projects
description: Products I build, and open-source projects by friends. Currently XMade, a Chrome extension for saving posts from X, and Bing Wallpaper for Mac.
---

<script setup>
import { withBase } from 'vitepress'
const xmadeImg = withBase('/images/projects/xmade.jpg')
const liveUrl = withBase('/live/')
const bingImg = withBase('/images/bing-wallpaper/cover.jpg')
const storeUrl = 'https://chromewebstore.google.com/detail/xmade-twitter-video-downl/bgopfpaklpnjmjbngflljdnjnblhnbjm'
</script>

# Projects

<div class="project-list">
  <article class="project-tile">
    <a class="skill-thumb" :href="liveUrl" target="_blank" rel="noopener" style="display:flex;align-items:center;justify-content:center;min-height:170px;background:linear-gradient(135deg,#101c25,#202438);color:#b6f36a;font-size:30px;font-weight:800;letter-spacing:4px">✳ STAGEFLOW</a>
    <h2 class="skill-title"><a :href="liveUrl" target="_blank" rel="noopener">Stageflow · 星场</a></h2>
    <p class="skill-pitch">A browser-based live scoring workspace with group scoring, duo PK and shareable cloud display links. Public alpha uses simulated gifts; TikTok data is not connected yet.</p>
    <div class="skill-foot"><span class="skill-chip">Web app · Alpha</span><div class="skill-controls"><a class="skill-zip" :href="liveUrl" target="_blank" rel="noopener">Try the alpha →</a></div></div>
  </article>
  <article class="project-tile">
    <a class="skill-thumb" :href="storeUrl" target="_blank" rel="noopener">
      <img :src="xmadeImg" alt="XMade: one-click download of posts, videos, and long articles from X" width="800" height="450" loading="eager" decoding="async" />
    </a>
    <h2 class="skill-title"><a :href="storeUrl" target="_blank" rel="noopener">XMade</a></h2>
    <p class="skill-pitch">A Chrome extension that downloads posts, videos, and long articles from X, then sends them to WeChat Official Account drafts. It is a tool I use every day.</p>
    <div class="skill-foot">
      <span class="skill-chip">Chrome Extension</span>
      <div class="skill-controls">
        <a class="skill-zip" :href="storeUrl" target="_blank" rel="noopener">Install from the Chrome Web Store →</a>
      </div>
    </div>
  </article>
  <article class="project-tile">
    <a class="skill-thumb" href="https://fairzy.github.io/bingwallpaper-for-mac/" target="_blank" rel="noopener">
      <img :src="bingImg" alt="Bing Wallpaper for Mac: the Bing daily photo as your desktop, automatically" width="800" height="450" loading="lazy" decoding="async" />
    </a>
    <h2 class="skill-title"><a href="https://fairzy.github.io/bingwallpaper-for-mac/" target="_blank" rel="noopener">Bing Wallpaper for Mac</a></h2>
    <p class="skill-pitch">An open-source app: the behavior of the official Windows Bing Wallpaper, reverse-engineered with REA and rebuilt natively in Swift for macOS. Lives in the menu bar and sets the Bing daily photo as your desktop every day. MIT, free.</p>
    <div class="skill-foot">
      <span class="skill-chip">macOS app · Open source</span>
      <div class="skill-controls">
        <a class="skill-zip" href="/en/ai/products/bing-wallpaper-for-mac">Read the intro →</a>
        <a class="skill-zip" href="https://github.com/fairzy/bingwallpaper-for-mac" target="_blank" rel="noopener">GitHub →</a>
      </div>
    </div>
  </article>
</div>
