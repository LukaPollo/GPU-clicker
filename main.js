document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const clicker = document.getElementById('clicker');
    const scoreSpan = document.getElementById('score');
    const hatsContainer = document.getElementById('hats-container');
    const gpuIcon = 'GPU.png';
    const backgroundMusic = new Audio('backgroundMusic.mp3'); 
    const audioIconACTIVE = 'AudioIconACTIVE.png';
    const audioIconINACTIVE = 'AudioIconINACTIVE.png';
    let score = 0;
    let multiplier = 1;
    let autoclickerLevel = 0;
    let autoclickerInterval;
    let goldenGPUInterval;
    let goldenGPULevel = 0;
    const audio = new Audio('Metallic_sound.wav');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.style.display = 'none');
            tab.classList.add('active');
            const contentId = tab.getAttribute('data-content');
            document.getElementById(contentId).style.display = 'block';
        });
    });

    const firstTab = tabs[0];
    firstTab.classList.add('active');
    const firstContentId = firstTab.getAttribute('data-content');
    document.getElementById(firstContentId).style.display = 'block';

    clicker.addEventListener('click', () => {
        addGPUs(multiplier);
        audio.volume = 0.2;
        audio.play();
        audio.currentTime = 0;
    });
        

    function addGPUs(amount) {
        score += amount;
        scoreSpan.textContent = score;
        createFloatingGPUs(amount);
    }

    function createFloatingGPUs(amount) {
        for (let i = 0; i < amount; i++) {
            const gpu = document.createElement('img');
            gpu.src = gpuIcon;
            gpu.className = 'falling-gpu';
            gpu.ondragstart = () => false;

            const clickerRect = clicker.getBoundingClientRect();
            const randomX = clickerRect.left + Math.random() * clickerRect.width;
            const randomY = clickerRect.top + Math.random() * clickerRect.height;

            gpu.style.left = `${randomX}px`;
            gpu.style.top = `${randomY}px`;
            gpu.style.opacity = '1';

            hatsContainer.appendChild(gpu);

            setTimeout(() => {
                gpu.style.transition = 'top 1s ease-out, opacity 1s ease-out';
                gpu.style.top = `${clickerRect.bottom}px`;
                gpu.style.opacity = '0';

                gpu.addEventListener('transitionend', () => {
                    hatsContainer.removeChild(gpu);
                });
            }, 0);
        }
    }

    function getPurchasedLevels(type) {
        const purchasedItems = document.querySelectorAll(`.item-row.purchased[data-type="${type}"]`);
        const purchasedLevels = Array.from(purchasedItems).map(item => parseInt(item.getAttribute('data-level')));
        return purchasedLevels;
    }
    const purchasedGoldenGPULevels = getPurchasedLevels('golden-gpu');
    const purchasedAutoclickerLevels = getPurchasedLevels('autoclicker');
    const purchasedMultiplierLevels = getPurchasedLevels('multiplier');


    const outOfStockItems = document.querySelectorAll('.item-row');
    outOfStockItems.forEach(item => {
        const level = parseInt(item.getAttribute('data-level'));
        const type = item.getAttribute('data-type');

        const purchasedLevels = getPurchasedLevels(type);
        const highestPurchasedLevel = Math.max(...purchasedLevels, 0);

        if (!item.classList.contains('purchased') && level < highestPurchasedLevel) {
            item.classList.add('out-of-stock');
            item.querySelector('.price').textContent = 'OUT OF STOCK'; 
        }
    });

    
    
    function buyItem(level, type, price) {
        const item = document.querySelector(`.item-row[data-type="${type}"][data-level="${level}"]`);

        if (item && item.classList.contains('purchased')) {
            alert("Item already purchased!");
            return;
        }

        if (score < price) {
            alert("Not enough score to buy this item!");
            return;
        }

        score -= price;
        scoreSpan.textContent = score;

        if (type === 'autoclicker') {
            autoclickerLevel = level;
            updateAutoclicker();
        } else if (type === 'multiplier') {
            multiplier = level + 1;
        } else if (type === 'golden-gpu') {
            goldenGPULevel = level;
            updateGoldenGPU();
        }

        if (item) {
            item.classList.add('purchased');
        }

        document.querySelectorAll(`.item-row[data-type="${type}"]`).forEach(lowerItem => {
            const lowerLevel = parseInt(lowerItem.getAttribute('data-level'));
            if (lowerLevel < level && !lowerItem.classList.contains('purchased')) {
                lowerItem.classList.add('out-of-stock');
                lowerItem.querySelector('.price').textContent = 'OUT OF STOCK';
            }
        });

        updateItemRowStatus(level, type);
    }

    document.querySelectorAll('GPU.png').forEach(img => {
        img.ondragstart = () => false;
      });

    function updateAutoclicker() {
        if (autoclickerInterval) clearInterval(autoclickerInterval);
        autoclickerInterval = setInterval(() => {
            addGPUs(autoclickerLevel); 
        }, 1000); 
    }

    function updateItemRowStatus(level, type) {
        document.querySelectorAll('.item-row').forEach(item => {
            const itemLevel = parseInt(item.getAttribute('data-level'));
            const itemType = item.getAttribute('data-type');
            if (itemLevel === level && itemType === type) {
                if (!item.classList.contains('purchased')) {
                    item.classList.add('purchased');
                }
            }
        });
    }

    document.querySelectorAll('.item-row').forEach(item => {
        item.addEventListener('click', () => {
            const level = parseInt(item.getAttribute('data-level'));
            const type = item.getAttribute('data-type');
            const price = parseInt(item.getAttribute('data-price'));
            buyItem(level, type, price);
        });
    });

    function spawnGoldenGPU() {
        const goldenGPU = document.createElement('img');
        goldenGPU.src = 'GPU GOLDEN.png'; 
        goldenGPU.className = 'golden-gpu';
        goldenGPU.ondragstart = () => false; 

        const playableWidth = window.innerWidth * 0.65; 
        const randomX = Math.random() * playableWidth;
        goldenGPU.style.left = `${randomX}px`;

        document.body.appendChild(goldenGPU);

        goldenGPU.addEventListener('animationend', () => {
            if (document.body.contains(goldenGPU)) {
                document.body.removeChild(goldenGPU);
            }
        });

        goldenGPU.addEventListener('click', () => {
            addGPUs(goldenGPULevel * 10); 
            //alert("Golden GPU collected!"); Just for testing purposes
            if (document.body.contains(goldenGPU)) {
                document.body.removeChild(goldenGPU);
            }
        });
    }
    
    function updateGoldenGPU() {
        if (goldenGPUInterval) clearInterval(goldenGPUInterval);

        if (goldenGPULevel > 0) {
            const spawnRate = Math.max(5000 - goldenGPULevel * 500, 1000); 
            goldenGPUInterval = setInterval(spawnGoldenGPU, spawnRate);
        }
    }

    // Background audio
    backgroundMusic.paused;
    backgroundMusic.volume = 0.1;
    const audioToggler = document.getElementById('audioToggler');
    audioToggler.src = audioIconINACTIVE;

    audioToggler.addEventListener('click', () => {
        if (backgroundMusic.paused) {
            backgroundMusic.play().catch(() => {
                console.error('Failed to play audio'); //testing
            });
            audioToggler.src = audioIconACTIVE;
        } else {
            backgroundMusic.pause();
            audioToggler.src = audioIconINACTIVE;
        }
    });
});