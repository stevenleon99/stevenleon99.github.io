/* ==========================================================================
   CURSOR TRAIL EFFECT — Shooting Stars
   Spawns small star particles that shoot outward and fade away
   ========================================================================== */

(function () {
  // Skip on touch devices
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  var pool = [];
  var POOL_SIZE = 40;
  var poolIdx = 0;
  var lastX = -999, lastY = -999;
  var active = false;
  var frameCount = 0;

  // Pre-create particle elements
  for (var i = 0; i < POOL_SIZE; i++) {
    var el = document.createElement('div');
    el.className = 'shooting-star';
    el.style.display = 'none';
    document.body.appendChild(el);
    pool.push({ el: el, active: false });
  }

  function spawnStar(x, y, dx, dy) {
    var p = pool[poolIdx];
    poolIdx = (poolIdx + 1) % POOL_SIZE;

    var el = p.el;
    var size = 2 + Math.random() * 3;
    var angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.6;
    var speed = 1.5 + Math.random() * 2.5;
    var vx = Math.cos(angle) * speed;
    var vy = Math.sin(angle) * speed;
    var life = 0;
    var maxLife = 20 + Math.random() * 20;
    var startX = x - size / 2;
    var startY = y - size / 2;

    el.style.width = size + 'px';
    el.style.height = size + 'px';
    el.style.display = 'block';
    el.style.transform = 'translate(' + startX + 'px,' + startY + 'px)';
    el.style.opacity = '1';

    // Randomly pick between circle and diamond shapes
    if (Math.random() > 0.6) {
      el.style.borderRadius = '0';
      el.style.transform = 'translate(' + startX + 'px,' + startY + 'px) rotate(45deg)';
    } else {
      el.style.borderRadius = '50%';
    }

    p.active = true;
    p.vx = vx;
    p.vy = vy;
    p.life = life;
    p.maxLife = maxLife;
    p.x = startX;
    p.y = startY;
  }

  document.addEventListener('mousemove', function (e) {
    var x = e.clientX;
    var y = e.clientY;

    if (!active) {
      active = true;
      lastX = x;
      lastY = y;
      return;
    }

    var dx = x - lastX;
    var dy = y - lastY;
    var dist = Math.sqrt(dx * dx + dy * dy);

    // Spawn stars based on movement distance
    if (dist > 3) {
      var count = Math.min(Math.floor(dist / 8), 3);
      for (var i = 0; i < count; i++) {
        spawnStar(x, y, dx, dy);
      }
      lastX = x;
      lastY = y;
    }
  });

  document.addEventListener('mouseleave', function () {
    active = false;
  });

  function animate() {
    frameCount++;
    for (var i = 0; i < POOL_SIZE; i++) {
      var p = pool[i];
      if (!p.active) continue;

      p.life++;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.04; // slight gravity
      p.vx *= 0.97;
      p.vy *= 0.97;

      var progress = p.life / p.maxLife;
      var opacity = 1 - progress;

      if (p.life >= p.maxLife) {
        p.active = false;
        p.el.style.display = 'none';
        continue;
      }

      p.el.style.transform = 'translate(' + p.x + 'px,' + p.y + 'px)' +
        (p.el.style.borderRadius === '0px' ? ' rotate(45deg)' : '');
      p.el.style.opacity = opacity;
    }
    requestAnimationFrame(animate);
  }

  animate();
})();
