console.log("Hii");
 let currentSong=new Audio();
 let songs;
 let currFolder;
 function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  }
async function getSongs(folder) {
    currFolder=folder;
    let a = await fetch(`/${folder}`);
    let res = await a.text();
    let div = document.createElement("div");
    div.innerHTML = res;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            let songName = element.href.split(`/${folder}/`)[1];
            songs.push(songName);
        }
    }
    

    
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songUL.innerHTML="";
    for(const song of songs){
        songUL.innerHTML = songUL.innerHTML + ` <li>
                <img class="invert" src="music.svg" alt="music">
                <div class="info">
                <p>${song.replaceAll("%20"," ")}</p>
                <p>Shresth</p>
                </div>
                <div class="playnow">
                  <span>Play Now</span>
                <img class="invert" src="play.svg" alt="play"></div>
              </li>`;
    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{

            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })

    })
    return songs;
}
let userHasInteracted = false;

document.addEventListener("click", () => {
  userHasInteracted = true;
});

const playMusic=(track,pause=false)=>{
    
    currentSong.src=`/${currFolder}/` + track;
    if(!pause && userHasInteracted){
        currentSong.play();
        play.src="pause.svg";

    }
    play.src="pause.svg";
    document.querySelector(".song-info").innerHTML=decodeURI(track);
    document.querySelector(".song-time").innerHTML="00:00/00:00";
}
async function main(){
   
    await getSongs("songs/eng");
    playMusic(songs[0],true);






    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play();
            play.src="pause.svg";
        }else{
            currentSong.pause();
            play.src="play.svg";
        }
    });
    currentSong.addEventListener("timeupdate",()=>{
        console.log(currentSong.currentTime,currentSong.duration);
        document.querySelector(".song-time").innerHTML=`${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`;
        document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100+"%";
    });
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100 ;
        document.querySelector(".circle").style.left=percent+ "%";
        currentSong.currentTime=((currentSong.duration)*percent /100);
    });
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0";
    });
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-120%";
    });
    previous.addEventListener("click",()=>{
        currentSong.pause();
        let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        console.log(songs,index);
        if((index-1) >= 0){
        playMusic(songs[index-1])};
    });
    next.addEventListener("click",()=>{
        currentSong.pause();
        let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        console.log(songs,index);
        if((index+1) < songs.length){
        playMusic(songs[index+1])};
    });
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        console.log(e,e.target,e.target.value)
        currentSong.volume=parseInt(e.target.value)/100;

    });
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        console.log(e);
        e.addEventListener("click",async item=>{
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0]);
            
        })
    })
    document.querySelector(".volume>img").addEventListener("click",e=>{
        if(e.target.src.includes("volume.svg")){
        e.target.src=e.target.src.replace("volume.svg","mute.svg");
        currentSong.volume=0;
        document.querySelector(".range").getElementsByTagName("input")[0].value=0;
        }
        else{
            e.target.src=e.target.src.replace("mute.svg","volume.svg");
            currentSong.volume=.10;
            document.querySelector(".range").getElementsByTagName("input")[0].value=10;
        }
    })


}
main()



