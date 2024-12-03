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

const fetchBoardData = async () => {
    const apiKey = '2ebfd784a79a4470be6818c17d8ff046';
    const stationCode = 'UT'; 
    const spoor = '18'; 

    try {
        const response = await fetch(`https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/departures?station=${stationCode}`, {
            headers: {
                'Ocp-Apim-Subscription-Key': apiKey,
            },
        });

        if (!response.ok) {
            throw new Error(`Fout bij ophalen data: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.payload || !data.payload.departures) {
            console.log('Geen vertrekkende treinen gevonden.');
            return;
        }

        const departuresFromSpoor = data.payload.departures.filter(
            (departure) => departure.plannedTrack === spoor || departure.actualTrack === spoor
        );

        if (departuresFromSpoor.length === 0) {
            console.log(`Geen vertrekkende treinen van spoor ${spoor}.`);
            return;
        }

        const nextTwoTrains = departuresFromSpoor.slice(0, 2);

        console.log(nextTwoTrains);
    } catch (error) {
        console.error('Er ging iets fout:', error.message);
    }
};

fetchBoardData();

