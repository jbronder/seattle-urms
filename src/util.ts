import { 
  Point,
  Feature, 
  FeatureCollection,
  Geometry, 
  GeoJsonProperties,
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
  retrofit_level: string,
  building_use: string,
  estimated_number_of_occupants: string,
  confirmation_source: string,
  geocoded_column: Geometry,
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
    features: []
  };

  dataObj.forEach((entry: object) => {
    featureCollection.features.push(makeFeature(entry as BuildingEntry));
  });

  return featureCollection;
}

/**
 * Construct an HTML string to render to the Maplibre Popup.
 * @param fields 
 */
export function makeDescription(fields: MapGeoJSONFeature["properties"]): string {
  const {
    preliminary_risk_category,
    neighborhood,
    address,
    city,
    state,
    zip_code,
    year_built,
    no_stories,
    retrofit_level,
    building_use,
    estimated_number_of_occupants,
    confirmation_source,
  } = fields;

  const popupText = `<p><strong>Category</strong>: ${preliminary_risk_category}</p>
    <p><strong>Neighborhood</strong>: ${neighborhood}</p>
    <p><strong>Address</strong>: ${address}, ${city}, ${state}, ${zip_code}</p>
    <p><strong>Year Built</strong>: ${year_built}</p>
    <p><strong>Stories</strong>: ${no_stories}</p>
    <p><strong>Retrofit Level</strong>: ${retrofit_level}</p>
    <p><strong>Building Use</strong>: ${building_use}</p>
    <p><strong>Estimated Occupant Count</strong>: ${estimated_number_of_occupants}</p>
    <p><strong>Confirmation Source</strong>: ${confirmation_source}</p>`; 

  return popupText;
}
