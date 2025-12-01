/* Original scripts extracted from uploaded file (if any) */

/* Year */
    document.getElementById('year').textContent = new Date().getFullYear();

    /* Mobile menu open/close */
    const burger = document.getElementById('burger');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMobile = document.getElementById('closeMobile');

    burger.addEventListener('click', () => {
      mobileMenu.style.display = 'block';
      mobileMenu.setAttribute('aria-hidden','false');
    });
    closeMobile.addEventListener('click', () => {
      mobileMenu.style.display = 'none';
      mobileMenu.setAttribute('aria-hidden','true');
    });
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) {
        mobileMenu.style.display = 'none';
        mobileMenu.setAttribute('aria-hidden','true');
      }
    });

    /* Smooth scroll and active link handling (desktop + mobile) */
    document.querySelectorAll('[data-link]').forEach(a=>{
      a.addEventListener('click', (e)=>{
        e.preventDefault();
        const href = a.getAttribute('href');
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({behavior:'smooth',block:'start'});
        document.querySelectorAll('[data-link]').forEach(x=>x.classList.remove('active'));
        a.classList.add('active');
        // also update desktop topnav
        document.querySelectorAll('nav.topnav a').forEach(x=>x.classList.remove('active'));
        const top = document.querySelector(`nav.topnav a[href="${href}"]`);
        if (top) top.classList.add('active');
        if (mobileMenu.style.display === 'block') mobileMenu.style.display = 'none';
      });
    });

    /* Albums slider logic */
    (function(){
      const slider = document.getElementById('albumsSlider');
      const slidesRow = document.getElementById('slidesRow');
      const prev = document.getElementById('albPrev');
      const next = document.getElementById('albNext');
      let idx = 0;

      function update() {
        const slide = slider.querySelector('.slide');
        if (!slide) return;
        const gap = 14;
        const w = slide.offsetWidth + gap;
        slidesRow.style.transform = `translateX(${-idx * w}px)`;
      }
      prev.addEventListener('click', ()=>{
        idx = Math.max(0, idx - 1);
        update();
      });
      next.addEventListener('click', ()=>{
        const max = slidesRow.children.length - Math.floor((slider.offsetWidth) / (slider.querySelector('.slide').offsetWidth + 14));
        idx = Math.min(max, idx + 1);
        update();
      });
      window.addEventListener('resize', update);
      // initial
      setTimeout(update, 100);
    })();

    /* Audio player */
    (function(){
      const audio = document.getElementById('audioNative');
      const playBtn = document.getElementById('playBtn');
      const prevBtn = document.getElementById('prevBtn');
      const nextBtn = document.getElementById('nextBtn');
      const progress = document.getElementById('progress');
      const timeLabel = document.getElementById('time');
      const trackEls = Array.from(document.querySelectorAll('#trackList li'));

      let current = 0;

      function setTrack(i, autoplay=false){
        if (i < 0) i = trackEls.length - 1;
        if (i >= trackEls.length) i = 0;
        current = i;
        trackEls.forEach(t=>t.classList.remove('active'));
        const el = trackEls[current];
        el.classList.add('active');
        audio.src = el.dataset.src;
        audio.load();
        if (autoplay) audio.play().catch(()=>{});
        updatePlayBtn(!audio.paused && !audio.ended);
      }

      function updatePlayBtn(isPlaying){
        playBtn.textContent = isPlaying ? '⏸' : '▶︎';
        if (isPlaying) playBtn.classList.add('primary'); else playBtn.classList.remove('primary');
      }

      // init first
      setTrack(0,false);

      playBtn.addEventListener('click', ()=>{
        if (audio.paused) audio.play(); else audio.pause();
      });
      audio.addEventListener('play', ()=>updatePlayBtn(true));
      audio.addEventListener('pause', ()=>updatePlayBtn(false));

      prevBtn.addEventListener('click', ()=>setTrack(current - 1, true));
      nextBtn.addEventListener('click', ()=>setTrack(current + 1, true));

      trackEls.forEach((t, i)=> t.addEventListener('click', ()=> setTrack(i, true)));

      audio.addEventListener('timeupdate', ()=>{
        if (audio.duration) {
          const pct = (audio.currentTime / audio.duration) * 100;
          progress.value = pct;
          updateTime();
        }
      });
      progress.addEventListener('input', (e)=>{
        if (audio.duration) audio.currentTime = (e.target.value / 100) * audio.duration;
      });
      audio.addEventListener('ended', ()=> setTrack(current + 1, true));

      function updateTime(){
        const fmt = (s)=>{
          if (!s || isNaN(s)) return '00:00';
          const m = Math.floor(s/60), sec = Math.floor(s%60);
          return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
        };
        timeLabel.textContent = `${fmt(audio.currentTime)} / ${fmt(audio.duration)}`;
      }
      audio.addEventListener('loadedmetadata', updateTime);
      // keyboard accessibility
      document.addEventListener('keydown', (e)=>{
        if (e.code === 'Space' && document.activeElement.tagName !== 'INPUT') {
          e.preventDefault();
          if (audio.paused) audio.play(); else audio.pause();
        }
        if (e.code === 'ArrowRight') audio.currentTime = Math.min(audio.duration||0, audio.currentTime + 5);
        if (e.code === 'ArrowLeft') audio.currentTime = Math.max(0, audio.currentTime - 5);
      });
    })();

/* Additional scripts for accordion and viewer */

/* ===== Audio accordion behavior ===== */
document.addEventListener('DOMContentLoaded', function(){
  let tracks = Array.from(document.querySelectorAll('#trackList li'));
  if(tracks.length === 0){
    tracks = Array.from(document.querySelectorAll('.audio-list li, .track-list li'));
  }
  tracks.forEach((li,i)=>{
    li.classList.remove('track-hidden','track-visible');
    if(i >= 3) li.classList.add('track-hidden');
    else li.classList.add('track-visible');
  });

  const expandBtn = document.getElementById('expandTracks');
  if(expandBtn){
    expandBtn.addEventListener('click', function(){
      const isExpanded = expandBtn.getAttribute('aria-expanded') === 'true';
      tracks.forEach((li,i)=>{
        if(i >= 3){
          if(isExpanded){
            li.classList.remove('track-visible');
            li.classList.add('track-hidden');
          } else {
            li.classList.remove('track-hidden');
            li.classList.add('track-visible');
          }
        }
      });
      expandBtn.setAttribute('aria-expanded', String(!isExpanded));
      expandBtn.textContent = isExpanded ? '▼ Показать больше' : '▲ Показать меньше';
    });
  }

  /* ===== Fullscreen gallery viewer ===== */
  const galleryImgs = Array.from(document.querySelectorAll('#photos img, .gallery img, .gallery-grid img'));
  const viewer = document.getElementById('viewer');
  const viewerImg = document.getElementById('viewerImg');
  const prevBtn = document.getElementById('viewerPrev');
  const nextBtn = document.getElementById('viewerNext');
  const closeBtn = document.getElementById('viewerClose');
  let idx = 0;

  function openViewer(i){
    idx = i;
    viewerImg.src = galleryImgs[i].src;
    viewer.classList.add('active');
    viewer.setAttribute('aria-hidden','false');
  }
  function closeViewer(){
    viewer.classList.remove('active');
    viewer.setAttribute('aria-hidden','true');
  }
  function showNext(n){
    idx = (idx + n + galleryImgs.length) % galleryImgs.length;
    viewerImg.src = galleryImgs[idx].src;
  }

  galleryImgs.forEach((img, i)=>{
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', ()=> openViewer(i));
    let touchStartX = 0;
    img.addEventListener('touchstart', function(e){ touchStartX = e.changedTouches[0].screenX; }, {passive:true});
    img.addEventListener('touchend', function(e){
      const dx = e.changedTouches[0].screenX - touchStartX;
      if(Math.abs(dx) > 40){
        if(dx < 0) openViewer((i+1)%galleryImgs.length); else openViewer((i-1+galleryImgs.length)%galleryImgs.length);
      }
    }, {passive:true});
  });

  if(prevBtn) prevBtn.addEventListener('click', ()=> showNext(-1));
  if(nextBtn) nextBtn.addEventListener('click', ()=> showNext(1));
  if(closeBtn) closeBtn.addEventListener('click', closeViewer);

  document.addEventListener('keydown', function(e){
    if(!viewer.classList.contains('active')) return;
    if(e.key === 'ArrowRight') showNext(1);
    if(e.key === 'ArrowLeft') showNext(-1);
    if(e.key === 'Escape') closeViewer();
  });

  viewer.addEventListener('click', function(e){
    if(e.target === viewer) closeViewer();
  });
});
