/**
 * wiki-search.js — shared search for all wiki pages.
 * Include after the sidebar HTML on every page.
 */
(function() {
  var SEARCH_INDEX = [
    // Equipment — Bag-Drop Sets
    { name: 'Wooden Helm', url: 'item.html?id=wooden_helm', cat: 'Equipment' },
    { name: 'Wooden Plate', url: 'item.html?id=wooden_plate', cat: 'Equipment' },
    { name: 'Wooden Sword', url: 'item.html?id=wooden_sword', cat: 'Equipment' },
    { name: 'Wooden Legs', url: 'item.html?id=wooden_legs', cat: 'Equipment' },
    { name: 'Wooden Ring', url: 'item.html?id=wooden_ring', cat: 'Equipment' },
    { name: 'Copper Helm', url: 'item.html?id=copper_helm', cat: 'Equipment' },
    { name: 'Copper Plate', url: 'item.html?id=copper_plate', cat: 'Equipment' },
    { name: 'Copper Sword', url: 'item.html?id=copper_sword', cat: 'Equipment' },
    { name: 'Copper Legs', url: 'item.html?id=copper_legs', cat: 'Equipment' },
    { name: 'Copper Ring', url: 'item.html?id=copper_ring', cat: 'Equipment' },
    { name: 'Shadow Helm', url: 'item.html?id=shadow_helm', cat: 'Equipment' },
    { name: 'Shadow Plate', url: 'item.html?id=shadow_plate', cat: 'Equipment' },
    { name: 'Shadow Sword', url: 'item.html?id=shadow_sword', cat: 'Equipment' },
    { name: 'Shadow Legs', url: 'item.html?id=shadow_legs', cat: 'Equipment' },
    { name: 'Shadow Ring', url: 'item.html?id=shadow_ring', cat: 'Equipment' },
    { name: 'Golden Helm', url: 'item.html?id=golden_helm', cat: 'Equipment' },
    { name: 'Golden Plate', url: 'item.html?id=golden_plate', cat: 'Equipment' },
    { name: 'Golden Sword', url: 'item.html?id=golden_sword', cat: 'Equipment' },
    { name: 'Golden Legs', url: 'item.html?id=golden_legs', cat: 'Equipment' },
    { name: 'Golden Ring', url: 'item.html?id=golden_ring', cat: 'Equipment' },
    { name: 'Void Helm', url: 'item.html?id=void_helm', cat: 'Equipment' },
    { name: 'Void Plate', url: 'item.html?id=void_plate', cat: 'Equipment' },
    { name: 'Void Sword', url: 'item.html?id=void_sword', cat: 'Equipment' },
    { name: 'Void Legs', url: 'item.html?id=void_legs', cat: 'Equipment' },
    { name: 'Void Ring', url: 'item.html?id=void_ring', cat: 'Equipment' },
    // Crafted Gear
    { name: 'Iron Helm', url: 'item.html?id=craft_iron_helm', cat: 'Equipment' },
    { name: 'Fang Dagger', url: 'item.html?id=craft_fang_dagger', cat: 'Equipment' },
    { name: 'Slime Shield', url: 'item.html?id=craft_slime_shield', cat: 'Equipment' },
    { name: 'Goblin Blade', url: 'item.html?id=craft_goblin_blade', cat: 'Equipment' },
    { name: 'Essence Ring', url: 'item.html?id=craft_essence_ring', cat: 'Equipment' },
    { name: 'Scale Robe', url: 'item.html?id=craft_scale_robe', cat: 'Equipment' },
    { name: 'Wolf Fang Pendant', url: 'item.html?id=craft_wolf_pendant', cat: 'Equipment' },
    { name: 'Orc Plate', url: 'item.html?id=craft_orc_plate', cat: 'Equipment' },
    { name: 'Void Blade', url: 'item.html?id=craft_void_blade', cat: 'Equipment' },
    { name: 'Troll Cloak', url: 'item.html?id=craft_troll_cloak', cat: 'Equipment' },
    { name: 'Warlord Gauntlets', url: 'item.html?id=craft_warlord_gauntlets', cat: 'Equipment' },
    { name: 'Dragon Crown', url: 'item.html?id=craft_dragon_crown', cat: 'Equipment' },
    { name: 'Troll Aegis', url: 'item.html?id=craft_troll_aegis', cat: 'Equipment' },
    { name: 'Dragonfire Blade', url: 'item.html?id=craft_dragonfire_blade', cat: 'Equipment' },
    // Potions
    { name: 'Attack Potion', url: 'item.html?id=atk_potion', cat: 'Consumable' },
    { name: 'Vitality Potion', url: 'item.html?id=hp_potion', cat: 'Consumable' },
    { name: 'Regen Potion', url: 'item.html?id=regen_potion', cat: 'Consumable' },
    // Raw Materials
    { name: 'Iron Ore', url: 'item.html?id=ore_iron', cat: 'Material' },
    { name: 'Monster Fang', url: 'item.html?id=monster_fang', cat: 'Material' },
    { name: 'Magic Essence', url: 'item.html?id=magic_essence', cat: 'Material' },
    { name: 'Ancient Scale', url: 'item.html?id=ancient_scale', cat: 'Material' },
    { name: 'Void Crystal', url: 'item.html?id=void_crystal', cat: 'Material' },
    // Intermediates
    { name: 'Iron Bar', url: 'item.html?id=iron_bar', cat: 'Material' },
    { name: 'Fang Shard', url: 'item.html?id=fang_shard', cat: 'Material' },
    { name: 'Essence Vial', url: 'item.html?id=essence_vial', cat: 'Material' },
    { name: 'Ancient Dust', url: 'item.html?id=ancient_dust', cat: 'Material' },
    { name: 'Void Fragment', url: 'item.html?id=void_fragment', cat: 'Material' },
    // Arena Mob Materials
    { name: 'Slime Gel', url: 'item.html?id=slime_gel', cat: 'Material' },
    { name: 'Goblin Tooth', url: 'item.html?id=goblin_tooth', cat: 'Material' },
    { name: 'Wolf Fang', url: 'item.html?id=wolf_fang', cat: 'Material' },
    { name: 'Orc Shard', url: 'item.html?id=orc_shard', cat: 'Material' },
    { name: 'Troll Hide', url: 'item.html?id=troll_hide', cat: 'Material' },
    { name: 'Dragon Scale', url: 'item.html?id=dragon_scale', cat: 'Material' },
    // Boss Materials
    { name: 'Warlord Sigil', url: 'item.html?id=warlord_sigil', cat: 'Material' },
    { name: 'Troll Heart', url: 'item.html?id=troll_heart', cat: 'Material' },
    { name: 'Dragon Heart', url: 'item.html?id=dragon_heart', cat: 'Material' },
    // Seeds & Plants
    { name: 'Wheat Seed', url: 'item.html?id=wheat_seed', cat: 'Seed' },
    { name: 'Herb Seed', url: 'item.html?id=herb_seed', cat: 'Seed' },
    { name: 'Apple Seed', url: 'item.html?id=apple_seed', cat: 'Seed' },
    { name: 'Blossom Seed', url: 'item.html?id=blossom_seed', cat: 'Seed' },
    { name: 'Clover Seed', url: 'item.html?id=clover_seed', cat: 'Seed' },
    { name: 'Orchid Seed', url: 'item.html?id=orchid_seed', cat: 'Seed' },
    { name: 'Star Bloom Seed', url: 'item.html?id=starbloom_seed', cat: 'Seed' },
    { name: 'Crystal Root Seed', url: 'item.html?id=crystal_seed', cat: 'Seed' },
    { name: 'Void Spore', url: 'item.html?id=void_spore', cat: 'Seed' },
    // Harvested plants
    { name: 'Wheat', url: 'item.html?id=wheat', cat: 'Farming' },
    { name: 'Herbs', url: 'item.html?id=herbs', cat: 'Farming' },
    { name: 'Apples', url: 'item.html?id=apples', cat: 'Farming' },
    { name: 'Blossoms', url: 'item.html?id=blossoms', cat: 'Farming' },
    { name: 'Clovers', url: 'item.html?id=clovers', cat: 'Farming' },
    { name: 'Orchids', url: 'item.html?id=orchids', cat: 'Farming' },
    { name: 'Star Bloom', url: 'item.html?id=star_bloom', cat: 'Farming' },
    { name: 'Crystal Root', url: 'item.html?id=crystal_root', cat: 'Farming' },
    { name: 'Void Blossom', url: 'item.html?id=void_blossom', cat: 'Farming' },
    // Chests
    { name: 'Common Bag', url: 'item.html?id=common_chest', cat: 'Chest' },
    { name: 'Rare Bag', url: 'item.html?id=rare_chest', cat: 'Chest' },
    { name: 'Epic Bag', url: 'item.html?id=epic_chest', cat: 'Chest' },
    { name: 'Legendary Bag', url: 'item.html?id=legendary_chest', cat: 'Chest' },
    // Pages
    { name: 'Equipment', url: 'equipment.html', cat: 'Page' },
    { name: 'Arena & Bosses', url: 'arena.html', cat: 'Page' },
    { name: 'Crafting', url: 'crafting.html', cat: 'Page' },
    { name: 'Farming', url: 'farming.html', cat: 'Page' },
    { name: 'Skills', url: 'skills.html', cat: 'Page' },
    { name: 'Loot Bags', url: 'loot.html', cat: 'Page' },
    { name: 'Materials', url: 'materials.html', cat: 'Page' },
    { name: 'Patch Notes', url: 'patches.html', cat: 'Page' },
    // Skills
    { name: 'Developer', url: 'skills.html', cat: 'Skill' },
    { name: 'Designer', url: 'skills.html', cat: 'Skill' },
    { name: 'Gamer', url: 'skills.html', cat: 'Skill' },
    { name: 'Communicator', url: 'skills.html', cat: 'Skill' },
    { name: 'Researcher', url: 'skills.html', cat: 'Skill' },
    { name: 'Creator', url: 'skills.html', cat: 'Skill' },
    { name: 'Learner', url: 'skills.html', cat: 'Skill' },
    { name: 'Listener', url: 'skills.html', cat: 'Skill' },
    { name: 'Farmer', url: 'skills.html', cat: 'Skill' },
    { name: 'Warrior', url: 'skills.html#warrior-bonuses', cat: 'Skill' },
    { name: 'Crafter', url: 'skills.html', cat: 'Skill' },
    // Arena zones
    { name: 'Slime Cavern', url: 'arena.html', cat: 'Arena' },
    { name: 'Goblin Outpost', url: 'arena.html', cat: 'Arena' },
    { name: 'Wild Forest', url: 'arena.html', cat: 'Arena' },
    { name: 'Orc Stronghold', url: 'arena.html', cat: 'Arena' },
    { name: 'Troll Bridge', url: 'arena.html', cat: 'Arena' },
    { name: 'Dragon Lair', url: 'arena.html', cat: 'Arena' },
  ];

  var input = document.getElementById('searchInput');
  var resultsEl = document.getElementById('searchResults');
  if (!input || !resultsEl) return;

  input.addEventListener('input', function() {
    var q = this.value.trim().toLowerCase();
    resultsEl.innerHTML = '';
    if (q.length < 2) { resultsEl.classList.remove('active'); return; }

    var matches = SEARCH_INDEX.filter(function(entry) {
      return entry.name.toLowerCase().indexOf(q) !== -1;
    }).slice(0, 8);

    if (matches.length === 0) {
      resultsEl.innerHTML = '<div class="search-result-item" style="color:var(--text-dim);cursor:default">No results</div>';
    } else {
      matches.forEach(function(m) {
        var div = document.createElement('a');
        div.href = m.url;
        div.className = 'search-result-item';
        div.innerHTML = '<span class="search-result-name">' + m.name + '</span><span class="search-result-tag">' + m.cat + '</span>';
        resultsEl.appendChild(div);
      });
    }
    resultsEl.classList.add('active');
  });

  input.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') { resultsEl.classList.remove('active'); this.value = ''; }
  });

  document.addEventListener('click', function(e) {
    if (!e.target.closest('.search-wrap')) resultsEl.classList.remove('active');
  });
})();
