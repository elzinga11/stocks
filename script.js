let oldData;
document.getElementById("stockSubmit").addEventListener("click", function(event) {
    event.preventDefault();
    const value = document.getElementById("stockInput").value;
    if (value === "")
      return;
    setData(value);
    stockView(event, "temp");
  });


  function stockView(evt, weatherType) {
    // Declare all variables
    var i, tabcontent, tablinks;
    
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(weatherType).style.display = "block";
    evt.currentTarget.className += " active";
  }

  function setData(value){
    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
    ];
    let oldDataGainers;
    let oldDataLosers;
    const url = "https://financialmodelingprep.com/api/v3/quote/" + value + "?apikey=d060c2128b033cf9ba22f9cfdb1a04c9";
    fetch(url)
      .then(function(response) {
        return response.json();
      }).then(function(json) {
        for(let i=0; i<json.length; i++){
            json = json[i];
        }
        let date = new Date();
        document.getElementById("currentStock").innerHTML = '<p style="font-weight: 600">' + json.name + '</p>' + '<h4 style="font-size:15px; text-align: right; margin-top: -20px; font-weight: 100 !important">' + monthNames[date.getMonth()] + " " + date.getDate() + '</h4>';
        let results = "";
        // document.getElementById("currentIcon").innerHTML = '<img src="http://openweathermap.org/img/w/' + json.weather[0].icon + '.png"/>';
        let price = Number(json.price).toFixed(2);
        
        results += '<h2>' + "Current Price: $" + price + "</h2>"
        if(json.change < 0){
            results += '<p style="color: red">' + "Change: " + json.change + "</p>"
        }
        else{
            results += '<p style="color: green">' + json.change + "</p>"
        }

        dailyData = '<p style="font-weight: 600; font-size: 35px;">' + json.name + '</p>' + "<p>" + "Open: $" + json.open + "</p>" + "<p>" + "Previous Close: $" + json.previousClose + "</p>" + "<p>" + "Market Cap: "+ json.marketCap + "</p>" + "Volume: "+ json.marketCap + "</p>";
        document.getElementById("dailyInfo").innerHTML = dailyData;
        document.getElementById("stockResults").innerHTML = results;
      });

      let oneMinute = [];
      let oneMinuteDate = [];
      const urlOneMin = "https://financialmodelingprep.com/api/v3/historical-chart/1min/" + value + "?apikey=d060c2128b033cf9ba22f9cfdb1a04c9";
      fetch(urlOneMin)
        .then(function(response) {
          return response.json();
        }).then(function(json) {
          for(let i=0; i<json.length; i++){
              oneMinute.unshift(json[i].open);
              oneMinuteDate.unshift(json[i].date);
          }
        new Chart("stockChart", {
            type: "line",
            data: {
                labels: oneMinuteDate,
                datasets: [{
                backgroundColor: "transparent",
                label: 'Price',
                borderColor: '#518ae0',
                data: oneMinute
                }
            ]
            },
            options: {
                legend: {display: false},
                scales: {
                    yAxes: [{
                        ticks: {
                            // beginAtZero:true
                        }
                    }]
                }
            }
        });
        });

    let fiveMinute = [];
    let fiveMinuteDate = [];
    const urlFiveMin = "https://financialmodelingprep.com/api/v3/historical-chart/5min/" + value + "?apikey=d060c2128b033cf9ba22f9cfdb1a04c9";
    fetch(urlFiveMin)
        .then(function(response) {
        return response.json();
        }).then(function(json) {
        for(let i=0; i<json.length; i++){
            fiveMinute.unshift(json[i].open);
            fiveMinuteDate.unshift(json[i].date);
        }

        new Chart("fiveMinuteChart", {
            type: "line",
            data: {
                labels: fiveMinuteDate,
                datasets: [{
                backgroundColor: "transparent",
                label: 'Price',
                borderColor: '#518ae0',
                data: fiveMinute
                }
            ]
            },
            options: {
                legend: {display: false},
                scales: {
                    yAxes: [{
                        ticks: {
                            // beginAtZero:true
                        }
                    }]
                }
            }
        });
        });

        let oneHour = [];
        let oneHourDate = [];
        const urlOneHour = "https://financialmodelingprep.com/api/v3/historical-chart/oneHour/" + value + "?apikey=d060c2128b033cf9ba22f9cfdb1a04c9";
        fetch(urlOneHour)
          .then(function(response) {
            return response.json();
          }).then(function(json) {
            for(let i=0; i<json.length; i++){
                oneHour.unshift(json[i].open);
                oneHourDate.unshift(json[i].date);
            }
          new Chart("hourlyChart", {
              type: "line",
              data: {
                  labels: oneHourDate,
                  datasets: [{
                  backgroundColor: "transparent",
                  label: 'Price',
                  borderColor: '#518ae0',
                  data: oneHour
                  }
              ]
              },
              options: {
                  legend: {display: false},
                  scales: {
                      yAxes: [{
                          ticks: {
                              // beginAtZero:true
                          }
                      }]
                  }
              }
          });
          });

        gainers = [];
        const urlGainers = "https://financialmodelingprep.com/api/v3/gainers?apikey=d060c2128b033cf9ba22f9cfdb1a04c9";
        fetch(urlGainers)
        .then(function(response) {
            return response.json();
        }).then(function(json) {
            for(let i=0; i<json.length; i++){
                data = "";
                data += "<p>" + json[i].ticker + "</p>";
                data += "<p>" + "Price: " + json[i].price + "</p>";
                data += "<p>" + "Gain: "+ json[i].changes + "</p>";
                gainers.push(data);
                data = "";
            }
            if(oldDataGainers){
                document.querySelector("#gainers").removeChild(oldDataGainers);
            }
            list = document.createElement("div");
            list.style.display ="flex";
            list.style.flexWrap ="wrap";
            list.style.overflow="scroll";
            list.style.justifyContent ="space-between";
            list.style.marginLeft ="3%";
            list.style.marginRight = "3%";
            for(const company of gainers){
                let item = document.createElement("div");
                item.style.display = "flex";
                item.style.flexDirection = "column";
                item.style.width = "50vw";
                item.style.padding = "5px";
                item.innerHTML = company;
                item.style.border = "1px solid #e1e1e1";
                item.style.fontSize = "15px";
                if(document.body.clientWidth < 500){
                    item.style.fontSize = "1px !important";
                }
                list.appendChild(item);
            }
            oldDataGainers = list;
            document.querySelector("#gainers").appendChild(list);

        });

        losers = [];
        const urlLosers = "https://financialmodelingprep.com/api/v3/losers?apikey=d060c2128b033cf9ba22f9cfdb1a04c9";
        fetch(urlLosers)
        .then(function(response) {
            return response.json();
        }).then(function(json) {
            for(let i=0; i<json.length; i++){
                data = "";
                data += "<p>" + json[i].ticker + "</p>";
                data += "<p>" + "Price: "+ json[i].price + "</p>";
                data += "<p>" + "Loss: " + json[i].changes + "</p>";
                losers.push(data);
                data = "";
            }
            if(oldDataLosers){
                document.querySelector("#losers").removeChild(oldDataLosers);
            }
            newList = document.createElement("div");
            newList.style.display ="flex";
            newList.style.overflow="scroll";
            newList.style.flexWrap ="wrap";
            newList.style.justifyContent ="space-between";
            newList.style.marginLeft ="3%";
            newList.style.marginRight = "3%";
            for(const company of losers){
                let item = document.createElement("div");
                item.style.display = "flex";
                item.style.flexDirection = "column";
                item.style.width = "50vw";
                item.style.padding = "5px";
                item.innerHTML = company;
                item.style.border = "1px solid #e1e1e1";
                item.style.fontSize = "15px";
                if(document.body.clientWidth < 500){
                    item.style.fontSize = "1px !important";
                }
                newList.appendChild(item);
            }
            oldDataLosers = newList;
            document.querySelector("#losers").appendChild(newList);
        });
  }

  window.addEventListener('load', (event) => {
    setData("AAPL");
    stockView(event, "temp");
  });
  