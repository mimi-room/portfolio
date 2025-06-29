// DOM が読み込まれたらスタート
document.addEventListener('DOMContentLoaded', () => {

  /* ===== ① 画像リストと現在位置 ===== */
  const images = [...document.querySelectorAll('.modal-image')];
  let currentIndex = 0;

  /* ===== ハンバーガーメニューなど既存処理 ===== */
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('main-nav');

  if (hamburger && nav) {
    hamburger.addEventListener('click', () => nav.classList.toggle('active'));
  }

  document.querySelectorAll('#main-nav a').forEach(link =>
    link.addEventListener('click', () => nav.classList.remove('active'))
  );

  const fadeInElements = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  fadeInElements.forEach(el => observer.observe(el));

  /* ===== モーダルの土台を作成 ===== */
  const modal = document.createElement('div');
  Object.assign(modal.style, {
    display: 'none',
    position: 'fixed',
    zIndex: 999,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  });

  const modalImg = document.createElement('img');
  Object.assign(modalImg.style, {
    maxWidth: '90%',
    maxHeight: '90%',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    cursor: 'zoom-out'
  });
  modal.appendChild(modalImg);

  const caption = document.createElement('div');
  Object.assign(caption.style, {
    color: 'white',
    marginTop: '1rem',
    textAlign: 'center',
    fontSize: '1rem'
  });
  modal.appendChild(caption);

  /* ===== ① ←→ ボタンを追加 ===== */
  const prevBtn = document.createElement('button');
  prevBtn.textContent = '←';
  Object.assign(prevBtn.style, {
    position: 'absolute',
    left: '30px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '2rem',
    color: 'white',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    zIndex: 1000
  });
  modal.appendChild(prevBtn);

  const nextBtn = document.createElement('button');
  nextBtn.textContent = '→';
  Object.assign(nextBtn.style, {
    position: 'absolute',
    right: '30px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '2rem',
    color: 'white',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    zIndex: 1000
  });
  modal.appendChild(nextBtn);

  document.body.appendChild(modal);

  /* ===== ② 共通の切り替え関数 ===== */
  function showImageByIndex(index) {
    currentIndex = (index + images.length) % images.length;
    const target = images[currentIndex];
    modalImg.src = target.src;
    caption.textContent = target.dataset.caption || '';
  }

  /* ===== 画像クリックでモーダルを開く ===== */
  images.forEach((img, idx) =>
    img.addEventListener('click', () => {
      modal.style.display = 'flex';
      showImageByIndex(idx);
    })
  );

  /* ===== ③ ボタンクリック操作 ===== */
  prevBtn.addEventListener('click', e => {
    e.stopPropagation();
    showImageByIndex(currentIndex - 1);
  });
  nextBtn.addEventListener('click', e => {
    e.stopPropagation();
    showImageByIndex(currentIndex + 1);
  });

  /* ===== ④ スワイプ操作（スマホ対応） ===== */
  let touchStartX = 0;
  modal.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  });
  modal.addEventListener('touchend', e => {
    const diff = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(diff) > 50) {
      showImageByIndex(currentIndex + (diff < 0 ? 1 : -1));
    }
  });

  /* ← → キーでも切り替え */
  document.addEventListener('keydown', e => {
    if (modal.style.display === 'flex') {
      if (e.key === 'ArrowLeft') showImageByIndex(currentIndex - 1);
      if (e.key === 'ArrowRight') showImageByIndex(currentIndex + 1);
    }
  });

  /* モーダル外側クリックで閉じる */
  modal.addEventListener('click', () => {
    modal.style.display = 'none';
    modalImg.src = '';
    caption.textContent = '';
  });
});

document.body.appendChild(modal);
