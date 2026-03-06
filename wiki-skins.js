/**
 * wiki-skins.js — Fetches admin_config from Supabase and patches item/boss/zone icons.
 *
 * Cached in localStorage so repeat visits apply skins instantly (no emoji flash).
 * Fresh data is fetched in the background and updates the cache for next time.
 */
(function() {
  var url = window.WIKI_SUPABASE_URL || '';
  var key = window.WIKI_SUPABASE_KEY || '';
  if (!url || !key) return;

  var CACHE_KEY = 'wiki_admin_config';

  function patchEl(el, ov) {
    if (ov.image) {
      el.innerHTML = '<img src="' + ov.image + '" style="width:100%;height:100%;object-fit:contain">';
    } else if (ov.icon) {
      el.textContent = ov.icon;
    }
  }

  function applyConfig(cfg) {
    window.WIKI_ADMIN_CONFIG = cfg;

    var itemOv = cfg.itemOverrides || {};
    var bossOv = cfg.bossOverrides || {};
    var zoneOv = cfg.zoneOverrides || {};
    var seedOv = cfg.seedOverrides || {};
    var chestOv = cfg.chestOverrides || {};

    // Build flat mob override map from zoneOverrides[zoneId].mobs[mobId]
    var mobOv = {};
    for (var zid in zoneOv) {
      var zm = (zoneOv[zid] || {}).mobs || {};
      for (var mid in zm) { mobOv[mid] = zm[mid]; }
    }

    // 1. Explicit data attributes
    var attrMap = [
      ['data-item-id', itemOv],
      ['data-boss-id', bossOv],
      ['data-zone-id', zoneOv],
      ['data-seed-id', seedOv],
      ['data-chest-id', chestOv],
      ['data-mob-id', mobOv]
    ];
    attrMap.forEach(function(pair) {
      document.querySelectorAll('[' + pair[0] + ']').forEach(function(el) {
        var ov = pair[1][el.getAttribute(pair[0])];
        if (ov) patchEl(el, ov);
      });
    });

    // 2. Auto-discovery: find links to item.html?id=XXX, patch sibling icon
    var iconSelectors = '.mat-card-icon, .icon-cell, .set-item-icon, .zone-icon';
    document.querySelectorAll('a[href*="item.html?id="]').forEach(function(link) {
      var m = link.getAttribute('href').match(/item\.html\?id=([^&"]+)/);
      if (!m) return;
      var id = m[1];
      var ov = itemOv[id] || seedOv[id];
      if (!ov || (!ov.image && !ov.icon)) return;
      var container = link.closest('.mat-card, tr, .set-item');
      if (!container) return;
      var iconEl = container.querySelector(iconSelectors);
      if (iconEl) patchEl(iconEl, ov);
    });

    // Dispatch event so page-specific JS (equipment.html) can react
    window.dispatchEvent(new CustomEvent('wiki-skins-loaded', { detail: cfg }));
  }

  // 1. Apply cached config immediately (synchronous — no flash)
  try {
    var cached = localStorage.getItem(CACHE_KEY);
    if (cached) applyConfig(JSON.parse(cached));
  } catch(e) { /* corrupt cache, ignore */ }

  // 2. Fetch fresh config in background
  fetch(url + '/rest/v1/admin_config?id=eq.singleton&select=config', {
    headers: { 'apikey': key, 'Authorization': 'Bearer ' + key }
  }).then(function(r) { return r.json(); })
    .then(function(rows) {
      if (!rows || !rows[0] || !rows[0].config) return;
      var cfg = rows[0].config;

      // Save to cache for next visit
      try { localStorage.setItem(CACHE_KEY, JSON.stringify(cfg)); } catch(e) {}

      // Re-apply (handles new/changed skins since cache was written)
      applyConfig(cfg);
    }).catch(function() { /* offline — cached version already applied */ });
})();
