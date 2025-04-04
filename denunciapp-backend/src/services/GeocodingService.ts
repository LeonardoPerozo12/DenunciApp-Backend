import axios from 'axios';
import dotenv from "dotenv";
dotenv.config(); 

const MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

interface AddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
}

export const reverseGeocoding = async (lat: number, lng: number) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${MAPS_API_KEY}`;

    const { data } = await axios.get(url);

    if (data.status !== 'OK') {
        throw new Error(`Error en la geocodificación: ${data.status}`);
    }

    const addressComponents: AddressComponent[] = data.results[0].address_components;

    // Función para encontrar un componente específico
    const findComponent = (types: string[]) =>
        addressComponents.find((c: AddressComponent) => types.every(t => c.types.includes(t)))?.long_name || "";

    // Retornar los datos extraídos
    return {
        calle: findComponent(["route"]),
        sector: findComponent(["sublocality", "sublocality_level_1"]),
        distrito: findComponent(["administrative_area_level_3"]),
        municipio: findComponent(["locality"]),
        provincia: findComponent(["administrative_area_level_1"]),
        region: findComponent(["administrative_area_level_2"]),
    };
};
