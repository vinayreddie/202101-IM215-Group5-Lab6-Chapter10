rlinks = [{
        id: $('#filterBrowser'),
        rlink: 'http://randyconnolly.com/funwebdev/services/visits/browsers.php',

    },
    {
        id: $('#filterOS'),
        rlink: 'http://randyconnolly.com/funwebdev/services/visits/os.php',

    },
    {
        id: $('#filterCountry'),
        rlink: 'http://randyconnolly.com/funwebdev/services/visits/countries.php?continent=EU',

    }
]

function populateFilters(rlink, id) {
    return $.get(rlink).done(data => {
        printData(data, id);
    });
}

function printData(data, id) {
    var temp = '';
    data.forEach(element => {
        temp += `<option value='${element.id || element.iso}'> ${element.name} </option>`;
    });
    id.append(temp);
}

for (var i = 0; i < rlinks.length; i++) {
    populateFilters(rlinks[i].rlink, rlinks[i].id);
}


$.get('http://randyconnolly.com/funwebdev/services/visits/visits.php?continent=EU&month=1&limit=100').done(data => {
    populateTable(data);
    filterTable(data);
});

function populateTable(data) {
    var html = ``;
    data.forEach(el => {
        html += `<tr><td>${el.id}</td><td>${el.visit_date}</td><td>${el.country}</td><td>${el.browser}</td><td>${el.operatingSystem}</td></tr>`;
    });
    $('#visitsBody').html(html);

    $('#columnchart').html(displayBar(data));

}


const filterTable = (data) => {
    var filterList = {};
    const keys = { 'filterCountry': 'country_code', 'filterBrowser': 'browser_id', 'filterOS': 'os_id' };
    $('#filterCountry,#filterBrowser,#filterOS').on('change', (e) => {
        var key = keys[e.target.id];
        (e.target.value == 0) ? delete filterList[key]: filterList[key] = e.target.value;
        if (Object.keys(filterList).length == 0) populateTable(data);
        var current = $.grep(data, (el, i) => {
            var result = true;
            Object.keys(filterList).forEach(e => {
                if (el[e] !== filterList[e]) {
                    result = false;
                }
            });
            return result;
        });
        populateTable(current);

        $('#columnchart').html(displayBar(current));

    });
}

function displayBar(data1) {
    google.charts.load('current', { 'packages': ['bar'] });
    google.charts.setOnLoadCallback(drawStuff);

    var dict = { '': '' };

    data1.forEach(element => {
        dict[element.operatingSystem] = (dict[element.operatingSystem] || 0) + 1;
    });

    function drawStuff() {
        var data = new google.visualization.arrayToDataTable(Object.entries(dict));

        var options = {
            width: 400,
            legend: { position: 'none' },
            bar: { groupWidth: "90%" }
        };

        var chart = new google.charts.Bar(document.getElementById('columnchart'));
        // Convert the Classic options to Material options.
        chart.draw(data, google.charts.Bar.convertOptions(options));
    };
}