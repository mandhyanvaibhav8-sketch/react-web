import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import './styles.css';

export default function Dashboard({
  fileName,
  predictionData,
  onRunNewPrediction,
}) {
  // convert backend data → Recharts format (only predictions)
  const chartData = [];

  if (predictionData) {
    // Only process predictions data
    const predictions = predictionData.predictions || [];
    predictions.forEach((item) => {
      chartData.push({
        cycle: item.cycle,
        capacity: item.capacity,
      });
    });
  }

  // Get final predicted capacity and first cycle number
  const predictions = predictionData?.predictions || [];
  const insights = Array.isArray(predictionData?.meta?.insights)
    ? predictionData.meta.insights
    : [];
  const finalPred = predictions.length > 0 
    ? predictions[predictions.length - 1].capacity 
    : null;
  const firstCycle = predictions.length > 0 ? predictions[0].cycle : null;
  const lastCycle = predictions.length > 0 ? predictions[predictions.length - 1].cycle : null;

  const capacities = chartData.map((pt) => pt.capacity);
  const minCapacity = capacities.length ? Math.min(...capacities) : null;
  const maxCapacity = capacities.length ? Math.max(...capacities) : null;
  const capacityPadding =
    minCapacity !== null && maxCapacity !== null
      ? Math.max((maxCapacity - minCapacity) * 0.1, 0.1)
      : 0;
  const yDomain =
    minCapacity !== null && maxCapacity !== null
      ? [
          Math.max(0, minCapacity - capacityPadding),
          maxCapacity + capacityPadding,
        ]
      : [0, "auto"];

  return (
    <div className="dashboard-container">
      <h2>
        Prediction for:
        <br />
        <span className="file-name-small">{fileName}</span>
      </h2>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart 
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e8f3" opacity={0.5} />
            <XAxis
              dataKey="cycle"
              stroke="#666"
              tick={{ fill: '#666', fontSize: 12 }}
              label={{
                value: 'Charge Cycles',
                position: 'insideBottom',
                offset: -10,
                style: { textAnchor: 'middle', fill: '#666', fontSize: 13, fontWeight: 500 }
              }}
            />
            <YAxis
              stroke="#666"
              tick={{ fill: '#666', fontSize: 12 }}
              domain={yDomain}
              tickFormatter={(value) =>
                typeof value === 'number' ? value.toFixed(2) : value
              }
              label={{
                value: 'Capacity (mAh)',
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: '#666', fontSize: 13, fontWeight: 500 }
              }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e0e8f3',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              formatter={(value) => [`${value.toFixed(2)} mAh`, 'Predicted']}
              labelFormatter={(label) => `Cycle: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="capacity"
              name="Predicted"
              stroke="#007aff"
              strokeWidth={3}
              dot={{ fill: '#007aff', r: 3, strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6 }}
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {firstCycle && lastCycle && (
        <p className="cycle-range-info">
          Showing predictions from cycle {firstCycle} to {lastCycle}
        </p>
      )}

      {/* Summary card */}
      {finalPred && lastCycle && (
        <div className="predictions-summary">
          <div className="prediction-card">
            <h4>Predicted Capacity</h4>
            <p>{finalPred.toFixed(2)}</p>
            <span>at cycle {lastCycle}</span>
          </div>
        </div>
      )}

      {/* Tips */}
      {insights.length > 0 && (
        <div className="tips-container">
          <h3>Personalized Battery Advice</h3>
          <ul>
            {insights.map((tip, idx) => (
              <li key={idx}>⚡ {tip}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        className="btn-primary"
        onClick={onRunNewPrediction}
        style={{ marginTop: '20px' }}
      >
        Run New Prediction
      </button>
    </div>
  );
}
