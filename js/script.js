const PAGE_UP = ['ArrowUp', 'PageUp'];
const PAGE_DOWN = ['ArrowDown', 'PageDown'];

document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.getElementById('section-wrapper');
    const dots = document.querySelectorAll('.dot');
    const sections = document.querySelectorAll('section');
    const hint = document.getElementById('hint');

    const TOTAL = sections.length;
    let current = -1;
    let isAnimating = false;

    // Function that allows scroll to the given section by given index
    function section(id) {
        if (id < 0 || id >= TOTAL || isAnimating || id == current) return;
        isAnimating = true;
        current = id;
        wrapper.style.transform = `translateY(-${current * 100}vh)`; //Moves wrapper to selected section (transition effect)

        dots.forEach((d, i) => d.classList.toggle('active', i === current)); //Toggle active dot in the nav

        sections.forEach((s, i) => {
            const content = s.querySelector('.content');
            if (i === current) {
                s.removeAttribute("inert"); //Allow tabbing back of the displayed section
                if (content) {
                    content.classList.remove('visible');

                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            content.classList.add('visible');
                            //Run animations when switching to different section
                            animateCounters();
                            updateSluxOnlinePlayers();
                        })
                    }); //Wait 2 frames to add back visible class for smoothnes
                }
                s.classList.add('active');
                return;
            }

            s.setAttribute("inert", ""); //Remove tabbing to another section (that are not displayed)
            if (content) content.classList.remove('visible');
            s.classList.remove('active');
        });

        if (hint) {
            if (current > 0) hint.classList.add('hidden');
            else hint.classList.remove('hidden');
        }

        setTimeout(() => { isAnimating = false; }, 700);
    }

    window.section = section;

    //Allowing scroll using mouse wheel
    window.addEventListener('wheel', e => {
        if (isAnimating) return;
        if (Math.abs(e.deltaY) < 30) return;
        //Ignores small scrolls, that can be accidental or from touch pad

        const activeSection = sections[current];
        const content = activeSection.querySelector('.content');

        if (content) {
            const atTop = content.scrollTop <= 5;
            const atBottom = content.scrollTop + content.clientHeight >= content.scrollHeight - 5;
            if (e.deltaY > 0 && atBottom) {
                section(current + 1); // Scroll down
            } else if (e.deltaY <= 0 && atTop) {
                section(current - 1); // Scroll up
            }
        }
    }, { passive: true });

    //Allowing scroll on touch pad
    let touchY = 0;
    window.addEventListener('touchstart', e => { touchY = e.touches[0].clientY; }, { passive: true });

    window.addEventListener('touchmove', e => {
        const dy = touchY - e.changedTouches[0].clientY;
        if (Math.abs(dy) < 30) return;

        const activeSection = sections[current];
        const content = activeSection.querySelector('.content');

        if (content) {
            const atTop = content.scrollTop <= 1;
            const atBottom = content.scrollTop + content.clientHeight >= content.scrollHeight - 1;

            if (dy > 0 && atBottom) {
                section(current + 1); // Scroll down
            } else if (dy <= 0 && atTop) {
                section(current - 1); // Scroll up
            }
        }
    }, { passive: true });

    //Allowing scroll using keys (arrows, pgup, pgdn, w, s)
    window.addEventListener('keydown', e => {
        if (e.key == 'w' || PAGE_UP.includes(e.code)) section(current - 1);
        if (e.key == 's' || PAGE_DOWN.includes(e.code)) section(current + 1);
    });

    section(0); //Start at section with index 0
});

//Function that creates counters animated, like it goes from 0 to the targeted value linearly
function animateCounters() {
    document.querySelectorAll('.count').forEach(counter => {
        const target = +counter.dataset.target;
        let current = 0;

        const duration = 1000; //Animation duration
        const stepTime = 30; //Time between each update of the counter
        const steps = duration / stepTime;
        const increment = target / steps;

        const update = () => {
            current += increment;

            if (current < target) {
                counter.textContent = Math.ceil(current);
                setTimeout(update, stepTime);
            } else counter.textContent = target;
        };

        update();
    });
}

// Function that allows to copy text, you need to provide the button and the text to copy
function copyText(btn, text) {
    navigator.clipboard.writeText(text).then(() => { //Copy text, when done
        const span = btn.querySelector('.text');
        const original = span.innerText;
        span.innerText = 'COPIED';

        setTimeout(() => {
            span.innerText = original;
        }, 1500); //Change text of the button to coppied for 1.5s then revert
    });
}

// Retrieves player count on mc.slux.cz Minecraft server using mcsrvstat API
async function updateSluxOnlinePlayers() {
    try {
        const res = await fetch('https://api.mcsrvstat.us/2/mc.slux.cz');
        const data = await res.json();

        //Safely accessing the players properties using ? so if undefined it will not throw error and using ?? to default to 0 if online is undefined
        const online = data?.players?.online ?? 0;
        document.getElementById("online").textContent = online;
    } catch (e) {
        document.getElementById("online").textContent = "0";
    }
}

// Reveals all of the hidden project with delayed time for visual effects
function toggleProjects() {
    const btn = document.getElementById('seeMore');
    const text = document.querySelector('.see-more-text');
    const hidden = document.querySelectorAll('.hidden-project');
    const isOpen = btn.classList.contains('open');

    btn.classList.toggle('open');
    text.textContent = isOpen ? 'Show more' : 'Show less'; //Changing text to match the state

    //Toggle revealed class with delay for each project for better visual effect
    hidden.forEach((el, i) => {
        setTimeout(() => {
            el.classList.toggle('revealed', !isOpen);
        }, i * 50);
    });
}