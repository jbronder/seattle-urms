import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
  Point,
} from "geojson";
import { MapGeoJSONFeature } from "maplibre-gl";

interface BuildingEntry {
  preliminary_risk_category: string;
  neighborhood: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  year_built: string;
  no_stories: string;
  retrofit_level: string;
  building_use: string;
  estimated_number_of_occupants: string;
  confirmation_source: string;
  geocoded_column: Geometry;
}

/**
 * Build a GeoJSON Feature.
 * @param entry an API data entry
 */
function makeFeature(entry: BuildingEntry): Feature {
  const feature: Feature = {
    type: "Feature",
    geometry: entry.geocoded_column as Point,
    properties: {} as GeoJsonProperties,
  };

  for (const [prop, value] of Object.entries(entry)) {
    if (prop !== "geocoded_column") {
      feature.properties![prop.toString()] = value;
    } else if (prop === "geocoded_column") {
      feature.geometry = value as Point;
    }
  }
  return feature;
}

/**
 * Converts a JSON response into a GeoJSON object
 * @param urmData
 */
export function makeGeoJSON(urmData: string): FeatureCollection {
  const dataObj: object[] = JSON.parse(urmData);

  const featureCollection: FeatureCollection = {
    type: "FeatureCollection",
    features: [],
  };

  dataObj.forEach((entry: object) => {
    featureCollection.features.push(makeFeature(entry as BuildingEntry));
  });

  return featureCollection;
}

/**
 * Construct an HTML string to render to the Maplibre Popup.
 * @param fields - GeoJSON properties of a `Feature`
 * @returns information describing a URM building
 */
export function makeDescription(
  fields: MapGeoJSONFeature["properties"],
): string {
  const {
    COMPLIANCE_METHOD,
    CONFIRMED_RETROFIT,
    COUNCIL_DISTRICT,
    ECA_LIQUEFACTION,
    ECA_POTENTIAL_SLIDE,
    ECA_STEEP_SLOPE,
    MAF_ADDRESS,
    NEIGHBORHOOD,
    //OBJECTID,
    OCCUPANCY,
    OCCUPANT_LOAD,
    STORIES,
    VULNERABILITY_CLASSIFICATION,
    YEAR_BUILT,
  } = fields;

  let complianceText = "Unknown";
  switch (COMPLIANCE_METHOD) {
    case "1":
      complianceText = "Substantial Alteration per SEBC Section 304.4.2";
      break;
    case "2":
      complianceText = "Alternate Method per SEBC Appendix Chapter 6";
      break;
    case "3a":
      complianceText = "Completed substantial alteration permitted between 09/16/1996- 04/24/2009 using 1994 or later edition of SEBC";
      break;
    case "3b":
      complianceText = "Completed substantial alteration permitted between 04/24/2009-11/15/2024 using the 2006 or later edition of SEBC"
      break;
    case "3c":
      complianceText = "Other, as approved by Code Official";
      break;
  }

  const popupText =
    `<p><strong>Vulnerability Classification</strong>: ${VULNERABILITY_CLASSIFICATION}</p>
    <p><strong>Liquefaction Prone?</strong>: ${ECA_LIQUEFACTION}</p>
    <p><strong>Steep Slope?</strong>: ${ECA_STEEP_SLOPE}</p>
    <p><strong>Potential Slide Area?</strong>: ${ECA_POTENTIAL_SLIDE}</p>
    <p><strong>Neighborhood</strong>: ${NEIGHBORHOOD}</p>
    <p><strong>Address</strong>: ${MAF_ADDRESS}</p>
    <p><strong>Year Built</strong>: ${YEAR_BUILT}</p>
    <p><strong>Stories</strong>: ${STORIES}</p>
    <p><strong>Confirmed Retrofit</strong>: ${CONFIRMED_RETROFIT}</p>
    <p><strong>Compliance Method</strong>: ${complianceText}</p>
    <p><strong>Building Use</strong>: ${OCCUPANCY}</p>
    <p><strong>Estimated Occupant Count</strong>: ${OCCUPANT_LOAD}</p>
    <p><strong>Council District</strong>: ${COUNCIL_DISTRICT}</p>
    `;
  return popupText;
}
