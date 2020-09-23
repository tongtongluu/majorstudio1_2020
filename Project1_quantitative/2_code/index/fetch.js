// Smithsonian API example code
// check API documentation for search here: http://edan.si.edu/openaccess/apidocs/#api-search-search

// put your API key here;
const apiKey = "lfhAACxNfCCZkYCMPMkqelvWP7lkxB3jzVOoI2RO";

// search base URL
const searchBaseURL = "https://api.si.edu/openaccess/api/v1.0/search";

// Constructing the search query
var start = 0;
var last = 0;
var inCollection = 0;
var search = `unit_code:"FSG" + topic:"Animals"`;

// array that we will write into
let dataArray = [];
var data = [];

// search: fetches an array of terms based on term category
function fetchSearchData(searchTerm) {
    let url = searchBaseURL + "?api_key=" + apiKey + "&q=" + searchTerm + "&start=" + start + "&rows=" + 1000;
    console.log(url);
    return window
        .fetch(url)
        .then(res => res.json())
        .then(data => {
            data.response.rows.forEach(function (n) {
                addObject(n);
                console.log(n);
            })
        })
        .catch(error => {
            console.log(error);
        })
}

// create your own array with just the data you need
function addObject(objectData) {
    var currentID = objectData.id;
    var currentTitle = objectData.title;
    var objectLink = objectData.content.descriptiveNonRepeating.record_link;
    var objectDisplay = objectData.content.indexedStructured.onPhysicalExhibit;
    var objectCulture = objectData.content.indexedStructured.culture;
    var objectType = objectData.content.freetext.objectType;
    var objectMedium = objectData.content.freetext.physicalDescription[0]["content"];
    var objectDate = objectData.content.freetext.date[0]["content"];
    var objectPlace = "";
    var objectTopic = objectData.content.indexedStructured.topic;

    try {
        objectPlace = objectData.content.freetext.place[0]["content"];
    }
    catch (err) {
        objectPlace = "";
    }
    var objectPeriod = "";
    try {
        objectPeriod = objectData.content.freetext.date[1]["content"];
    }
    catch (err) {
        objectPeriod = "";
    }

    var index = dataArray.length;

    dataArray[index] = {};
    dataArray[index]["title"] = currentTitle;
    dataArray[index]["id"] = currentID;
    dataArray[index]["link"] = objectLink;
    if (typeof (objectDisplay) === 'undefined') {
        dataArray[index]["display"] = "No";
    } else {
        dataArray[index]["display"] = "Yes";
    }
    dataArray[index]["culture"] = objectCulture;
    var finalobject = "";
    for (var i = 0; i < objectType.length; i++) {
        finalobject += objectType[i]["content"]
        finalobject += '%'
    }
    dataArray[index]["type"] = finalobject;
    dataArray[index]["medium"] = objectMedium;
    dataArray[index]["date"] = objectDate;
    dataArray[index]["place"] = objectPlace;
    var finaltopic = "";
    for (var i = 0; i < objectTopic.length; i++) {
        finaltopic += objectTopic[i]
        finaltopic += '%'
    }
    dataArray[index]["topic"] = finaltopic;
    dataArray[index]["period"] = objectPeriod;
}

function exportToCsv(filename, rows) {
    var processRow = function (row) {
        var finalVal = '';
        for (var j = 0; j < row.length; j++) {
            var innerValue = row[j] === null ? '' : row[j].toString();
            var result = innerValue.replaceAll(',', '%');
            if (j > 0)
                finalVal += ',';
            finalVal += result;
        }
        console.log(finalVal);
        return finalVal + '\n';
    };

    var csvFile = 'title, id, link, display, culture, type, medium, date, origin, topic, period\n';
    for (var i = 0; i < rows.length; i++) {
        csvFile += processRow(Object.values(rows[i]));
    }

    var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

async function run() {
    while (start == last) {
        await fetchSearchData(search);
        start += 1000;
        last = dataArray.length;
    };

    for (var i = 0; i < dataArray.length; i++) {
        if (typeof (dataArray[i].display) != 'undefined') {
            inCollection += 1;
        }
    };
    console.log(dataArray);
    // exportToCsv("test.csv", dataArray);
    // create svg element
    /* var svg = d3.select("#arc").append("svg").attr("width", 1000).attr("height", 400)

    // add an arc
    svg
    .append("path")
    .attr("transform", "translate(400,200)")
    .attr("d", d3.arc()
        .innerRadius( 100 )
        .outerRadius( 150 )
        .startAngle( 3.14 )     // It's in radian, so Pi = 3.14 = bottom.
        .endAngle( 12.56 )       // 2*Pi = 6.28 = top
        )
    .attr('stroke', 'black')
    .attr('fill', '#69b3a2'); */

    /* var dataset = {
        apples: [53245, 28479, 19697, 24037, 40245],
        oranges: [53245, 28479, 19697, 24037, 40245],
        lemons: [5500],
        pears: [53245, 28479, 19697, 24037, 40245],
    };

    var width = 600,
        height = 400,
        cwidth = 45;

    var color = d3.scale.category20();

    var pie = d3.layout.pie()
        .sort(null)
        .startAngle(-40 * (Math.PI/180))
        .endAngle(270 * (Math.PI/180));

    var arc = d3.svg.arc();

    var svg = d3.select("arc").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("stroke-width", "2")
        .attr("stroke", "#fff")
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var inner_radius = 20;

    var gs = svg.selectAll("g").data(d3.values(dataset)).enter().append("g");

    gs.selectAll("path").data(function (d) { return pie(d); })
            .enter().append("path")
            .attr("fill", function (d, i) { return color(i); })
            .attr("d", function (d, i, j) {
                return arc.innerRadius(cwidth * j + inner_radius).outerRadius(cwidth * (j + 1) + inner_radius)(d);
            });
    } */

    const width = 2000,
        height = 1000,
        chartRadius = height / 2 - 40;

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    let svg = d3.select('body').append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    let tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip');

    const PI = Math.PI,
        arcMinRadius = 10,
        arcPadding = 10,
        labelPadding = 25,
        numTicks = 0;
    data[0] = { name: "Mythical", value: 74 };
    data[1] = { name: "Bird", value: 52 };
    data[2] = { name: "Horse", value: 37 };
    data[3] = { name: "Lion", value: 31 };
    data[4] = { name: "Bear", value: 24 };
    data[5] = { name: "Elephant", value: 12 };
    data[6] = { name: "Dragon", value: 9 };
    data[7] = { name: "Deer", value: 8 };
    data[8] = { name: "Monkey", value: 7 };
    data[9] = { name: "Butterfly", value: 6 };
    data[10] = { name: "Tiger", value: 4 };
    data[11] = { name: "Sheep", value: 4 };
    data[12] = { name: "Rabbit", value: 4 };
    data[13] = { name: "Dog", value: 4 };
    data[14] = { name: "Turtle", value: 2 };
    data[15] = { name: "Taotie", value: 2 };
    data[16] = { name: "Phoenix", value: 2 };
    data[17] = { name: "Fish", value: 2 };
    data[18] = { name: "Cicada", value: 2 };
    data[19] = { name: "Antelope", value: 2 };
    data[20] = { name: "Snake", value: 1 };
    data[21] = { name: "Serpent", value: 1 };
    data[22] = { name: "Leopard", value: 1 };
    data[23] = { name: "Duck", value: 1 };
    data[24] = { name: "Cows", value: 1 };
    data[25] = { name: "Cheetah", value: 1 };
    data[26] = { name: "Cat", value: 1 };
    data[27] = { name: "Buffalo", value: 1 };
    console.log(data);

    let scale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value) * 1.3333])
        .range([0, 2 * PI]);

    // let ticks = scale.ticks(numTicks).slice(0, -1);
    let keys = data.map((d, i) => d.name);
    //number of arcs
    const numArcs = keys.length;
    const arcWidth = (chartRadius - arcMinRadius - numArcs * arcPadding) / numArcs;

    let arc = d3.arc()
        .innerRadius((d, i) => getInnerRadius(i))
        .outerRadius((d, i) => getOuterRadius(i))
        .cornerRadius(5)
        .startAngle(PI)
        .endAngle((d, i) => scale(d) + PI)

    let radialAxis = svg.append('g')
        .attr('class', 'r axis')
        .selectAll('g')
        .data(data)
        .enter().append('g');

    radialAxis.append('circle')
        .attr('r', (d, i) => getOuterRadius(i) + arcPadding);

    radialAxis.append('text')
        .attr('x', labelPadding)
        .attr('y', (d, i) => getOuterRadius(i) - arcPadding + 10)
        .text(d => d.name)
        .style('text-anchor', 'start')
        .attr('transform', function (d, i, j) { return 'translate(-20,0)' });

    /*let axialAxis = svg.append('g')
        .attr('class', 'a axis')
        .selectAll('g')
        .data(ticks)
        .enter().append('g')
        .attr('transform', d => 'rotate(' + (rad2deg(scale(d)) - 90) + ')'); 

    axialAxis.append('line')
        .attr('x2', chartRadius);

    axialAxis.append('text')
        .attr('x', chartRadius + 10)
        .style('text-anchor', d => (scale(d) >= PI && scale(d) < 2 * PI ? 'end' : null))
        .attr('transform', d => 'rotate(' + (90 - rad2deg(scale(d))) + ',' + (chartRadius + 10) + ',0)')
        .text(d => d); */

    //data arcs
    let arcs = svg.append('g')
        .attr('class', 'data')
        .selectAll('path')
        .data(data)
        .enter().append('path')
        .attr('class', 'arc')
        .style('fill', (d, i) => color(i))

    arcs.transition()
        .delay((d, i) => i * 200)
        .duration(1000)
        .attrTween('d', arcTween);

    arcs.on('mousemove', showTooltip)
    arcs.on('mouseout', hideTooltip)


    function arcTween(d, i) {
        let interpolate = d3.interpolate(0, d.value);
        return t => arc(interpolate(t), i);
    }

    function showTooltip(d) {
        tooltip.style('left', (d3.event.pageX + 10) + 'px')
            .style('top', (d3.event.pageY - 25) + 'px')
            .style('display', 'inline-block')
            .html(d.value);
    }

    function hideTooltip() {
        tooltip.style('display', 'none');
    }

    function rad2deg(angle) {
        return angle * 180 / PI;
    }

    function getInnerRadius(index) {
        return arcMinRadius + (numArcs - (index + 1)) * (arcWidth + arcPadding);
    }

    function getOuterRadius(index) {
        return getInnerRadius(index) + arcWidth;
    }
}

run();

