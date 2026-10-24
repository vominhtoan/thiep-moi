// CHỈNH THÔNG TIN THIỆP TẠI ĐÂY
var CONFIG = {
    bride: 'Huyền Ni',
    groom: 'Minh Toàn',
    weddingDate: '2027-02-21T09:30:00+07:00',
    venue: 'Nhà hàng tiệc cưới Dự HT',
    address: 'Hòa Tân Đông, Đông Hòa, Phú Yên',
    mapUrl: 'https://maps.app.goo.gl/Xi6sV2UaAH48NKZGA',
    musicFile: 'music/runtoyou.mp3'
};
(function(){
    var params = new URLSearchParams(window.location.search);
    var guest = (params.get('to') || 'Quý khách').trim().slice(0,100);
    // textContent ngăn việc chèn HTML qua tham số trên URL
    document.getElementById('guestGreeting').textContent = guest;
    document.getElementById('guestName').textContent = guest;
    document.getElementById('rsvpName').value = guest === 'Quý khách' ? '' : guest;
    document.getElementById('coupleNames').innerHTML = '';
    document.getElementById('coupleNames').appendChild(document.createTextNode(CONFIG.bride + ' '));
    var amp = document.createElement('span'); amp.textContent = '&';
    document.getElementById('coupleNames').appendChild(amp);
    document.getElementById('coupleNames').appendChild(document.createTextNode(' ' + CONFIG.groom));
    document.querySelector('.venue-card h3').textContent = CONFIG.venue;
    document.querySelector('.venue-card p').textContent = CONFIG.address;
    document.getElementById('mapLink').href = CONFIG.mapUrl;
    var audio = new Audio(CONFIG.musicFile); audio.loop = true;
    var musicBtn = document.getElementById('musicBtn');
    function playMusic(){audio.play().then(function(){musicBtn.classList.add('playing');}).catch(function(){musicBtn.title='Chưa có file nhạc hoặc trình duyệt chặn phát nhạc';});}
    musicBtn.addEventListener('click',function(){if(audio.paused){playMusic();}else{audio.pause();musicBtn.classList.remove('playing');}});
    document.getElementById('openBtn').addEventListener('click',function(){document.getElementById('opening').classList.add('hidden');playMusic();});
    function countdown(){var diff = new Date(CONFIG.weddingDate).getTime()-Date.now();if(diff<=0){diff=0;document.getElementById('countdownMessage').textContent='Ngày vui đã đến rồi! ♡';}var units=[Math.floor(diff/86400000),Math.floor(diff/3600000)%24,Math.floor(diff/60000)%60,Math.floor(diff/1000)%60];['days','hours','minutes','seconds'].forEach(function(id,i){document.getElementById(id).textContent=String(units[i]).padStart(2,'0');});}
    countdown();setInterval(countdown,1000);
    var attend=document.getElementById('attending');var guests=document.getElementById('guests');attend.addEventListener('change',function(){guests.disabled=attend.value==='Không';});
    document.getElementById('rsvpForm').addEventListener('submit',function(e){e.preventDefault();var data={name:document.getElementById('rsvpName').value.trim(),attending:attend.value,guests:attend.value==='Không'?0:Number(guests.value),message:this.elements.message.value.trim(),createdAt:new Date().toISOString()};try{localStorage.setItem('wedding_rsvp',JSON.stringify(data));document.getElementById('formStatus').textContent='Đã lưu xác nhận trên trình duyệt này (bản demo).';}catch(err){document.getElementById('formStatus').textContent='Không thể lưu trên trình duyệt này.';}});
    var wishList=document.getElementById('wishList');function renderWishes(){wishList.innerHTML='';var arr=[];try{arr=JSON.parse(localStorage.getItem('wedding_wishes')||'[]');if(!Array.isArray(arr))arr=[];}catch(err){}arr.slice().reverse().forEach(function(w){var div=document.createElement('div');div.className='wish';var strong=document.createElement('strong');strong.textContent=w.name;var p=document.createElement('p');p.textContent=w.text;div.appendChild(strong);div.appendChild(p);wishList.appendChild(div);});}
    document.getElementById('wishForm').addEventListener('submit',function(e){e.preventDefault();var arr=[];try{arr=JSON.parse(localStorage.getItem('wedding_wishes')||'[]');if(!Array.isArray(arr))arr=[];arr.push({name:document.getElementById('wishName').value.trim(),text:document.getElementById('wishText').value.trim()});localStorage.setItem('wedding_wishes',JSON.stringify(arr.slice(-50)));this.reset();renderWishes();}catch(err){alert('Trình duyệt không cho phép lưu lời chúc.');}});
    renderWishes();
})();
