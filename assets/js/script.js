const clockFps = 60;
var switchText = true;

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
    const stationCode = 'UT'; 
    const spoor = '18'; 

    try {
        const response = await fetch('assets/api/information.php', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                function: "getDepartures",
                stationCode: stationCode,
            })
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
            var actualDateTime = new Date(nextTwoTrains[0].plannedDateTime);
            var departureMinutes = Math.max(0, Math.ceil((actualDateTime - new Date()) / 60000));

            var plannedDateTime = new Date(nextTwoTrains[0].plannedDateTime);

            //actualDateTime = new Date(actualDateTime.getTime() + 10*60000);

            var delay = Math.max(0, Math.ceil((actualDateTime - plannedDateTime) / 60000));

            var routeStationsString = '';
            nextTwoTrains[0].routeStations.forEach((station, index) => {
                if(index === 0){
                    routeStationsString += station.mediumName;
                }else{
                    if(nextTwoTrains[0].routeStations.length - 1 == index ){
                        routeStationsString += ' en ' + station.mediumName;
                    }else{
                        routeStationsString += ', ' + station.mediumName;
                    }
                }
            });

            document.querySelector('#middle #board #categoryName').innerHTML = nextTwoTrains[0].product.longCategoryName;

            if(switchText && departureMinutes <= 10){
                document.querySelector('#middle #board #departureMinutes').innerHTML = `<span>${departureMinutes}</span> ${departureMinutes === 1 ? 'minuut' : 'minuten'}`;
            }else{
                var departureMinutesString = `<span>${actualDateTime.getHours().toString().padStart(2, '0')}:${actualDateTime.getMinutes().toString().padStart(2, '0')}</span>`;
                if(delay > 0){
                    departureMinutesString += ` <span id="delay">+${delay}</span>`;
                }

                document.querySelector('#middle #board #departureMinutes').innerHTML = departureMinutesString;
            }

            document.querySelector('#middle #board #direction').innerHTML = nextTwoTrains[0].direction;
            document.querySelector('#middle #board #routeStations span').innerHTML  = routeStationsString;
        }

        if(nextTwoTrains[1]){
            var actualDateTime = new Date(nextTwoTrains[1].actualDateTime);

            if(switchText){
                document.querySelector('#middle #bottom p').innerHTML = `Volgende trein: <span>${actualDateTime.getHours().toString().padStart(2, '0')}:${actualDateTime.getMinutes().toString().padStart(2, '0')} ${nextTwoTrains[1].trainCategory} ${nextTwoTrains[1].direction}</span>`;
            }else{
                document.querySelector('#middle #bottom p').innerHTML = `Next train: <span>${actualDateTime.getHours().toString().padStart(2, '0')}:${actualDateTime.getMinutes().toString().padStart(2, '0')} ${nextTwoTrains[1].trainCategory} ${nextTwoTrains[1].direction}</span>`;
            }
        }else{
            document.querySelector('#middle #bottom p').style.display = 'none';
        }

        switchText = !switchText;
    } catch (error) {
        console.error('Er ging iets fout:', error.message);
    }
};