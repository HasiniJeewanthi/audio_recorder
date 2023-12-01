const mic_btn = document.querySelector('#mic');
const playback = document.querySelector('.playback');

mic_btn.addEventListener('click', ToggleMic);

let can_record = false;
let is_recording = false;

let reorder = null;

let chunks = [];

function SetupAudio(){
    console.log("Setup");
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
            audio:true
        }).then(SetupStream)
        .catch(err => {
            console.error(err)
        });
        
    }
}

SetupAudio();

function SetupStream(stream) {
    reorder = new MediaRecorder(stream);

    reorder.ondataavailable = e => {
        chunks.push(e.data);
    }

    reorder.onstop = e => {
        const blob = new Blob(chunks, {type: "audio/ogg; codecs=opus"});
        chunks = [];
        const audioURL = window.URL.createObjectURL(blob);
        playback.src = audioURL;
    }

    can_record = true;
}

function ToggleMic(){
    if (!can_record) return;

    is_recording = !is_recording;

    if (is_recording) {
        reorder.start();
        mic_btn.classList.add("is-recording");
        
    }else{
        reorder.stop();
        mic_btn.classList.add("is-recording");
    }
}