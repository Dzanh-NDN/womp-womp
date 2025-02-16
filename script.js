const musicContainer = document.querySelector('.container')
const diskContainer = document.querySelector('.disk-container')
const playbtn = document.querySelector('#play')
const prevbtn = document.querySelector('#prev')
const nextbtn = document.querySelector('#next')
const volume = document.querySelector('#volume')
const audio = document.querySelector('#audio')
const progress = document.querySelector('.progress')
const progressContainer = document.querySelector('.progress-container')
const title = document.querySelector('#Title')
const Name = document.querySelector('#Name')
const image = document.querySelector('.image')
const disk = document.querySelector('.disk')
const current_time = document.querySelector('#current-time')
const total_time = document.querySelector('#total-time')
const volume_bar = document.querySelector('.volume-bar')
const volume_slider = document.querySelector('.volume-slider')
const menu = document.querySelector('.menu')
const list = document.querySelector('#list')
const song = document.querySelectorAll(".menu li")
const loop = document.querySelector('#loop')
const random = document.querySelector('#random')

let songIndex = 0;
let updateTimer;
let randomMusic = 0;
let music_list = [];

fetch('music.json')
    .then(response => response.json())
    .then(data => {
        music_list = data;

        loadSong(songIndex);
    })
    .catch(error => console.error('Error loading JSON:', error));


function loadSong(songIndex) {

    audio.src = music_list[songIndex].audio;
    audio.load()

    title.innerText = music_list[songIndex].title;
    Name.innerText = music_list[songIndex].name;
    disk.src = music_list[songIndex].disk;
    image.src = music_list[songIndex].disk;
}



function updateProcess(e) {
    const duration = e.srcElement.duration;
    const nowplaying = e.srcElement.currentTime;
    const percent = (nowplaying/duration)*280;
    progress.style.width = `${percent}px`;

    let currentMins = Math.floor(audio.currentTime / 60)
    let currentSecs = Math.floor(audio.currentTime - currentMins * 60)
    let durationMins = Math.floor(audio.duration / 60)
    let durationSecs = Math.floor(audio.duration - durationMins * 60)

    if(currentSecs < 10) {currentSecs = "0" + currentSecs; }
    if(durationSecs < 10) {durationSecs = "0" + durationSecs; }
    if(currentMins < 10) {currentMins = "0" + currentMins; }
    if(durationMins < 10) {durationMins = "0" + durationMins; }

    current_time.innerText = currentMins + ":" + currentSecs;
    total_time.innerText = durationMins + ":" + durationSecs;
}

function setProgress(e) {
    const clickX = e.offsetX
    const duration = audio.duration

    audio.currentTime = (clickX / 280) * duration
}

function playSong() {
    diskContainer.classList.add('play')
    musicContainer.classList.add('play')
    document.getElementById("myicon").setAttribute("name", "pause-outline")

    audio.play()
}

function pauseSong() {
    diskContainer.classList.remove('play')
    musicContainer.classList.remove('play')
    document.getElementById("myicon").setAttribute("name", "play-outline")

    audio.pause()
}

function prevsong() {
    songIndex -= 1;

    if(songIndex < 0) {
        songIndex = music_list.length - 1
    }
    document.querySelectorAll(".menu li a")[songIndex].classList.remove("play");

    document.querySelectorAll(".menu li a")[songIndex].classList.add("play");
    loadSong(songIndex);
    playSong();
}

function nextsong() {
    if(randomMusic == 0) {
        songIndex += 1;

        if(songIndex > music_list.length - 1) {
        songIndex = 0
        }}
    else if (randomMusic == 1) {
        songIndex = Math.floor(Math.random(0, 1) * music_list.length)
    } 
    else {
        songIndex = songIndex
    }
    document.querySelectorAll(".menu li a").forEach(a => a.classList.remove("play"));

    document.querySelectorAll(".menu li a")[songIndex].classList.add("play");
    loadSong(songIndex);
    playSong();
}

function setVolume() {
    audio.volume = volume_slider.value / 100;
}

function volume_setting() {
    if( volume_bar.style.display == 'none') {
        volume_bar.style.display = 'grid'
    }
    else {
        volume_bar.style.display = 'none'
    }
}

function menu_setting() {
    if( menu.style.display == 'none') {
        menu.style.display = 'inline-block'
    }
    else {
        menu.style.display = 'none'
    }
}

playbtn.addEventListener('click', () => {
    const isPlaying = musicContainer.classList.contains('play')

    if(isPlaying) {
        pauseSong()
    } else {
        playSong()
    }
})


function randomSong() {
    randomMusic = randomMusic === 1 ? 0 : 1;
    random.style.color = randomMusic ? 'lightblue' : 'black';
    loop.style.color = 'black';
}

function loopSong() {
    randomMusic = randomMusic === 2 ? 0 : 2;
    loop.style.color = randomMusic === 2 ? 'lightblue' : 'black';
    random.style.color = 'black';
}

prevbtn.addEventListener('click', prevsong)
nextbtn.addEventListener('click', nextsong)

audio.addEventListener('timeupdate', updateProcess)

progressContainer.addEventListener('click', setProgress)

audio.addEventListener('ended', nextsong)
volume.addEventListener('click', volume_setting)
list.addEventListener('click', menu_setting)
random.addEventListener('click', randomSong)
loop.addEventListener('click', loopSong)





song.forEach((li, index) => {
    li.addEventListener("click", function() {
        // Remove "play" class from all <a> elements inside <li>
        document.querySelectorAll(".menu li a").forEach(a => a.classList.remove("play"));

        // Add "play" class to the clicked <a> element
        this.querySelector("a").classList.add("play");

        songIndex = index;

        loadSong(songIndex);
        playSong();
    });
});

