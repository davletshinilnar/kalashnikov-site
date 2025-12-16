// Обновление года в футере
document.getElementById('year').textContent = new Date().getFullYear();

// Мобильное меню
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
const closeMobile = document.getElementById('closeMobile');

burger.addEventListener('click', () => {
    mobileMenu.setAttribute('aria-hidden', 'false');
});

closeMobile.addEventListener('click', () => {
    mobileMenu.setAttribute('aria-hidden', 'true');
});

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
        mobileMenu.setAttribute('aria-hidden', 'true');
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
const tracks = Array.from(trackList.children);

// Форматирование времени
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Обновление прогресса
function updateProgress() {
    const percent = (audio.currentTime / audio.duration) * 100;
    progress.value = percent;
    
    timeDisplay.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
}

// Загрузка трека
function loadTrack(index) {
    const track = tracks[index];
    const src = track.dataset.src;
    const title = track.dataset.title;
    
    audio.src = src;
    audio.load();
    
    // Обновить активный трек
    tracks.forEach(t => t.classList.remove('active'));
    track.classList.add('active');
    
    // Обновить заголовок (если есть элемент для этого)
    const titleElement = document.querySelector('.current-track-title');
    if (titleElement) {
        titleElement.textContent = title;
    }
}

// Воспроизведение/пауза
playBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playBtn.textContent = '⏸';
    } else {
        audio.pause();
        playBtn.textContent = '▶︎';
    }
});

// Следующий трек
nextBtn.addEventListener('click', () => {
    currentTrack = (currentTrack + 1) % tracks.length;
    loadTrack(currentTrack);
    audio.play();
    playBtn.textContent = '⏸';
});

// Предыдущий трек
prevBtn.addEventListener('click', () => {
    currentTrack = currentTrack === 0 ? tracks.length - 1 : currentTrack - 1;
    loadTrack(currentTrack);
    audio.play();
    playBtn.textContent = '⏸';
});

// Клик по треку в плейлисте
tracks.forEach((track, index) => {
    track.addEventListener('click', () => {
        currentTrack = index;
        loadTrack(currentTrack);
        audio.play();
        playBtn.textContent = '⏸';
    });
});

// Обновление прогресса
audio.addEventListener('timeupdate', updateProgress);

// Перемотка
progress.addEventListener('input', () => {
    const time = (progress.value / 100) * audio.duration;
    audio.currentTime = time;
});

// Когда трек загружен
audio.addEventListener('loadedmetadata', () => {
    timeDisplay.textContent = `00:00 / ${formatTime(audio.duration)}`;
});

// Когда трек закончился
audio.addEventListener('ended', () => {
    nextBtn.click();
});

// Галерея фото
const galleryImages = document.querySelectorAll('.gallery-grid img');
const viewer = document.getElementById('viewer');
const viewerImg = document.getElementById('viewerImg');
const viewerClose = document.getElementById('viewerClose');
const viewerPrev = document.getElementById('viewerPrev');
const viewerNext = document.getElementById('viewerNext');

let currentImageIndex = 0;

// Открытие просмотрщика
galleryImages.forEach((img, index) => {
    img.addEventListener('click', () => {
        currentImageIndex = index;
        viewerImg.src = img.src;
        viewer.setAttribute('aria-hidden', 'false');
        // Также добавим класс для плавного появления
        viewer.style.opacity = '1';
        viewer.style.visibility = 'visible';
    });
});

// Закрытие просмотрщика
viewerClose.addEventListener('click', () => {
    viewer.setAttribute('aria-hidden', 'true');
    viewer.style.opacity = '0';
    viewer.style.visibility = 'hidden';
});

// Предыдущее фото
viewerPrev.addEventListener('click', () => {
    currentImageIndex = currentImageIndex === 0 ? galleryImages.length - 1 : currentImageIndex - 1;
    viewerImg.src = galleryImages[currentImageIndex].src;
});

// Следующее фото
viewerNext.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    viewerImg.src = galleryImages[currentImageIndex].src;
});

// Закрытие по клику вне изображения
viewer.addEventListener('click', (e) => {
    if (e.target === viewer) {
        viewer.setAttribute('aria-hidden', 'true');
        viewer.style.opacity = '0';
        viewer.style.visibility = 'hidden';
    }
});

// Клавиши для навигации в галерее
document.addEventListener('keydown', (e) => {
    if (viewer.getAttribute('aria-hidden') === 'false') {
        if (e.key === 'Escape') {
            viewer.setAttribute('aria-hidden', 'true');
            viewer.style.opacity = '0';
            viewer.style.visibility = 'hidden';
        } else if (e.key === 'ArrowLeft') {
            viewerPrev.click();
        } else if (e.key === 'ArrowRight') {
            viewerNext.click();
        }
    }
});


// Раскрытие всех треков
const expandTracks = document.getElementById('expandTracks');
if (expandTracks) {
    expandTracks.addEventListener('click', () => {
        const isExpanded = expandTracks.getAttribute('aria-expanded') === 'true';
        expandTracks.setAttribute('aria-expanded', !isExpanded);
        expandTracks.textContent = isExpanded ? '▼ Показать больше' : '▲ Скрыть';
        
        // Здесь можно добавить логику для показа/скрытия треков
        const hiddenTracks = document.querySelectorAll('.track-list li:not(:nth-child(-n+4))');
        hiddenTracks.forEach(track => {
            track.style.display = isExpanded ? 'none' : 'flex';
        });
    });
}

// Слайдер альбомов
const albumsSlider = document.getElementById('albumsSlider');
const slidesRow = document.getElementById('slidesRow');
const albPrev = document.getElementById('albPrev');
const albNext = document.getElementById('albNext');

if (albumsSlider && slidesRow) {
    let slideIndex = 0;
    const slides = slidesRow.querySelectorAll('.slide');
    const slideWidth = slides[0]?.offsetWidth + 20 || 220; // ширина слайда + отступ
    
    function updateSlider() {
        slidesRow.style.transform = `translateX(-${slideIndex * slideWidth}px)`;
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
