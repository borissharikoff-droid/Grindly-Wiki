/**
 * wiki-skins.js — Fetches admin_config from Supabase and patches item/boss/zone icons
 * on any wiki page.
 *
 * Two modes:
 * 1. Explicit: Elements with [data-item-id], [data-boss-id], [data-zone-id],
 *    [data-seed-id], [data-chest-id] get patched directly.
 * 2. Auto-discovery: Finds all <a href="item.html?id=XXX"> links and patches the
 *    nearest icon element (.mat-card-icon, .icon-cell, .set-item-icon) in the same
 *    parent container.
 *
 * Include after wiki-config.js:
 *   <script src="wiki-config.js"></script>
 *   <script src="wiki-skins.js"></script>
 */
(function() {
  var url = window.WIKI_SUPABASE_URL || '';
  var key = window.WIKI_SUPABASE_KEY || '';
  if (!url || !key) return;

  function patchEl(el, ov) {
    if (ov.image) {
      el.innerHTML = '<img src="' + ov.image + '" style="width:100%;height:100%;object-fit:contain">';
    } else if (ov.icon) {
      el.textContent = ov.icon;
    }
  }

  function patchByAttr(selector, overrides) {
    document.querySelectorAll(selector).forEach(function(el) {
      var id = el.getAttribute(selector.replace(/[\[\]]/g, '').split('=')[0].replace('[',''));
      // extract attr name from selector like [data-item-id]
    });
  }

  fetch(url + '/rest/v1/admin_config?id=eq.singleton&select=config', {
    headers: { 'apikey': key, 'Authorization': 'Bearer ' + key }
  }).then(function(r) { return r.json(); })
    .then(function(rows) {
      if (!rows || !rows[0] || !rows[0].config) return;
      var cfg = rows[0].config;
      window.WIKI_ADMIN_CONFIG = cfg;

      var itemOv = cfg.itemOverrides || {};
      var bossOv = cfg.bossOverrides || {};
      var zoneOv = cfg.zoneOverrides || {};
      var seedOv = cfg.seedOverrides || {};
      var chestOv = cfg.chestOverrides || {};

      // 1. Explicit data attributes
      var attrMap = [
        ['data-item-id', itemOv],
        ['data-boss-id', bossOv],
        ['data-zone-id', zoneOv],
        ['data-seed-id', seedOv],
        ['data-chest-id', chestOv]
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
        var ov = itemOv[id];
        if (!ov || (!ov.image && !ov.icon)) return;
        // Walk up to find a container, then find the icon element
        var container = link.closest('.mat-card, tr, .set-item');
        if (!container) return;
        var iconEl = container.querySelector(iconSelectors);
        if (iconEl) patchEl(iconEl, ov);
      });

      // Dispatch event so page-specific JS (equipment.html) can react
      window.dispatchEvent(new CustomEvent('wiki-skins-loaded', { detail: cfg }));
    }).catch(function() { /* offline */ });
})();
