/* ==========================================================================
   CURSOR TRAIL EFFECT — Star Cluster + Bubble Trail + Click Burst
   - Orbiting star cluster following cursor (navy/coral palette)
   - Growing bubbles that burst (pop) behind the cursor
   - Click burst with coral accent
   ========================================================================== */

(function () {
  // Skip on touch devices
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  var mouseX = -200, mouseY = -200;
  var centerX = -200, centerY = -200;
  var visible = false;
  var tick = 0;

  /* --- Bubble color palette (navy + coral academic theme) --- */
  var COLORS = [
    'rgba(127, 166, 191, __A__)',   // navy-light - #7FA6BF
    'rgba(201, 220, 232, __A__)',   // navy-pale - #C9DCE8
    'rgba(79, 122, 155, __A__)',    // navy-soft - #4F7A9B
    'rgba(242, 175, 164, __A__)',   // coral accent - #F2AFA4
    'rgba(245, 196, 187, __A__)',   // coral-light - #F5C4BB
    'rgba(51, 92, 129, __A__)',     // navy-mid - #335C81
  ];

  function color(alpha) {
    var c = COLORS[Math.floor(Math.random() * COLORS.length)];
    return c.replace('__A__', alpha);
  }

  /* =======================================================================
     PART 1 — Orbiting Star Cluster
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
      x: -200, y: -200,
      tx: -200, ty: -200,
      twinkleOffset: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.03 + Math.random() * 0.04,
      shape: Math.random()
    });
  }

  /* =======================================================================
     PART 2 — Bubble Trail (grow, then burst/pop)
     ======================================================================= */
  var BUBBLE_POOL = 40;
  var bubblePool = [];
  var bubbleIdx = 0;
  var lastSpawnX = -999, lastSpawnY = -999;

  for (var j = 0; j < BUBBLE_POOL; j++) {
    var bEl = document.createElement('div');
    bEl.className = 'trail-star trail-star--bubble';
    bEl.style.display = 'none';
    document.body.appendChild(bEl);

    bubblePool.push({
      el: bEl, active: false,
      x: 0, y: 0,
      initSize: 0, maxSize: 0,
      life: 0, maxLife: 0,
      color: '',
      phase: '' // 'grow' or 'pop'
    });
  }

  function spawnBubble(x, y) {
    var b = bubblePool[bubbleIdx];
    bubbleIdx = (bubbleIdx + 1) % BUBBLE_POOL;

    var initSize = 5 + Math.random() * 10;
    var maxSize = initSize + 8 + Math.random() * 14;
    var growLife = 30 + Math.random() * 30;
    var c = color(0.18);

    b.active = true;
    b.x = x + (Math.random() - 0.5) * 20;
    b.y = y + (Math.random() - 0.5) * 20;
    b.initSize = initSize;
    b.maxSize = maxSize;
    b.life = 0;
    b.maxLife = growLife + 8; // grow phase + pop phase
    b.growLife = growLife;
    b.color = c;
    b.phase = 'grow';
    b.el.style.display = 'block';
    b.el.style.borderRadius = '50%';
    b.el.style.clipPath = 'none';
    b.el.style.background = 'radial-gradient(circle at 35% 35%, ' + c.replace(String(0.18), String(0.35)) + ', ' + c + ')';
    b.el.style.boxShadow = '0 0 6px ' + c + ', inset 0 0 4px ' + c.replace(String(0.18), String(0.12));
  }

  /* =======================================================================
     PART 3 — Click Burst (random bubbles explode outward)
     ======================================================================= */
  var BURST_POOL = 30;
  var burstPool = [];
  var burstIdx = 0;

  for (var k = 0; k < BURST_POOL; k++) {
  var burEl = document.createElement('div');
    burEl.className = 'trail-star trail-star--burst';
    burEl.style.display = 'none';
    document.body.appendChild(burEl);

    burstPool.push({
      el: burEl, active: false,
      x: 0, y: 0, vx: 0, vy: 0,
      size: 0, maxSize: 0,
      life: 0, maxLife: 0,
      color: '',
      popAt: 0,
      phase: ''
    });
  }

  function spawnBurst(cx, cy) {
    var count = 5 + Math.floor(Math.random() * 8); // 5–12 bubbles
    for (var n = 0; n < count; n++) {
      var b = burstPool[burstIdx];
      burstIdx = (burstIdx + 1) % BURST_POOL;

      var angle = Math.random() * Math.PI * 2;
      var speed = 2 + Math.random() * 5;
      var sz = 6 + Math.random() * 16;
      var growFrames = 8 + Math.floor(Math.random() * 10);
      var totalLife = growFrames + 6 + Math.floor(Math.random() * 8);
      var c = color(0.25);

      b.active = true;
      b.x = cx + (Math.random() - 0.5) * 6;
      b.y = cy + (Math.random() - 0.5) * 6;
      b.vx = Math.cos(angle) * speed;
      b.vy = Math.sin(angle) * speed;
      b.size = sz * 0.4;
      b.maxSize = sz;
      b.life = 0;
      b.maxLife = totalLife;
      b.popAt = growFrames;
      b.color = c;
      b.phase = 'grow';
      b.el.style.display = 'block';
      b.el.style.borderRadius = '50%';
      b.el.style.clipPath = 'none';
      b.el.style.background = 'radial-gradient(circle at 35% 35%, ' + c.replace(String(0.25), String(0.45)) + ', ' + c + ')';
      b.el.style.boxShadow = '0 0 8px ' + c + ', inset 0 0 5px ' + c.replace(String(0.25), String(0.15));
    }
  }

  document.addEventListener('click', function (e) {
    spawnBurst(e.clientX, e.clientY);
  });

  /* =======================================================================
     EVENTS
     ======================================================================= */
  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!visible) visible = true;

    var dx = mouseX - lastSpawnX;
    var dy = mouseY - lastSpawnY;
    var dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 8) {
      var count = Math.min(Math.floor(dist / 12) + 1, 3);
      for (var m = 0; m < count; m++) {
        spawnBubble(mouseX, mouseY);
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

    centerX += (mouseX - centerX) * 0.1;
    centerY += (mouseY - centerY) * 0.1;

    /* --- Orbiting cluster --- */
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

    /* --- Bubble trail (grow then pop) --- */
    for (var j = 0; j < BUBBLE_POOL; j++) {
      var b = bubblePool[j];
      if (!b.active) continue;
      b.life++;
      if (b.life >= b.maxLife) {
        b.active = false;
        b.el.style.display = 'none';
        continue;
      }

      if (b.life < b.growLife) {
        // Grow phase — expand + fade slightly
        var gp = b.life / b.growLife;
        var sz = b.initSize + (b.maxSize - b.initSize) * gp;
        var op = 0.9 - gp * 0.35;
        var half = sz / 2;
        b.el.style.transform = 'translate(' + (b.x - half) + 'px,' + (b.y - half) + 'px)';
        b.el.style.width = sz + 'px';
        b.el.style.height = sz + 'px';
        b.el.style.opacity = op;
      } else {
        // Pop phase — rapidly expand + fade out
        var pp = (b.life - b.growLife) / (b.maxLife - b.growLife);
        var popSz = b.maxSize * (1 + pp * 0.6);
        var popOp = (1 - pp) * 0.55;
        var popHalf = popSz / 2;
        b.el.style.transform = 'translate(' + (b.x - popHalf) + 'px,' + (b.y - popHalf) + 'px)';
        b.el.style.width = popSz + 'px';
        b.el.style.height = popSz + 'px';
        b.el.style.opacity = popOp;
        b.el.style.borderRadius = '50%';
      }
    }

    /* --- Click burst bubbles --- */
    for (var k = 0; k < BURST_POOL; k++) {
      var bu = burstPool[k];
      if (!bu.active) continue;
      bu.life++;
      if (bu.life >= bu.maxLife) {
        bu.active = false;
        bu.el.style.display = 'none';
        continue;
      }

      // Move outward
      bu.x += bu.vx;
      bu.y += bu.vy;
      bu.vx *= 0.94;
      bu.vy *= 0.94;
      bu.vy += 0.06; // slight gravity

      if (bu.life < bu.popAt) {
        // Grow phase
        var bgp = bu.life / bu.popAt;
        var bsz = bu.size + (bu.maxSize - bu.size) * bgp;
        var bhalf = bsz / 2;
        bu.el.style.transform = 'translate(' + (bu.x - bhalf) + 'px,' + (bu.y - bhalf) + 'px)';
        bu.el.style.width = bsz + 'px';
        bu.el.style.height = bsz + 'px';
        bu.el.style.opacity = 0.9 - bgp * 0.2;
      } else {
        // Pop phase — expand + fade
        var bpp = (bu.life - bu.popAt) / (bu.maxLife - bu.popAt);
        var popBsz = bu.maxSize * (1 + bpp * 0.8);
        var popBhalf = popBsz / 2;
        bu.el.style.transform = 'translate(' + (bu.x - popBhalf) + 'px,' + (bu.y - popBhalf) + 'px)';
        bu.el.style.width = popBsz + 'px';
        bu.el.style.height = popBsz + 'px';
        bu.el.style.opacity = (1 - bpp) * 0.7;
        bu.el.style.borderRadius = '50%';
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
})();