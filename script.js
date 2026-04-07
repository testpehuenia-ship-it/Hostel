document.addEventListener('DOMContentLoaded', () => {

    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // 1. Initial Loader Timeline (GSAP)
    const tlLoader = gsap.timeline();
    tlLoader.to('#loader', {
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
            document.getElementById('loader').style.display = 'none';
        }
    })
    .from('.nav-elem', {
        y: -20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: "back.out(1.7)"
    }, "-=0.3")
    .from('.reveal-elem', {
        y: 40,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: "power4.out"
    }, "-=0.5")
    .from('.main-glass', {
        scale: 0.8,
        opacity: 0,
        rotationX: -10,
        rotationY: 10,
        duration: 1.5,
        ease: "elastic.out(1, 0.5)"
    }, "-=0.8");

    // 2. Scroll Animations (Scroll Hijacking & Isometric Effects)
    
    // Popup Elements (Cards, Tables, Gallery)
    gsap.utils.toArray('.popup-elem').forEach(elem => {
        gsap.from(elem, {
            scrollTrigger: {
                trigger: elem,
                start: "top 85%",
                toggleActions: "play none none none"
            },
            y: 50,
            opacity: 0,
            rotationX: 10,  // Isometric entrance
            duration: 0.8,
            ease: "back.out(1.2)"
        });
    });

    // FAQ Accordions (Staggered Entrance)
    gsap.from('.faq-stagger', {
        scrollTrigger: {
            trigger: '.faq-grid',
            start: "top 80%"
        },
        x: -40,
        opacity: 0,
        stagger: 0.15,
        duration: 0.6,
        ease: "power3.out"
    });

    // Parallax on Floating 3D Container
    gsap.to('.main-glass', {
        scrollTrigger: {
            trigger: '.hero',
            start: "top top",
            end: "bottom top",
            scrub: true
        },
        y: 100,
        rotationX: 0,
        rotationY: 0
    });

    // 3. 4 Seasons Carousel & Dynamic Particle Engine
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const fxLayer = document.getElementById('fx-layer');
    
    let currentSlide = 0;
    let effectInterval = null;
    let spawnTimeout = null;

    function createParticle(type) {
        if (!fxLayer) return;
        const p = document.createElement('div');
        p.className = `particle ${type}`;
        
        const w = fxLayer.clientWidth;
        const h = fxLayer.clientHeight;
        
        if (type === 'sparkle') {
            // Summer
            p.style.left = gsap.utils.random(0, w) + 'px';
            p.style.top = gsap.utils.random(0, h) + 'px';
            fxLayer.appendChild(p);
            
            gsap.to(p, {
                opacity: gsap.utils.random(0.5, 1),
                scale: gsap.utils.random(1, 2),
                duration: gsap.utils.random(0.5, 1.5),
                yoyo: true,
                repeat: 1,
                onComplete: () => { if(p.parentNode) p.remove(); }
            });
        } 
        else if (type === 'leaf') {
            // Autumn
            p.style.left = gsap.utils.random(-0.2 * w, w) + 'px';
            p.style.top = '-20px';
            p.style.background = gsap.utils.random(['#e67e22', '#d35400', '#f39c12', '#c0392b']);
            fxLayer.appendChild(p);
            
            gsap.to(p, {
                y: h + 50,
                x: "+=" + gsap.utils.random(-100, 200),
                rotation: gsap.utils.random(-360, 360),
                duration: gsap.utils.random(3, 6),
                ease: "power1.inOut",
                onComplete: () => { if(p.parentNode) p.remove(); }
            });
        }
        else if (type === 'snowflake') {
            // Winter
            p.style.left = gsap.utils.random(-0.1 * w, w) + 'px';
            p.style.top = '-10px';
            const size = gsap.utils.random(4, 10);
            p.style.width = size + 'px';
            p.style.height = size + 'px';
            fxLayer.appendChild(p);
            
            gsap.to(p, {
                y: h + 20,
                x: "+=" + gsap.utils.random(-50, 50),
                opacity: gsap.utils.random(0.4, 0.9),
                duration: gsap.utils.random(4, 8),
                ease: "none",
                onComplete: () => { if(p.parentNode) p.remove(); }
            });
        }
        else if (type === 'petal') {
            // Spring
            p.style.left = gsap.utils.random(-0.1 * w, w) + 'px';
            p.style.bottom = '-20px';
            p.style.background = gsap.utils.random(['#ffb7b2', '#ffdac1', '#e2f0cb', '#e2d4f8']);
            fxLayer.appendChild(p);
            
            gsap.to(p, {
                y: - (h + 50),
                x: "+=" + gsap.utils.random(-150, 150),
                rotation: gsap.utils.random(-180, 180),
                duration: gsap.utils.random(4, 7),
                ease: "sine.inOut",
                onComplete: () => { if(p.parentNode) p.remove(); }
            });
        }
    }

    function startSeasonEffect(season) {
        if (!fxLayer) return;
        // Kill existing
        fxLayer.innerHTML = '';
        clearTimeout(spawnTimeout);
        
        function spawner() {
            let config = { type: null, rate: 0 };
            
            if (season === 'summer') config = { type: 'sparkle', rate: 400 };
            else if (season === 'autumn') config = { type: 'leaf', rate: 300 };
            else if (season === 'winter') config = { type: 'snowflake', rate: 150 };
            else if (season === 'spring') config = { type: 'petal', rate: 350 };
            
            if (config.type) {
                createParticle(config.type);
                spawnTimeout = setTimeout(spawner, gsap.utils.random(config.rate - 50, config.rate + 150));
            }
        }
        spawner();
    }

    function goToSlide(index) {
        if (!slides.length) return;
        
        slides[currentSlide].classList.remove('active');
        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        
        const season = slides[currentSlide].getAttribute('data-season');
        startSeasonEffect(season);
    }

    if (slides.length > 0) {
        // Initial Effect
        startSeasonEffect(slides[0].getAttribute('data-season'));

        // Controls
        nextBtn.addEventListener('click', () => {
            goToSlide(currentSlide + 1);
            resetInterval();
        });
        
        prevBtn.addEventListener('click', () => {
            goToSlide(currentSlide - 1);
            resetInterval();
        });

        // Auto play
        function resetInterval() {
            clearInterval(effectInterval);
            effectInterval = setInterval(() => {
                goToSlide(currentSlide + 1);
            }, 6000);
        }
        resetInterval();
    }

    // 4. FAQ Accordion Logic (GSAP Animated)
    const faqHeads = document.querySelectorAll('.faq-head');
    faqHeads.forEach(head => {
        head.addEventListener('click', () => {
            const body = head.nextElementSibling;
            const span = head.querySelector('span');
            const isOpen = body.style.height && body.style.height !== '0px';

            // Close all
            document.querySelectorAll('.faq-body').forEach(el => {
                gsap.to(el, { height: 0, paddingBottom: 0, duration: 0.4, ease: "power2.out" });
            });
            document.querySelectorAll('.faq-head span').forEach(el => {
                gsap.to(el, { rotation: 0, duration: 0.3 });
            });

            // Open clicked
            if (!isOpen) {
                gsap.set(body, { height: "auto" });
                const targetHeight = body.offsetHeight;
                gsap.fromTo(body, 
                    { height: 0, paddingBottom: 0 }, 
                    { height: targetHeight, paddingBottom: 24, duration: 0.4, ease: "power2.out" }
                );
                gsap.to(span, { rotation: 45, duration: 0.3 });
            }
        });
    });

    // 5. Interactive Selector Logic
    const interactiveOptions = document.querySelectorAll('.interactive-option');
    interactiveOptions.forEach(option => {
        option.addEventListener('click', () => {
            interactiveOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
        });
    });

    // ====== CHAT WIDGET LOGIC ======
    const chatToggle = document.getElementById('chat-toggle');
    const chatPanel = document.getElementById('chat-panel');
    const chatClose = document.getElementById('chat-close');
    const chatForm = document.getElementById('chat-form');
    const chatFormView = document.getElementById('chat-form-view');
    const chatSuccessView = document.getElementById('chat-success-view');
    const userNameSpan = document.getElementById('chat-user-name');
    const chatReset = document.getElementById('chat-reset');
    const notifDot = document.querySelector('.notification-dot');

    if(chatToggle && chatPanel) {
        chatToggle.addEventListener('click', () => {
            chatPanel.classList.toggle('hidden');
            if (notifDot) notifDot.style.display = 'none'; // Clear notification on open
        });

        chatClose.addEventListener('click', () => {
            chatPanel.classList.add('hidden');
        });

        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('chat-name').value;
            const phone = document.getElementById('chat-phone').value;
            const message = document.getElementById('chat-message').value;

            // Set name dynamically in success screen
            userNameSpan.textContent = name;
            
            // UI State transition
            chatFormView.classList.add('hidden');
            chatSuccessView.classList.remove('hidden');

            // Format WhatsApp payload
            const waText = encodeURIComponent(`Hola, soy ${name}. Mi celular es ${phone}. Consulta: ${message}`);
            
            // Redirect to WhatsApp after brief success message
            setTimeout(() => {
                window.open(`https://wa.me/5492942555444?text=${waText}`, '_blank');
            }, 2500);
        });

        chatReset.addEventListener('click', () => {
            chatSuccessView.classList.add('hidden');
            chatFormView.classList.remove('hidden');
            chatForm.reset();
        });
    }

    // ====== LÓGICA DE RESERVAS EN LÍNEA ======
    const reservaForm = document.getElementById('reserva-form');
    if (reservaForm) {
        reservaForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre = document.getElementById('res-name').value;
            const telefono = document.getElementById('res-phone').value;
            const dias = document.getElementById('res-days').value;
            const personas = document.getElementById('res-people').value;
            
            // Mensaje que enviará a WhatsApp
            const textWa = encodeURIComponent(`¡Hola Hostel Andino! Quisiera solicitar una estadía 😊:\n\n👤 Nombre: ${nombre}\n📞 Teléfono: ${telefono}\n📅 Días: ${dias}\n👥 Personas: ${personas}\n\nQuedo a la espera de confirmación de disponibilidad.`);
            
            // Abre WhatsApp en una ventana nueva, con el número brindado (+54 9 2942 555-444)
            window.open(`https://wa.me/5492942555444?text=${textWa}`, '_blank');
        });
    }

});
