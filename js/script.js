const PAGE_UP = ['ArrowUp', 'PageUp'];
const PAGE_DOWN = ['ArrowDown', 'PageDown'];

document.addEventListener('DOMContentLoaded', () => {

    const wrapper = document.getElementById('section-wrapper');
    const dots = document.querySelectorAll('.dot');
    const sections = document.querySelectorAll('section');
    const hint = document.getElementById('hint');
    const TOTAL = sections.length;
    const SECTION_TITLE = document.getElementById('nav-title');

    let current = -1;
    let isAnimating = false;

    // Function that allows scroll to the given section by given index
    function section(id) {
        if (id < 0 || id >= TOTAL || isAnimating || id == current) return;
        isAnimating = true;
        current = id;
        wrapper.style.transform = `translateY(-${current * 100}vh)`; //Moves wrapper to selected section 

        SECTION_TITLE.style.opacity = id != 0 ? 1 : 0;

        dots.forEach((d, i) => d.classList.toggle('active', i === current));
        
        sections.forEach((s, i) => {
            const content = s.querySelector('.content');
            if (i === current) {
                s.removeAttribute("inert");
                if (content) {
                    content.classList.remove('visible');

                    requestAnimationFrame(() =>
                        requestAnimationFrame(() => {
                            content.classList.add('visible');
                            //Run animations when switching to different section
                            animateSkills();
                            animateCounters();
                            updateSluxOnlinePlayers();
                        })
                    ); //Wait 2 frames to add back visible class for smoothnes
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

        setTimeout(() => { isAnimating = false; }, 500);
    }

    window.section = section;

    //Allowing scroll using mouse wheel
    window.addEventListener('wheel', e => {
        if (isAnimating) return;

        const activeSection = sections[current];
        const content = activeSection.querySelector('.content');

        if (content) {
            const atTop = content.scrollTop === 0;
            const atBottom = content.scrollTop + content.clientHeight >= content.scrollHeight - 1;

            if (e.deltaY > 0) {
                // scroll dolů
                if (!atBottom) return;
                section(current + 1);
            } else {
                // scroll nahoru
                if (!atTop) return;
                section(current - 1);
            }
        }
    }, { passive: true });

    //Allowing scroll on touch pad
    let touchY = 0;
    window.addEventListener('touchstart', e => { touchY = e.touches[0].clientY; }, { passive: true });
    window.addEventListener('touchend', e => {
        const dy = touchY - e.changedTouches[0].clientY;
        if (Math.abs(dy) < 30) return;

        const activeSection = sections[current];
        const content = activeSection.querySelector('.content');

        if (content) {
            const atTop = content.scrollTop <= 1;
            const atBottom = content.scrollTop + content.clientHeight >= content.scrollHeight - 1;

            if (dy > 0) {
                if (!atBottom) return;
                section(current + 1);
            } else {
                if (!atTop) return;
                section(current - 1);
            }
        }
    }, { passive: true });

    //Allowing scroll using keys
    window.addEventListener('keydown', e => {
        if (e.key == 'w' || PAGE_UP.includes(e.code)) section(current - 1);
        if (e.key == 's' || PAGE_DOWN.includes(e.code)) section(current + 1);
    });

    section(0);
});

//Functions that creates counters animated, like it goes from 0 to the targeted value linearly
function animateCounters() {
    document.querySelectorAll('.count').forEach(counter => {
        const target = +counter.dataset.target;
        let current = 0;

        const duration = 1000;
        const stepTime = 30;
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

function animateSkills() {
    document.querySelectorAll('.fill').forEach(el => {
        el.style.width = '0%';
        setTimeout(() => { //This makes the animation run always even when scrolling through sections (visual effect)
            const value = el.dataset.skill;
            el.style.width = value + '%';
        }, 300);
    });
}

function copyText(text) {
    navigator.clipboard.writeText(text);
}

function setProject(i) {
    document.querySelectorAll('.nav-item').forEach((b, j) =>
        b.classList.toggle('active', j === i)
    );
    document.querySelectorAll('.project').forEach((p, j) =>
        p.classList.toggle('active', j === i)
    );
}

// Retrieves player count on mc.slux.cz Minecraft server
async function updateSluxOnlinePlayers() {
    try {
        const res = await fetch('https://api.mcsrvstat.us/2/mc.slux.cz');
        const data = await res.json();

        const online = data?.players?.online ?? 0;
        document.getElementById("online").textContent = online;
    } catch (e) {
        document.getElementById("online").textContent = "0";
    }
}