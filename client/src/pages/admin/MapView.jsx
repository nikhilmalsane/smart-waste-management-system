import { useEffect, useState } from "react"
import { apiRequest } from "../../api/api"
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
})

const getIcon = (status) => {
  let color =
    status === "full"
      ? "red"
      : status === "partial"
      ? "orange"
      : "green"

  return new L.DivIcon({
    className: "custom-marker",
    html: `<div style="
      background:${color}
      width:15px;
      height:15px;
      border-radius:50%;
      border:2px solid white
    "></div>`
  })
}

function MapView() {
  const [bins, setBins] = useState([])

  const fetchBins = async () => {
    try {
      const res = await apiRequest("/bins")
      setBins(res.data)
    } catch (error) {
      alert(error.message)
    }
  }

  useEffect(() => {
    fetchBins()
  }, [])

  return (
    <div className="map-container">
      <h2>Bin Map View</h2>

      <MapContainer
        center={[18.5204, 73.8567]} 
        zoom={13}
        className="map"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {bins.map((bin) => (
          <Marker
            key={bin._id}
            position={[bin.latitude, bin.longitude]}
            icon={getIcon(bin.status)}
          >
            <Popup>
              <div>
                <strong>{bin.location}</strong>
                <br />
                Status: {bin.status}
                <br />
                Fill: {bin.fillLevel}%
                <br />
                Staff:{" "}
                {bin.assignedStaff?.name || "Not Assigned"}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <style>{`
        .map-container {
          padding: 20px;
          font-family: Arial, sans-serif;
        }

        .map-container h2 {
          text-align: center;
          color: #2e7d32;
          margin-bottom: 10px;
        }

        .map {
          height: 500px; /* VERY IMPORTANT */
          width: 100%;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }

      `}</style>
    </div>
  );
}

export default MapView;