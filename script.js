/* ==========================================================================
   SHUBH DEEPAWALI - HIGH PERFORMANCE FESTIVE ENGINE
   Mobile & Desktop Optimized | Pure Web Audio & Fast Canvas 2D
   ========================================================================== */

// Detect mobile / low-power devices for adaptive rendering
const isMobile = window.innerWidth <= 768 || /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

// --- Audio Synthesizer (Pure Web Audio API - Lightweight & Safe) ---
class FestiveAudioEngine {
    constructor() {
        this.ctx = null;
        this.isAudioEnabled = true;
        this.isMusicPlaying = false;
        this.droneNodes = [];
        this.lastCrackleTime = 0;
        this.lastPopTime = 0;
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    // Sacred Temple Bell Chime (घंटी ध्वनि)
    playTempleBell() {
        if (!this.isAudioEnabled) return;
        this.init();
        if (!this.ctx) return;

        try {
            const now = this.ctx.currentTime;
            // On mobile use 2 harmonics instead of 4 to save audio threads
            const freqs = isMobile ? [523.25, 1046.5] : [523.25, 1046.5, 1567.98, 2093.0];
            const gains = isMobile ? [0.4, 0.2] : [0.4, 0.25, 0.15, 0.08];

            freqs.forEach((freq, i) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now);

                gain.gain.setValueAtTime(gains[i], now);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + (isMobile ? 2.5 : 3.5));

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now);
                osc.stop(now + (isMobile ? 2.6 : 3.6));
            });
        } catch (e) {}
    }

    // Authentic Sparkler / Phuljhadi Crackle Sound (Throttled for mobile 60fps)
    playSparklerCrackle() {
        if (!this.isAudioEnabled) return;
        const nowMs = Date.now();
        if (nowMs - this.lastCrackleTime < 180) return;
        this.lastCrackleTime = nowMs;

        this.init();
        if (!this.ctx) return;

        try {
            const bufferDuration = 0.12;
            const bufferSize = Math.floor(this.ctx.sampleRate * bufferDuration);
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);

            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
            }

            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 2400 + Math.random() * 800;
            filter.Q.value = 3.0;

            const gain = this.ctx.createGain();
            const now = this.ctx.currentTime;
            gain.gain.setValueAtTime(0.14, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + bufferDuration);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            noise.start(now);
        } catch (e) {}
    }

    // Distant Firework Boom & Pop (Throttled)
    playDistantFireworkPop() {
        if (!this.isAudioEnabled) return;
        const nowMs = Date.now();
        if (nowMs - this.lastPopTime < 350) return;
        this.lastPopTime = nowMs;

        this.init();
        if (!this.ctx) return;

        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(110 + Math.random() * 30, now);
            osc.frequency.exponentialRampToValueAtTime(30, now + 0.25);

            gain.gain.setValueAtTime(0.03, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.26);
        } catch (e) {}
    }

    // Divine Meditative Tanpura / Classical Drone (सा-पा-सा तानपुरा)
    toggleAmbientMusic() {
        this.init();
        if (this.isMusicPlaying) {
            this.stopAmbientMusic();
            return false;
        } else {
            this.startAmbientMusic();
            return true;
        }
    }

    startAmbientMusic() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const droneFrequencies = isMobile ? [130.81, 196.00, 261.63] : [130.81, 196.00, 261.63, 392.00];
        
        this.droneNodes = [];

        droneFrequencies.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            osc.type = idx % 2 === 0 ? 'sawtooth' : 'sine';
            osc.frequency.setValueAtTime(freq, now);

            // Subtle pitch modulation
            const lfo = this.ctx.createOscillator();
            const lfoGain = this.ctx.createGain();
            lfo.frequency.value = 0.2 + idx * 0.08;
            lfoGain.gain.value = 1.0;
            lfo.connect(osc.frequency);
            lfo.start(now);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(520, now);

            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(0.035 / (idx + 1), now + 2.5);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            this.droneNodes.push({ osc, gain, lfo });
        });

        this.isMusicPlaying = true;
    }

    stopAmbientMusic() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        this.droneNodes.forEach(node => {
            try {
                node.gain.gain.linearRampToValueAtTime(0.0001, now + 1.0);
                setTimeout(() => {
                    try {
                        node.osc.stop();
                        node.lfo.stop();
                    } catch(e) {}
                }, 1100);
            } catch(e) {}
        });
        this.droneNodes = [];
        this.isMusicPlaying = false;
    }
}

const audio = new FestiveAudioEngine();

// --- Interactive Canvas Fireworks & Phuljhadi Particles ---
const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
let particles = [];
let rockets = [];
let ambientGlows = [];
let nightStars = [];
let skyLanterns = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas, { passive: true });
resizeCanvas();

// Twinkling Celestial Night Stars (Fast - No ShadowBlur)
class NightStar {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * (canvas.height * 0.82);
        this.size = Math.random() * 1.5 + 0.6;
        this.baseAlpha = Math.random() * 0.5 + 0.25;
        this.alpha = this.baseAlpha;
        this.twinkleSpeed = Math.random() * 0.03 + 0.012;
        this.phase = Math.random() * Math.PI * 2;
    }

    update() {
        this.phase += this.twinkleSpeed;
        this.alpha = this.baseAlpha + Math.sin(this.phase) * 0.25;
    }

    draw(ctx) {
        ctx.globalAlpha = Math.max(0.1, Math.min(1, this.alpha));
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Sky Lantern (आकाश दीया / कंदिल - Optimized with 0 Gradient allocations per frame)
class SkyLantern {
    constructor(initialSpread = false) {
        this.reset(initialSpread);
    }

    reset(initialSpread = false) {
        this.x = Math.random() * (canvas.width * 1.02);
        this.y = initialSpread 
            ? Math.random() * (canvas.height + 60) - 30
            : canvas.height + Math.random() * 50 + 20;

        this.depth = Math.random() * 0.6 + 0.4;
        this.w = (Math.random() * 6 + 15) * this.depth;
        this.h = this.w * 1.35;
        this.speedY = (Math.random() * 0.9 + 1.1) * this.depth;
        this.swaySpeed = Math.random() * 0.02 + 0.012;
        this.swayAmp = (Math.random() * 14 + 8) * this.depth;
        this.swayPhase = Math.random() * Math.PI * 2;
        this.flickerPhase = Math.random() * Math.PI * 2;
        this.flickerSpeed = Math.random() * 0.06 + 0.03;
        this.alpha = this.depth * 0.75 + 0.25;
    }

    update() {
        this.y -= this.speedY;
        this.swayPhase += this.swaySpeed;
        this.flickerPhase += this.flickerSpeed;

        if (this.y < -this.h - 40) {
            this.reset(false);
        }
    }

    draw(ctx) {
        const currentX = this.x + Math.sin(this.swayPhase) * this.swayAmp;
        const currentY = this.y;
        const flicker = 0.88 + Math.sin(this.flickerPhase) * 0.12;

        ctx.globalAlpha = Math.min(1, this.alpha * flicker);

        // 1. Soft warm glowing halo
        ctx.fillStyle = 'rgba(255, 140, 20, 0.16)';
        ctx.beginPath();
        ctx.arc(currentX, currentY + this.h * 0.55, this.w * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // 2. Classical Trapezoidal Paper Lantern Body
        const topW = this.w * 0.82;
        const botW = this.w;
        const halfTop = topW / 2;
        const halfBot = botW / 2;

        ctx.beginPath();
        ctx.moveTo(currentX - halfTop, currentY);
        ctx.quadraticCurveTo(currentX, currentY - this.h * 0.15, currentX + halfTop, currentY);
        ctx.lineTo(currentX + halfBot, currentY + this.h);
        ctx.quadraticCurveTo(currentX, currentY + this.h * 1.05, currentX - halfBot, currentY + this.h);
        ctx.closePath();

        ctx.fillStyle = 'rgba(255, 185, 45, 0.94)';
        ctx.fill();

        // 3. Bamboo hoop wire at bottom
        ctx.strokeStyle = '#4a1502';
        ctx.lineWidth = Math.max(1, 1.2 * this.depth);
        ctx.beginPath();
        ctx.ellipse(currentX, currentY + this.h, halfBot * 0.95, this.h * 0.09, 0, 0, Math.PI * 2);
        ctx.stroke();

        // 4. Glowing inner candle flame spark
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(currentX, currentY + this.h * 0.85, Math.max(1.2, 2.0 * this.depth), 0, Math.PI * 2);
        ctx.fill();
    }
}

// Adaptive counts for butter-smooth mobile 60 FPS
const STAR_COUNT = isMobile ? 22 : 45;
const LANTERN_COUNT = isMobile ? 6 : 14;
const EMBER_COUNT = isMobile ? 6 : 14;
const MAX_PARTICLES = isMobile ? 45 : 110;

for (let i = 0; i < STAR_COUNT; i++) {
    nightStars.push(new NightStar());
}
for (let i = 0; i < LANTERN_COUNT; i++) {
    skyLanterns.push(new SkyLantern(true));
}

// Festive Palettes
const festivePalettes = [
    { colors: ['#fff475', '#ffd700', '#ffb703', '#fb8500', '#ffffff'] },
    { colors: ['#ff0a54', '#ff477e', '#ff70a6', '#ff5400', '#ffd700'] },
    { colors: ['#52b788', '#74c69d', '#00f5d4', '#00bbf9', '#ffffff'] },
    { colors: ['#7209b7', '#b5179e', '#f72585', '#4cc9f0', '#ffffff'] },
    { colors: ['#ff0055', '#ff9900', '#ffee00', '#00f5d4', '#70e000'] }
];

class Particle {
    constructor(x, y, color, speed, angle, friction = 0.95, gravity = 0.05, life = 70) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.friction = friction;
        this.gravity = gravity;
        this.alpha = 1;
        this.life = life;
        this.maxLife = life;
        this.size = Math.random() * 2.2 + 1.0;
    }

    update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
        this.alpha = Math.max(0, this.life / this.maxLife);
    }

    draw(ctx) {
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Background Rocket Class
class Rocket {
    constructor(startX, startY, targetX, targetY, paletteObj, burstType = 'chrysanthemum') {
        this.x = startX;
        this.y = startY;
        this.targetX = targetX;
        this.targetY = targetY;
        this.palette = paletteObj.colors;
        this.burstType = burstType;
        
        const dx = targetX - startX;
        const dy = targetY - startY;
        this.angle = Math.atan2(dy, dx);
        this.speed = Math.random() * 5 + 17;
        this.headColor = this.palette[0] || '#ffd700';
        this.trail = [];
        this.maxTrail = isMobile ? 3 : 5;
        this.alive = true;
    }

    update() {
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > this.maxTrail) {
            this.trail.shift();
        }

        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        // Occasional light spark tail
        if (!isMobile && Math.random() > 0.45) {
            particles.push(new Particle(
                this.x, this.y + 4, '#ffd700',
                Math.random() * 1.2 + 0.4, Math.PI / 2, 0.93, 0.08, 14
            ));
        }

        if (this.y <= this.targetY) {
            this.explode();
            this.alive = false;
        }
    }

    draw(ctx) {
        if (!this.alive) return;

        ctx.lineWidth = 2.0;
        ctx.lineCap = 'round';
        for (let i = 0; i < this.trail.length - 1; i++) {
            const p1 = this.trail[i];
            const p2 = this.trail[i + 1];
            ctx.globalAlpha = (i + 1) / this.trail.length * 0.7;
            ctx.strokeStyle = '#ffd700';
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
        }

        // Rocket Head (Fast rendering without shadowBlur)
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
    }

    explode() {
        audio.playDistantFireworkPop();

        const count = isMobile 
            ? Math.floor(Math.random() * 8 + 16) 
            : Math.floor(Math.random() * 12 + 28);

        if (this.burstType === 'willow') {
            const goldPalette = ['#fff6a3', '#ffd700', '#ffb703', '#ffffff'];
            const pCount = isMobile ? 18 : 30;
            for (let i = 0; i < pCount; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 3.5 + 1.2;
                const color = goldPalette[Math.floor(Math.random() * goldPalette.length)];
                particles.push(new Particle(this.x, this.y, color, speed, angle, 0.965, 0.038, Math.random() * 25 + 50));
            }
        } else if (this.burstType === 'ring') {
            const ringColor = this.palette[Math.floor(Math.random() * this.palette.length)];
            const ringCount = isMobile ? 16 : 26;
            for (let i = 0; i < ringCount; i++) {
                const angle = (Math.PI * 2 * i) / ringCount;
                const speed = 3.6;
                particles.push(new Particle(this.x, this.y, ringColor, speed, angle, 0.95, 0.045, 55));
            }
        } else {
            // Chrysanthemum
            for (let i = 0; i < count; i++) {
                const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.3 - 0.15);
                const speed = Math.random() * 4.5 + 1.8;
                const color = this.palette[Math.floor(Math.random() * this.palette.length)];
                particles.push(new Particle(this.x, this.y, color, speed, angle, 0.95, 0.05, Math.random() * 20 + 45));
            }
        }
    }
}

// Background Floating Ambient Golden Embers
class AmbientEmber {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 40;
        this.size = Math.random() * 2.0 + 0.8;
        this.speedY = Math.random() * 0.7 + 0.3;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.alpha = Math.random() * 0.6 + 0.2;
        this.color = Math.random() > 0.4 ? '#ffd700' : '#ff9e00';
    }

    update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        if (this.y < -10) this.reset();
    }

    draw(ctx) {
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

for (let i = 0; i < EMBER_COUNT; i++) {
    ambientGlows.push(new AmbientEmber());
}

// Launch a single background rocket
function launchBackgroundRocket() {
    const startX = Math.random() * (canvas.width * 0.85) + canvas.width * 0.075;
    const startY = canvas.height + 10;
    const targetY = Math.random() * (canvas.height * 0.36) + canvas.height * 0.12;
    const targetX = startX + (Math.random() - 0.5) * 140;

    const palette = festivePalettes[Math.floor(Math.random() * festivePalettes.length)];
    const burstTypes = ['chrysanthemum', 'willow', 'ring', 'chrysanthemum'];
    const burstType = burstTypes[Math.floor(Math.random() * burstTypes.length)];

    rockets.push(new Rocket(startX, startY, targetX, targetY, palette, burstType));
}

// Sparkler Effect (फुलझड़ी टच/क्लिक)
function spawnSparkler(x, y, count = 10, playAudio = true) {
    const goldPalette = ['#fff59d', '#ffd700', '#ffb703', '#fb8500', '#ffffff'];
    const pCount = isMobile ? Math.min(count, 8) : count;
    for (let i = 0; i < pCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3.5 + 1;
        const color = goldPalette[Math.floor(Math.random() * goldPalette.length)];
        particles.push(new Particle(x, y, color, speed, angle, 0.92, 0.04, Math.random() * 20 + 18));
    }
    if (playAudio) {
        audio.playSparklerCrackle();
    }
}

// Firework Burst Trigger (Direct coordinates)
function createFirework(x, y, count = 40, colors = ['#ffd700', '#ff9900', '#ff3366', '#ffffff', '#00e5ff']) {
    const pCount = isMobile ? Math.min(count, 28) : count;
    for (let i = 0; i < pCount; i++) {
        const angle = (Math.PI * 2 * i) / pCount + (Math.random() * 0.4 - 0.2);
        const speed = Math.random() * 5 + 1.8;
        const color = colors[Math.floor(Math.random() * colors.length)];
        particles.push(new Particle(x, y, color, speed, angle, 0.95, 0.07, Math.random() * 30 + 40));
    }
}

// Continuous Background Firework Scheduler
let lastAutoRocketTime = 0;
let nextRocketDelay = isMobile ? 2200 : 1200;

// Optimized Master Animation Loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Celestial stars
    for (let i = 0; i < nightStars.length; i++) {
        const star = nightStars[i];
        star.update();
        star.draw(ctx);
    }

    // 2. Sky Lanterns
    for (let i = 0; i < skyLanterns.length; i++) {
        const lantern = skyLanterns[i];
        lantern.update();
        lantern.draw(ctx);
    }

    // 3. Continuous Rocket Auto-Launcher
    const now = Date.now();
    if (now - lastAutoRocketTime > nextRocketDelay) {
        lastAutoRocketTime = now;
        nextRocketDelay = isMobile 
            ? (Math.random() * 800 + 2000)   // 2.0s - 2.8s on mobile for optimal GPU life
            : (Math.random() * 700 + 1100);  // 1.1s - 1.8s on desktop

        launchBackgroundRocket();

        if (!isMobile && Math.random() < 0.25) {
            setTimeout(() => launchBackgroundRocket(), 220);
        }
    }

    // 4. Ambient Embers
    for (let i = 0; i < ambientGlows.length; i++) {
        const ember = ambientGlows[i];
        ember.update();
        ember.draw(ctx);
    }

    // 5. Active Rockets
    for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.update();
        r.draw(ctx);
        if (!r.alive) {
            rockets.splice(i, 1);
        }
    }

    // Cap particle array size for stable 60 FPS
    if (particles.length > MAX_PARTICLES) {
        particles.splice(0, particles.length - MAX_PARTICLES);
    }

    // 6. Active Particle Sparks
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
        if (p.life <= 0) {
            particles.splice(i, 1);
        }
    }

    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// ==========================================================================
// SCROLL-SAFE INTERACTIVE TOUCH & MOUSE HANDLERS
// Prevents scroll jank on mobile phones while keeping delightful touch sparks
// ==========================================================================
let isInteracting = false;
let touchStartX = 0;
let touchStartY = 0;
let isTouchScrolling = false;
let lastTouchSparkTime = 0;

window.addEventListener('mousedown', (e) => {
    if (e.target.closest('input, button, a, .diya-unit, .moving-rangoli-container, .stream-diya, .audio-control-bar')) return;
    isInteracting = true;
    spawnSparkler(e.clientX, e.clientY, 12, true);
});
window.addEventListener('mouseup', () => { isInteracting = false; });
window.addEventListener('mousemove', (e) => {
    if (isInteracting && Math.random() > 0.5) {
        spawnSparkler(e.clientX, e.clientY, 4, false);
    }
});

// Touch Start: Record origin, spawn discrete tap sparkler
window.addEventListener('touchstart', (e) => {
    if (e.target.closest('input, button, a, .diya-unit, .moving-rangoli-container, .stream-diya, .audio-control-bar')) return;
    if (e.touches.length > 0) {
        const t = e.touches[0];
        touchStartX = t.clientX;
        touchStartY = t.clientY;
        isTouchScrolling = false;

        const now = Date.now();
        if (now - lastTouchSparkTime > 200) {
            lastTouchSparkTime = now;
            spawnSparkler(t.clientX, t.clientY, isMobile ? 6 : 10, true);
        }
    }
}, { passive: true });

// Touch Move: Check for scrolling threshold - DO NOT lag native scrolling!
window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
        const t = e.touches[0];
        const dy = Math.abs(t.clientY - touchStartY);
        const dx = Math.abs(t.clientX - touchStartX);

        // If moved more than 10px, the user is scrolling -> cancel sparklers completely
        if (dy > 10 || dx > 10) {
            isTouchScrolling = true;
        }

        // If not scrolling and stationary touch movement, emit light throttled sparkler
        if (!isTouchScrolling) {
            const now = Date.now();
            if (now - lastTouchSparkTime > 300) {
                lastTouchSparkTime = now;
                spawnSparkler(t.clientX, t.clientY, 3, false);
            }
        }
    }
}, { passive: true });

window.addEventListener('touchend', () => {
    isTouchScrolling = false;
}, { passive: true });

// ==========================================================================
// INTERACTIVE MULTI-DIYA CEREMONY
// ==========================================================================
const allDiyas = document.querySelectorAll('.diya-unit, .stream-diya');

allDiyas.forEach(diya => {
    const handleDiyaTap = (e) => {
        e.stopPropagation();
        audio.playTempleBell();

        const rect = diya.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + (rect.height * 0.3);

        createFirework(centerX, centerY, isMobile ? 22 : 36, ['#ffd700', '#ffea00', '#ff6b00', '#ffffff']);

        diya.style.transition = 'transform 0.15s ease';
        diya.style.transform = 'scale(1.18)';
        setTimeout(() => {
            diya.style.transform = '';
        }, 200);
    };

    diya.addEventListener('click', handleDiyaTap);
});

// ==========================================================================
// INTERACTIVE MOVING RANGOLIS
// ==========================================================================
const movingRangolis = document.querySelectorAll('.moving-rangoli-container');
movingRangolis.forEach(rangoli => {
    rangoli.addEventListener('click', (e) => {
        e.stopPropagation();
        audio.playTempleBell();
        const rect = rangoli.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        createFirework(cx, cy, isMobile ? 25 : 40, ['#ff007f', '#00f5d4', '#ffd700', '#70e000', '#ffffff', '#ff5400']);
    });
});

// Auto-activate audio context on first screen interaction (both click and touch)
let firstInteraction = true;
function unlockAudio() {
    if (firstInteraction) {
        firstInteraction = false;
        audio.init();
    }
}
window.addEventListener('click', unlockAudio, { once: true });
window.addEventListener('touchstart', unlockAudio, { once: true, passive: true });

// ==========================================================================
// AUDIO CONTROLS UI
// ==========================================================================
const musicToggleBtn = document.getElementById('musicToggleBtn');
const musicIcon = document.getElementById('musicIcon');
const musicText = document.getElementById('musicText');
const soundFxBtn = document.getElementById('soundFxBtn');

if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isPlaying = audio.toggleAmbientMusic();
        if (isPlaying) {
            musicIcon.className = 'fa-solid fa-volume-high';
            if (musicText) musicText.innerText = 'संगीत बंद करें';
            musicToggleBtn.classList.add('active');
        } else {
            musicIcon.className = 'fa-solid fa-volume-xmark';
            if (musicText) musicText.innerText = 'संगीत चालू करें';
            musicToggleBtn.classList.remove('active');
        }
    });
}

if (soundFxBtn) {
    soundFxBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        audio.isAudioEnabled = !audio.isAudioEnabled;
        soundFxBtn.classList.toggle('active', audio.isAudioEnabled);
        soundFxBtn.innerHTML = audio.isAudioEnabled ? '<i class="fa-solid fa-bell"></i>' : '<i class="fa-solid fa-bell-slash"></i>';
    });
}

// ==========================================================================
// DYNAMIC PERSONALIZED TITLE VIA URL
// ==========================================================================
function getSenderFromURL() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('from') || urlParams.get('name');
    } catch(e) {
        return null;
    }
}

const customSender = getSenderFromURL();
if (customSender && customSender.trim()) {
    const cleanName = customSender.trim();
    document.title = `शुभ दीपावली | ${cleanName} की तरफ से`;
    const chetanNameEl = document.querySelector('.chetan-name');
    if (chetanNameEl) {
        chetanNameEl.textContent = cleanName;
    }
} else {
    document.title = `शुभ दीपावली | चेतन साहू जी की तरफ से`;
}

// ==========================================================================
// WHATSAPP & SOCIAL SHARING HANDLERS
// ==========================================================================
function getFestiveShareMessage() {
    const senderName = document.querySelector('.chetan-name')?.textContent.trim() || 'चेतन साहू जी';
    const siteUrl = window.location.href.split('#')[0];
    
    return `🪔✨ *शुभ दीपावली!* ✨🪔\n\n*${senderName}* की तरफ से आपको और आपके समस्त परिवार को दीपावली की अनंत शुभकामनाएं!\n\nमां लक्ष्मी जी और भगवान श्री गणेश जी की असीम कृपा से आपका जीवन सुख, समृद्धि, वैभव और आरोग्य के दिव्य प्रकाश से सदैव जगमगाता रहे।\n\n👇 *खास आपके लिए तैयार किया गया यह दीपोत्सव ग्रीटिंग देखने के लिए नीचे लिंक खोलें:* \n${siteUrl}`;
}

async function triggerFestiveShare() {
    const shareMessage = getFestiveShareMessage();
    
    if (navigator.share && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        try {
            await navigator.share({
                title: document.title,
                text: shareMessage
            });
            return;
        } catch (err) {
            if (err.name === 'AbortError') return;
        }
    }
    
    const encodedText = encodeURIComponent(shareMessage);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
}

function copyWebsiteLink() {
    const siteUrl = window.location.href.split('#')[0];
    const copyBtnText = document.getElementById('copyLinkBtnText');
    const copyBtn = document.getElementById('copyShareLinkBtn');
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(siteUrl).then(() => {
            if (copyBtnText) copyBtnText.textContent = '✓ लिंक कॉपी हो गया!';
            if (copyBtn) {
                copyBtn.style.borderColor = '#25d366';
                copyBtn.style.color = '#25d366';
            }
            setTimeout(() => {
                if (copyBtnText) copyBtnText.textContent = 'लिंक कॉपी करें';
                if (copyBtn) {
                    copyBtn.style.borderColor = '';
                    copyBtn.style.color = '';
                }
            }, 2500);
        }).catch(() => {
            prompt('इस लिंक को कॉपी करें:', siteUrl);
        });
    } else {
        prompt('इस लिंक को कॉपी करें:', siteUrl);
    }
}

// Attach event listeners
const waShareBtn = document.getElementById('whatsappShareBtn');
const floatingWaBtn = document.getElementById('floatingWaShareBtn');
const copyShareBtn = document.getElementById('copyShareLinkBtn');

if (waShareBtn) waShareBtn.addEventListener('click', triggerFestiveShare);
if (floatingWaBtn) floatingWaBtn.addEventListener('click', triggerFestiveShare);
if (copyShareBtn) copyShareBtn.addEventListener('click', copyWebsiteLink);
