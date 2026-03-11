/**
 * wiki-nav.js — Single source of truth for sidebar navigation.
 * Automatically highlights the current page and injects consistent nav links.
 * Include this script on every page AFTER the sidebar HTML.
 *
 * Usage: Add <ul class="nav-links" id="wikiNav"></ul> in the sidebar,
 * then include this script. It will populate the nav and mark the active page.
 */
(function() {
  var NAV_ITEMS = [
    { href: 'index.html',     label: 'Wiki Home',       dot: 'gold' },
    { href: 'equipment.html', label: 'Equipment',        dot: 'gold' },
    { href: 'loot.html',      label: 'Loot Bags',        dot: 'orange' },
    { href: 'materials.html', label: 'Materials',         dot: 'purple' },
    { href: 'arena.html',     label: 'Arena &amp; Bosses', dot: 'red' },
    { href: 'crafting.html',  label: 'Crafting',          dot: 'cyan' },
    { href: 'cooking.html',   label: 'Cooking',           dot: 'orange', badge: 'WIP' },
    { href: 'farming.html',   label: 'Farming',           dot: 'green' },
    { href: 'skills.html',    label: 'Skills',            dot: 'blue' },
    { href: 'patches.html',   label: 'Patch Notes',       dot: 'green' },
    { href: 'roadmap.html',   label: 'Roadmap',           dot: 'gold' },
  ];

  var container = document.getElementById('wikiNav');
  if (!container) return;

  // Determine current page from URL
  var path = window.location.pathname;
  var currentPage = path.substring(path.lastIndexOf('/') + 1) || 'index.html';

  var html = '';
  NAV_ITEMS.forEach(function(item) {
    var isActive = (currentPage === item.href) ? ' active' : '';
    var badge = '';
    if (item.badge === 'WIP') {
      badge = ' <span class="nav-badge-soon">WIP</span>';
    } else if (item.badge === 'NEW') {
      badge = ' <span class="nav-badge-new">NEW</span>';
    }
    html += '<li><a href="' + item.href + '" class="nav-link' + isActive + '">' +
      '<span class="nav-dot ' + item.dot + '"></span> ' + item.label + badge + '</a></li>';
  });

  container.innerHTML = html;
})();
