const predictButton = document.getElementById("predictButton");
const resultPanel = document.getElementById("resultPanel");
const errorMessage = document.getElementById("errorMessage");
let predictionChart;

predictButton.addEventListener("click", predictScore);

function predictScore() {
  errorMessage.textContent = "";

  const gameType = document.getElementById("gameType").value;
  const wicketsDown = Number.parseInt(document.getElementById("wicketsDown").value, 10);
  const runsAtTea = Number.parseInt(document.getElementById("runsAtTea").value, 10);
  const temperature = Number.parseInt(document.getElementById("temperature").value, 10);
  const crossBatHacks = Number.parseInt(document.getElementById("crossBatHacks").value, 10);

  const validationError = validateInputs(wicketsDown, runsAtTea, temperature, crossBatHacks);
  if (validationError) {
    resultPanel.classList.add("hidden");
    errorMessage.textContent = validationError;
    return;
  }

  const ratios = [2.5, 2.3, 2, 1.8, 1.6, 1.4, 1, 0.8, 0.2, 0.1];
  let returnRatio = ratios[wicketsDown];

  if (temperature > 30) {
    const tempAdjustment = (temperature - 30) * 0.04;
    returnRatio += returnRatio * tempAdjustment;
  }

  const hackAdjustments = [0, -0.02, -0.05, -0.1, -0.2, -0.35];
  returnRatio += returnRatio * hackAdjustments[crossBatHacks];
  returnRatio = Math.max(returnRatio, 0.05);

  const totalOvers = gameType === "twoDay" ? 75 : 40;
  const oversAtBreak = gameType === "twoDay" ? 37 : 20;
  const oversRemaining = totalOvers - oversAtBreak;

  const predictedScore = runsAtTea + Math.round(runsAtTea * returnRatio);
  const conservative = Math.round(predictedScore * 0.94);
  const aggressive = Math.round(predictedScore * 1.06);

  document.getElementById("predictedScore").textContent = `Predicted Total Score: ${predictedScore}`;
  document.getElementById("conservativeScore").textContent = `${conservative} runs`;
  document.getElementById("likelyScore").textContent = `${predictedScore} runs`;
  document.getElementById("aggressiveScore").textContent = `${aggressive} runs`;

  const currentRate = (runsAtTea / oversAtBreak).toFixed(2);
  const requiredRate = ((predictedScore - runsAtTea) / oversRemaining).toFixed(2);
  document.getElementById("runRateSummary").textContent = `Current run rate at break: ${currentRate}. Required run rate for projection: ${requiredRate}.`;

  resultPanel.classList.remove("hidden");
  generateGraph(runsAtTea, predictedScore, oversAtBreak, oversRemaining, totalOvers);
}

function validateInputs(wicketsDown, runsAtTea, temperature, crossBatHacks) {
  if ([wicketsDown, runsAtTea, temperature, crossBatHacks].some(Number.isNaN)) {
    return "Please fill in all fields.";
  }

  if (wicketsDown < 0 || wicketsDown > 9) {
    return "Wickets down must be between 0 and 9.";
  }

  if (runsAtTea < 0 || runsAtTea > 700) {
    return "Runs at tea/drinks must be between 0 and 700.";
  }

  if (temperature < 0 || temperature > 45) {
    return "Temperature must be between 0°C and 45°C.";
  }

  if (crossBatHacks < 0 || crossBatHacks > 5) {
    return "Cross bat hacks must be between 0 and 5.";
  }

  return "";
}

function generateGraph(runsAtTea, predictedScore, oversAtBreak, oversRemaining, totalOvers) {
  const data = [];
  const labels = [];
  let cumulativeRuns = 0;

  const runRateBeforeBreak = runsAtTea / oversAtBreak;
  for (let i = 1; i <= oversAtBreak; i += 1) {
    cumulativeRuns += runRateBeforeBreak;
    data.push(Number(cumulativeRuns.toFixed(1)));
    labels.push(i);
  }

  const targetRunsAfterBreak = predictedScore - runsAtTea;
  const runRateAfterBreak = targetRunsAfterBreak / oversRemaining;

  for (let i = 1; i <= oversRemaining; i += 1) {
    const phaseBoost = 0.92 + (i / oversRemaining) * 0.18;
    cumulativeRuns += runRateAfterBreak * phaseBoost;
    data.push(Number(cumulativeRuns.toFixed(1)));
    labels.push(oversAtBreak + i);
  }

  data[data.length - 1] = predictedScore;

  const ctx = document.getElementById("predictionChart").getContext("2d");

  if (predictionChart) {
    predictionChart.destroy();
  }

  predictionChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Predicted Score Progression",
          data,
          borderColor: "rgba(46, 204, 113, 1)",
          backgroundColor: "rgba(46, 204, 113, 0.18)",
          fill: true,
          tension: 0.25,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
      },
      scales: {
        x: {
          title: { display: true, text: `Overs (Total ${totalOvers})` },
        },
        y: {
          title: { display: true, text: "Cumulative Runs" },
          beginAtZero: true,
        },
      },
    },
  });
}
