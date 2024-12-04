const clockFps = 60;

window.onload = function() {
    clockInitialize();
    fetchBoardData();

    setInterval(fetchBoardData, 5000);
    setInterval(clockInitialize, 1000 / clockFps);
};

function clockInitialize(){
    var date = new Date();
    var time = [date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()];
    var clockDiv = [document.getElementById("hour"), document.getElementById("minute"), document.getElementById("second")];
    
    var hour = time[1]/2+time[0]*30;
    var minute = time[1] * 6;
    var second = (time[2] + time[3] / 1000) * 6;
    
    clockDiv[0].style.transform="rotate("+ hour +"deg)";
    clockDiv[1].style.transform="rotate("+ minute +"deg)";
    clockDiv[2].style.transform="rotate("+ second +"deg)";
}

async function fetchBoardData() {
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

        const nextTwoTrains = departuresFromSpoor.slice(0, 2);

        if(nextTwoTrains[0]){
            var departureTime = new Date(nextTwoTrains[0].plannedDateTime);
            var departureMinutes = Math.max(0, Math.ceil((departureTime - new Date()) / 60000));

            var routeStationsString = '';
            nextTwoTrains[0].routeStations.forEach((station, index) => {
                if(index === 0){
                    routeStationsString += station.mediumName;
                }else{
                    routeStationsString += ', ' + station.mediumName;
                }
            });

            if(nextTwoTrains[0].routeStations.length == 0){
                routeStationsString = nextTwoTrains[0].direction;
            }else if(nextTwoTrains[0].routeStations.length >= 1){
                routeStationsString += ' en ' + nextTwoTrains[0].direction;
            }

            document.querySelector('#middle #board #categoryName').innerHTML = nextTwoTrains[0].product.longCategoryName;
            document.querySelector('#middle #board #departureMinutes').innerHTML = `<span>${departureMinutes}</span> ${departureMinutes === 1 ? 'minuut' : 'minuten'}`;
            document.querySelector('#middle #board #direction').innerHTML = nextTwoTrains[0].direction;
            document.querySelector('#middle #board #routeStations span').innerHTML  = routeStationsString;
        }

        if(nextTwoTrains[1]){
            var departureTime = new Date(nextTwoTrains[1].plannedDateTime);

            document.querySelector('#middle #bottom p span').innerHTML = `${departureTime.getHours().toString().padStart(2, '0')}:${departureTime.getMinutes().toString().padStart(2, '0')} ${nextTwoTrains[1].trainCategory} ${nextTwoTrains[1].direction}`;
        }else{
            document.querySelector('#middle #bottom p').style.display = 'none';
        }

        console.log(nextTwoTrains);
    } catch (error) {
        console.error('Er ging iets fout:', error.message);
    }
};

