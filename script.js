document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Switcher Logic (Animated Toggle Slider)
    const themeCheckbox = document.getElementById('themeCheckbox');
    const htmlEl = document.documentElement;

    const savedTheme = localStorage.getItem('dozari_theme') || 'dark';
    htmlEl.setAttribute('data-theme', savedTheme);
    if (themeCheckbox) {
        themeCheckbox.checked = (savedTheme === 'dark');
    }

    if (themeCheckbox) {
        themeCheckbox.addEventListener('change', () => {
            const newTheme = themeCheckbox.checked ? 'dark' : 'light';
            htmlEl.setAttribute('data-theme', newTheme);
            localStorage.setItem('dozari_theme', newTheme);
        });
    }

    // 2. Scroll to Top Button Logic
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 3. Privacy Policy Modal Logic
    const policyModal = document.getElementById('policyModal');
    const openPolicyBtns = [
        document.getElementById('openPolicyModal'),
        document.getElementById('openPolicyModalFooter'),
        document.getElementById('openPolicyModalCookie')
    ];
    const closePolicyBtn = document.getElementById('closePolicyModal');
    const acceptPolicyBtn = document.getElementById('acceptPolicyBtn');

    function openPolicyModalFn(e) {
        if (e) e.preventDefault();
        if (policyModal) {
            policyModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closePolicyModalFn() {
        if (policyModal) {
            policyModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    openPolicyBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', openPolicyModalFn);
        }
    });

    if (closePolicyBtn) closePolicyBtn.addEventListener('click', closePolicyModalFn);
    if (acceptPolicyBtn) acceptPolicyBtn.addEventListener('click', closePolicyModalFn);

    if (policyModal) {
        policyModal.addEventListener('click', (e) => {
            if (e.target === policyModal) {
                closePolicyModalFn();
            }
        });
    }

    const cookieBanner = document.getElementById('cookieBanner');
    const acceptCookiesBtn = document.getElementById('acceptCookiesBtn');

    if (cookieBanner && !localStorage.getItem('dozari_cookies_accepted')) {
        cookieBanner.classList.add('show');
    }

    if (acceptCookiesBtn) {
        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('dozari_cookies_accepted', 'true');
            cookieBanner.classList.remove('show');
        });
    }

    // 4. Mobile Menu Toggle & Body Scroll Lock
    const burgerBtn = document.getElementById('burgerBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav__link');

    function toggleMenu() {
        burgerBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    if (burgerBtn && navMenu) {
        burgerBtn.addEventListener('click', toggleMenu);
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });
    }

    // 5. Hero Slideshow Logic
    const slides = document.querySelectorAll('.hero__slide');
    const verticalNumItems = document.querySelectorAll('.vertical-num-item');
    let currentSlide = 0;
    const slideInterval = 5000;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        verticalNumItems.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
        currentSlide = index;
    }

    function nextSlide() {
        let next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    if (slides.length > 0) {
        let slideTimer = setInterval(nextSlide, slideInterval);

        verticalNumItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                showSlide(index);
                clearInterval(slideTimer);
                slideTimer = setInterval(nextSlide, slideInterval);
            });
        });
    }

    // 6. Dynamic Media Cards & News Popup Modal
    const mediaGrid = document.getElementById('mediaGrid');
    const mediaModal = document.getElementById('mediaModal');
    const closeMediaModal = document.getElementById('closeMediaModal');
    const mediaModalBody = document.getElementById('mediaModalBody');
    const prevMediaBtn = document.getElementById('prevMediaBtn');
    const nextMediaBtn = document.getElementById('nextMediaBtn');

    let currentNewsList = [];
    let currentNewsIndex = 0;

    const fallbackNews = [
        {
            title: 'ПОБЕДА НА ЭТАПЕ ROK CUP',
            date: '02 СЕНТЯБРЯ 2026',
            text: 'Пилот команды Матвей Дозаров завоевал золото в упорной борьбе на мокрой трассе. Соревнования проходили в сложных погодных условиях, однако слаженная работа личного механика и инженеров позволила настроить карт идеально. Победа на данном этапе открывает отличные перспективы перед финалом сезона.',
            photo: 'images/slide1.jpg',
            link: '#'
        },
        {
            title: 'ТЕСТОВЫЕ ЗАЕЗДЫ НОВОГО ШАССИ',
            date: '28 АВГУСТА 2026',
            text: 'Инженеры команды провели успешные тесты обновленной геометрии рамы и тормозной системы. Новые компоненты продемонстрировали отличную стабильность на высоких скоростях и улучшенный отклик в поворотах. Пилоты отметили возросший уровень комфорта и предсказуемость поведения гоночного болида.',
            photo: 'images/slide2.jpg',
            link: '#'
        },
        {
            title: 'ОТКРЫТ НАБОР В АКАДЕМИЮ',
            date: '15 АВГУСТА 2026',
            text: 'Стартует отбор молодых пилотов в молодежную программу DOZARI KARTING Academy. Мы приглашаем талантливых ребят проявить себя в тренировочных заездах под руководством профессиональных тренеров и действующих чемпионов. Лучшие выпускники академии получат шанс войти в основной состав команды.',
            photo: 'images/slide3.jpg',
            link: '#'
        }
    ];

    function openMediaModal(index) {
        currentNewsIndex = index;
        const item = currentNewsList[currentNewsIndex];
        if (!item || !mediaModalBody) return;
        mediaModalBody.innerHTML = `
            <img class="media-modal__image" src="${item.photo}" alt="${item.title}">
            <div class="media-modal__text">
                <span class="modal-news-date">${item.date}</span>
                <h2>${item.title}</h2>
                <p>${item.text}</p>
            </div>
        `;

        mediaModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMediaModalFn() {
        if (mediaModal) {
            mediaModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (closeMediaModal) {
        closeMediaModal.addEventListener('click', closeMediaModalFn);
    }

    if (mediaModal) {
        mediaModal.addEventListener('click', (e) => {
            if (e.target === mediaModal) {
                closeMediaModalFn();
            }
        });
    }

    if (prevMediaBtn) {
        prevMediaBtn.addEventListener('click', () => {
            currentNewsIndex = (currentNewsIndex - 1 + currentNewsList.length) % currentNewsList.length;
            openMediaModal(currentNewsIndex);
        });
    }

    if (nextMediaBtn) {
        nextMediaBtn.addEventListener('click', () => {
            currentNewsIndex = (currentNewsIndex + 1) % currentNewsList.length;
            openMediaModal(currentNewsIndex);
        });
    }

    function renderMedia(items) {
        if (!mediaGrid) return;
        currentNewsList = items;
        mediaGrid.innerHTML = '';
        items.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'media-card';
            card.innerHTML = `
                <div class="media-card__img">
                    <img src="${item.photo}" alt="${item.title}" loading="lazy">
                </div>
                <div class="media-card__content">
                    <span class="media-card__date">${item.date}</span>
                    <h3 class="media-card__title">${item.title}</h3>
                    <p class="media-card__text">${item.text}</p>
                    <a href="#" class="media-card__link" data-index="${index}"><span>Читать подробнее →</span></a>
                </div>
            `;
            const linkBtn = card.querySelector('.media-card__link');
            linkBtn.addEventListener('click', (e) => {
                e.preventDefault();
                openMediaModal(index);
            });
            mediaGrid.appendChild(card);
        });
    }

    renderMedia(fallbackNews);

    // 7. Phone Mask & Validation (+7 (XXX) XXX-XX-XX)
    const phoneInput = document.getElementById('userPhone');

    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.startsWith('9')) {
                value = '7' + value;
            }
            if (value.startsWith('8')) {
                value = '7' + value.slice(1);
            }

            let formatted = '';
            if (value.length > 0) {
                formatted = '+7 ';
            }
            if (value.length > 1) {
                formatted += '(' + value.substring(1, 4);
            }
            if (value.length >= 5) {
                formatted += ') ' + value.substring(4, 7);
            }
            if (value.length >= 8) {
                formatted += '-' + value.substring(7, 9);
            }
            if (value.length >= 10) {
                formatted += '-' + value.substring(9, 11);
            }

            e.target.value = formatted;
        });
    }

    // 8. AJAX Form Submission to mail.php
    const applicationForm = document.getElementById('applicationForm');
    const formMessage = document.getElementById('formMessage');

    if (applicationForm) {
        applicationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const phoneVal = phoneInput ? phoneInput.value.replace(/\D/g, '') : '';
            if (phoneVal.length < 11) {
                if (formMessage) {
                    formMessage.textContent = 'Пожалуйста, введите корректный номер телефона';
                    formMessage.className = 'form__message error';
                }
                return;
            }

            const formData = new FormData(applicationForm);
            
            if (formMessage) {
                formMessage.textContent = 'Отправка заявки...';
                formMessage.className = 'form__message';
            }

            try {
                const response = await fetch('mail.php', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (result.success) {
                    if (formMessage) {
                        formMessage.textContent = 'Спасибо! Ваша заявка успешно отправлена. Мы свяжемся с вами.';
                        formMessage.className = 'form__message success';
                    }
                    applicationForm.reset();
                } else {
                    throw new Error(result.message || 'Ошибка отправки');
                }
            } catch (error) {
                console.warn('Демо-режим отправки формы:', error);
                if (formMessage) {
                    formMessage.textContent = 'Спасибо! Заявка принята в обработку (демо-режим).';
                    formMessage.className = 'form__message success';
                }
                applicationForm.reset();
            }
        });
    }

    // 9. Mobile Carousels for Philosophy & Formula
    function initCarousel(carouselId, trackSelector, prevSelector, nextSelector, dotsSelector = null, autoPlay = true, autoPlayDelay = 4000) {
        const carousel = document.getElementById(carouselId);
        if (!carousel) return;

        const track = carousel.querySelector(trackSelector);
        const prevBtn = carousel.querySelector(prevSelector);
        const nextBtn = carousel.querySelector(nextSelector);
        const dotsContainer = dotsSelector ? carousel.querySelector(dotsSelector) : null;
        const slides = track ? track.children : [];
        const slideCount = slides.length;

        if (slideCount <= 1) {
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            return;
        }

        let currentIndex = 0;
        let autoPlayTimer = null;
        let isUserInteracting = false;

        // Create dots if container exists
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            for (let i = 0; i < slideCount; i++) {
                const dot = document.createElement('button');
                dot.className = i === 0 ? 'philosophy__dot active' : 'philosophy__dot';
                dot.setAttribute('aria-label', `Слайд ${i + 1}`);
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            }
        }

        function updateCarousel() {
            if (!track) return;
            const offset = -currentIndex * 100;
            track.style.transform = `translateX(${offset}%)`;

            // Update dots
            if (dotsContainer) {
                const dots = dotsContainer.querySelectorAll('.philosophy__dot, .formula__dot');
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === currentIndex);
                });
            }
        }

        function goToSlide(index) {
            currentIndex = (index + slideCount) % slideCount;
            updateCarousel();
        }

        function nextSlide() {
            goToSlide(currentIndex + 1);
        }

        function prevSlide() {
            goToSlide(currentIndex - 1);
        }

        function startAutoPlay() {
            if (!autoPlay) return;
            stopAutoPlay();
            autoPlayTimer = setInterval(() => {
                if (!isUserInteracting) {
                    nextSlide();
                }
            }, autoPlayDelay);
        }

        function stopAutoPlay() {
            if (autoPlayTimer) {
                clearInterval(autoPlayTimer);
                autoPlayTimer = null;
            }
        }

        // Event listeners
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                isUserInteracting = true;
                prevSlide();
                stopAutoPlay();
                setTimeout(() => { isUserInteracting = false; startAutoPlay(); }, 1000);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                isUserInteracting = true;
                nextSlide();
                stopAutoPlay();
                setTimeout(() => { isUserInteracting = false; startAutoPlay(); }, 1000);
            });
        }

        // Pause on hover
        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', startAutoPlay);

        // Touch swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoPlay();
        }, { passive: true });

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                isUserInteracting = true;
                if (diff > 0) nextSlide(); else prevSlide();
                setTimeout(() => { isUserInteracting = false; startAutoPlay(); }, 1000);
            } else {
                startAutoPlay();
            }
        }, { passive: true });

        // Resize handler - reinitialize on breakpoint change
        let wasMobile = window.innerWidth <= 768;
        window.addEventListener('resize', () => {
            const isMobile = window.innerWidth <= 768;
            if (wasMobile !== isMobile) {
                wasMobile = isMobile;
                if (isMobile) {
                    startAutoPlay();
                } else {
                    stopAutoPlay();
                }
            }
        });

        // Start autoplay if mobile
        if (window.innerWidth <= 768) {
            startAutoPlay();
        }
    }

    // Initialize carousels
    initCarousel('philosophyCarousel', '.philosophy__track', '.philosophy__arrow--prev', '.philosophy__arrow--next', '.philosophy__dots');
    initCarousel('formulaCarousel', '.formula__track', '.formula__arrow--prev', '.formula__arrow--next', '.formula__dots');

    // Add dots containers to carousels if they don't exist
    function ensureDotsContainer(carouselId, dotsClass) {
        const carousel = document.getElementById(carouselId);
        if (carousel && !carousel.querySelector(`.${dotsClass}`)) {
            const dotsContainer = document.createElement('div');
            dotsContainer.className = dotsClass;
            carousel.appendChild(dotsContainer);
        }
    }

    ensureDotsContainer('philosophyCarousel', 'philosophy__dots');
    ensureDotsContainer('formulaCarousel', 'formula__dots');
});
