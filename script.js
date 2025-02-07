document.getElementById("predictButton").addEventListener("click", predictScore);

function predictScore() {
  const gameType = document.getElementById("gameType").value;
  const wicketsDown = parseInt(document.getElementById("wicketsDown").value);
  const runsAtTea = parseInt(document.getElementById("runsAtTea").value);
  const temperature = parseInt(document.getElementById("temperature").value);
  const crossBatHacks = parseInt(document.getElementById("crossBatHacks").value);

  if (isNaN(wicketsDown) || isNaN(runsAtTea) || isNaN(temperature) || isNaN(crossBatHacks)) {
    alert("Please fill in all fields.");
    return;
  }

  // Base ratios
  const ratios = [2.5, 2.3, 2, 1.8, 1.6, 1.4, 1, 0.8, 0.2, 0.1];
  let returnRatio = ratios[wicketsDown];

  // Adjust for temperature
  if (temperature > 30) {
    const tempAdjustment = (temperature - 30) * 0.05;
    returnRatio += returnRatio * tempAdjustment;
  }

  // Adjust for cross bat hacks
  const hackAdjustments = [0, 0, 0, -0.1, -0.2, -0.35];
  returnRatio += returnRatio * hackAdjustments[crossBatHacks];

  // Determine total overs and overs at tea/drinks
  const totalOvers = gameType === "twoDay" ? 75 : 40;
  const oversAtBreak = gameType === "twoDay" ? 37 : 20;
  const oversRemaining = totalOvers - oversAtBreak;

  // Predicted final score
  const predictedScore = runsAtTea + Math.round(runsAtTea * returnRatio);

  // Display the predicted score
  document.getElementById("predictedScore").innerHTML = `Predicted Total Score: ${predictedScore}`;

  // Generate the full overs graph
  generateGraph(runsAtTea, returnRatio, oversAtBreak, oversRemaining, totalOvers);
}

function generateGraph(runsAtTea, returnRatio, oversAtBreak, oversRemaining, totalOvers) {
  let data = [];
  let labels = [];
  let cumulativeRuns = 0;
  
  // First overs (straight line)
  let runRateBeforeBreak = runsAtTea / oversAtBreak;
  for (let i = 1; i <= oversAtBreak; i++) {
    cumulativeRuns += runRateBeforeBreak;
    data.push(cumulativeRuns);
    labels.push(i);
  }

  // Overs after tea with increasing run rate
  let runRateAfterBreak = (runsAtTea * returnRatio) / oversRemaining;
  for (let i = 1; i <= oversRemaining; i++) {
    cumulativeRuns += runRateAfterBreak * (1 + i / oversRemaining); // Simulating a gradual increase
    data.push(cumulativeRuns);
    labels.push(oversAtBreak + i);
  }

  // Draw Chart
  const ctx = document.getElementById("predictionChart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Predicted Score Progression",
          data: data,
          borderColor: "rgba(46, 204, 113, 1)",
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: { display: true, text: "Overs" },
        },
        y: {
          title: { display: true, text: "Cumulative Runs" },
        },
      },
    },
  });
}
