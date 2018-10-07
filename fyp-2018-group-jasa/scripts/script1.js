entity = 'Trump'
month = '09'
year = '2018'


function getStats(entity, month, year)
{
	// return date, number of positive and negative comments
	// type dict

	var stats;
	$.getJSON({url: './data/ord_dictt_count-10k-2018-09.json', async:false}, function(data) {
		stats = data;
	});
	return stats;
}

function getChartValues(entity, month, year)
{
	// return values for a chart

	var stats = getStats(entity, month, year);

	$.getJSON({url: './data/ord_dictt_count-10k-2018-09.json', async:false}, function(data) {
		stats = data;
	});

	dataPointsPos = [['Date', 'Positive', 'Negative']]
	for (var key in stats) 
	{
	    dataPointsPos.push([key, stats[key]['pos'], stats[key]['neg']])
	}

	return dataPointsPos;
}

function getComments(entity, date)
{
	var comments;
	$.getJSON({url: './data/dictt_small-10k-2018-09.json', async:false}, function(data) {
		comments = data;
	});

	return comments[date];
}


var dataPointsPos = getChartValues(entity, month, year);


google.charts.load('current', {packages: ['corechart', 'bar']});
// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart);
// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart() 
{
	var data = google.visualization.arrayToDataTable(dataPointsPos);

	var options = 
	{
		title: 'Comments about ' + entity + ' on Twitter during ' + year + '-' + month,
		chartArea: 
		{
			width: '60%', 
			height: '90%',     
			backgroundColor: 
			{
				'fill': '#F4F4F4',
				'opacity': 100
			}
		},
		hAxis: 
		{
			title: 'Number of Comments',
			minValue: 0,
		},
		vAxis: 
		{
			title: 'Date'
		}
		 
	};

	var chart = new google.visualization.BarChart(document.getElementById('chart_div'));

	function selectHandler() 
	{
		var selectedItem = chart.getSelection()[0];
		console.log(selectedItem);
		
		if (selectedItem) 
		{
			var date = data.getValue(selectedItem.row, 0);

			var comments = getComments(entity, date);

			$('#tbodyid').empty();
			for (var i = 0; i < 10; i++) 
			{
				$('#tbodyid').append('<tr><td>'+comments["pos"][i]+'</td><td>'+comments["neg"][i]+'</td></tr>');
			}
		}
	}

	google.visualization.events.addListener(chart, 'select', selectHandler);    
	chart.draw(data, options);
}

