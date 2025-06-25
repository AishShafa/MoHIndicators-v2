import React, { useState, useEffect } from "react";
import { MapContainer, GeoJSON, TileLayer } from "react-leaflet";
import * as XLSX from "xlsx";
import mapData from "./../../../data/maldives.geojson"; // GeoJSON file
import "leaflet/dist/leaflet.css";
import xl from "../../../data/fake_filtered_health_data.xlsx"

const IslandMap = () => {
  const [excelData, setExcelData] = useState([]);

  useEffect(() => {
    // Load Excel file
    const loadExcelData = async () => {
      try {
        const res = await fetch(xl); // Update the path
        const arrayBuffer = await res.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        setExcelData(jsonData);
      } catch (err) {
        console.error("Error loading Excel file:", err);
      }
    };
    loadExcelData();
  }, []);

  // Match island data by location
  const getIslandData = (location) => {
    if (!location || !excelData.length) return null;
    return excelData.find((row) => row.Location?.toLowerCase() === location.toLowerCase());
  };

  // Assign colors dynamically based on data values
  const getColor = (value) => {
    return value > 4000
      ? "#800026"
      : value > 3000
      ? "#BD0026"
      : value > 2000
      ? "#E31A1C"
      : value > 1000
      ? "#FC4E2A"
      : value > 500
      ? "#FD8D3C"
      : "#FFEDA0";
  };

  // Style for each GeoJSON feature
  const style = (feature) => {
    const islandData = getIslandData(feature.properties.COUNTRY);
    const value = islandData?.Value || 0;
    return {
      fillColor: getColor(value),
      weight: 2,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: 0.7,
    };
  };

  // Add interactivity to each feature
  const onEachFeature = (feature, layer) => {
    const islandName = feature.properties.COUNTRY;
    const islandData = getIslandData(islandName);

    const popupContent = islandData
      ? `<b>Location:</b> ${islandName}<br/>
         <b>Value:</b> ${islandData.Value}<br/>
         <b>Year:</b> ${islandData.Year}<br/>
         <b>Indicator:</b> ${islandData.Indicator}`
      : `<b>Location:</b> ${islandName}<br/>No data available`;

    layer.bindPopup(popupContent);

    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 5,
          color: "#666",
          dashArray: "",
          fillOpacity: 0.7,
        });
      },
      mouseout: (e) => {
        layer.setStyle(style(feature));
      },
      click: () => layer.openPopup(),
    });
  };

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Dynamic Choropleth Map</h1>
      <MapContainer style={{ height: "80vh" }} zoom={6} center={[3.2, 73.22]}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <GeoJSON
          data={mapData.features}
          style={style}
          onEachFeature={onEachFeature}
        />
      </MapContainer>
    </div>
  );
};

export default IslandMap;