const modes ={
    pomodoro: 25,
    short: 5,
    long: 15,
};
let currentMode = "pomodoro";
let pomoCount = 0;

//Cài đặt biến (Của hàm handleTimerEnd)
let settings = {
    autoStartBreaks: false,
    autoStartPomodoro: false,
    longBreakInterval: 4 //Đếm số lần đến lần nghỉ dài tiếp theo 
};

const startBtn = document.getElementById("start");
const resetBtn = document.getElementById("reset");
const timerEl = document.getElementById("timer");



let timeLeft = modes[currentMode] * 60; 
let interval = null; // Quan trọng: Khởi tạo là null để biết đồng hồ đang không chạy

const updateTimer = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerEl.innerHTML = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    // Hiển thị số không trước số phút và giây nếu nó chỉ còn một đơn vị - dùng padStart vì nó chỉ sử dụng được cho String
}

// Hàm kiểm tra trạng thái để quyết định Chạy hay Dừng
const toggleTimer = () => {
    if (interval === null) {
        startTimer();
    } else {

        stopTimer();
    }
}

const startTimer = () => {
    if(interval !== null) return; 
    startBtn.innerHTML = "Pause"
    interval = setInterval(() => {
        timeLeft--; 
        updateTimer();
        if (timeLeft === 0) {
            clearInterval(interval);
            interval = null;
            // SỬA: Gọi hàm handleTimerEnd thay vì alert
            handleTimerEnd();
        }
    }, 1000);

    startBtn.innerHTML = "Pause"; 
}

const stopTimer = () => {

    clearInterval(interval);
    
    interval = null;

    startBtn.innerHTML = "Start";
}

const resetTimer = () => {
    stopTimer();

    timeLeft = modes[currentMode] * 60;
    updateTimer();
    
    startBtn.innerHTML = "Start";
}
function switchMode(mode){
    currentMode = mode;
    document.querySelectorAll('.btn').forEach(btn => btn.classList.remove('active')); // SỬA: class của bạn là .btn
    document.getElementById(`btn-${mode}`).classList.add('active');

    resetTimer();
}
function handleTimerEnd(){
    let nextMode = ''; //Xác định mode tiếp theo 
    let ShouldAutoStart = false;
    if(currentMode === 'pomodoro'){
        pomoCount++; 
        console.log(`Pomo count: ${pomoCount}`);
        if(pomoCount % settings.longBreakInterval === 0){
            nextMode = 'long';
        }else{
            nextMode = 'short';
        }
        ShouldAutoStart = settings.autoStartBreaks; //Kiểm tra xem cài đặt có đang tự động nghỉ hay không? 
    }else{
        //-> Nếu vừa nghỉ xong thì chuyển về Pomo, không thì bỏ qua và cho nghỉ
        nextMode = 'pomodoro';
        ShouldAutoStart = settings.autoStartPomodoro;
    }
    //Sau khi chạy xét hết các điều kiện thì chuyển mode
    switchMode(nextMode);



    if(ShouldAutoStart){
        startTimer();
    }else{
        alert("Timer ended. Click start to begin next session.");
        startBtn.innerHTML = "Start"; // Reset nút
    }
}
//Xử lý các phân từ điều khiển
startBtn.addEventListener("click", toggleTimer);
resetBtn.addEventListener("click", resetTimer);
//Xử lý các phẩn tử chuyển chế độ 
document.getElementById('btn-pomodoro').addEventListener('click', () => switchMode('pomodoro'));
document.getElementById('btn-short').addEventListener('click', () => switchMode('short'));
document.getElementById('btn-long').addEventListener('click', () => switchMode('long'));
//Khai báo các biến chức năng và Xử lý các phần tử của HandleTimerEnd
const toggleAutoBreak = document.getElementById("auto-start-breaks");
const toggleAutoPomo = document.getElementById("auto-start-pomodoro");
const InputInterVal = document.getElementById("long-breaks-interval")

// Các biến Logic của Setting Overlay
const  overlay = document.querySelector(".setting-overlay");
const  closeBtn = document.querySelector(".close-btn");
const  settingBtn = document.getElementById("setting");

function openOverlay() {
    if(overlay){
        overlay.classList.add("active");
    }
}

function closeOverlay() {
    if(overlay){
    overlay.classList.remove("active");
    }
}
window.onclick = function(event){
    if(event.target === overlay){
        closeOverlay();
    }
}
function updateSettings(){
    modes.pomodoro = parseInt(document.getElementById("setting-pomodoro").value) || 25;
    modes.short = parseInt(document.getElementById("setting-short").value) || 5;
    modes.long = parseInt(document.getElementById("setting-long").value) || 15;

    settings.autoStartBreaks = toggleAutoBreak.checked;
    settings.autoStartPomodoro = toggleAutoPomo.checked;
    settings.longBreakInterval = parseInt(document.getElementById("long-breaks-interval").value)||4;
    if(interval==null){
        timeLeft = modes[currentMode] * 60;
        updateTimer();
    }
}
//Khai báo các biến và Lấy phần tử và thêm sự kiện lắng nghe thay đổi 
const inputPomodoro = document.getElementById("setting-pomodoro");
const inputShort = document.getElementById("setting-short");
const inputLong = document.getElementById("setting-long");
const inputInterval = document.getElementById("long-breaks-interval");

if (inputPomodoro) inputPomodoro.addEventListener("change", updateSettings);
if (inputShort) inputShort.addEventListener("change", updateSettings);
if (inputLong) inputLong.addEventListener("change", updateSettings);
// Thêm lắng nghe cho input interval mới
if (inputInterval) inputInterval.addEventListener("change", updateSettings);
if (toggleAutoBreak) toggleAutoBreak.addEventListener("change", updateSettings);
if (toggleAutoPomo) toggleAutoPomo.addEventListener("change", updateSettings);
updateTimer();



//Logic của Nút đổi bg và bg music

const musicBtn = document.getElementById("music-btn");
const musicStatus = document.getElementById("music-status"); // Lấy thẻ bao quanh
const songName = document.getElementById("song-name");       // Lấy thẻ chữ

// Khởi tạo nhạc
const audio = new Audio("lofi.mp3");
audio.loop = true;
audio.volume = 0.2;
if (musicBtn) {
    musicBtn.addEventListener("click", () => {
        if (audio.paused) {
            // --- TRƯỜNG HỢP BẬT NHẠC ---
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    // 1. Sáng nút
                    musicBtn.classList.add("active");
                    
                    // 2. Kích hoạt sóng nhạc nhảy
                    if(musicStatus) musicStatus.classList.add("playing");
                    
                    // 3. Đổi tên bài hát
                    if(songName) songName.textContent = "Lofi Chill Beats 🎵";
                })
                .catch(error => {
                    console.error("Lỗi:", error);
                    alert("Trình duyệt chặn tự phát nhạc. Hãy click chuột vào trang web rồi thử lại!");
                });
            }
        } else {
            audio.pause();
            
            // 1. Tắt sáng nút
            musicBtn.classList.remove("active");
            
            // 2. Dừng sóng nhạc
            if(musicStatus) musicStatus.classList.remove("playing");
            
            if(songName) songName.textContent = "Music Paused";
        }
    });
}
const bgChangeBtn = document.getElementById("bg-change-btn");
const bgElement = document.querySelector(".bg-image");

// Danh sách ảnh nền
const backgrounds = [
    "lofi-girl-synthwave-3840x2160-14917.jpg", 
    "70140023_p0.jpg", 
    "78844578_p0.jpg", 
    "my-neighbor-totoro-3840x2160-17071.jpg" 
];
let currentBgIndex = 0;

if (bgChangeBtn && bgElement) {
    bgChangeBtn.addEventListener("click", () => {
        currentBgIndex = (currentBgIndex + 1) % backgrounds.length;
        bgElement.style.backgroundImage = `url('${backgrounds[currentBgIndex]}')`;
    });
}