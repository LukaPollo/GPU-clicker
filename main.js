document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const clicker = document.getElementById('clicker');
    const scoreSpan = document.getElementById('score');
    const hatsContainer = document.getElementById('hats-container');
    const gpuIcon = 'GPU.png';
    let score = 0;
    let multiplier = 1;
    let autoclickerLevel = 0;
    let autoclickerInterval;

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

    function buyItem(level, type, price) {
        if (score >= price) {
            score -= price;
            if (type === 'autoclicker') {
                autoclickerLevel = level;
                updateAutoclicker();
            } else if (type === 'multiplier') {
                multiplier = level + 1;
            }
            scoreSpan.textContent = score;
            updateItemRowStatus(level, type); 
        } else {
            alert("Not enough GPU balance to purchase this item!");
        }
    }

    function updateAutoclicker() {
        if (autoclickerInterval) clearInterval(autoclickerInterval);
        autoclickerInterval = setInterval(() => {
            addGPUs(autoclickerLevel); // no multiplier here, only autoclickerLevel
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
});
