/**
 * wiki-online.js — Fetches online player count from Supabase profiles table.
 * Updates the .player-count element in the top bar.
 * Counts users whose updated_at is within the last 5 minutes (active heartbeat).
 */
(function() {
  var url = window.WIKI_SUPABASE_URL || '';
  var key = window.WIKI_SUPABASE_KEY || '';
  if (!url || !key) return;

  var el = document.querySelector('.player-count span:last-child');
  if (!el) return;

  var staleMs = 5 * 60 * 1000;
  var cutoff = new Date(Date.now() - staleMs).toISOString();

  // Count profiles updated in the last 5 minutes (regardless of is_online flag which can be stale)
  fetch(url + '/rest/v1/profiles?updated_at=gte.' + encodeURIComponent(cutoff) + '&select=id', {
    headers: { 'apikey': key, 'Authorization': 'Bearer ' + key, 'Prefer': 'count=exact', 'Range-Unit': 'items', 'Range': '0-0' }
  }).then(function(r) {
    var range = r.headers.get('content-range');
    var total = '0';
    if (range) {
      var parts = range.split('/');
      if (parts[1] && parts[1] !== '*') total = parts[1];
    }
    el.textContent = total + ' online';
    el.closest('.player-count').title = total + ' players currently online';
  }).catch(function() {
    el.textContent = '0 online';
  });
})();
