import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet + React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Blue Dot for "You Are Here"
const blueDotIcon = new L.DivIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: #3b82f6; width: 15px; height: 15px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
    iconSize: [15, 15],
    iconAnchor: [7, 7]
});

// Component to handle map clicks (for registration)
function ClickHandler({ onClick }) {
    useMapEvents({
        click(e) {
            onClick(e.latlng);
        },
    });
    return null;
}

// Component to center map when location is found
function ChangeView({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, zoom);
        }
    }, [center, zoom, map]);
    return null;
}

const MapComponent = ({
    center = [17.3850, 78.4867], // Default to Hyderabad
    zoom = 13,
    markers = [],
    onMapClick,
    onLocationFound,
    interactive = true
}) => {
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        if (interactive && "geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const loc = [position.coords.latitude, position.coords.longitude];
                    setUserLocation(loc);
                    if (onLocationFound) onLocationFound(loc);
                },
                (error) => console.error("Error getting location:", error),
                { enableHighAccuracy: true }
            );
        }
    }, [interactive, onLocationFound]);

    return (
        <div style={{ height: '100%', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
            <MapContainer
                center={userLocation || center}
                zoom={zoom}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <ChangeView center={userLocation || center} zoom={zoom} />

                {userLocation && (
                    <Marker position={userLocation} icon={blueDotIcon}>
                        <Popup><b>You are here</b></Popup>
                    </Marker>
                )}

                {markers.map((m, idx) => (
                    <Marker key={idx} position={m.position}>
                        {m.title && <Popup><b>{m.title}</b><br />{m.description}</Popup>}
                    </Marker>
                ))}

                {onMapClick && <ClickHandler onClick={onMapClick} />}
            </MapContainer>
        </div>
    );
};

export default MapComponent;
