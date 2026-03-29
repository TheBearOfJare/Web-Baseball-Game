function updateBackgroundScale(width, height) {
    const gameBackground = document.getElementById('game-background');
    gameBackground.style.setProperty('--bg-scale-width', width);
    gameBackground.style.setProperty('--bg-scale-height', height);
}

function updateCameraPosition(x, y) {
    const gameBackground = document.getElementById('game-background');
    gameBackground.style.setProperty('--bg-camera-x', x + 'vw');
    gameBackground.style.setProperty('--bg-camera-y', y + 'vh');
}

function switchToTop() {
    updateBackgroundScale(1.5, 1.5);
    updateCameraPosition(0,1);
}

function switchToBatter() {
    updateBackgroundScale(1.8, 0.8);
    updateCameraPosition(0,0);
}

function switchToFirstBase() {
    updateBackgroundScale(3.8, 1.8);
    updateCameraPosition(-5,1);
}

function switchToSecondBase() {
    updateBackgroundScale(1.8, 0.8);
    updateCameraPosition(-2,2);
}

function switchToThirdBase() {
    updateBackgroundScale(1.8, 0.8);
    updateCameraPosition(-2,1);
}

window.addEventListener('load', () => {
    switchToBatter();
});

// temporary keybinds to switch views. REMOVE THESE LATER
window.addEventListener('keydown', (e) => {
    if (e.key === 't') {
        switchToTop();
    }
    if (e.key === 'b') {
        switchToBatter();
    }
    if (e.key === '1') {
        switchToFirstBase();
    }
    if (e.key === '2') {
        switchToSecondBase();
    }
    if (e.key === '3') {
        switchToThirdBase();
    }
});

