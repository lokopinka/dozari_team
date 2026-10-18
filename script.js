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


    // 6. Phone Mask & Validation (+7 (XXX) XXX-XX-XX)
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

    // 7. AJAX Form Submission to mail.php
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

    // Фиксируем размер пилота и hero-сетки после загрузки,
    // чтобы iOS Safari не сжимал картинку при скрытии адресной строки
    const heroLayout = document.querySelector('.hero__layout');
    const heroCenter = document.querySelector('.hero__center');
    const heroButton = document.querySelector('.hero-btn-giant');
    const heroTitle = document.querySelector('.hero__title');
    const MOBILE_HERO_MAX = 1024;
    // Кончик пальца поднятой руки в pilot-cutout.png (доли ширины/высоты изображения)
    const PILOT_HAND_Y = 0.038;
    const PILOT_IMAGE_ASPECT = 5335 / 3557;
    let heroSizeFrozen = false;
    let heroMode = null;
    let heroLockedWidth = 0;
    let heroResizeTimer = null;

    if (heroLayout && heroCenter) {
        const getHeroMode = () => (window.innerWidth <= MOBILE_HERO_MAX ? 'mobile' : 'desktop');

        // Ставим кончик пальца чуть ниже кнопки «Стать пилотом»,
        // чтобы пилот указывал на неё и не перекрывал её
        const alignPilotHandToButton = () => {
            if (!heroButton || getHeroMode() === 'desktop') {
                heroCenter.style.bottom = '';
                return;
            }

            const img = heroCenter.querySelector('img');
            if (!img) return;

            const imgStyle = getComputedStyle(img);
            const matrix = imgStyle.transform.match(/matrix\(([^)]+)\)/);
            const scale = matrix ? parseFloat(matrix[1].split(',')[0]) : 1;
            const originY = parseFloat(imgStyle.transformOrigin.split(' ')[1]) || img.clientHeight;

            const naturalWidth = img.naturalWidth || 5335;
            const naturalHeight = img.naturalHeight || 3557;
            const aspect = naturalWidth && naturalHeight
                ? naturalWidth / naturalHeight
                : PILOT_IMAGE_ASPECT;
            const contentWidth = Math.min(img.clientWidth, img.clientHeight * aspect);
            const contentHeight = contentWidth / aspect;

            // Позиция кончика пальца внутри самого изображения (до scale)
            const handLocalY = (img.clientHeight - contentHeight) + PILOT_HAND_Y * contentHeight;

            const layoutRect = heroLayout.getBoundingClientRect();
            const bottomPx = parseFloat(getComputedStyle(heroCenter).bottom);
            if (!Number.isFinite(bottomPx)) return;

            // Низ контейнера пилота отсчитывается от низа hero-сетки
            const containerTop = layoutRect.bottom - bottomPx - heroCenter.clientHeight;
            const handY = containerTop + img.offsetTop + originY + (handLocalY - originY) * scale;

            const buttonRect = heroButton.getBoundingClientRect();
            const baseGap = window.innerWidth >= 768 ? 24 : 18;
            // На низких экранах (ландшафт телефона) не выпускаем руку за пределы экрана
            const gap = Math.max(0, Math.min(baseGap, window.innerHeight - buttonRect.bottom - 4));
            const delta = (buttonRect.bottom + gap) - handY;

            if (Math.abs(delta) < 0.5) return;
            heroCenter.style.bottom = (bottomPx - delta).toFixed(1) + 'px';
        };

        const lockHeroSize = () => {
            const mode = getHeroMode();
            heroMode = mode;
            heroLockedWidth = window.innerWidth;

            if (mode === 'desktop') {
                heroCenter.style.width = '';
                heroCenter.style.height = '';
                heroCenter.style.bottom = '';
                heroLayout.style.height = 'calc(100vh - 80px)';
                heroLayout.style.minHeight = '';
                if (heroTitle) heroTitle.style.marginBottom = '';
                return true;
            }

            // Сбрасываем прошлые ограничения, чтобы замерить актуальный размер экрана
            heroCenter.style.width = '';
            heroCenter.style.height = '';
            heroLayout.style.height = '';
            heroLayout.style.minHeight = '';
            if (heroTitle) heroTitle.style.marginBottom = '';

            // Читаем размеры после применения CSS (без vh в inline-стилях)
            const pilotRect = heroCenter.getBoundingClientRect();
            const layoutRect = heroLayout.getBoundingClientRect();
            if (!pilotRect.width || !pilotRect.height || !layoutRect.height) return false;

            // Фиксируем пилота в пикселях: размер больше не зависит от vh,
            // поэтому адресная строка Safari не может его сжать
            heroCenter.style.width = Math.round(pilotRect.width) + 'px';
            heroCenter.style.height = Math.round(pilotRect.height) + 'px';

            // Фиксируем высоту hero-сетки, чтобы пилот не смещался при скролле
            heroLayout.style.height = Math.round(layoutRect.height) + 'px';
            heroLayout.style.minHeight = '0px';

            // Фиксируем отступ заголовка (он зависел от vh), чтобы кнопка не сдвигалась
            if (heroTitle) {
                const titleMarginBottom = parseFloat(getComputedStyle(heroTitle).marginBottom);
                if (Number.isFinite(titleMarginBottom)) {
                    heroTitle.style.marginBottom = titleMarginBottom + 'px';
                }
            }

            alignPilotHandToButton();
            return true;
        };

        const freezeHeroSize = () => {
            heroSizeFrozen = lockHeroSize();
        };

        // Замеряем экран на каждом этапе загрузки страницы
        lockHeroSize();
        requestAnimationFrame(() => {
            if (heroSizeFrozen) return;
            lockHeroSize();
            requestAnimationFrame(() => {
                if (!heroSizeFrozen) lockHeroSize();
            });
        });

        window.addEventListener('load', freezeHeroSize, { once: true });

        // При возврате со страницы из bfcache размер нужно зафиксировать заново
        window.addEventListener('pageshow', (event) => {
            if (!event.persisted) return;
            heroSizeFrozen = false;
            freezeHeroSize();
        });

        // После загрузки на мобильных игнорируем resize от адресной строки.
        // На десктопе оставляем прежнее поведение — пересчёт при изменении окна.
        const onHeroResize = () => {
            const mode = getHeroMode();

            // После загрузки игнорируем изменения только высоты (адресная строка iOS).
            // При реальном изменении ширины (поворот) размер пересчитываем.
            if (heroSizeFrozen && mode === 'mobile' && heroMode === 'mobile') {
                if (Math.abs(window.innerWidth - heroLockedWidth) < 2) return;
                heroSizeFrozen = false;
            }
            if (mode !== heroMode) heroSizeFrozen = false;

            clearTimeout(heroResizeTimer);
            heroResizeTimer = setTimeout(() => {
                if (heroSizeFrozen && getHeroMode() === 'mobile') return;
                lockHeroSize();
            }, 140);
        };

        window.addEventListener('resize', onHeroResize, { passive: true });
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', onHeroResize, { passive: true });
        }

        // При повороте экрана ширина реально меняется — пересчитываем размеры
        window.addEventListener('orientationchange', () => {
            heroSizeFrozen = false;
            setTimeout(freezeHeroSize, 350);
        });
    }
});
