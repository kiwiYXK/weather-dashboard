city_locations = {
    "Atlanta": {lat: 33.7537, lon: -84.3863},
    "Austin": {lat: 30.2671, lon: -97.7430},
    "Chicago": {lat: 41.8755, lon: -87.6244},
    "New York": {lat: 40.7127, lon: -74.0060},
    "Orlando": {lat: 28.5421, lon: -81.3790},
    "San Francisco": {lat: 37.7790, lon: -122.4199},
    "Seattle": {lat: 47.6038, lon: -122.3300},
    "Denver": {lat: 39.7392, lon: -104.9848}
}

app_key = "211d7e9c2e43aecb1e6367fab24bfae2"

function query_city_data(city){
    $.ajax({
        type:'GET',
        url: "https://api.openweathermap.org/data/2.5/onecall",
        data:{
            lat: city_locations[city].lat, 
            lon: city_locations[city].lon,
            exclude: "hourly,minutely",
            units: "imperial",
            appid: app_key
        },
        success: function(response) {
            city_data = parse_data(response);
            update_show(city, city_data);
        },
        error: function(msg) {
            console.log("error", msg);
        }
    })
}

function parse_data(resonse){
    var city_data = {}
    var cur_date = new Date(resonse["current"]["dt"] * 1000);
    city_data["current"] = {
        "temp": resonse["current"]["temp"],
        "wind": resonse["current"]["wind_speed"],
        "humidity": resonse["current"]["humidity"],
        "uvi": resonse["current"]["uvi"],
        "icon": resonse["current"]["weather"][0]["icon"],
        "date": cur_date.getDate() + "/" + cur_date.getMonth() +"/" + cur_date.getFullYear()
    }

    city_data["days"] = []
    for(var i=1; i <=5; i++){
        var date_i = new Date(resonse["daily"][i]["dt"] * 1000);
        city_data["days"].push({
            "temp": resonse["daily"][i]["temp"]["day"],
            "wind": resonse["daily"][i]["wind_speed"],
            "humidity": resonse["daily"][i]["humidity"],
            "icon": resonse["daily"][i]["weather"][0]["icon"],
            "date": date_i.getDate() + "/" + date_i.getMonth() +"/" + date_i.getFullYear()
        })
    }

    return city_data
}

function get_uvi_rank(uvi){
    if(uvi<3){
        return "low"
    }else if(uvi<6){
        return "moderate"
    }else if(uvi<8){
        return "high"
    }else if(uvi<11){
        return "very-high"
    }else{
        return "extreme"
    }
}

function update_show(city_name, city_data){
    // update current
    $("#current-title").text(city_name + "(" + city_data["current"]["date"] + ")");
    $('#current-icon').attr('src', "http://openweathermap.org/img/wn/"+ city_data["current"]["icon"]  +"@2x.png");
    
    $("#current-temp").text(city_data["current"]["temp"]);
    $("#current-wind").text(city_data["current"]["wind"]);
    $("#current-humidity").text(city_data["current"]["humidity"]);
    var uvi = $("#current-uvi");
    uvi.text(city_data["current"]["uvi"]);
    uvi.removeClass();
    uvi.addClass("rank-"+get_uvi_rank(city_data["current"]["uvi"]));

    // update cards
    var cards_str = ""
    for(var i=0;i<5;i++){
        cards_str += '<div class="card forecast-card">';
        cards_str += '<div class="card-body">';
        cards_str += '<h5 class="card-title fw-bold">' + city_data["days"][i]["date"] + '</h5>';
        cards_str += '<img class="weather-icon-2" src="http://openweathermap.org/img/wn/' +
            city_data["days"][i]["icon"] + '@2x.png" alt="">';

        cards_str += '<div class="card-text">';
        cards_str += '<p>Temp: ' + city_data["days"][i]["temp"] + '°F</p>';
        cards_str += '<p>Wind: ' + city_data["days"][i]["wind"] + ' MPH</p>';
        cards_str += '<p>Humidity: ' + city_data["days"][i]["humidity"] + ' %</p>';

        cards_str += "</div></div></div>";
    }

    $("#card-list").html(cards_str);
}


$(function() {
    // Handler for .ready() called.
    // city_data = parse_data(city_res_1);
    // update_show("Atlanta", city_data);

    query_city_data("Atlanta")

    $(".city-btn").on("click", function(){
        console.log($(this).val());
        query_city_data($(this).val());
        // query_city_data()
    })
});

