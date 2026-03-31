function toggleBaseActive(base) {
    const base1 = document.getElementById('base-1');
    const base2 = document.getElementById('base-2');
    const base3 = document.getElementById('base-3');
    
    if (base === 1) {
        base1.classList.toggle('active');
    }
    if (base === 2) {
        base2.classList.toggle('active');
    }
    if (base === 3) {
        base3.classList.toggle('active');
    }
}

function updatePitchResult(text) {
    const pitchResult = document.getElementById('pitch-result');
    pitchResult.textContent = text;
}

function updatePlayResult(text) {
    const playResult = document.getElementById('play-result');
    playResult.textContent = text;
}

function incrementScore(team) {
    const homeScore = document.getElementById('home-score');
    const awayScore = document.getElementById('away-score');
    if (team === "home") {
        homeScore.textContent++;
    } else {
        awayScore.textContent++;
    }
}

function incrementOuts() {
    const outs = document.getElementById('outs');
    outs.textContent++;
}

function incrementBalls() {
    const balls = document.getElementById('balls');
    balls.textContent++;
}

function incrementStrikes() {
    const strikes = document.getElementById('strikes');
    strikes.textContent++;
}

function resetBallsAndStrikes() {
    const balls = document.getElementById('balls');
    const strikes = document.getElementById('strikes');
    balls.textContent = 0;
    strikes.textContent = 0;
}

function resetOuts() {
    const outs = document.getElementById('outs');
    outs.textContent = 0;
}

function resetBases() {
    const base1 = document.getElementById('base-1');
    const base2 = document.getElementById('base-2');
    const base3 = document.getElementById('base-3');
    base1.classList.remove('active');
    base2.classList.remove('active');
    base3.classList.remove('active');
}