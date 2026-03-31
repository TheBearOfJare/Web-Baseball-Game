var spaceIsPressed = false;
var homeScore = 0;
var awayScore = 0;
var inning = -1;
var topOrBottom = "Bottom";
var balls = 0;
var strikes = 0;
var outs = 0;
var bases = [false, false, false];
var mode = "Batting";
var earthBatter = 1;
var marsBatter = 1;
var ballThrowInProgress;
var playInProgress = false;
var timeAtPlate;
var pitchX;
var pitchType;
var ballMode;

async function main() {

    document.getElementById("start-btn").style.display = "none";

    earthSideUpToBat = document.getElementById("earth-side-up-to-bat");
    marsSideUpToBat = document.getElementById("mars-side-up-to-bat");

    console.log("Beginning game")

    // this loop happens every position change
    while (true) {

        // inning is over
        if (topOrBottom === "Bottom") {
            inning++;
            topOrBottom = "Top";
            mode = "Batting";
        }
        else {
            topOrBottom = "Bottom";
            mode = "Pitching";
        }

        console.log("Inning: " + inning + " " + topOrBottom + " " + mode);

        if (mode === "Batting") {

            // reset the bases
            bases = [false, false, false];

            outs = 0;
            balls = 0;
            strikes = 0;

            // ui
            resetBallsAndStrikes();
            resetOuts();
            resetBases();

            // batter loop
            while (outs < 3) {

                // mercy rule
                if (homeScore - awayScore >= 10) {
                    console.log("Earth wins by mercy rule");
                    displayWinner("Earth");
                    return;
                }

                console.log("Outs: " + outs + " Balls: " + balls + " Strikes: " + strikes);
        
                // spawn the batter
                batter = spawnNewPlayer("Earth", "earth-side-up-to-bat");

                // move the platform to the plate
                earthSideUpToBat.style.left = "50%";
                earthSideUpToBat.style.top = "50%";

                // reassign the batter from the side-up-to-bat div to the graphics div
                document.getElementById("graphics").appendChild(batter);
                // earthSideUpToBat.removeChild(batter);

                // move the batter to the plate
                batter.style.left = "50%";
                batter.style.top = "50%";

                playInProgress = true;

                console.log("playInProgress");
                
                // pitch
                computerPitch();

                while (playInProgress) {
                    // pitch triggers the hit (or skips right to strike if they miss)
                    // hit triggers moveBall
                    // cpu feilders move to intercept the ball
                    // at some point the play is ended and this will exit, and we're ready to loop around again.
                    await new Promise(resolve => requestAnimationFrame(resolve));
                }
                
            }
            

        }

        // pitching
        else {

            while (outs < 3) {

                // mercy rule
                if (awayScore - homeScore >= 10) {
                    displayWinner("Mars");
                    return;
                }
        
                // spawn the batter
                batter = spawnNewPlayer("Mars", "mars-side-up-to-bat");

                // move the platform to the plate
                marsSideUpToBat.style.left = "50%";
                marsSideUpToBat.style.top = "50%";

                // reassign the batter from the side-up-to-bat div to the graphics div
                document.getElementById("graphics").appendChild(batter);
                // earthSideUpToBat.removeChild(batter);

                // move the batter to the plate
                batter.style.left = "50%";
                batter.style.top = "50%";

                playInProgress = true;
                
                // pitch
                playerPitch();

                while (playInProgress) {
                    // pitch triggers the hit (or skips right to strike if they miss)
                    // hit triggers moveBall
                    // cpu feilders move to intercept the ball
                    // at some point the play is ended and this will exit, and we're ready to loop around again.
                    await new Promise(resolve => requestAnimationFrame(resolve));
                }
                
            }

        }


        

    }
}

function spawnNewPlayer(team, assignment) {

    console.log("Spawning new " + team + " player to " + assignment);

    var player = document.createElement("div");
    player.classList.add(team);
    player.style.backgroundImage = `url("img/${team}_Player.svg")`;
    player.id = team + earthBatter;
    document.getElementById(assignment).appendChild(player);
    earthBatter++;
    return player;
}

function computerPitch() {
    
    // wait a short random amount of time
    setTimeout(() => {
        
    }, Math.random() * 1000);

    console.log("Computer pitching");

    // spawn the ball
    var ball = document.createElement("div");
    ball.id = "ball";
    document.getElementById("graphics").appendChild(ball);
    ball.style.left = "50%";
    ball.style.bottom = "50%";

    // select a pitch type
    pitchType = chooseRandom(["fastball", "curveball", "slider", "changeup"]);

    // choose how inside or outside the pitch is. 0.25 is as far inside as you can go while being a strike, 1.25 is as far outside as you can go while being a strike. The strike zone is therefore 1 unit wide, with the possibility of going 25% outside the zone for balls on either side.
    pitchX = Math.random() * 1.5 - 0.25;

    // pitch type tells us the time it takes and how the motion is handled. The motion variable holds the coordinate(s) of locations along the ball's path [left, bottom]
    if (pitchType === "fastball") {
        time = 0.5;
        motion = [["calc(50% + " + pitchX * 1 + "vw)", "4vh"]];
    }
    if (pitchType === "curveball") {
        time = 2;
        motion = [["calc(50% + " + pitchX * 3 + "vw)", "40%"], ["calc(50% + " + pitchX * 1 + "vw)", "4vh"]];
    }
    if (pitchType === "slider") {
        time = 1;
        motion = [["calc(50% + " + pitchX * 2 + "vw)", "4vh"]]; // sliders can be more inside or outside
    }
    if (pitchType === "changeup") {
        time = 3;
        motion = [["calc(50% + " + pitchX * 1 + "vw)", "4vh"]]; // changeups osclate back and forth so you won't know if they're leaning inside or outside but they're generally a strike
    }

    console.log("Pitch type: " + pitchType);
    console.log("Pitch X: " + pitchX);
    console.log("Time: " + time);
    console.log("Motion: " + motion);

    // note the time when the ball will reach the plate
    timeAtPlate = Date.now() + time * 1000;
    ballThrowInProgress = setTimeout(() => {
        ballThrowInProgress = false;
        playInProgress = false;
        console.log("Ball reached the plate before swing.");
        // check if it's inside or outside the plate
        if (pitchX >= 0 && pitchX <= 1) {
            addStrike();
        } else {
            addBall();
        }
    }, time * 1000);

    // move the ball from the pitcher to the plate along the motion path
    let segmentTime = time / motion.length;
    for (let i = 0; i < motion.length; i++) {
        setTimeout(() => {
            ball.style.transition = `left ${segmentTime}s linear, bottom ${segmentTime}s linear`;
            ball.style.left = motion[i][0];
            ball.style.bottom = motion[i][1];
        }, i * segmentTime * 1000);
    }
}

function hitBall(timingMultiplier) {

    pitchModifier = 3; // fastball
    if (pitchType === "curveball") {
        pitchModifier = 1;
    }
    else if (pitchType === "slider") {
        pitchModifier = 2;
    }
    else if (pitchType === "changeup") {
        pitchModifier = 0.6;
    }

    velocity = 10 * timingMultiplier * pitchModifier + (pitchX*10);

    angle = timingMultiplier * 150 - 45 + (pitchX * 45);

    upVelocity = 10 / timingMultiplier; // worse timings generate more fly balls

    ballMode = "hit";

    console.log("Ball hit");
    console.log("Velocity: " + velocity);
    console.log("Angle: " + angle);
    console.log("Up Velocity: " + upVelocity);

    moveBall(velocity, angle, upVelocity);
    
}

async function moveBall(velocity, angle, upVelocity) {
    let ball = document.getElementById("ball");
    
    // convert angle to radians to figure out x and y velocity components
    let rad = angle * (Math.PI / 180);
    let vx = velocity * Math.cos(rad);
    let vy = velocity * Math.sin(rad);

    if (Math.max(vx, vy) < 0.1) {
        ballMode = "stopped"; // the ball can be picked up by a feilder, but it's no longer moving
        return
    }

    let z = 0;
    let g = 9.8;

    let lastTime = performance.now();
    let xOffset = 0;
    let yOffset = 0;
    
    ball.style.transition = "none"; // clear the pitch transitions so it responds instantly

    while (ballMode === "hit") {
        // await next frame to loop without blocking execution and for smooth 60fps movement
        await new Promise(resolve => requestAnimationFrame(resolve));
        
        let currentTime = performance.now();
        let dt = (currentTime - lastTime) / 1000;
        lastTime = currentTime;
        
        // update velocities based on gravity
        upVelocity -= g * dt;
        
        // update positions incrementally
        xOffset += vx * dt;
        yOffset += vy * dt;
        z += upVelocity * dt;
        
        // handle bounces
        if (z < 0) {
            z = 0;
            
            let graphics = document.getElementById("graphics");
            let H = graphics.clientHeight;
            let vw = window.innerWidth / 100;
            let vh = window.innerHeight / 100;

            // Differences (+X right, +Y down from center of grass)
            let dx = xOffset * vw;
            let dy = (graphics.clientHeight - (4 * vh + yOffset * vh)) - (graphics.clientHeight - (0.10 * H + 30 * vh));

            // Rotate -45deg to get local unrotated coordinates
            let x_local = (dx + dy) / Math.SQRT2;
            let y_local = (-dx + dy) / Math.SQRT2;

            if (x_local > 30 * vh || y_local > 30 * vh) {
                // Ball landed outside outfield grass on the right or bottom sides
                ballMode = "stopped";
                updatePlayResult("Foul Ball");
                if (strikes < 2) {
                    addStrike();
                }
                setTimeout(() => { playInProgress = false; deleteBall(); }, 2000); // Give player time to read result
                break;
            } else if (x_local < -30 * vh || y_local < -30 * vh) {
                // Ball landed outside on the left or top sides
                ballMode = "stopped";
                updatePlayResult("Home Run!");
                if (mode === "Batting") {
                    homeScore++;
                } else {
                    awayScore++;
                }
                setTimeout(() => { playInProgress = false; deleteBall(); }, 3000);
                break;
            }

            // Abs value ensures it always bounces UP, instead of accidentally continuing down
            upVelocity = Math.abs(upVelocity) * 0.4;
            
            if (upVelocity < 0.1) {
                upVelocity = 0;
            }
            vx *= 0.8;
            vy *= 0.8;
        }

        // console.log("Z: " + z + "\nupVelocity: " + upVelocity);

        // move relative to starting point based on accumulated offsets
        ball.style.left = `calc(50% + ${xOffset}vw)`;
        ball.style.bottom = `calc(4vh + ${yOffset}vh)`;
        ball.style.transform = `translateZ(${z}px) scaleX(calc((1 / var(--bg-scale-width)) * ${1 + z / 100})) scaleY(calc((1 / var(--bg-scale-height)) * ${1 + z / 100}))`;

        // Update shadow based on height (z)
        let shadowY = 4 + (z * 2);
        let shadowBlur = 6 + z;
        let shadowOpacity = Math.max(0.05, 0.3 - (z * 0.005));
        ball.style.boxShadow = `0 ${shadowY}px ${shadowBlur}px rgba(0,0,0,${shadowOpacity})`;
    }
}

function addStrike() {
    strikes++;
    incrementStrikes();
    updatePitchResult("Strike!");
    updatePlayResult("");
    if (strikes === 3) {
        strikeOut();
    }
    setTimeout(() => { playInProgress = false; deleteBall(); }, 2000);
}

function addBall() {
    balls++;
    incrementBalls();
    updatePitchResult("Ball!");
    updatePlayResult("");
    if (balls === 4) {
        walk();
    }
    setTimeout(() => { playInProgress = false; deleteBall(); }, 2000);
}

function addOut() {
    outs++;
    incrementOuts();
    updatePlayResult("Out!");
    setTimeout(() => { playInProgress = false; deleteBall(); }, 3000);

}

function walk() {
    balls = 0;
    strikes = 0;
    resetBallsAndStrikes();
    updatePlayResult("Walk!");
    setTimeout(() => { playInProgress = false; deleteBall(); }, 2000);

}

function strikeOut() {
    outs++;
    incrementOuts();
    updatePlayResult("Strikeout!");
    setTimeout(() => { playInProgress = false; deleteBall(); }, 3000);
    if (outs === 3) {
        endInning();
    }
}

function endInning() {

}

function deleteBall() {
    document.getElementById("ball").remove();
}

function pauseGame() {
    
}

function displayWinner(winner) {
    updatePlayResult(winner + " wins!");
}

window.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        spaceIsPressed = true;

        // batting swings
        if (ballThrowInProgress) {

            // clear the timeout
            clearTimeout(ballThrowInProgress);
            ballThrowInProgress = false;

            // see how early the player was. The lower the differential, the higher multiplier we apply to the speed of the ball.
            differential = timeAtPlate - Date.now();

            console.log("Differential: " + differential + " ms");
            if (differential < 100) {
                hitBall(timingMultiplier = (100 - differential) / 100);
            }
            // too early, missed entirely
            else {
                console.log("Too early, missed entirely");
                addStrike();
                playInProgress = false;
            }
            
        }
    }
    if (e.key === 'Escape') {
        pauseGame();
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key === ' ') {
        spaceIsPressed = false;
    }
});

document.getElementById('start-btn').addEventListener('click', main);
