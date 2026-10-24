/* ==========================================================================
   SHUBH DEEPAWALI - CLASSICAL INTERACTIVE ENGINE
   ========================================================================== */

// --- Audio Synthesizer (Pure Web Audio API - No external assets required) ---
class FestiveAudioEngine {
    constructor() {
        this.ctx = null;
        this.isAudioEnabled = true;
        this.isMusicPlaying = false;
        this.droneNodes = [];
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    // Sacred Temple Bell Chime (घंटी ध्वनि)
    playTempleBell() {
        if (!this.isAudioEnabled) return;
        this.init();

        const now = this.ctx.currentTime;
        const freqs = [523.25, 1046.5, 1567.98, 2093.0]; // C5 harmonics (rich temple chime)
        const gains = [0.4, 0.25, 0.15, 0.08];

        freqs.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(gains[i], now);
            // Exponential resonant decay like a bronze temple bell
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 3.6);
        });
    }

    // Authentic Sparkler / Phuljhadi Crackle Sound
    playSparklerCrackle() {
        if (!this.isAudioEnabled) return;
        this.init();

        const bufferSize = this.ctx.sampleRate * 0.18;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 2200 + Math.random() * 1000;
        filter.Q.value = 3.5;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start();
    }

    // Distant Firework Boom & Pop (हल्की दूरस्थ पटाखे की गूंज)
    playDistantFireworkPop() {
        if (!this.isAudioEnabled) return;
        this.init();
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(110 + Math.random() * 35, now);
            osc.frequency.exponentialRampToValueAtTime(30, now + 0.28);

            gain.gain.setValueAtTime(0.035, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.29);
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
        const now = this.ctx.currentTime;
        const droneFrequencies = [130.81, 196.00, 261.63, 392.00]; // C3, G3, C4, G4 (Pancham tanpura)
        
        this.droneNodes = [];

        droneFrequencies.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            osc.type = idx % 2 === 0 ? 'sawtooth' : 'sine';
            osc.frequency.setValueAtTime(freq, now);

            // Subtle pitch modulation (gentle Indian micro-tone breathing)
            const lfo = this.ctx.createOscillator();
            const lfoGain = this.ctx.createGain();
            lfo.frequency.value = 0.2 + idx * 0.08;
            lfoGain.gain.value = 1.2;
            lfo.connect(osc.frequency);
            lfo.start(now);

            // Soft warm acoustic filter
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(550, now);

            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(0.045 / (idx + 1), now + 3);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            this.droneNodes.push({ osc, gain, lfo });
        });

        this.isMusicPlaying = true;
    }

    stopAmbientMusic() {
        const now = this.ctx.currentTime;
        this.droneNodes.forEach(node => {
            node.gain.gain.linearRampToValueAtTime(0.0001, now + 1.2);
            setTimeout(() => {
                try {
                    node.osc.stop();
                    node.lfo.stop();
                } catch(e) {}
            }, 1300);
        });
        this.droneNodes = [];
        this.isMusicPlaying = false;
    }
}

const audio = new FestiveAudioEngine();

// --- Interactive Canvas Fireworks & Phuljhadi Particles ---
const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let rockets = [];
let ambientGlows = [];
let nightStars = [];
let skyLanterns = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Twinkling Celestial Night Stars
class NightStar {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * (canvas.height * 0.85);
        this.size = Math.random() * 1.6 + 0.5;
        this.baseAlpha = Math.random() * 0.6 + 0.3;
        this.alpha = this.baseAlpha;
        this.twinkleSpeed = Math.random() * 0.03 + 0.012;
        this.phase = Math.random() * Math.PI * 2;
    }

    update() {
        this.phase += this.twinkleSpeed;
        this.alpha = this.baseAlpha + Math.sin(this.phase) * 0.3;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0.1, Math.min(1, this.alpha));
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Sky Lantern (आकाश दीया / कंदिल - Floating Lantern)
class SkyLantern {
    constructor(initialSpread = false) {
        this.reset(initialSpread);
    }

    reset(initialSpread = false) {
        this.x = Math.random() * (canvas.width * 1.05) - (canvas.width * 0.025);
        this.y = initialSpread 
            ? Math.random() * (canvas.height + 60) - 30
            : canvas.height + Math.random() * 60 + 30;

        // Depth perspective (0.35 = distant, 1.0 = near)
        this.depth = Math.random() * 0.65 + 0.35;
        this.w = (Math.random() * 8 + 18) * this.depth;
        this.h = this.w * 1.38;
        this.speedY = (Math.random() * 1.1 + 1.25) * this.depth; // Significantly faster upward ascent
        this.swaySpeed = Math.random() * 0.024 + 0.014;
        this.swayAmp = (Math.random() * 18 + 10) * this.depth;
        this.swayPhase = Math.random() * Math.PI * 2;
        this.flickerPhase = Math.random() * Math.PI * 2;
        this.flickerSpeed = Math.random() * 0.07 + 0.03;
        this.alpha = this.depth * 0.82 + 0.18;
    }

    update() {
        this.y -= this.speedY;
        this.swayPhase += this.swaySpeed;
        this.flickerPhase += this.flickerSpeed;

        if (this.y < -this.h - 50) {
            this.reset(false);
        }
    }

    draw(ctx) {
        const currentX = this.x + Math.sin(this.swayPhase) * this.swayAmp;
        const currentY = this.y;
        const flicker = 0.88 + Math.sin(this.flickerPhase) * 0.12;

        ctx.save();
        ctx.globalAlpha = Math.min(1, this.alpha * flicker);

        // 1. Soft Warm Glowing Halo / Aura behind the lantern
        const auraRadius = this.w * 2.2;
        const halo = ctx.createRadialGradient(
            currentX, currentY + this.h * 0.6, 2,
            currentX, currentY + this.h * 0.6, auraRadius
        );
        halo.addColorStop(0, 'rgba(255, 180, 25, 0.42)');
        halo.addColorStop(0.45, 'rgba(255, 95, 0, 0.18)');
        halo.addColorStop(1, 'rgba(255, 60, 0, 0)');
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(currentX, currentY + this.h * 0.6, auraRadius, 0, Math.PI * 2);
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

        // Warm paper glowing gradient
        const bodyGrad = ctx.createLinearGradient(currentX, currentY, currentX, currentY + this.h);
        bodyGrad.addColorStop(0, 'rgba(255, 120, 10, 0.9)');
        bodyGrad.addColorStop(0.45, 'rgba(255, 195, 45, 0.95)');
        bodyGrad.addColorStop(0.85, 'rgba(255, 240, 160, 0.98)');
        bodyGrad.addColorStop(1, 'rgba(255, 190, 50, 0.94)');

        ctx.fillStyle = bodyGrad;
        ctx.fill();

        // 3. Bamboo hoop wire at bottom
        ctx.strokeStyle = '#4a1502';
        ctx.lineWidth = Math.max(1, 1.3 * this.depth);
        ctx.beginPath();
        ctx.ellipse(currentX, currentY + this.h, halfBot * 0.95, this.h * 0.09, 0, 0, Math.PI * 2);
        ctx.stroke();

        // 4. Glowing inner candle flame spark
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(currentX, currentY + this.h * 0.88, Math.max(1.2, 2.2 * this.depth), 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

// Populate Stars and Sky Lanterns
for (let i = 0; i < 60; i++) {
    nightStars.push(new NightStar());
}
for (let i = 0; i < 18; i++) {
    skyLanterns.push(new SkyLantern(true));
}

// Diverse Festive Color Palettes for Fireworks
const festivePalettes = [
    { name: 'Royal Gold & Amber', colors: ['#fff475', '#ffd700', '#ffb703', '#fb8500', '#ffffff'] },
    { name: 'Crimson & Saffron', colors: ['#ff0a54', '#ff477e', '#ff70a6', '#ff5400', '#ffd700'] },
    { name: 'Emerald & Peacock', colors: ['#52b788', '#74c69d', '#00f5d4', '#00bbf9', '#ffffff'] },
    { name: 'Divine Violet & Magenta', colors: ['#7209b7', '#b5179e', '#f72585', '#4cc9f0', '#ffffff'] },
    { name: 'Multi Festive Dhamaka', colors: ['#ff0055', '#ff9900', '#ffee00', '#00f5d4', '#70e000', '#ff00aa'] },
    { name: 'Golden Willow', colors: ['#fff9a6', '#ffd700', '#f39c12', '#e67e22', '#ffffff'] }
];

class Particle {
    constructor(x, y, color, speed, angle, friction = 0.96, gravity = 0.05, life = 90, isTwinkle = false) {
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
        this.size = Math.random() * 2.4 + 1.2;
        this.isTwinkle = isTwinkle;
    }

    update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.life--;

        const baseAlpha = Math.max(0, this.life / this.maxLife);
        if (this.isTwinkle && Math.random() > 0.4) {
            this.alpha = baseAlpha * (Math.random() * 0.6 + 0.4);
        } else {
            this.alpha = baseAlpha;
        }
    }

    draw(ctx) {
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Background Rocket Class (नीचे से ऊपर जाकर फूटने वाले पटाखे)
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
        this.distanceToTarget = Math.sqrt(dx * dx + dy * dy);
        this.angle = Math.atan2(dy, dx);
        this.speed = Math.random() * 6 + 18.5; // Fast upward rocket shoot
        this.headColor = this.palette[0] || '#ffd700';
        this.trail = [];
        this.maxTrail = 6;
        this.alive = true;
    }

    update() {
        // Record trail
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > this.maxTrail) {
            this.trail.shift();
        }

        // Move towards target
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        // Emit slight spark tail
        if (Math.random() > 0.3) {
            particles.push(new Particle(
                this.x + (Math.random() - 0.5) * 3,
                this.y + 4,
                '#ffd700',
                Math.random() * 1.5 + 0.5,
                Math.PI / 2 + (Math.random() * 0.4 - 0.2),
                0.93,
                0.08,
                18
            ));
        }

        // Explode when reached apex/target height
        if (this.y <= this.targetY) {
            this.explode();
            this.alive = false;
        }
    }

    draw(ctx) {
        if (!this.alive) return;

        // Draw luminous rocket trail
        ctx.save();
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        for (let i = 0; i < this.trail.length - 1; i++) {
            const p1 = this.trail[i];
            const p2 = this.trail[i + 1];
            const alpha = (i + 1) / this.trail.length;
            ctx.strokeStyle = `rgba(255, 215, 0, ${alpha * 0.75})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
        }

        // Rocket head
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 12;
        ctx.shadowColor = this.headColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    explode() {
        audio.playDistantFireworkPop();

        const count = Math.floor(Math.random() * 12 + 28);

        if (this.burstType === 'willow') {
            // Golden Willow / Kamuro
            const goldPalette = ['#fff6a3', '#ffd700', '#ffb703', '#f39c12', '#ffffff'];
            for (let i = 0; i < 32; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 3.8 + 1.2;
                const color = goldPalette[Math.floor(Math.random() * goldPalette.length)];
                particles.push(new Particle(this.x, this.y, color, speed, angle, 0.965, 0.038, Math.random() * 30 + 60, true));
            }
        } else if (this.burstType === 'ring') {
            // Ring Burst
            const ringColor = this.palette[Math.floor(Math.random() * this.palette.length)];
            for (let i = 0; i < 28; i++) {
                const angle = (Math.PI * 2 * i) / 28;
                const speed = 3.8;
                particles.push(new Particle(this.x, this.y, ringColor, speed, angle, 0.95, 0.045, 60));
            }
            // Inner core
            for (let i = 0; i < 8; i++) {
                const angle = Math.random() * Math.PI * 2;
                particles.push(new Particle(this.x, this.y, '#ffffff', Math.random() * 2, angle, 0.92, 0.04, 40));
            }
        } else {
            // Chrysanthemum / Classic Sphere Burst
            for (let i = 0; i < count; i++) {
                const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.3 - 0.15);
                const speed = Math.random() * 4.8 + 2.0;
                const color = this.palette[Math.floor(Math.random() * this.palette.length)];
                const isTwinkle = Math.random() > 0.5;
                particles.push(new Particle(this.x, this.y, color, speed, angle, 0.952, 0.055, Math.random() * 25 + 50, isTwinkle));
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
        this.y = canvas.height + Math.random() * 50;
        this.size = Math.random() * 2.2 + 0.8;
        this.speedY = Math.random() * 0.8 + 0.3;
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

for (let i = 0; i < 16; i++) {
    ambientGlows.push(new AmbientEmber());
}

// Launch a single background rocket
function launchBackgroundRocket() {
    // Launch from bottom with margin
    const startX = Math.random() * (canvas.width * 0.85) + canvas.width * 0.075;
    const startY = canvas.height + 10;
    
    // Target altitude: top 12% to 48% of screen
    const targetY = Math.random() * (canvas.height * 0.36) + canvas.height * 0.12;
    // Target X: slight drift
    const targetX = startX + (Math.random() - 0.5) * 160;

    const palette = festivePalettes[Math.floor(Math.random() * festivePalettes.length)];
    const burstTypes = ['chrysanthemum', 'willow', 'ring', 'chrysanthemum'];
    const burstType = burstTypes[Math.floor(Math.random() * burstTypes.length)];

    rockets.push(new Rocket(startX, startY, targetX, targetY, palette, burstType));
}

// Sparkler Effect (फुलझड़ी टच/क्लिक)
function spawnSparkler(x, y, count = 12) {
    const goldPalette = ['#fff59d', '#ffd700', '#ffb703', '#fb8500', '#ffffff'];
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1;
        const color = goldPalette[Math.floor(Math.random() * goldPalette.length)];
        particles.push(new Particle(x, y, color, speed, angle, 0.92, 0.04, Math.random() * 25 + 20));
    }
    audio.playSparklerCrackle();
}

// Firework Burst Trigger (Direct coordinates)
function createFirework(x, y, count = 60, colors = ['#ffd700', '#ff9900', '#ff3366', '#ffffff', '#00e5ff']) {
    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.4 - 0.2);
        const speed = Math.random() * 6 + 2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        particles.push(new Particle(x, y, color, speed, angle, 0.95, 0.08, Math.random() * 40 + 60));
    }
}

// Full Festive Anar / Phuljhadi Grand Burst
function burstPhuljhadi() {
    // Launch multiple rockets simultaneously for grand celebration
    launchBackgroundRocket();
    setTimeout(() => launchBackgroundRocket(), 150);
    setTimeout(() => launchBackgroundRocket(), 350);
    setTimeout(() => launchBackgroundRocket(), 550);

    const x = canvas.width / 2;
    const y = canvas.height * 0.42;
    createFirework(x, y, 90, ['#ffd700', '#ff7700', '#ff0055', '#ffea00', '#00f5d4']);
    audio.playTempleBell();
}

// Continuous Background Firework Scheduler
let lastAutoRocketTime = 0;
let nextRocketDelay = 900; // Launch every 0.7 - 1.5 seconds continuously

// Animation Loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw twinkling celestial night stars (आसमान का Night View)
    nightStars.forEach(star => {
        star.update();
        star.draw(ctx);
    });

    // 2. Draw floating Sky Lanterns (आकाश दीया / कंदिल)
    skyLanterns.forEach(lantern => {
        lantern.update();
        lantern.draw(ctx);
    });

    // 3. Continuous Rocket Auto-Launcher
    const now = Date.now();
    if (now - lastAutoRocketTime > nextRocketDelay) {
        lastAutoRocketTime = now;
        nextRocketDelay = Math.random() * 600 + 1000; // Launch every 1.0s - 1.6s

        launchBackgroundRocket();

        // 25% chance of twin rocket launch
        if (Math.random() < 0.25) {
            setTimeout(() => launchBackgroundRocket(), 220);
        }
    }

    // 4. Draw ambient floating embers
    ambientGlows.forEach(ember => {
        ember.update();
        ember.draw(ctx);
    });

    // 5. Update and draw active ascending rockets
    for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.update();
        r.draw(ctx);
        if (!r.alive) {
            rockets.splice(i, 1);
        }
    }

    // Keep particle count healthy for optimal 60 FPS
    if (particles.length > 130) {
        particles.splice(0, particles.length - 130);
    }

    // 6. Update and draw active firework explosion sparks
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
animate();

// Interactive Sparkler on Mouse Move / Touch
let isInteracting = false;
window.addEventListener('mousedown', (e) => {
    if (e.target.closest('input') || e.target.closest('button')) return;
    isInteracting = true;
    spawnSparkler(e.clientX, e.clientY, 15);
});
window.addEventListener('mouseup', () => { isInteracting = false; });
window.addEventListener('mousemove', (e) => {
    if (isInteracting && Math.random() > 0.4) {
        spawnSparkler(e.clientX, e.clientY, 5);
    }
});

window.addEventListener('touchstart', (e) => {
    if (e.target.closest('input') || e.target.closest('button')) return;
    if (e.touches.length > 0) {
        const t = e.touches[0];
        spawnSparkler(t.clientX, t.clientY, 15);
    }
}, { passive: true });

window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0 && Math.random() > 0.5) {
        const t = e.touches[0];
        spawnSparkler(t.clientX, t.clientY, 6);
    }
}, { passive: true });

// --- Interactive Multi-Diya Ceremony ---
const allDiyas = document.querySelectorAll('.diya-unit, .stream-diya');

allDiyas.forEach(diya => {
    diya.addEventListener('click', (e) => {
        e.stopPropagation();
        audio.playTempleBell();

        const rect = diya.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + (rect.height * 0.3);

        // Golden festive spark shower from touched diya
        createFirework(centerX, centerY, 38, ['#ffd700', '#ffea00', '#ff6b00', '#ffffff']);

        // Slight bounce animation on touch
        diya.style.transition = 'transform 0.15s ease';
        diya.style.transform = 'scale(1.22)';
        setTimeout(() => {
            diya.style.transform = '';
        }, 200);
    });
});

// --- Interactive Moving Rangolis (रंगोली पर क्लिक करने पर दिव्य चक्र व संगीत) ---
const movingRangolis = document.querySelectorAll('.moving-rangoli-container');
movingRangolis.forEach(rangoli => {
    rangoli.addEventListener('click', (e) => {
        e.stopPropagation();
        audio.playTempleBell();
        const rect = rangoli.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        createFirework(cx, cy, 45, ['#ff007f', '#00f5d4', '#ffd700', '#70e000', '#ffffff', '#ff5400']);
    });
});

// Auto-activate audio context on first screen interaction
let firstInteraction = true;
window.addEventListener('click', () => {
    if (firstInteraction) {
        firstInteraction = false;
        audio.init();
    }
}, { once: true });

// --- Audio Controls UI ---
const musicToggleBtn = document.getElementById('musicToggleBtn');
const musicIcon = document.getElementById('musicIcon');
const musicText = document.getElementById('musicText');
const soundFxBtn = document.getElementById('soundFxBtn');

musicToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isPlaying = audio.toggleAmbientMusic();
    if (isPlaying) {
        musicIcon.className = 'fa-solid fa-volume-high';
        musicText.innerText = 'संगीत बंद करें';
        musicToggleBtn.classList.add('active');
    } else {
        musicIcon.className = 'fa-solid fa-volume-xmark';
        musicText.innerText = 'संगीत चालू करें';
        musicToggleBtn.classList.remove('active');
    }
});

soundFxBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    audio.isAudioEnabled = !audio.isAudioEnabled;
    soundFxBtn.classList.toggle('active', audio.isAudioEnabled);
    soundFxBtn.innerHTML = audio.isAudioEnabled ? '<i class="fa-solid fa-bell"></i>' : '<i class="fa-solid fa-bell-slash"></i>';
});

// --- Dynamic Personalized Title via URL (optional) ---
function getSenderFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('from') || urlParams.get('name');
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
    
    // Check if Native Web Share API is available on mobile devices
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
    
    // Direct WhatsApp Web / Mobile redirect fallback
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


