/**
 * wiki-patches.js — Shared patch notes fetcher & renderer with wiki auto-linking.
 *
 * Usage:
 *   renderPatches(containerEl, { limit: 20, expandFirst: false })
 *   renderLatestPatch(containerEl)  // single latest release, auto-expanded
 */
(function() {
  var REPO = 'borissharikoff-droid/Idly';
  var API  = 'https://api.github.com/repos/' + REPO + '/releases?per_page=25';

  // ── Wiki link dictionary ──────────────────────────────────────────────────
  // Maps keywords → wiki URLs. Longer phrases first so "Dragon Crown" matches before "Dragon".
  var WIKI_LINKS = [
    // Equipment sets
    {re:/\bWooden Set\b/g, url:'equipment.html', label:'Wooden Set'},
    {re:/\bCopper Set\b/g, url:'equipment.html', label:'Copper Set'},
    {re:/\bShadow Set\b/g, url:'equipment.html', label:'Shadow Set'},
    {re:/\bGolden Set\b/g, url:'equipment.html', label:'Golden Set'},
    {re:/\bVoid Set\b/g, url:'equipment.html', label:'Void Set'},
    // Crafted gear (multi-word first)
    {re:/\bDragonfire Blade\b/g, url:'item.html?id=craft_dragonfire_blade'},
    {re:/\bDragon Crown\b/g, url:'item.html?id=craft_dragon_crown'},
    {re:/\bTroll Aegis\b/g, url:'item.html?id=craft_troll_aegis'},
    {re:/\bTroll Cloak\b/g, url:'item.html?id=craft_troll_cloak'},
    {re:/\bWarlord Gauntlets\b/g, url:'item.html?id=craft_warlord_gauntlets'},
    {re:/\bVoid Blade\b/g, url:'item.html?id=craft_void_blade'},
    {re:/\bOrc Plate\b/g, url:'item.html?id=craft_orc_plate'},
    {re:/\bWolf Fang Pendant\b/g, url:'item.html?id=craft_wolf_pendant'},
    {re:/\bScale Robe\b/g, url:'item.html?id=craft_scale_robe'},
    {re:/\bEssence Ring\b/g, url:'item.html?id=craft_essence_ring'},
    {re:/\bGoblin Blade\b/g, url:'item.html?id=craft_goblin_blade'},
    {re:/\bSlime Shield\b/g, url:'item.html?id=craft_slime_shield'},
    {re:/\bFang Dagger\b/g, url:'item.html?id=craft_fang_dagger'},
    {re:/\bIron Helm\b/g, url:'item.html?id=craft_iron_helm'},
    // Arena zones
    {re:/\bSlime Cavern\b/g, url:'arena.html', label:'Slime Cavern'},
    {re:/\bGoblin Outpost\b/g, url:'arena.html', label:'Goblin Outpost'},
    {re:/\bWild Forest\b/g, url:'arena.html', label:'Wild Forest'},
    {re:/\bOrc Stronghold\b/g, url:'arena.html', label:'Orc Stronghold'},
    {re:/\bTroll Bridge\b/g, url:'arena.html', label:'Troll Bridge'},
    {re:/\bDragon Lair\b/g, url:'arena.html', label:'Dragon Lair'},
    // Bosses
    {re:/\bOrc Warlord\b/g, url:'arena.html'},
    {re:/\bTroll Overlord\b/g, url:'arena.html'},
    {re:/\bAncient Dragon\b/g, url:'arena.html'},
    // Materials (multi-word)
    {re:/\bDragon Scale\b/g, url:'item.html?id=dragon_scale'},
    {re:/\bTroll Hide\b/g, url:'item.html?id=troll_hide'},
    {re:/\bOrc Shard\b/g, url:'item.html?id=orc_shard'},
    {re:/\bWolf Fang\b/g, url:'item.html?id=wolf_fang'},
    {re:/\bGoblin Tooth\b/g, url:'item.html?id=goblin_tooth'},
    {re:/\bSlime Gel\b/g, url:'item.html?id=slime_gel'},
    {re:/\bVoid Crystal\b/g, url:'item.html?id=void_crystal'},
    {re:/\bMagic Essence\b/g, url:'item.html?id=magic_essence'},
    {re:/\bIron Ore\b/g, url:'item.html?id=ore_iron'},
    {re:/\bDragon Heart\b/g, url:'item.html?id=dragon_heart'},
    {re:/\bTroll Heart\b/g, url:'item.html?id=troll_heart'},
    {re:/\bWarlord Sigil\b/g, url:'item.html?id=warlord_sigil'},
    // Potions
    {re:/\bAttack Potion\b/g, url:'item.html?id=atk_potion'},
    {re:/\bVitality Potion\b/g, url:'item.html?id=hp_potion'},
    {re:/\bRegen Potion\b/g, url:'item.html?id=regen_potion'},
    // Plants
    {re:/\bStar Bloom\b/g, url:'item.html?id=star_bloom'},
    {re:/\bCrystal Root\b/g, url:'item.html?id=crystal_root'},
    {re:/\bVoid Blossom\b/g, url:'item.html?id=void_blossom'},
    // Pages (generic keywords — last so specific items match first)
    {re:/\b[Cc]rafting\b/g, url:'crafting.html'},
    {re:/\b[Ff]arming\b/g, url:'farming.html'},
    {re:/\b[Aa]rena\b/g, url:'arena.html'},
    {re:/\b[Mm]arketplace\b/g, url:'#'},
    {re:/\b[Ll]oot [Bb]ags?\b/g, url:'loot.html'},
  ];

  // ── Helpers ────────────────────────────────────────────────────────────────
  function esc(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function formatDate(iso) {
    var d = new Date(iso);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
  }

  function getPreview(body) {
    if (!body) return 'No description provided.';
    var lines = body.split('\n').filter(function(l) { return l.trim(); });
    var preview = lines.slice(0, 3).join(' ').replace(/[#*`_~]/g, '').trim();
    if (preview.length > 200) preview = preview.substring(0, 200) + '...';
    return preview || 'No description provided.';
  }

  // ── Change-type badges ─────────────────────────────────────────────────────
  var CHANGE_TYPES = {
    'added':   {color:'#00ff88', bg:'rgba(0,255,136,0.08)', border:'rgba(0,255,136,0.2)', label:'NEW'},
    'new':     {color:'#00ff88', bg:'rgba(0,255,136,0.08)', border:'rgba(0,255,136,0.2)', label:'NEW'},
    'feat':    {color:'#00ff88', bg:'rgba(0,255,136,0.08)', border:'rgba(0,255,136,0.2)', label:'NEW'},
    'changed': {color:'#fbbf24', bg:'rgba(251,191,36,0.08)', border:'rgba(251,191,36,0.2)', label:'CHANGE'},
    'balance': {color:'#fbbf24', bg:'rgba(251,191,36,0.08)', border:'rgba(251,191,36,0.2)', label:'BALANCE'},
    'buffed':  {color:'#4ade80', bg:'rgba(74,222,128,0.08)', border:'rgba(74,222,128,0.2)', label:'BUFF'},
    'nerfed':  {color:'#f87171', bg:'rgba(248,113,113,0.08)', border:'rgba(248,113,113,0.2)', label:'NERF'},
    'fixed':   {color:'#38bdf8', bg:'rgba(56,189,248,0.08)', border:'rgba(56,189,248,0.2)', label:'FIX'},
    'fix':     {color:'#38bdf8', bg:'rgba(56,189,248,0.08)', border:'rgba(56,189,248,0.2)', label:'FIX'},
    'removed': {color:'#f472b6', bg:'rgba(244,114,182,0.08)', border:'rgba(244,114,182,0.2)', label:'REMOVED'},
  };

  function changeTypeBadge(line) {
    var lower = line.toLowerCase();
    for (var key in CHANGE_TYPES) {
      if (lower.indexOf(key) !== -1) {
        var t = CHANGE_TYPES[key];
        return '<span style="display:inline-block;font-size:9px;font-family:var(--font-mono);text-transform:uppercase;letter-spacing:.5px;padding:1px 6px;border-radius:3px;margin-right:6px;background:'+t.bg+';color:'+t.color+';border:1px solid '+t.border+'">'+t.label+'</span>';
      }
    }
    return '';
  }

  // ── Auto-link wiki terms ───────────────────────────────────────────────────
  function autoLinkWiki(html) {
    // Track which links we've already inserted to avoid double-linking
    var placeholders = [];
    var idx = 0;

    WIKI_LINKS.forEach(function(wl) {
      if (wl.url === '#') return; // skip placeholder links
      html = html.replace(wl.re, function(match) {
        var ph = '\x00WLINK' + idx + '\x00';
        placeholders.push({ph: ph, html: '<a href="'+wl.url+'" style="color:var(--gold);text-decoration:none;border-bottom:1px dotted var(--gold-dim)">'+match+'</a>'});
        idx++;
        return ph;
      });
    });

    // Restore placeholders
    placeholders.forEach(function(p) {
      html = html.split(p.ph).join(p.html);
    });

    return html;
  }

  // ── Markdown → HTML ────────────────────────────────────────────────────────
  function renderMarkdown(md) {
    if (!md) return '<p style="color:var(--text-dim)">No description provided.</p>';

    var escaped = esc(md);

    // Headings
    escaped = escaped
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>');

    // Inline formatting
    escaped = escaped
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');

    // List items — add change-type badge
    escaped = escaped.replace(/^[*\-] (.+)$/gm, function(_, content) {
      var badge = changeTypeBadge(content);
      return '<li>' + badge + content + '</li>';
    });

    // Wrap consecutive <li> in <ul>
    escaped = escaped.replace(/(<li>.*?<\/li>(\s*<li>.*?<\/li>)*)/gs, function(match) {
      return '<ul>' + match + '</ul>';
    });
    escaped = escaped.replace(/<\/ul>\s*<ul>/g, '');

    // Paragraphs
    escaped = escaped
      .replace(/\n{2,}/g, '<br><br>')
      .replace(/\n/g, '<br>');

    // Auto-link wiki terms (after all HTML generation so we don't break tags)
    escaped = autoLinkWiki(escaped);

    return escaped;
  }

  // ── Build a patch card ─────────────────────────────────────────────────────
  function buildPatchCard(rel, isLatest, startOpen) {
    var card = document.createElement('div');
    card.className = 'patch-card' + (startOpen ? ' open' : '');

    var header = document.createElement('div');
    header.className = 'patch-header';
    header.innerHTML =
      '<span class="patch-tag">' + esc(rel.tag_name || 'unknown') + '</span>' +
      '<span class="patch-title">' + esc(rel.name || rel.tag_name || 'Release') + '</span>' +
      (isLatest ? '<span class="patch-latest">Latest</span>' : '') +
      '<span class="patch-date">' + formatDate(rel.published_at || rel.created_at) + '</span>' +
      '<span class="patch-arrow">&#9660;</span>';

    var body = document.createElement('div');
    body.className = 'patch-body';
    body.innerHTML =
      '<div class="patch-preview">' + esc(getPreview(rel.body)) + '</div>' +
      '<div class="patch-content">' + renderMarkdown(rel.body) + '</div>' +
      '<a href="' + rel.html_url + '" target="_blank" rel="noopener" class="patch-gh-link">View on GitHub &rarr;</a>';

    header.addEventListener('click', function() {
      card.classList.toggle('open');
    });

    card.appendChild(header);
    card.appendChild(body);
    return card;
  }

  // ── Cached fetch ───────────────────────────────────────────────────────────
  var _cache = null;
  function fetchReleases() {
    if (_cache) return _cache;
    _cache = fetch(API).then(function(r) {
      if (!r.ok) throw new Error('GitHub API ' + r.status);
      return r.json();
    });
    return _cache;
  }

  // ── Public: render full patch list ─────────────────────────────────────────
  window.renderPatches = function(container, opts) {
    opts = opts || {};
    var limit = opts.limit || 20;
    var expandFirst = opts.expandFirst || false;

    container.innerHTML = '<div class="patches-loading">Loading releases...</div>';

    fetchReleases().then(function(releases) {
      if (!releases || releases.length === 0) {
        container.innerHTML = '<div class="patches-error">No releases found.</div>';
        return;
      }
      container.innerHTML = '';
      releases.slice(0, limit).forEach(function(rel, i) {
        container.appendChild(buildPatchCard(rel, i === 0, expandFirst && i === 0));
      });
    }).catch(function(err) {
      container.innerHTML = '<div class="patches-error">Failed to load releases. ' + err.message + '</div>';
    });
  };

  // ── Public: render latest patch only (for home page) ───────────────────────
  window.renderLatestPatch = function(container) {
    container.innerHTML = '<div class="patches-loading">Loading latest release...</div>';

    fetchReleases().then(function(releases) {
      if (!releases || releases.length === 0) {
        container.innerHTML = '<div style="color:var(--text-dim);font-size:13px;padding:16px 0">No releases yet.</div>';
        return;
      }
      container.innerHTML = '';
      container.appendChild(buildPatchCard(releases[0], true, false));
      // "View all patches" link
      var link = document.createElement('a');
      link.href = 'patches.html';
      link.style.cssText = 'display:block;text-align:center;margin-top:10px;padding:8px 0;font-size:12px;color:var(--gold);font-family:var(--font-mono)';
      link.textContent = 'View all patch notes \u2192';
      container.appendChild(link);
    }).catch(function(err) {
      container.innerHTML = '<div style="color:var(--text-dim);font-size:13px;padding:16px 0">Could not load patch notes.</div>';
    });
  };
})();
