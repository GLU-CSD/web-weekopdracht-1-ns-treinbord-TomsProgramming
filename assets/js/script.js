window.onload = function() {
    clockInitialize();

    setInterval(clockInitialize, 1000);
};
function clockInitialize(){
    var date = new Date();
    var time = [date.getHours(), date.getMinutes(), date.getSeconds()];
    var clockDiv = [document.getElementById("hour"), document.getElementById("minute"), document.getElementById("second")];
    
    var hour = time[1]/2+time[0]*30;
    
    clockDiv[0].style.transform="rotate("+ hour +"deg)";
    clockDiv[1].style.transform="rotate("+ time[1]*6 +"deg)";
    clockDiv[2].style.transform="rotate("+ time[2]*6 +"deg)";
}