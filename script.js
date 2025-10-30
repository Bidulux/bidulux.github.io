// Configuration des particules
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const particleCount = 100;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
    }

    draw() {
        ctx.fillStyle = '#00ff88';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Initialisation des particules
function initParticles() {
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

// Animation
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    requestAnimationFrame(animate);
}

// Récupération des données crypto
async function fetchCryptoData() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,monero&order=market_cap_desc');
        const data = await response.json();
        
        const cryptoGrid = document.getElementById('crypto-grid');
        cryptoGrid.innerHTML = data.map(coin => `
            <div class="crypto-card">
                <img src="${coin.image}" alt="${coin.name}" class="crypto-logo">
                <h3>${coin.name}</h3>
                <div class="price">$${coin.current_price.toLocaleString()}</div>
                <div class="market-info">
                    <div>Volume 24h: $${coin.total_volume.toLocaleString()}</div>
                    <div class="${coin.price_change_percentage_24h >= 0 ? 'up' : 'down'}">
                        ${coin.price_change_percentage_24h.toFixed(2)}%
                    </div>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Événements
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Initialisation
initParticles();
animate();
fetchCryptoData();
setInterval(fetchCryptoData, 30000);