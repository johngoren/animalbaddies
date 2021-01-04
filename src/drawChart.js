export default function drawChart(category, ctx, Chart) {
	var dataElement = document.querySelector('#data')
	var stats = JSON.parse(dataElement.dataset.stats)["stats"];
    var myChart = new Chart(ctx, {
	type: 'bar',
	data: {
	    labels: ['Animal Alarmist', 'Animal Critic', 'Animal Agnostic', 'Animal Advocate', 'True Forest Friend'],
	    datasets: [{
		label: '# of Votes',
		data: stats,
		backgroundColor: [
		    'rgba(255, 99, 132, 0.2)',
		    'rgba(54, 162, 235, 0.2)',
		    'rgba(255, 206, 86, 0.2)',
		    'rgba(75, 192, 192, 0.2)',
		    'rgba(153, 102, 255, 0.2)',
		],
		borderColor: [
		    'rgba(255, 99, 132, 1)',
		    'rgba(54, 162, 235, 1)',
		    'rgba(255, 206, 86, 1)',
		    'rgba(75, 192, 192, 1)',
		    'rgba(153, 102, 255, 1)',
		],
		borderWidth: 1
	    }]
	},
	options: {
	   scales: {
		yAxes: [{
		    ticks: {
			beginAtZero: true,
		    }
		}]
	    }
	}
    });
}
