function randomNormal() {
  let u = 0, v = 0;
  while(u === 0) u = Math.random();
  while(v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function runSimulation() {
  let startValue = 10000;
  let expectedReturn = 0.08;
  let volatility = 0.2;
  let days = 252;
  let price = startValue;

  for (let i = 0; i < days; i++) {
    let dailyReturn = (expectedReturn / 252) +
      volatility * Math.sqrt(1/252) * randomNormal();
    price *= (1 + dailyReturn);
  }

  document.getElementById("mcResult").innerText =
    "Erwarteter Endwert: €" + price.toFixed(2);
}

function calculateSharpe() {
  let returns = [0.01, -0.005, 0.012, 0.008, -0.002];
  let riskFreeRate = 0.02 / 252;

  let avg = returns.reduce((a,b)=>a+b,0)/returns.length;
  let variance = returns.map(r=>Math.pow(r-avg,2))
    .reduce((a,b)=>a+b,0)/returns.length;

  let stdDev = Math.sqrt(variance);

  let sharpe = (avg - riskFreeRate) / stdDev * Math.sqrt(252);

  document.getElementById("sharpeResult").innerText =
    "Sharpe Ratio: " + sharpe.toFixed(2);
}

function calculateVaR() {
  let returns = [];
  for (let i=0; i<1000; i++) {
    returns.push(randomNormal() * 0.02);
  }
  returns.sort((a,b)=>a-b);
  let var95 = returns[Math.floor(returns.length*0.05)];

  document.getElementById("varResult").innerText =
    "VaR (95%): " + (var95*100).toFixed(2) + "%";
}
