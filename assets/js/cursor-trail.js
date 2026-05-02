/* ==========================================================================
   CURSOR TRAIL EFFECT — Star Cluster + Fading Trail
   A constellation of twinkling stars orbiting the cursor, with a trail of
   behind-stars that spawn behind and fade out over time
   ========================================================================== */

(function () {
  // Skip on touch devices
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  var mouseX = -200, mouseY = -200;
  var centerX = -200, centerY = -200;
  var visible = false;
  var tick = 0;

  /* =======================================================================
     PART 1 — Orbiting Star Cluster (follows cursor)
     ======================================================================= */
  var CLUSTER_SIZE = 14;
  var cluster = [];

  for (var i = 0; i < CLUSTER_SIZE; i++) {
    var el = document.createElement('div');
    el.className = 'trail-star trail-star--cluster';
    document.body.appendChild(el);

    cluster.push({
      el: el,
      orbitRadius: 10 + Math.random() * 28,
      angle: (Math.PI * 2 / CLUSTER_SIZE) * i + (Math.random() - 0.5) * 0.8,
      speed: 0.008 + Math.random() * 0.015,
      size: 2 + Math.random() * 4,
      x: -200,
      y: -200,
      tx: -200,
      ty: -200,
      twinkleOffset: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.03 + Math.random() * 0.04,
      shape: Math.random()
    });
  }

  /* =======================================================================
     PART 2 — Fading Trail Stars (spawn behind cursor, shrink & fade)
     ======================================================================= */
  var TRAIL_POOL = 50;
  var trailPool = [];
  var trailIdx = 0;
  var lastSpawnX = -999, lastSpawnY = -999;

  for (var j = 0; j < TRAIL_POOL; j++) {
    var tEl = document.createElement('div');
    tEl.className = 'trail-star trail-star--trail';
    tEl.style.display = 'none';
    document.body.appendChild(tEl);

    trailPool.push({
      el: tEl,
      active: false,
      x: 0, y: 0,
      size: 0,
      maxSize: 0,
      life: 0,
      maxLife: 0,
      shape: 0
    });
  }

  function spawnTrailStar(x, y) {
    var t = trailPool[trailIdx];
    trailIdx = (trailIdx + 1) % TRAIL_POOL;

    var maxSize = 1.5 + Math.random() * 5;
    var shape = Math.random();

    t.active = true;
    t.x = x + (Math.random() - 0.5) * 12;
    t.y = y + (Math.random() - 0.5) * 12;
    t.maxSize = maxSize;
    t.size = maxSize;
    t.life = 0;
    t.maxLife = 40 + Math.random() * 40; // ~0.7s – 1.3s at 60fps
    t.shape = shape;
    t.el.style.display = 'block';

    // Assign shape once
    if (shape < 0.3) {
      t.el.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
      t.el.style.borderRadius = '0';
    } else if (shape < 0.55) {
      t.el.style.clipPath = 'none';
      t.el.style.borderRadius = '1px';
    } else {
      t.el.style.clipPath = 'none';
      t.el.style.borderRadius = '50%';
    }
  }

  /* =======================================================================
     EVENTS
     ======================================================================= */
  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!visible) {
      visible = true;
    }

    // Spawn trail stars as the cursor moves
    var dx = mouseX - lastSpawnX;
    var dy = mouseY - lastSpawnY;
    var dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 6) {
      // Spawn 1–3 trail stars depending on speed
      var count = Math.min(Math.floor(dist / 10) + 1, 3);
      for (var k = 0; k < count; k++) {
        spawnTrailStar(mouseX, mouseY);
      }
      lastSpawnX = mouseX;
      lastSpawnY = mouseY;
    }
  });

  document.addEventListener('mouseleave', function () {
    visible = false;
  });

  /* =======================================================================
     ANIMATION LOOP
     ======================================================================= */
  function animate() {
    tick++;

    // Ease cluster center toward mouse
    centerX += (mouseX - centerX) * 0.1;
    centerY += (mouseY - centerY) * 0.1;

    /* --- Update orbiting cluster stars --- */
    for (var i = 0; i < CLUSTER_SIZE; i++) {
      var s = cluster[i];
      s.angle += s.speed;
      s.tx = centerX + Math.cos(s.angle) * s.orbitRadius;
      s.ty = centerY + Math.sin(s.angle) * s.orbitRadius;
      s.x += (s.tx - s.x) * 0.08;
      s.y += (s.ty - s.y) * 0.08;

      var twinkle = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(tick * s.twinkleSpeed + s.twinkleOffset));
      var hs = s.size / 2;

      var transform = 'translate(' + (s.x - hs) + 'px,' + (s.y - hs) + 'px)';
      if (s.shape < 0.35) {
        s.el.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
        s.el.style.borderRadius = '0';
      } else if (s.shape < 0.6) {
        transform += ' rotate(45deg)';
        s.el.style.clipPath = 'none';
        s.el.style.borderRadius = '1px';
      } else {
        s.el.style.clipPath = 'none';
        s.el.style.borderRadius = '50%';
      }

      s.el.style.transform = transform;
      s.el.style.width = s.size + 'px';
      s.el.style.height = s.size + 'px';
      s.el.style.opacity = visible ? twinkle : 0;
    }

    /* --- Update fading trail stars --- */
    for (var j = 0; j < TRAIL_POOL; j++) {
      var t = trailPool[j];
      if (!t.active) continue;

      t.life++;
      if (t.life >= t.maxLife) {
        t.active = false;
        t.el.style.display = 'none';
        continue;
      }

      var progress = t.life / t.maxLife;
      // Fade out
      var opacity = 1 - progress;
      // Shrink over time
      var currentSize = t.maxSize * (1 - progress * 0.6);
      var chs = currentSize / 2;

      var tTransform = 'translate(' + (t.x - chs) + 'px,' + (t.y - chs) + 'px)';
      if (t.shape < 0.55 && t.shape >= 0.3) {
        tTransform += ' rotate(45deg)';
      }

      t.el.style.transform = tTransform;
      t.el.style.width = currentSize + 'px';
      t.el.style.height = currentSize + 'px';
      t.el.style.opacity = opacity;
    }

    requestAnimationFrame(animate);
  }

  animate();
})();
