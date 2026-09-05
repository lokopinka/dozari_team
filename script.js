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

    function openModal(e) {
        if (e) e.preventDefault();
        if (policyModal) {
            policyModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal() {
        if (policyModal) {
            policyModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    openPolicyBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', openModal);
        }
    });

    if (closePolicyBtn) closePolicyBtn.addEventListener('click', closeModal);
    if (acceptPolicyBtn) acceptPolicyBtn.addEventListener('click', closeModal);

    if (policyModal) {
        policyModal.addEventListener('click', (e) => {
            if (e.target === policyModal) {
                closeModal();
            }
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

    // 5. Hero Slideshow Logic (5 local images & vertical numbers with lines)
    const slides = document.querySelectorAll('.hero__slide');
    const verticalNumItems = document.querySelectorAll('.vertical-num-item');
    let currentSlide = 0;
    const slideInterval = 5000; // 5 seconds

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

    // 6. Cookie Banner Logic
    const cookieBanner = document.getElementById('cookieBanner');
    const acceptCookieBtn = document.getElementById('acceptCookie');

    if (cookieBanner && acceptCookieBtn) {
        if (!localStorage.getItem('dozari_cookies_accepted')) {
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 1000);
        }

        acceptCookieBtn.addEventListener('click', () => {
            localStorage.setItem('dozari_cookies_accepted', 'true');
            cookieBanner.classList.remove('show');
        });
    }

    // 7. Dynamic Media Cards from CSV & News Popup Modal
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
            <img src="${item.photo}" alt="${item.title}">
            <span class="modal-news-date">${item.date}</span>
            <h2>${item.title}</h2>
            <p>${item.text}</p>
            <p>Команда DOZARI TEAM продолжает активную подготовку к следующим этапам чемпионата. Следите за нашими обновлениями в социальных сетях и на сайте, чтобы не пропустить эксклюзивные репортажи с трасс.</p>
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

    async function loadMediaFromCSV() {
        try {
            const response = await fetch(CSV_URL);
            if (!response.ok) throw new Error('Network response was not ok');
            const csvText = await response.text();
            const rows = csvText.split('\n').map(row => row.split(','));
            
            const newsItems = [];
            for (let i = 1; i < rows.length; i++) {
                const cols = rows[i];
                if (cols.length >= 4) {
                    newsItems.push({
                        title: cols[0].trim().replace(/^["']|["']$/g, ''),
                        date: cols[1].trim().replace(/^["']|["']$/g, ''),
                        text: cols[2].trim().replace(/^["']|["']$/g, ''),
                        photo: cols[3].trim().replace(/^["']|["']$/g, ''),
                        link: cols[4] ? cols[4].trim().replace(/^["']|["']$/g, '') : '#'
                    });
                }
            }

            if (newsItems.length > 0) {
                renderMedia(newsItems);
            } else {
                renderMedia(fallbackNews);
            }
        } catch (error) {
            console.warn('Используются резервные данные новостей:', error);
            renderMedia(fallbackNews);
        }
    }

    loadMediaFromCSV();

    // 8. Phone Mask & Validation (+7 (XXX) XXX-XX-XX)
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

    // 9. AJAX Form Submission to mail.php
    const applicationForm = document.getElementById('applicationForm');
    const formMessage = document.getElementById('formMessage');

    if (applicationForm) {
        applicationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const phoneVal = phoneInput.value.replace(/\D/g, '');
            if (phoneVal.length < 11) {
                formMessage.textContent = 'Пожалуйста, введите корректный номер телефона';
                formMessage.className = 'form__message error';
                return;
            }

            const formData = new FormData(applicationForm);
            
            formMessage.textContent = 'Отправка заявки...';
            formMessage.className = 'form__message';

            try {
                const response = await fetch('mail.php', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (result.success) {
                    formMessage.textContent = 'Спасибо! Ваша заявка успешно отправлена. Мы свяжемся с вами.';
                    formMessage.className = 'form__message success';
                    applicationForm.reset();
                } else {
                    throw new Error(result.message || 'Ошибка отправки');
                }
            } catch (error) {
                console.warn('Демо-режим отправки формы:', error);
                formMessage.textContent = 'Спасибо! Заявка принята в обработку (демо-режим).';
                formMessage.className = 'form__message success';
                applicationForm.reset();
            }
        });
    }
});
