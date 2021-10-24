$("input").on("input", function () {
  let query = $(this).val();
  if (!query) $(".card-cont").show();
  else {
    let i = 0;
    $(".card-cont").each(function () {
      let reg = new RegExp(".*" + query + ".*", "i");
      if (reg.test($(this).attr("id"))) {
        $(this).show();
        i++;
      } else $(this).hide();
    });
    if (i == 0) $(".noresult").show();
    else $(".noresult").hide();
  }
});

fetch("https://restcountries.com/v3.1/all").then(function (data) {
  data.json().then((dataArr) => {
    create(dataArr);
  });
});
function create(arr) {
  let row = document.getElementById("cards");
  arr.forEach((element, index) => {
    let html = `
        <div class="card  bg-dark text-white mb-2 m-1 text-center"  style="height:100%"  >
            <img src=${element["flags"]["png"]} class="card-img-top" alt="country_flag">
            <div class="card-body " >
              <p class="card-title h2" >${element["name"]["official"]}</p>
            </div>
            <p>
              <a class="btn btn-primary" data-toggle="collapse" href="#id${index}" role="button" aria-expanded="false" onclick="getWeather('${element["latlng"][0]}','${element["latlng"][1]}', 'id${index}' ,this.getAttribute('aria-expanded'))">
                weather
              </a>
            </p>
            <div class="collapse" id="id${index}">
              <div class="p-3 m-2 bg-info text-white rounded">
              </div>
            </div>
        </div>  `;
    let col = document.createElement("div");
    col.className = "col-md-6 col-lg-4 p-2 card-cont";
    col.id = element["name"]["official"];
    col.innerHTML = html;
    row.appendChild(col);
  });
  document.getElementById("main").appendChild(row);
}
function getWeather(lat, long, id, expanded) {
  if (expanded == "true") return;
  let p = document.getElementById(id).children[0];
  p.innerHTML = "Updating...";
  fetch(
    // "altkey =dbcb2899dbcee7dcab43bcf5fdd07597"
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&APPID=c470d9117220df245654821524d1b0c2`
  ).then(function (data) {
    data.json().then((dataArr) => {
      let html =
        Math.ceil(dataArr["main"]["temp"] - 273.15) +
        " &#176;C" +
        "<br/>" +
        dataArr["weather"][0]["description"];

      p.innerHTML = html;
    });
  });
}
