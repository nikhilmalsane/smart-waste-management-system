import { useEffect, useState } from "react";
import { apiRequest } from "../../api/api";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

function StaffMap() {
    const [bins, setBins] = useState([]);

    const fetchBins = async () => {
        try {
            const res = await apiRequest("/bins");
            const user = JSON.parse(localStorage.getItem("user"));

            const myBins = res.bins.filter(
                (bin) => bin.assignedStaff?._id === user._id
            )

            setBins(myBins);
        } catch (error) {
            alert(error.message);
        }
    };

    useEffect(() => {
        fetchBins();
    }, []);

    return (
        <div className="map-container">
            <h2>My Assigned Bins</h2>

            <div className="map-wrapper">
                <MapContainer
                    center={[18.5204, 73.8567]}
                    zoom={13}
                    scrollWheelZoom={true}
                >
                    <TileLayer
                        attribution="&copy; OpenStreetMap contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {
                        bins.map((bin) =>
                            bin.latitude && bin.longitude ? (
                                <Marker key={bin._id} position={[bin.latitude, bin.longitude]}>
                                    <Popup>
                                        <div className="popup">
                                            <strong>{bin.location}</strong>
                                            <br />
                                            Status: <span className={`status ${bin.status}`}>{bin.status}</span>
                                            <br />
                                            Fill Level: {bin.fillLevel}%
                                        </div>
                                    </Popup>
                                </Marker>
                            ) : null
                        )
                    }
                </MapContainer>
            </div>

            <style>{`
                .map-container {
                    padding: 20px;
                    background: #f4f6f8;
                    min-height: 100vh;
                    font-family: Arial, sans-serif;
                }

                h2 {
                    text-align: center;
                    color: #2e7d32;
                    margin-bottom: 15px;
                }

                .map-wrapper {
                    height: 500px;
                    border-radius: 15px;
                    overflow: hidden;
                    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
                }

                .leaflet-container {
                    width: 100%;
                    height: 100%;
                }

                .popup {
                    font-size: 14px;
                }

                .status {
                    font-weight: bold;
                    text-transform: capitalize;
                }

                .status.full {
                    color: red;
                }

                .status.partial {
                    color: orange;
                }

                .status.empty {
                    color: green;
                }
            `}</style>
        </div>
    );
}

export default StaffMap;