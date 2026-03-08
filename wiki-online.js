/**
 * wiki-online.js — Fetches online player count from Supabase profiles table.
 * Updates the .player-count element in the top bar.
 * Only counts users whose updated_at is within the last 3 minutes (same as app).
 */
(function() {
  var url = window.WIKI_SUPABASE_URL || '';
  var key = window.WIKI_SUPABASE_KEY || '';
  if (!url || !key) return;

  var el = document.querySelector('.player-count span:last-child');
  if (!el) return;

  var staleMs = 3 * 60 * 1000;
  var cutoff = new Date(Date.now() - staleMs).toISOString();

  fetch(url + '/rest/v1/profiles?is_online=eq.true&updated_at=gte.' + encodeURIComponent(cutoff) + '&select=id', {
    headers: { 'apikey': key, 'Authorization': 'Bearer ' + key, 'Prefer': 'count=exact' }
  }).then(function(r) {
    var count = r.headers.get('content-range');
    var total = '0';
    if (count) {
      var parts = count.split('/');
      if (parts[1] && parts[1] !== '*') total = parts[1];
    }
    el.textContent = total + ' online';
    el.closest('.player-count').title = total + ' players currently online';
  }).catch(function() {
    el.textContent = '0 online';
  });
})();
