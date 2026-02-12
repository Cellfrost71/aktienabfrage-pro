const API_KEY = "eklHeYrFeHyxGINKs29bAXeMUoH6KoYn";
const API_KEY = "DEIN_API_KEY_HIER";

let portfolio = [];
let chart;

function addPosition() {
  const symbol = document.getElementById("symbol").value.toUpperCase();
  const shares = parseFloat(document.getElementById("shares").value);
  const buyPrice = parseFloat(document.getElementById("buyPrice").value);

  if (!symbol || !shares || !buyPrice) return;

  portfolio.push({ symbol, shares, buyPrice });
  fetchPrices();
}

async function fetchPrices() {
  for (let position of portfolio) {
    const response = await fetch(
      `https://financialmodelingprep.com/api/v3/quote/${position.symbol}?apikey=${API_KEY}`
    );
    const data = await response.json();

    if (data && data[0]) {
      position.currentPrice = data[0].price;
    }
  }
  renderPortfolio();
}

function renderPortfolio() {
  const container = document.getElementById("portfolio");
  container.innerHTML = "";

  let totalValue = 0;
  let totalInvested = 0;

  portfolio.forEach(pos => {
    const value = pos.currentPrice * pos.shares;
    const invested = pos.buyPrice * pos.shares;
    const performance = value - invested;

    totalValue += value;
    totalInvested += invested;

    container.innerHTML += `
      <p>
        <strong>${pos.symbol}</strong><br>
        Wert: €${value.toFixed(2)}<br>
        Performance: <span class="${performance >= 0 ? 'green' : 'red'}">
        €${performance.toFixed(2)}
        </span>
      </p>
    `;
  });

  const totalPerf = totalValue - totalInvested;

  document.getElementById("totalValue").innerText =
    "Gesamtwert: €" + totalValue.toFixed(2);

  document.getElementById("totalPerformance").innerHTML =
    `Gesamt Performance: <span class="${totalPerf >= 0 ? 'green' : 'red'}">
    €${totalPerf.toFixed(2)}</span>`;

  updateChart(totalValue);
}

function updateChart(value) {
  const ctx = document.getElementById("portfolioChart").getContext("2d");

  if (!chart) {
    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Start", "Jetzt"],
        datasets: [{
          label: "Depot Wert",
          data: [0, value],
          borderColor: "#3b82f6"
        }]
      }
    });
  } else {
    chart.data.datasets[0].data[1] = value;
    chart.update();
  }
}




