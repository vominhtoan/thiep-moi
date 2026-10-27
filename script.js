/* Chỉnh thông tin thiệp tại đây */
var CONFIG = {
  bride: 'Huyền Ni',
  groom: 'Minh Toàn',
  weddingDate: '2027-02-21T09:30:00+07:00',
  venue: 'Nhà hàng tiệc cưới Dự HT',
  address: 'Hòa Tân Đông, Đông Hòa, Phú Yên',
  mapUrl: 'https://maps.app.goo.gl/Xi6sV2UaAH48NKZGA',
  musicFile: 'music/runtoyou.mp3'
};
(function () {
  'use strict';
  function el(id) { return document.getElementById(id); }
  var params = new URLSearchParams(window.location.search);
  var guest = (params.get('to') || 'Quý khách').trim().slice(0, 100) || 'Quý khách';
  ['guestGreeting', 'guestName', 'guestInvite'].forEach(function (id) { el(id).textContent = guest; });
  if (guest !== 'Quý khách') { el('rsvpName').value = guest; el('wishName').value = guest; }
  el('venueName').textContent = CONFIG.venue;
  el('venueAddress').textContent = CONFIG.address;
  el('mapLink').href = CONFIG.mapUrl;
  el('coupleNames').textContent = '';
  el('coupleNames').appendChild(document.createTextNode(CONFIG.bride + ' '));
  var amp = document.createElement('span'); amp.textContent = '&'; el('coupleNames').appendChild(amp);
  el('coupleNames').appendChild(document.createTextNode(' ' + CONFIG.groom));

  var audio = new Audio(CONFIG.musicFile); audio.loop = true; audio.preload = 'none';
  var musicBtn = el('musicBtn');
  function syncMusic() { musicBtn.classList.toggle('playing', !audio.paused); musicBtn.setAttribute('aria-label', audio.paused ? 'Bật nhạc' : 'Tắt nhạc'); }
  function playMusic() { audio.play().then(syncMusic).catch(function () { syncMusic(); musicBtn.title = 'Chạm để bật nhạc (kiểm tra file music/runtoyou.mp3)'; }); }
  musicBtn.addEventListener('click', function () { if (audio.paused) playMusic(); else { audio.pause(); syncMusic(); } });
  audio.addEventListener('pause', syncMusic); audio.addEventListener('play', syncMusic);
  el('openBtn').addEventListener('click', function () { el('opening').classList.add('hidden'); document.body.classList.remove('locked'); playMusic(); });

  var target = new Date(CONFIG.weddingDate).getTime();
  function tick() {
    var remaining = Math.max(0, target - Date.now());
    var days = Math.floor(remaining / 86400000);
    var hours = Math.floor(remaining / 3600000) % 24;
    var minutes = Math.floor(remaining / 60000) % 60;
    var seconds = Math.floor(remaining / 1000) % 60;
    el('days').textContent = String(days); el('hours').textContent = String(hours).padStart(2, '0');
    el('minutes').textContent = String(minutes).padStart(2, '0'); el('seconds').textContent = String(seconds).padStart(2, '0');
    if (remaining === 0) el('countdownMessage').textContent = 'Ngày hạnh phúc đã đến rồi! ♡';
  }
  tick(); setInterval(tick, 1000);

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) { entries.forEach(function (entry) { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }); }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(function (node) { observer.observe(node); });
  } else document.querySelectorAll('.reveal').forEach(function (node) { node.classList.add('visible'); });

  /* Lưu dữ liệu trên trình duyệt để demo; không phải hệ thống nhận RSVP online. */
  el('rsvpForm').addEventListener('submit', function (event) {
    event.preventDefault();
    var record = { name: el('rsvpName').value.trim(), attendance: el('rsvpAttendance').value, message: el('rsvpMessage').value.trim(), date: new Date().toISOString() };
    if (!record.name || !record.attendance) return;
    try { localStorage.setItem('wedding_rsvp_demo', JSON.stringify(record)); el('rsvpStatus').textContent = 'Đã lưu trên thiết bị này ♡ (chưa gửi đến cô dâu chú rể)'; }
    catch (e) { el('rsvpStatus').textContent = 'Trình duyệt không cho phép lưu dữ liệu.'; }
  });
  function getWishes() { try { return JSON.parse(localStorage.getItem('wedding_wishes_demo') || '[]'); } catch (e) { return []; } }
  function renderWishes() {
    el('wishesList').textContent = '';
    getWishes().slice().reverse().forEach(function (wish) {
      var item = document.createElement('div'); item.className = 'wish-item';
      var name = document.createElement('strong'); name.textContent = wish.name;
      var msg = document.createElement('p'); msg.textContent = wish.text;
      var date = document.createElement('small'); date.textContent = wish.date || '';
      item.appendChild(name); item.appendChild(msg); item.appendChild(date); el('wishesList').appendChild(item);
    });
  }
  el('wishForm').addEventListener('submit', function (event) {
    event.preventDefault();
    var name = el('wishName').value.trim(), message = el('wishText').value.trim();
    if (!name || !message) return;
    var wishes = getWishes(); wishes.push({ name: name, text: message, date: new Date().toLocaleDateString('vi-VN') });
    try { localStorage.setItem('wedding_wishes_demo', JSON.stringify(wishes.slice(-30))); el('wishStatus').textContent = 'Đã lưu lời chúc trên thiết bị này ♡'; el('wishText').value = ''; renderWishes(); }
    catch (e) { el('wishStatus').textContent = 'Không thể lưu lời chúc trên thiết bị này.'; }
  });
  renderWishes();
})();
