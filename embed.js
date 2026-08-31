/*
 * embed.js — lets this site sit inside an <iframe> on another page (e.g. the
 * Roundup's SNO/WordPress site) and tell that page how tall it needs to be.
 *
 * A cross-origin iframe cannot resize itself to fit its content, so each page
 * posts its height to the parent window and the parent sets the iframe height.
 * When the site is loaded directly (no parent listening) this does nothing
 * visible, so it is safe to ship on the standalone site too.
 *
 * Parent-page side of this handshake is documented in README.md.
 */
(function () {
  // Not framed — nothing to do.
  if (window.parent === window) return;

  var lastSent = -1;
  var scheduled = false;

  function measure() {
    var doc = document.documentElement;
    var body = document.body;
    return Math.max(
      doc.scrollHeight,
      doc.offsetHeight,
      body ? body.scrollHeight : 0,
      body ? body.offsetHeight : 0
    );
  }

  function send() {
    scheduled = false;
    var h = measure();
    if (h === lastSent) return;
    lastSent = h;
    window.parent.postMessage({ roundupGamesHeight: h }, "*");
  }

  function queueSend() {
    if (scheduled) return;
    scheduled = true;
    (window.requestAnimationFrame || window.setTimeout)(send);
  }

  // Tell the parent a new page loaded, so it can scroll the iframe into view.
  window.parent.postMessage({ roundupGamesNavigated: location.pathname }, "*");

  window.addEventListener("load", queueSend);
  window.addEventListener("resize", queueSend);
  document.addEventListener("readystatechange", queueSend);

  if (window.ResizeObserver && document.body) {
    new ResizeObserver(queueSend).observe(document.body);
  }

  // Catch late layout shifts from async embeds (crossword/word-search iframes,
  // fonts, images) that fire no event we can hook.
  [200, 600, 1200, 2500, 4000].forEach(function (ms) {
    window.setTimeout(queueSend, ms);
  });

  queueSend();
})();
