console.log("Behaviour loaded");

async function getWeather(){
    const response = await fetch('https://api.openweathermap.org/data/2.5/forecast?q=Lod,IL&units=metric&appid=ff53c09fa0bee0baddb2c9edca9349b5');
    const weather = await response.json();


    
    const summary = [];

    const table = document.createElement('table');
    const headerRow = document.createElement('tr');
    table.append(headerRow);

    
    headerRow.append(buildHeader('time'));
    headerRow.append(buildHeader('temp'));
    headerRow.append(buildHeader('state'));
    headerRow.append(buildHeader('desc'));
    headerRow.append(buildHeader('windSpeed'));
    headerRow.append(buildHeader('humidity'));
    
    for(let measure of weather.list){
        const data = {
            time: measure.dt,
            temp: measure.main.temp + 'C',
            state: measure.weather[0].main,
            desc: measure.weather[0].description,
            windSpeed: measure.wind.speed + 'km\h',
            humidity: measure.main.humidity + '%'
        };

        const tr = document.createElement('tr');
        table.append(tr);
        for(let attr in data){
            const td = document.createElement('td');
            tr.append(td);

            if(attr === 'state'){
                const div = document.createElement('div');
                div.className = data[attr];
                td.append(div);
                continue;
            }
            td.innerHTML = data[attr];
        }
    }
    const container = document.querySelector('.weather');
    container.append(table);

    
    
    
}
function buildHeader(name){
    let header = document.createElement('th');
    header.innerHTML = name;

    return header;
}

getWeather();