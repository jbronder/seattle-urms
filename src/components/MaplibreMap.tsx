import {useEffect, useRef } from "react";
import maplibregl, { FilterSpecification } from "maplibre-gl";
import { Protocol } from "pmtiles";
import "maplibre-gl/dist/maplibre-gl.css";
import "./maplibremap.css";
import layers from "protomaps-themes-base";

import FilterController from './FilterController.tsx';

// for development only
import outData from "../assets/out.json?raw";
import { makeGeoJSON, makeDescription } from "../util.js";

interface RiskFilter {
  criticalRisk: boolean;
  highRisk: boolean;
  mediumRisk: boolean;
}

function MaplibreMap() {
  const mapGLContainer = useRef<HTMLDivElement | null>(null);
  const mapGL = useRef<maplibregl.Map | null>(null);
  const rf: RiskFilter = {
    criticalRisk: true,
    highRisk: true,
    mediumRisk: true,
  }

  function runRiskFilters(rf: RiskFilter) {
    mapGL.current?.setFilter('point'); 
    const pointFilters: FilterSpecification = ['any'];
    for (const [k, v] of Object.entries(rf)) {
      switch (k) {
        case "criticalRisk":
          if (v) {
            // @ts-ignore
            pointFilters.push(["==", ["get", "preliminary_risk_category"], "Critical Risk"]);
          }
          break;
        case "highRisk":
          if (v) {
            // @ts-ignore
            pointFilters.push(["==", ["get", "preliminary_risk_category"], "High Risk"]);
          }
          break;
        case "mediumRisk":
          if (v) {
            // @ts-ignore
            pointFilters.push(["==", ["get", "preliminary_risk_category"], "Medium Risk"]);
          }
          break;
      }
    }
    mapGL.current?.setFilter('point', pointFilters);
  }

  function handleCriticalFilter(checkCondition: (boolean | 'indeterminate')) {
    if (typeof checkCondition !== "string") {
      rf.criticalRisk = checkCondition;
      runRiskFilters(rf);
    }
  }

  function handleHighFilter(checkCondition: (boolean | 'indeterminate')) {
    if (typeof checkCondition !== "string") {
      rf.highRisk = checkCondition;
      runRiskFilters(rf);
    }
  }

  function handleMediumFilter(checkCondition: (boolean | 'indeterminate')) {
    if (typeof checkCondition !== "string") {
      rf.mediumRisk = checkCondition;
      runRiskFilters(rf);
    }
  }

  useEffect(() => {
    const protocol = new Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);

    if (mapGL.current) {
      return;
    }
    
    mapGL.current = new maplibregl.Map({
      container: mapGLContainer.current!,
      //style: "https://demotiles.maplibre.org/style.json",
      style: {
        version: 8,
        glyphs: "https://cdn.protomaps.com/fonts/pbf/{fontstack}/{range}.pbf",
        sources: {
          protomaps: {
            type: "vector",
            url: `pmtiles://${location.toString()}/seattle.pmtiles`,
            attribution: '<a href="https://protomaps.com">Protomaps</a> © <a href="https://openstreetmap.org">OpenStreetMap</a>'
          }
        },
        layers: layers("protomaps", "light")
      },
      center:  [-122.337059, 47.6335315],
      zoom: 12,
      maxBounds: [
        [-122.451042,47.509988],
        [-122.223076,47.757075]
      ]
    });

    // add on screen zoom and north-orientation
    mapGL.current.addControl(new maplibregl.NavigationControl(), 'bottom-left');

    // loading building points to the map
    mapGL.current.on('load', () => {

      // supplies the map the data points from the API
      mapGL.current!.addSource('point', {
        'type': 'geojson',
        'data': makeGeoJSON(outData)
      });

      // adds the data as a layer to the map
      mapGL.current!.addLayer({
        'id': 'point',
        'type': 'circle',
        'source': 'point',
        'paint': {
            'circle-radius': 5,
            'circle-color': '#118AB2' 
        }
      });

      // enable popup functionality for a single data point
      mapGL.current!.on('click', 'point', (e) => {
        //@ts-ignore
        const coordinates = e.features![0].geometry.coordinates.slice();
        const description = makeDescription(e.features![0].properties);

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new maplibregl.Popup({ maxWidth: "500px", className: 'my-popup' })
          .setLngLat(coordinates)
          .setHTML(description)
          .addTo(mapGL.current!);
      });

    });

    return () => {
      maplibregl.removeProtocol("pmtiles");
    }
  }, []);

  return (
    <>
      <div className="map-wrap">
        <div ref={mapGLContainer} className="map" />
      </div>
      <div className="filter-ctrl-cont">
        <FilterController 
          fnCrCb={handleCriticalFilter}
          fnHrCb={handleHighFilter}
          fnMrCb={handleMediumFilter}
        />
      </div>
    </>
  );
}

export default MaplibreMap;