function createStars() {
    const space = document.getElementById('space');
    const numStars = 400;

    for (let i = 0; i < numStars; i++) {
        let wrapper = document.createElement('div');
        wrapper.classList.add('star-wrapper');

        let star = document.createElement('div');
        star.classList.add('star');
        
        let x = Math.random() * 100;
        let y = Math.random() * 100;
        let size = Math.random() * 2 + 1;
        let duration = Math.random() * 3 + 2;
        let delay = Math.random() * 5;

        wrapper.style.left = x + '%';
        wrapper.style.top = y + '%';

        star.style.width = size + 'px';
        star.style.height = size + 'px';
        star.style.animationDuration = duration + 's';
        star.style.animationDelay = delay + 's';

        wrapper.appendChild(star);
        space.appendChild(wrapper);
    }
}

window.onload = () => {
    createStars();
}