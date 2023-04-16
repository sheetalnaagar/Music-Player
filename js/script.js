const wrapper = document.querySelector(".wrapper"),
musicImg= wrapper.querySelector(".img-area img"),
musicName =wrapper.querySelector(".song-details .name"),
musicArtist =wrapper.querySelector(".song-details .artist"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
mainAudio =wrapper.querySelector("#main-audio"),
progressBar = wrapper.querySelector(".progress-bar"),
progressArea = wrapper.querySelector(".progress-area");
musicList = wrapper.querySelector(".music-list"),
showMoreBtn = wrapper.querySelector("#more-music"),
hideMusicBtn = musicList.querySelector("#close");

//load random music on page refresh
let musicIndex = Math.floor((Math.random()* allMusic.length)+1);
isMusicPaused=true;



window.addEventListener("load", ()=>{
    loadMusic(musicIndex); //calling load music function once window loads
    playingNow();
});

// load music function
function loadMusic(indexNumb){
    musicName.innerText=allMusic[indexNumb -1].name;
    musicArtist.innerText=allMusic[indexNumb -1].artist;
    musicImg.src=`img/${allMusic[indexNumb -1].img}.jpeg`;
    mainAudio.src=`songs/${allMusic[indexNumb -1].src}.mp3`;
}
//play music function
function playMusic(){
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText ="pause";
    mainAudio.play();
}
//pause music function
function pauseMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText ="play_arrow";
    mainAudio.pause();
}
//next music function
function nextMusic(){
    musicIndex++;
    // musicIndex is greater than array length then musicIndex will be 1 so the first song will play
    musicIndex > allMusic.length ? musicIndex =1 : musicIndex =musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}
//prev music function
function prevMusic(){
    musicIndex--;
    // musicIndex is less than 1 then musicIndex will be array length then  last song will play
    musicIndex < 1 ? musicIndex =allMusic.length : musicIndex =musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

//play or music button event
playPauseBtn.addEventListener("click", ()=>{
    const isMusicPaused =wrapper.classList.contains("paused");
    //if isMusicPaused is true then it will call pauseMusic else it will call playMusic
    isMusicPaused ? pauseMusic() : playMusic();
    playingNow();

});

//nexxt music btn event
nextBtn.addEventListener("click", ()=>{
    nextMusic(); //calling next music function
});

// prev music btn event
prevBtn.addEventListener("click", ()=>{
    prevMusic(); //calling next music function
});

     

     
//update current playing song current time ac to progress bar width

//update progress bar width according to music current time
mainAudio.addEventListener("timeupdate", (e)=>{
    const currentTime = e.target.currentTime;//getting current time of song 
    const duration = e.target.duration;//getting total duration of song
    let progressWidth =(currentTime/duration)*100;
     progressBar.style.width =`${progressWidth}%`;

     

     let musicCurrentTime = wrapper.querySelector(".current"),
     musicDuration = wrapper.querySelector(".duration");

     mainAudio.addEventListener("loadeddata", ()=>{
       
      //update song total duration
      let audioDuration = mainAudio.duration;
      let totalMin =Math.floor(audioDuration / 60);
      let totalSec =Math.floor(audioDuration % 60);
     if(totalSec< 10){//adding 0 if sec is less than 10
       totalSec = `0${totalSec}`;
    }
     musicDuration.innerText =`${totalMin}:${totalSec}`;
    });
  //update playing song current time
    
   let currentMin = Math.floor(currentTime/60);
   let currentSec = Math.floor(currentTime%60);
   if(currentSec < 10){
    //adding 0 if sec is less than 10
    currentSec = `0${currentSec}`;
   }
   musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

//let's update playing current time ac to progress
progressArea.addEventListener('click', (e) => { 
    const progressWidthVal = progressArea.clientWidth;
    const clickedOffsetX = e.offsetX; 
    const songDuration = mainAudio.duration; 
    mainAudio.currentTime = (clickedOffsetX / progressWidthVal) * songDuration; 
   playMusic();
   playingNow();
});
   

//change loop, shuffle, repeat icon onclick
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", ()=>{
  let getText = repeatBtn.innerText; //getting this tag innerText
  switch(getText){
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song looped");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback shuffled");
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist looped");
      break;
  }
});


//code for what to do after song ended
mainAudio.addEventListener("ended", ()=>{
    
    let getText = repeatBtn.innerText; //getting this tag innerText
    switch(getText){
      case "repeat":
        nextMusic(); //calling nextMusic function
        break;
      case "repeat_one":
        mainAudio.currentTime = 0; //setting audio current time to 0
        loadMusic(musicIndex); //calling loadMusic function with argument, in the argument there is a index of current song
        playMusic(); //calling playMusic function
        break;
      case "shuffle":
        let randIndex = Math.floor((Math.random() * allMusic.length) + 1); //genereting random index/numb with max range of array length
        do{
          randIndex = Math.floor((Math.random() * allMusic.length) + 1);
        }while(musicIndex == randIndex); //this loop run until the next random number won't be the same of current musicIndex
        musicIndex = randIndex; //passing randomIndex to musicIndex
        loadMusic(musicIndex);
        playMusic();
        playingNow();
        break;
    }
  });
// show music list onclick 
  showMoreBtn.addEventListener("click", ()=>{
    musicList.classList.toggle("show");
});

//hide list
hideMusicBtn.addEventListener("click", ()=>{
    showMoreBtn.click();
});


const ulTag = wrapper.querySelector("ul");
// li ac to the array length
 for (let i=0; i< allMusic.length; i++){
    //pass song name, artist from array to li 
    let liTag =` <li li-index="${i + 1}">
    <div class="row">
        <span>${allMusic[i].name}</span>
        <p>${allMusic[i].artist}</p>
    </div>
    <audio  class="${allMusic[i].src}"  src="songs/${allMusic[i].src}.mp3"></audio>
    <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
  </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

    liAudioTag.addEventListener("loadeddata", ()=>{
      let audioDuration = liAudioTag.duration;
      let totalMin =Math.floor(audioDuration / 60);
      let totalSec =Math.floor(audioDuration % 60);
      if(totalSec < 10){ //adding 0 if sec is less than 10
        totalSec = `0${totalSec}`;
      } 
     
     liAudioDuration.innerText =`${totalMin}:${totalSec}`;
     liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`); //adding t-duration attribute with total duration value)
     
    });
 }

// adding onclick attribute in all li
function playingNow(){
const allLiTag = ulTag.querySelectorAll("li");
  
  for (let j = 0; j < allLiTag.length; j++) {
    let audioTag = allLiTag[j].querySelector(".audio-duration");
    
    if(allLiTag[j].classList.contains("playing")){
      allLiTag[j].classList.remove("playing");
      let adDuration = audioTag.getAttribute("t-duration");
      audioTag.innerText = adDuration;//passing t-duration value 
    }
    //if the li tag index is equal to the musicIndex then add playing class in it
    if(allLiTag[j].getAttribute("li-index") == musicIndex){
      allLiTag[j].classList.add("playing");
      audioTag.innerText = "Playing";
    }
    allLiTag[j].setAttribute("onclick", "clicked(this)");
  }
}

//particular li clicked function
function clicked(element){
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex; //updating current song index with clicked li index
    loadMusic(musicIndex);
    playMusic();
    playingNow();
  }
    