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
        let scrollTicking = false;
        window.addEventListener('scroll', () => {
            if (scrollTicking) return;
            scrollTicking = true;
            window.requestAnimationFrame(() => {
                scrollToTopBtn.classList.toggle('show', window.scrollY > 400);
                scrollTicking = false;
            });
        }, { passive: true });

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

    if (slides.length > 1) {
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

    // 8. Video Gallery — green play/pause + custom progress
    const videoFrame = document.getElementById('videoFrame');
    const videoPlayer = document.getElementById('videoPlayer');
    const videoPlayBtn = document.getElementById('videoPlayBtn');
    const videoProgress = document.getElementById('videoProgress');
    const videoProgressFill = document.getElementById('videoProgressFill');
    const videoTime = document.getElementById('videoTime');
    const videoThumbs = document.querySelectorAll('.video-gallery__thumb');

    if (videoFrame && videoPlayer && videoPlayBtn) {
        // Pause control disappears 0.5s after playback starts,
        // and reappears briefly on user activity (mouse move, tap, key press)
        const PAUSE_BTN_HIDE_DELAY = 500;
        let pauseBtnHideTimer = null;

        const clearPauseBtnTimer = () => {
            if (pauseBtnHideTimer) {
                clearTimeout(pauseBtnHideTimer);
                pauseBtnHideTimer = null;
            }
        };

        const showPauseBtn = () => {
            videoFrame.classList.remove('is-idle');
            clearPauseBtnTimer();
            if (videoFrame.classList.contains('playing')) {
                pauseBtnHideTimer = setTimeout(() => {
                    videoFrame.classList.add('is-idle');
                }, PAUSE_BTN_HIDE_DELAY);
            }
        };

        const setPlayingState = (playing) => {
            videoFrame.classList.toggle('playing', playing);
            videoPlayBtn.setAttribute('aria-pressed', String(playing));
            videoPlayBtn.setAttribute('aria-label', playing ? 'Поставить видео на паузу' : 'Воспроизвести видео');
            if (playing) {
                showPauseBtn();
            } else {
                clearPauseBtnTimer();
                videoFrame.classList.remove('is-idle');
            }
        };

        const togglePlayPause = () => {
            if (videoPlayer.paused || videoPlayer.ended) {
                if (videoPlayer.ended) {
                    videoPlayer.currentTime = 0;
                }
                const playPromise = videoPlayer.play();
                if (playPromise && typeof playPromise.catch === 'function') {
                    playPromise.catch(() => {
                        // Autoplay was prevented — keep the custom controls usable
                        setPlayingState(false);
                    });
                }
            } else {
                videoPlayer.pause();
            }
        };

        // Green center button — works on desktop and mobile
        videoPlayBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePlayPause();
        });

        videoPlayer.addEventListener('play', () => setPlayingState(true));
        videoPlayer.addEventListener('pause', () => setPlayingState(false));
        videoPlayer.addEventListener('ended', () => {
            setPlayingState(false);
            updateProgress();
        });

        const formatTime = (seconds) => {
            if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
            const minutes = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${minutes}:${String(secs).padStart(2, '0')}`;
        };

        const updateProgress = () => {
            const duration = videoPlayer.duration;
            if (!Number.isFinite(duration) || duration <= 0) {
                if (videoProgressFill) videoProgressFill.style.width = '0%';
                if (videoTime) videoTime.textContent = '0:00 / 0:00';
                return;
            }
            const ratio = Math.min(1, Math.max(0, videoPlayer.currentTime / duration));
            if (videoProgressFill) videoProgressFill.style.width = `${ratio * 100}%`;
            if (videoProgress) videoProgress.setAttribute('aria-valuenow', String(Math.round(ratio * 100)));
            if (videoTime) {
                videoTime.textContent = `${formatTime(videoPlayer.currentTime)} / ${formatTime(duration)}`;
            }
        };

        videoPlayer.addEventListener('timeupdate', updateProgress);
        videoPlayer.addEventListener('loadedmetadata', updateProgress);

        // Progress bar — click/tap/drag to seek
        if (videoProgress) {
            const seekFromEvent = (event) => {
                const rect = videoProgress.getBoundingClientRect();
                if (rect.width <= 0) return;
                const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
                if (Number.isFinite(videoPlayer.duration) && videoPlayer.duration > 0) {
                    videoPlayer.currentTime = ratio * videoPlayer.duration;
                    updateProgress();
                }
            };

            let isSeeking = false;
            videoProgress.addEventListener('pointerdown', (e) => {
                isSeeking = true;
                videoProgress.setPointerCapture?.(e.pointerId);
                seekFromEvent(e);
            });
            videoProgress.addEventListener('pointermove', (e) => {
                if (isSeeking) seekFromEvent(e);
            });
            const stopSeeking = (e) => {
                if (!isSeeking) return;
                isSeeking = false;
                videoProgress.releasePointerCapture?.(e.pointerId);
            };
            videoProgress.addEventListener('pointerup', stopSeeking);
            videoProgress.addEventListener('pointercancel', stopSeeking);

            videoProgress.addEventListener('keydown', (e) => {
                if (!Number.isFinite(videoPlayer.duration)) return;
                if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                    e.preventDefault();
                    const step = e.key === 'ArrowRight' ? 5 : -5;
                    videoPlayer.currentTime = Math.min(
                        videoPlayer.duration,
                        Math.max(0, videoPlayer.currentTime + step)
                    );
                    updateProgress();
                }
            });
        }

        // Click/tap anywhere on the video frame (except controls) toggles playback
        videoFrame.addEventListener('click', (e) => {
            if (e.target.closest('.video-gallery__controls')) return;
            if (e.target === videoPlayBtn || videoPlayBtn.contains(e.target)) return;
            togglePlayPause();
        });

        // Any activity brings the hidden pause control back for another 0.5s
        ['pointermove', 'pointerdown', 'keydown'].forEach((type) => {
            videoFrame.addEventListener(type, (e) => {
                if (!videoFrame.classList.contains('playing')) return;
                if (e.target.closest && e.target.closest('.video-gallery__controls')) return;
                showPauseBtn();
            }, { passive: true });
        });
    }

    // Thumbnail click handling (for future: could swap video source)
    videoThumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
            videoThumbs.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            // Could swap video source here if needed:
            // const newSrc = thumb.dataset.src;
            // if (newSrc && newSrc !== videoPlayer.src) { videoPlayer.src = newSrc; videoPlayer.load(); }
        });
    });
});
