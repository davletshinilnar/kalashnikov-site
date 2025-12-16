// Обновление года в футере
document.getElementById('year').textContent = new Date().getFullYear();

// Мобильное меню
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
const closeMobile = document.getElementById('closeMobile');

if (burger && mobileMenu && closeMobile) {
    burger.addEventListener('click', () => {
        mobileMenu.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Предотвращаем скролл при открытом меню
    });

    closeMobile.addEventListener('click', () => {
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Восстанавливаем скролл
    });

    // Закрытие меню при клике вне его
    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            mobileMenu.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    });
}

// Навигация по ссылкам
document.querySelectorAll('[data-link]').forEach(link => {
    link.addEventListener('click', (e) => {
        // Убрать активный класс со всех ссылок
        document.querySelectorAll('[data-link]').forEach(l => {
            l.classList.remove('active');
        });
        
        // Добавить активный класс текущей ссылке
        e.target.classList.add('active');
        
        // Закрыть мобильное меню
        if (mobileMenu) {
            mobileMenu.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    });
});

// Аудиоплеер
const audio = document.getElementById('audioNative');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progress = document.getElementById('progress');
const timeDisplay = document.getElementById('time');
const trackList = document.getElementById('trackList');

let currentTrack = 0;
const tracks = trackList ? Array.from(trackList.children) : [];

// Форматирование времени
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Обновление прогресса
function updateProgress() {
    if (audio && progress && timeDisplay && audio.duration) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progress.value = percent || 0;
        
        timeDisplay.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
    }
}

// Загрузка трека
function loadTrack(index) {
    if (!tracks[index] || !audio) return;
    
    const track = tracks[index];
    const src = track.dataset.src;
    
    if (!src) return;
    
    audio.src = src;
    audio.load();
    
    // Обновить активный трек
    tracks.forEach(t => t.classList.remove('active'));
    track.classList.add('active');
}

// Воспроизведение/пауза
if (playBtn && audio) {
    playBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().catch(e => console.log('Ошибка воспроизведения:', e));
            playBtn.textContent = '⏸';
        } else {
            audio.pause();
            playBtn.textContent = '▶︎';
        }
    });
}

// Следующий трек
if (nextBtn && tracks.length > 0 && audio) {
    nextBtn.addEventListener('click', () => {
        currentTrack = (currentTrack + 1) % tracks.length;
        loadTrack(currentTrack);
        audio.play().catch(e => console.log('Ошибка воспроизведения:', e));
        playBtn.textContent = '⏸';
    });
}

// Предыдущий трек
if (prevBtn && tracks.length > 0 && audio) {
    prevBtn.addEventListener('click', () => {
        currentTrack = currentTrack === 0 ? tracks.length - 1 : currentTrack - 1;
        loadTrack(currentTrack);
        audio.play().catch(e => console.log('Ошибка воспроизведения:', e));
        playBtn.textContent = '⏸';
    });
}

// Клик по треку в плейлисте
if (trackList) {
    tracks.forEach((track, index) => {
        track.addEventListener('click', () => {
            currentTrack = index;
            loadTrack(currentTrack);
            audio.play().catch(e => console.log('Ошибка воспроизведения:', e));
            playBtn.textContent = '⏸';
        });
    });
}

// Обновление прогресса
if (audio) {
    audio.addEventListener('timeupdate', updateProgress);
}

// Перемотка
if (progress && audio) {
    progress.addEventListener('input', () => {
        if (audio.duration) {
            const time = (progress.value / 100) * audio.duration;
            audio.currentTime = time;
        }
    });
}

// Когда трек загружен
if (audio) {
    audio.addEventListener('loadedmetadata', () => {
        if (timeDisplay) {
            timeDisplay.textContent = `00:00 / ${formatTime(audio.duration)}`;
        }
    });
}

// Когда трек закончился
if (audio) {
    audio.addEventListener('ended', () => {
        if (nextBtn) {
            nextBtn.click();
        }
    });
}

// Галерея фото - ИСПРАВЛЕНО
const galleryImages = document.querySelectorAll('.gallery-grid img');
const viewer = document.getElementById('viewer');
const viewerImg = document.getElementById('viewerImg');
const viewerClose = document.getElementById('viewerClose');
const viewerPrev = document.getElementById('viewerPrev');
const viewerNext = document.getElementById('viewerNext');

let currentImageIndex = 0;

console.log('Найдено изображений:', galleryImages.length);
console.log('Просмотрщик:', viewer);

// Открытие просмотрщика
if (galleryImages.length > 0 && viewer && viewerImg) {
    galleryImages.forEach((img, index) => {
        img.addEventListener('click', (e) => {
            console.log('Клик по изображению', index);
            e.preventDefault();
            currentImageIndex = index;
            viewerImg.src = img.src;
            viewer.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Предотвращаем скролл
        });
    });
}

// Закрытие просмотрщика
if (viewerClose && viewer) {
    viewerClose.addEventListener('click', (e) => {
        e.preventDefault();
        viewer.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Восстанавливаем скролл
    });
}

// Предыдущее фото
if (viewerPrev && galleryImages.length > 0 && viewerImg) {
    viewerPrev.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        currentImageIndex = currentImageIndex === 0 ? galleryImages.length - 1 : currentImageIndex - 1;
        viewerImg.src = galleryImages[currentImageIndex].src;
    });
}

// Следующее фото
if (viewerNext && galleryImages.length > 0 && viewerImg) {
    viewerNext.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        viewerImg.src = galleryImages[currentImageIndex].src;
    });
}

// Закрытие по клику вне изображения
if (viewer) {
    viewer.addEventListener('click', (e) => {
        if (e.target === viewer) {
            viewer.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    });
}

// Клавиши для навигации в галерее
document.addEventListener('keydown', (e) => {
    if (viewer && viewer.getAttribute('aria-hidden') === 'false') {
        if (e.key === 'Escape') {
            viewer.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        } else if (e.key === 'ArrowLeft') {
            if (viewerPrev) viewerPrev.click();
        } else if (e.key === 'ArrowRight') {
            if (viewerNext) viewerNext.click();
        }
    }
});

// Раскрытие всех треков
const expandTracks = document.getElementById('expandTracks');
if (expandTracks && trackList) {
    // Скрыть треки по умолчанию (оставить только первые 3)
    const allTracks = Array.from(trackList.children);
    if (allTracks.length > 3) {
        for (let i = 3; i < allTracks.length; i++) {
            allTracks[i].style.display = 'none';
        }
    }
    
    expandTracks.addEventListener('click', () => {
        const isExpanded = expandTracks.getAttribute('aria-expanded') === 'true';
        expandTracks.setAttribute('aria-expanded', !isExpanded);
        expandTracks.innerHTML = isExpanded ? '▼ Показать больше' : '▲ Скрыть';
        
        // Показать/скрыть треки
        for (let i = 3; i < allTracks.length; i++) {
            allTracks[i].style.display = isExpanded ? 'none' : 'flex';
        }
    });
}

// Слайдер альбомов
const albumsSlider = document.getElementById('albumsSlider');
const slidesRow = document.getElementById('slidesRow');
const albPrev = document.getElementById('albPrev');
const albNext = document.getElementById('albNext');

if (albumsSlider && slidesRow && albPrev && albNext) {
    let slideIndex = 0;
    const slides = slidesRow.querySelectorAll('.slide');
    const slideWidth = slides[0] ? slides[0].offsetWidth + 20 : 220;
    
    function updateSlider() {
        if (slidesRow) {
            slidesRow.style.transform = `translateX(-${slideIndex * slideWidth}px)`;
        }
    }
    
    albNext.addEventListener('click', () => {
        if (slideIndex < slides.length - 1) {
            slideIndex++;
            updateSlider();
        }
    });
    
    albPrev.addEventListener('click', () => {
        if (slideIndex > 0) {
            slideIndex--;
            updateSlider();
        }
    });
}

// Обработка ошибок загрузки изображений
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            console.log('Ошибка загрузки изображения:', this.src);
            // Можно добавить placeholder
            this.style.backgroundColor = '#ddd';
            this.alt = 'Изображение недоступно';
        });
    });
});
