document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const clicker = document.getElementById('clicker');
    const scoreSpan = document.getElementById('score');
    const floatingNumbersContainer = document.getElementById('floating-numbers');
    const hatsContainer = document.getElementById('hats-container');
    const gpuIcon = 'GPU.png';
    let score = 0;
    let multiplier = 1;
    let autoclickerLevel = 0;
    let autoclickerInterval;

    // Tab functionality
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.style.display = 'none');
            tab.classList.add('active');
            const contentId = tab.getAttribute('data-content');
            document.getElementById(contentId).style.display = 'block';
        });
    });

    // Set the default active tab
    const firstTab = tabs[0];
    firstTab.classList.add('active');
    const firstContentId = firstTab.getAttribute('data-content');
    document.getElementById(firstContentId).style.display = 'block';

    // Clicker functionality
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

    function updateMultiplier() {
        multiplier = autoclickerLevel + 1;
    }

    function buyItem(level, type, price) {
        // Check if the user has enough GPU balance
        if (score >= price) {
            score -= price;
            if (type === 'autoclicker') {
                autoclickerLevel = level;
                updateMultiplier();
                if (autoclickerInterval) clearInterval(autoclickerInterval);
                autoclickerInterval = setInterval(() => {
                    addGPUs(autoclickerLevel);
                }, 1000);
            }
            scoreSpan.textContent = score;
            updateItemRowStatus(level, type); // Update item row status
        } else {
            // Optionally: Provide feedback to the user if they don't have enough balance
            alert("Not enough GPU balance to purchase this item!");
        }
    }

    function updateItemRowStatus(level, type) {
        // Find the item row based on type and level
        document.querySelectorAll('.item-row').forEach(item => {
            const itemLevel = parseInt(item.getAttribute('data-level'));
            const itemType = item.getAttribute('data-type');
            if (itemLevel === level && itemType === type) {
                // Check if the item is already purchased
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
