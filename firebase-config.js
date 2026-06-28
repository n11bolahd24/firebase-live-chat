/* =====================================================
   FIREBASE LIVE CHAT
   FIREBASE-CONFIG.JS
===================================================== */

const firebaseConfig = {
    apiKey: "AIzaSyBueFmieBcf4uhGsZPpfBrbQj7-cqIKGiY",
    authDomain: "live-chat-n11bolahd.firebaseapp.com",
    databaseURL: "https://live-chat-n11bolahd-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "live-chat-n11bolahd",
    storageBucket: "live-chat-n11bolahd.firebasestorage.app",
    messagingSenderId: "188799799334",
    appId: "1:188799799334:web:e6feba8bf77ae779e496e7"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();

/* =====================================================
   ROOM CHAT
===================================================== */

/*
Jika menggunakan renderMatch nanti cukup ubah:

window.CHAT_ROOM = "croatia-vs-ghana";

Kalau belum memakai renderMatch,
otomatis memakai room "global".
*/

window.CHAT_ROOM = window.CHAT_ROOM || "global";

const roomRef = db.ref("rooms/" + window.CHAT_ROOM);

const messagesRef = roomRef.child("messages");

const onlineRef = roomRef.child("online");

const typingRef = roomRef.child("typing");

/* =====================================================
   SERVER TIME
===================================================== */

const SERVER_TIME = firebase.database.ServerValue.TIMESTAMP;
