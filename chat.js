/* ======================================
   FIREBASE LIVE CHAT
   CHAT.JS
   PART 1
====================================== */

const chatBox = document.getElementById("chatMessages");
const messageInput = document.getElementById("message");
const sendBtn = document.getElementById("sendBtn");
const emojiBtn = document.getElementById("emojiBtn");
const emojiPicker = document.getElementById("emojiPicker");
const typingBox = document.getElementById("typingBox");
const onlineCount = document.getElementById("onlineCount");

const nameModal = document.getElementById("nameModal");
const usernameInput = document.getElementById("username");
const saveNameBtn = document.getElementById("saveName");

/* ========================= */

let username = localStorage.getItem("chat_username") || "";

const uid = "u_" + Date.now() + "_" + Math.random().toString(36).substr(2,6);

let typingTimer;

/* =========================
   LOGIN
========================= */

if(username){

    nameModal.style.display="none";

    connectUser();

}else{

    nameModal.style.display="flex";

}

saveNameBtn.onclick=function(){

    const name=usernameInput.value.trim();

    if(name.length<3){

        alert("Nama minimal 3 karakter");

        return;

    }

    username=name;

    localStorage.setItem("chat_username",username);

    nameModal.style.display="none";

    connectUser();

};

/* =========================
   ONLINE USER
========================= */

function connectUser(){

    onlineRef.child(uid).set({

        username:username,

        online:true,

        time:firebase.database.ServerValue.TIMESTAMP

    });

    onlineRef.child(uid).onDisconnect().remove();

}

onlineRef.on("value",function(snap){

    onlineCount.innerHTML=snap.numChildren()+" Online";

});

/* =========================
   EMOJI
========================= */

const emojiArray=

emojiPicker.innerText.trim().split(/\s+/);

emojiPicker.innerHTML="";

emojiArray.forEach(function(emoji){

    const span=document.createElement("span");

    span.textContent=emoji;

    span.onclick=function(){

        messageInput.value+=emoji;

        messageInput.focus();

    };

    emojiPicker.appendChild(span);

});

emojiBtn.onclick=function(){

    emojiPicker.style.display=

    emojiPicker.style.display==="flex"

    ?"none"

    :"flex";

};

document.addEventListener("click",function(e){

    if(

        !emojiPicker.contains(e.target)

        &&

        e.target!==emojiBtn

    ){

        emojiPicker.style.display="none";

    }

});

/* =========================
   HELPER
========================= */

function escapeHTML(text){

    const div=document.createElement("div");

    div.innerText=text;

    return div.innerHTML;

}



function timeFormat(ms){

    const d=new Date(ms);

    return d.toLocaleTimeString("id-ID",{

        hour:"2-digit",

        minute:"2-digit"

    });

}

function scrollBottom(){

    chatBox.scrollTop=

    chatBox.scrollHeight;

}
/* ======================================
   CHAT.JS
   PART 2
====================================== */

/* =========================
   SEND MESSAGE
========================= */

let lastSendTime = 0;

function sendMessage(){

    const text = messageInput.value.trim();

    if(text=="") return;

    const now = Date.now();

    if(now-lastSendTime<2000){

        alert("Tunggu 2 detik sebelum mengirim pesan lagi.");

        return;

    }

    lastSendTime = now;

    messagesRef.push({

        uid:uid,

        username:username,

        text:text,

        time:firebase.database.ServerValue.TIMESTAMP

    });

    messageInput.value="";

    typingRef.child(uid).remove();

}

/* =========================
   BUTTON SEND
========================= */

sendBtn.onclick=function(){

    sendMessage();

};

/* =========================
   ENTER SEND
========================= */

messageInput.addEventListener("keydown",function(e){

    if(e.key==="Enter" && !e.shiftKey){

        e.preventDefault();

        sendMessage();

    }

});

/* =========================
   TYPING
========================= */

messageInput.addEventListener("input",function(){

    if(!username) return;

    typingRef.child(uid).set({

        username:username

    });

    clearTimeout(typingTimer);

    typingTimer=setTimeout(function(){

        typingRef.child(uid).remove();

    },1500);

});

/* =========================
   SHOW TYPING
========================= */

typingRef.on("value",function(snapshot){

    let html="";

    snapshot.forEach(function(child){

        if(child.key===uid) return;

        const data=child.val();

        html+=`
            <div class="typing-dots">
                <strong>${escapeHTML(data.username)}</strong> sedang mengetik...
            </div>
        `;

    });

    typingBox.innerHTML=html;

});

/* =========================
   CLEANUP
========================= */

window.addEventListener("beforeunload",function(){

    onlineRef.child(uid).remove();

    typingRef.child(uid).remove();

});
/* ======================================
   CHAT.JS
   PART 3
====================================== */

/* =========================
   LOAD MESSAGE
========================= */

messagesRef.limitToLast(100).on("child_added",function(snapshot){

    const data = snapshot.val();

    if(!data) return;

    renderMessage(data);

});

/* =========================
   RENDER MESSAGE
========================= */

function renderMessage(data){

    const mine = data.uid === uid;

    const item = document.createElement("div");

    item.className = mine ? "message me" : "message";

    const avatarColor = getAvatarColor(data.username);

    item.innerHTML = `

        <div class="avatar"
        style="background:${avatarColor}">

            ${getAvatar(data.username)}

        </div>

        <div class="bubble">

            <div class="name">

                ${escapeHTML(data.username)}

            </div>

            <div class="text">

                ${makeLink(
                    escapeHTML(data.text)
                )}

            </div>

            <div class="time">

                ${timeFormat(data.time)}

            </div>

        </div>

    `;

    chatBox.appendChild(item);

    scrollBottom();

}

/* =========================
   AVATAR
========================= */

function getAvatar(name){

    return name.substring(0,1).toUpperCase();

}

function getAvatarColor(name){

    const colors=[

        "#ff9800",

        "#2196f3",

        "#4caf50",

        "#9c27b0",

        "#f44336",

        "#009688",

        "#795548",

        "#607d8b"

    ];

    let total=0;

    for(let i=0;i<name.length;i++){

        total+=name.charCodeAt(i);

    }

    return colors[total%colors.length];

}

/* =========================
   LINK
========================= */

function makeLink(text){

    return text.replace(

        /(https?:\/\/[^\s]+)/g,

        '<a href="$1" target="_blank">$1</a>'

    );

}

/* =========================
   AUTO SCROLL
========================= */

function scrollBottom(){

    setTimeout(function(){

        chatBox.scrollTop=

        chatBox.scrollHeight;

    },50);

}

/* =========================
   READY
========================= */

console.log(

"Firebase Live Chat Ready"

);
