/* ==========================================================================
   CURSOR TRAIL EFFECT
   Elegant dot + ring that follow the mouse with smooth easing
   ========================================================================== */

(function () {
  // Skip on touch devices
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  var dot = document.createElement('div');
  dot.className = 'cursor-dot';
  document.body.appendChild(dot);

  var ring = document.createElement('div');
  ring.className = 'cursor-dot-trail';
  document.body.appendChild(ring);

  var mouseX = -100, mouseY = -100;
  var dotX = -100, dotY = -100;
  var ringX = -100, ringY = -100;
  var visible = false;

  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!visible) {
      visible = true;
      dot.classList.add('visible');
      ring.classList.add('visible');
    }
  });

  document.addEventListener('mouseleave', function () {
    visible = false;
    dot.classList.remove('visible');
    ring.classList.remove('visible');
  });

  // Detect hoverable elements
  var hoverSelectors = 'a, button, .tag, .project-card, .stat-card, [role="button"], input, textarea, select, .greedy-nav a';

  document.addEventListener('mouseover', function (e) {
    if (e.target.closest(hoverSelectors)) {
      ring.classList.add('hovering');
    }
  });

  document.addEventListener('mouseout', function (e) {
    if (e.target.closest(hoverSelectors)) {
      ring.classList.remove('hovering');
    }
  });

  // Smooth follow loop
  function animate() {
    // Dot follows quickly
    dotX += (mouseX - dotX) * 0.25;
    dotY += (mouseY - dotY) * 0.25;
    dot.style.transform = 'translate(' + (dotX - 4) + 'px,' + (dotY - 4) + 'px)';

    // Ring follows with more lag
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    var rw = ring.classList.contains('hovering') ? 26 : 18;
    ring.style.transform = 'translate(' + (ringX - rw) + 'px,' + (ringY - rw) + 'px)';

    requestAnimationFrame(animate);
  }

  animate();
})();
