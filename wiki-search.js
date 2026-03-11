/**
 * wiki-search.js — shared search for all wiki pages.
 * Supports keyboard navigation (Up/Down/Enter/Escape) and Ctrl+K shortcut.
 */
(function() {
  var SEARCH_INDEX = [
    // Equipment — Bag-Drop Sets
    { name: 'Wooden Helm', url: 'item.html?id=wooden_helm', cat: 'Equipment', icon: '\u{1FA96}' },
    { name: 'Wooden Plate', url: 'item.html?id=wooden_plate', cat: 'Equipment', icon: '\u{1FAB5}' },
    { name: 'Wooden Sword', url: 'item.html?id=wooden_sword', cat: 'Equipment', icon: '\u{1F5E1}\uFE0F' },
    { name: 'Wooden Legs', url: 'item.html?id=wooden_legs', cat: 'Equipment', icon: '\u{1F9BF}' },
    { name: 'Wooden Ring', url: 'item.html?id=wooden_ring', cat: 'Equipment', icon: '\u{1F4FF}' },
    { name: 'Copper Helm', url: 'item.html?id=copper_helm', cat: 'Equipment', icon: '\u26D1\uFE0F' },
    { name: 'Copper Plate', url: 'item.html?id=copper_plate', cat: 'Equipment', icon: '\u{1F6E1}\uFE0F' },
    { name: 'Copper Sword', url: 'item.html?id=copper_sword', cat: 'Equipment', icon: '\u2694\uFE0F' },
    { name: 'Copper Legs', url: 'item.html?id=copper_legs', cat: 'Equipment', icon: '\u{1F9BF}' },
    { name: 'Copper Ring', url: 'item.html?id=copper_ring', cat: 'Equipment', icon: '\u{1F48D}' },
    { name: 'Shadow Helm', url: 'item.html?id=shadow_helm', cat: 'Equipment', icon: '\u{1FA96}' },
    { name: 'Shadow Plate', url: 'item.html?id=shadow_plate', cat: 'Equipment', icon: '\u{1F6E1}\uFE0F' },
    { name: 'Shadow Sword', url: 'item.html?id=shadow_sword', cat: 'Equipment', icon: '\u2694\uFE0F' },
    { name: 'Shadow Legs', url: 'item.html?id=shadow_legs', cat: 'Equipment', icon: '\u{1F9BF}' },
    { name: 'Shadow Ring', url: 'item.html?id=shadow_ring', cat: 'Equipment', icon: '\u{1F517}' },
    { name: 'Golden Helm', url: 'item.html?id=golden_helm', cat: 'Equipment', icon: '\u{1F451}' },
    { name: 'Golden Plate', url: 'item.html?id=golden_plate', cat: 'Equipment', icon: '\u{1F6E1}\uFE0F' },
    { name: 'Golden Sword', url: 'item.html?id=golden_sword', cat: 'Equipment', icon: '\u2694\uFE0F' },
    { name: 'Golden Legs', url: 'item.html?id=golden_legs', cat: 'Equipment', icon: '\u{1F9BF}' },
    { name: 'Golden Ring', url: 'item.html?id=golden_ring', cat: 'Equipment', icon: '\u{1F48D}' },
    { name: 'Void Helm', url: 'item.html?id=void_helm', cat: 'Equipment', icon: '\u{1F300}' },
    { name: 'Void Plate', url: 'item.html?id=void_plate', cat: 'Equipment', icon: '\u{1F47B}' },
    { name: 'Void Sword', url: 'item.html?id=void_sword', cat: 'Equipment', icon: '\u2694\uFE0F' },
    { name: 'Void Legs', url: 'item.html?id=void_legs', cat: 'Equipment', icon: '\u{1F9BF}' },
    { name: 'Void Ring', url: 'item.html?id=void_ring', cat: 'Equipment', icon: '\u{1F300}' },
    // Crafted Gear
    { name: 'Iron Helm', url: 'item.html?id=craft_iron_helm', cat: 'Equipment', icon: '\u26D1\uFE0F' },
    { name: 'Fang Dagger', url: 'item.html?id=craft_fang_dagger', cat: 'Equipment', icon: '\u{1F5E1}\uFE0F' },
    { name: 'Slime Shield', url: 'item.html?id=craft_slime_shield', cat: 'Equipment', icon: '\u{1F6E1}\uFE0F' },
    { name: 'Goblin Blade', url: 'item.html?id=craft_goblin_blade', cat: 'Equipment', icon: '\u{1F52A}' },
    { name: 'Essence Ring', url: 'item.html?id=craft_essence_ring', cat: 'Equipment', icon: '\u{1F48D}' },
    { name: 'Scale Robe', url: 'item.html?id=craft_scale_robe', cat: 'Equipment', icon: '\u{1F94B}' },
    { name: 'Wolf Fang Pendant', url: 'item.html?id=craft_wolf_pendant', cat: 'Equipment', icon: '\u{1F43A}' },
    { name: 'Orc Plate', url: 'item.html?id=craft_orc_plate', cat: 'Equipment', icon: '\u{1FAA8}' },
    { name: 'Void Blade', url: 'item.html?id=craft_void_blade', cat: 'Equipment', icon: '\u2694\uFE0F' },
    { name: 'Troll Cloak', url: 'item.html?id=craft_troll_cloak', cat: 'Equipment', icon: '\u{1F9CC}' },
    { name: 'Warlord Gauntlets', url: 'item.html?id=craft_warlord_gauntlets', cat: 'Equipment', icon: '\u{1F531}' },
    { name: 'Dragon Crown', url: 'item.html?id=craft_dragon_crown', cat: 'Equipment', icon: '\u{1F451}' },
    { name: 'Troll Aegis', url: 'item.html?id=craft_troll_aegis', cat: 'Equipment', icon: '\u{1F49C}' },
    { name: 'Dragonfire Blade', url: 'item.html?id=craft_dragonfire_blade', cat: 'Equipment', icon: '\u{1F525}' },
    // Potions
    { name: 'Attack Potion', url: 'item.html?id=atk_potion', cat: 'Consumable', icon: '\u2697\uFE0F' },
    { name: 'Vitality Potion', url: 'item.html?id=hp_potion', cat: 'Consumable', icon: '\u{1F48A}' },
    { name: 'Regen Potion', url: 'item.html?id=regen_potion', cat: 'Consumable', icon: '\u{1F489}' },
    { name: 'Death Insurance', url: 'item.html?id=death_insurance', cat: 'Consumable', icon: '\u{1F6E1}\uFE0F' },
    // Raw Materials
    { name: 'Iron Ore', url: 'item.html?id=ore_iron', cat: 'Material', icon: '\u{1FAA8}' },
    { name: 'Monster Fang', url: 'item.html?id=monster_fang', cat: 'Material', icon: '\u{1F9B7}' },
    { name: 'Magic Essence', url: 'item.html?id=magic_essence', cat: 'Material', icon: '\u{1F4A7}' },
    { name: 'Ancient Scale', url: 'item.html?id=ancient_scale', cat: 'Material', icon: '\u{1F409}' },
    { name: 'Void Crystal', url: 'item.html?id=void_crystal', cat: 'Material', icon: '\u{1F52E}' },
    // Intermediates
    { name: 'Compost', url: 'item.html?id=compost', cat: 'Material', icon: '\u{1F9EA}' },
    { name: 'Iron Bar', url: 'item.html?id=iron_bar', cat: 'Material', icon: '\u2B1B' },
    { name: 'Fang Shard', url: 'item.html?id=fang_shard', cat: 'Material', icon: '\u{1F9B4}' },
    { name: 'Essence Vial', url: 'item.html?id=essence_vial', cat: 'Material', icon: '\u{1F9EA}' },
    { name: 'Ancient Dust', url: 'item.html?id=ancient_dust', cat: 'Material', icon: '\u{1F4A8}' },
    { name: 'Void Fragment', url: 'item.html?id=void_fragment', cat: 'Material', icon: '\u{1F4A0}' },
    { name: 'Dungeon Pass', url: 'item.html?id=dungeon_pass', cat: 'Material', icon: '\u{1F3AB}' },
    // Seed Zips
    { name: 'Common Seed Zip', url: 'item.html?id=seed_zip_common', cat: 'Material', icon: '\u{1F392}' },
    { name: 'Rare Seed Zip', url: 'item.html?id=seed_zip_rare', cat: 'Material', icon: '\u{1F392}' },
    { name: 'Epic Seed Zip', url: 'item.html?id=seed_zip_epic', cat: 'Material', icon: '\u{1F392}' },
    { name: 'Legendary Seed Zip', url: 'item.html?id=seed_zip_legendary', cat: 'Material', icon: '\u{1F392}' },
    // Arena Mob Materials
    { name: 'Slime Gel', url: 'item.html?id=slime_gel', cat: 'Material', icon: '\u{1FAE7}' },
    { name: 'Goblin Tooth', url: 'item.html?id=goblin_tooth', cat: 'Material', icon: '\u{1F9B7}' },
    { name: 'Wolf Fang', url: 'item.html?id=wolf_fang', cat: 'Material', icon: '\u{1F43A}' },
    { name: 'Orc Shard', url: 'item.html?id=orc_shard', cat: 'Material', icon: '\u{1FAA8}' },
    { name: 'Troll Hide', url: 'item.html?id=troll_hide', cat: 'Material', icon: '\u{1F9CC}' },
    { name: 'Dragon Scale', url: 'item.html?id=dragon_scale', cat: 'Material', icon: '\u{1F409}' },
    // Boss Materials
    { name: 'Warlord Sigil', url: 'item.html?id=warlord_sigil', cat: 'Material', icon: '\u{1F531}' },
    { name: 'Troll Heart', url: 'item.html?id=troll_heart', cat: 'Material', icon: '\u{1F49C}' },
    { name: 'Dragon Heart', url: 'item.html?id=dragon_heart', cat: 'Material', icon: '\u2764\uFE0F\u200D\u{1F525}' },
    // Seeds & Plants
    { name: 'Wheat Seed', url: 'item.html?id=wheat_seed', cat: 'Seed', icon: '\u{1F33E}' },
    { name: 'Herb Seed', url: 'item.html?id=herb_seed', cat: 'Seed', icon: '\u{1F33F}' },
    { name: 'Apple Seed', url: 'item.html?id=apple_seed', cat: 'Seed', icon: '\u{1F34E}' },
    { name: 'Blossom Seed', url: 'item.html?id=blossom_seed', cat: 'Seed', icon: '\u{1F338}' },
    { name: 'Clover Seed', url: 'item.html?id=clover_seed', cat: 'Seed', icon: '\u2618\uFE0F' },
    { name: 'Orchid Seed', url: 'item.html?id=orchid_seed', cat: 'Seed', icon: '\u{1F33A}' },
    { name: 'Star Bloom Seed', url: 'item.html?id=starbloom_seed', cat: 'Seed', icon: '\u2B50' },
    { name: 'Crystal Root Seed', url: 'item.html?id=crystal_seed', cat: 'Seed', icon: '\u{1F48E}' },
    { name: 'Void Spore', url: 'item.html?id=void_spore', cat: 'Seed', icon: '\u{1F310}' },
    // Harvested plants
    { name: 'Wheat', url: 'item.html?id=wheat', cat: 'Farming', icon: '\u{1F33E}' },
    { name: 'Herbs', url: 'item.html?id=herbs', cat: 'Farming', icon: '\u{1F33F}' },
    { name: 'Apples', url: 'item.html?id=apples', cat: 'Farming', icon: '\u{1F34E}' },
    { name: 'Blossoms', url: 'item.html?id=blossoms', cat: 'Farming', icon: '\u{1F338}' },
    { name: 'Clovers', url: 'item.html?id=clovers', cat: 'Farming', icon: '\u2618\uFE0F' },
    { name: 'Orchids', url: 'item.html?id=orchids', cat: 'Farming', icon: '\u{1F33A}' },
    { name: 'Star Bloom', url: 'item.html?id=star_bloom', cat: 'Farming', icon: '\u2B50' },
    { name: 'Crystal Root', url: 'item.html?id=crystal_root', cat: 'Farming', icon: '\u{1F48E}' },
    { name: 'Void Blossom', url: 'item.html?id=void_blossom', cat: 'Farming', icon: '\u{1F310}' },
    { name: 'Wilted Plant', url: 'item.html?id=wilted_plant', cat: 'Farming', icon: '\u{1F940}' },
    { name: 'Farmhouse', url: 'farming.html', cat: 'Farming', icon: '\u{1F3E0}' },
    { name: 'Crop Rot', url: 'farming.html', cat: 'Farming', icon: '\u{1F480}' },
    // Cooking Dishes
    { name: 'Bread', url: 'cooking.html', cat: 'Cooking', icon: '\u{1F35E}' },
    { name: 'Apple Jam', url: 'cooking.html', cat: 'Cooking', icon: '\u{1FAD9}' },
    { name: 'Herb Soup', url: 'cooking.html', cat: 'Cooking', icon: '\u{1F372}' },
    { name: 'Apple Pie', url: 'cooking.html', cat: 'Cooking', icon: '\u{1F967}' },
    { name: 'Blossom Stew', url: 'cooking.html', cat: 'Cooking', icon: '\u{1F35C}' },
    { name: 'Slime Jelly', url: 'cooking.html', cat: 'Cooking', icon: '\u{1F36E}' },
    { name: 'Goblin Kebab', url: 'cooking.html', cat: 'Cooking', icon: '\u{1F362}' },
    { name: 'Clover Feast', url: 'cooking.html', cat: 'Cooking', icon: '\u{1F371}' },
    { name: 'Wolf Steak', url: 'cooking.html', cat: 'Cooking', icon: '\u{1F969}' },
    { name: 'Orchid Tea', url: 'cooking.html', cat: 'Cooking', icon: '\u{1F375}' },
    { name: 'Orc Hotpot', url: 'cooking.html', cat: 'Cooking', icon: '\u{1FAD5}' },
    { name: 'Starbloom Elixir', url: 'cooking.html', cat: 'Cooking', icon: '\u{1F9C3}' },
    { name: 'Troll Broth', url: 'cooking.html', cat: 'Cooking', icon: '\u{1F958}' },
    { name: 'Void Feast', url: 'cooking.html', cat: 'Cooking', icon: '\u{1F37D}\uFE0F' },
    { name: 'Dragon Roast', url: 'cooking.html', cat: 'Cooking', icon: '\u{1F525}' },
    { name: 'Mystery Stew', url: 'cooking.html', cat: 'Cooking', icon: '\u{1FAE0}' },
    // Chests
    { name: 'Common Bag', url: 'item.html?id=common_chest', cat: 'Chest', icon: '\u{1F4E6}' },
    { name: 'Rare Bag', url: 'item.html?id=rare_chest', cat: 'Chest', icon: '\u{1F381}' },
    { name: 'Epic Bag', url: 'item.html?id=epic_chest', cat: 'Chest', icon: '\u{1F9E9}' },
    { name: 'Legendary Bag', url: 'item.html?id=legendary_chest', cat: 'Chest', icon: '\u{1F48E}' },
    // Pages
    { name: 'Equipment', url: 'equipment.html', cat: 'Page', icon: '\u2694\uFE0F' },
    { name: 'Arena & Bosses', url: 'arena.html', cat: 'Page', icon: '\u{1F525}' },
    { name: 'Crafting', url: 'crafting.html', cat: 'Page', icon: '\u2692\uFE0F' },
    { name: 'Cooking', url: 'cooking.html', cat: 'Page', icon: '\u{1F373}' },
    { name: 'Farming', url: 'farming.html', cat: 'Page', icon: '\u{1F331}' },
    { name: 'Skills', url: 'skills.html', cat: 'Page', icon: '\u{1F4CA}' },
    { name: 'Loot Bags', url: 'loot.html', cat: 'Page', icon: '\u{1F381}' },
    { name: 'Materials', url: 'materials.html', cat: 'Page', icon: '\u{1F48E}' },
    { name: 'Patch Notes', url: 'patches.html', cat: 'Page', icon: '\u{1F4E3}' },
    { name: 'Roadmap', url: 'roadmap.html', cat: 'Page', icon: '\u{1F4CD}' },
    { name: 'Prestige', url: 'prestige.html', cat: 'Page', icon: '\u2728' },
    // Prestige tiers
    { name: 'Prestige Bronze', url: 'prestige.html', cat: 'Prestige', icon: '\u{1F949}' },
    { name: 'Prestige Silver', url: 'prestige.html', cat: 'Prestige', icon: '\u{1F948}' },
    { name: 'Prestige Gold', url: 'prestige.html', cat: 'Prestige', icon: '\u{1F947}' },
    { name: 'Prestige Diamond', url: 'prestige.html', cat: 'Prestige', icon: '\u{1F4A0}' },
    { name: 'Prestige Void', url: 'prestige.html', cat: 'Prestige', icon: '\u{1F52E}' },
    { name: 'Transcendent Title', url: 'prestige.html', cat: 'Prestige', icon: '\u2728' },
    // Skills
    { name: 'Developer', url: 'skills.html', cat: 'Skill', icon: '\u{1F4BB}' },
    { name: 'Designer', url: 'skills.html', cat: 'Skill', icon: '\u{1F3A8}' },
    { name: 'Gamer', url: 'skills.html', cat: 'Skill', icon: '\u{1F3AE}' },
    { name: 'Communicator', url: 'skills.html', cat: 'Skill', icon: '\u{1F4AC}' },
    { name: 'Researcher', url: 'skills.html', cat: 'Skill', icon: '\u{1F50D}' },
    { name: 'Creator', url: 'skills.html', cat: 'Skill', icon: '\u{1F3AC}' },
    { name: 'Learner', url: 'skills.html', cat: 'Skill', icon: '\u{1F4DA}' },
    { name: 'Listener', url: 'skills.html', cat: 'Skill', icon: '\u{1F3B5}' },
    { name: 'Farmer', url: 'skills.html', cat: 'Skill', icon: '\u{1F33E}' },
    { name: 'Warrior', url: 'skills.html#warrior-bonuses', cat: 'Skill', icon: '\u2694\uFE0F' },
    { name: 'Crafter', url: 'skills.html', cat: 'Skill', icon: '\u2692\uFE0F' },
    { name: 'Chef', url: 'skills.html', cat: 'Skill', icon: '\u{1F468}\u200D\u{1F373}' },
    { name: 'Grindly', url: 'skills.html#grindly-bonuses', cat: 'Skill', icon: '\u{1F3E0}' },
    // Arena zones
    { name: 'Slime Cavern', url: 'arena.html', cat: 'Arena', icon: '\u{1FAE7}' },
    { name: 'Goblin Outpost', url: 'arena.html', cat: 'Arena', icon: '\u{1F47A}' },
    { name: 'Wild Forest', url: 'arena.html', cat: 'Arena', icon: '\u{1F332}' },
    { name: 'Orc Stronghold', url: 'arena.html', cat: 'Arena', icon: '\u{1F3F0}' },
    { name: 'Troll Bridge', url: 'arena.html', cat: 'Arena', icon: '\u{1F309}' },
    { name: 'Dragon Lair', url: 'arena.html', cat: 'Arena', icon: '\u{1F409}' },
  ];

  var input = document.getElementById('searchInput');
  var resultsEl = document.getElementById('searchResults');
  if (!input || !resultsEl) return;

  var kbIndex = -1;
  var currentMatches = [];

  function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

  function renderResults() {
    resultsEl.innerHTML = '';
    if (currentMatches.length === 0) {
      resultsEl.innerHTML = '<div class="search-result-item" style="color:var(--text-dim);cursor:default">No results found</div>';
    } else {
      currentMatches.forEach(function(m, i) {
        var div = document.createElement('a');
        div.href = m.url;
        div.className = 'search-result-item' + (i === kbIndex ? ' kb-active' : '');
        div.innerHTML =
          '<span class="search-result-icon">' + (m.icon || '') + '</span>' +
          '<span class="search-result-name">' + esc(m.name) + '</span>' +
          '<span class="search-result-tag">' + esc(m.cat) + '</span>';
        resultsEl.appendChild(div);
      });
    }
    resultsEl.classList.add('active');
  }

  input.addEventListener('input', function() {
    var q = this.value.trim().toLowerCase();
    kbIndex = -1;
    if (q.length < 2) {
      resultsEl.innerHTML = '';
      resultsEl.classList.remove('active');
      currentMatches = [];
      return;
    }

    // Score-based matching: exact start > word start > contains
    var scored = [];
    SEARCH_INDEX.forEach(function(entry) {
      var name = entry.name.toLowerCase();
      var idx = name.indexOf(q);
      if (idx === -1) return;
      var score = idx === 0 ? 3 : (name.charAt(idx - 1) === ' ' ? 2 : 1);
      scored.push({ entry: entry, score: score });
    });
    scored.sort(function(a, b) { return b.score - a.score; });
    currentMatches = scored.slice(0, 10).map(function(s) { return s.entry; });
    renderResults();
  });

  input.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      resultsEl.classList.remove('active');
      this.value = '';
      kbIndex = -1;
      currentMatches = [];
      return;
    }
    if (!resultsEl.classList.contains('active') || currentMatches.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      kbIndex = Math.min(kbIndex + 1, currentMatches.length - 1);
      renderResults();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      kbIndex = Math.max(kbIndex - 1, -1);
      renderResults();
    } else if (e.key === 'Enter' && kbIndex >= 0 && kbIndex < currentMatches.length) {
      e.preventDefault();
      window.location.href = currentMatches[kbIndex].url;
    }
  });

  document.addEventListener('click', function(e) {
    if (!e.target.closest('.search-wrap')) {
      resultsEl.classList.remove('active');
      kbIndex = -1;
    }
  });

  // Ctrl+K / Cmd+K to focus search
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      input.focus();
      input.select();
    }
  });
})();
