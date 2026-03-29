import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, LineChart, Line } from "recharts";

function DashboardCharts({ data }) {

  const binStatusData = [
    { name: "Full", value: data.bins.full },
    { name: "Partial", value: data.bins.partial },
    { name: "Empty", value: data.bins.empty },
  ]

  const areaData = data.areaDistribution

  const performanceData = data.areaDistribution.map(a => ({
    area: a.area,
    collections: a.totalCollections || 0
  }))

  return (
    <div className="charts-container">
      <h2>Dashboard Charts</h2>

      <div className="charts-grid">

        <div className="chart-card">
          <h3>Bin Status</h3>
          <PieChart width={300} height={300}>
            <Pie
              data={binStatusData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
            >
              {binStatusData.map((_, index) => (
                <Cell key={index} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        <div className="chart-card">
          <h3>Bins per Area</h3>
          <BarChart width={300} height={300} data={areaData}>
            <XAxis dataKey="area" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="totalBins" />
          </BarChart>
        </div>

        <div className="chart-card">
          <h3>Area Performance</h3>
          <LineChart width={300} height={300} data={performanceData}>
            <XAxis dataKey="area" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="collections" />
          </LineChart>
        </div>

      </div>

      <div className="chart-card">
        <h3>Top Staff</h3>
        {data.topStaff.length === 0 ? (
          <p>No data</p>
        ) : (
          data.topStaff.map((staff, index) => (
            <p key={index}>
              #{index + 1} {staff.name || "Staff"} - {staff.totalCollections}
            </p>
          ))
        )}
      </div>

      <style>{`
        .charts-container {
          margin-top: 20px;
        }

        .charts-container h2 {
          text-align: center;
          color: #2e7d32;
          margin-bottom: 20px;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 20px;
        }

        .chart-card {
          background: #fff;
          padding: 15px;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          text-align: center;
        }

        .chart-card h3 {
          margin-bottom: 10px;
        }

      `}</style>
    </div>
  )
}

export default DashboardCharts;