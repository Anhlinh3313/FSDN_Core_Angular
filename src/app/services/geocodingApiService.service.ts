import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class GeocodingApiService {
  API_KEY: string;
  API_URL: string;

  constructor(private http: Http) {
    this.API_KEY = environment.gMapKey;
    this.API_URL = `https://maps.googleapis.com/maps/api/geocode/json?key=${this.API_KEY}`;
  }

  async findFromAddressAsync(address: string, postalCode?: string, place?: string, province?: string, region?: string, country?: string): Promise<google.maps.places.PlaceResult> {
    const response = await this.findFromAddress(address, postalCode, place, province, region, country).toPromise();
    // console.log(response);
    if (response.status == "OK") {
      const data = response.results[0];
      let place = response.results[0] as google.maps.places.PlaceResult;
      place.geometry.location = new google.maps.LatLng(data.geometry.location.lat, data.geometry.location.lng);
      return place;
    }
    return null;
  }

  async findFirstFromLatLngAsync(lat: number, lng: number): Promise<google.maps.places.PlaceResult> {
    const response = await this.findFromLatLng(lat, lng).first().toPromise();
    if (response.status == "OK") {
      const data = response.results[0];
      let place = response.results[0] as google.maps.places.PlaceResult;
      place.geometry.location = new google.maps.LatLng(data.geometry.location.lat, data.geometry.location.lng);
      return place;
    }

    return null;
  }

  async findFromLatLngAsync(lat: number, lng: number): Promise<google.maps.places.PlaceResult[]> {
    let listPlaces: google.maps.places.PlaceResult[] = [];
    const response = await this.findFromLatLng(lat, lng).toPromise();
    if (response.status == "OK") {
      let resultLength = response.results.length;

      response.results.forEach(element => {
        let place = element as google.maps.places.PlaceResult;
        place.geometry.location = new google.maps.LatLng(element.geometry.location.lat, element.geometry.location.lng);
        listPlaces.push(place);
      });
    }

    return listPlaces;
  }

  findFromAddress(address: string, postalCode?: string, place?: string, province?: string, region?: string, country?: string): Observable<any> {
    let compositeAddress = [address];

    if (postalCode) compositeAddress.push(postalCode);
    if (place) compositeAddress.push(place);
    if (province) compositeAddress.push(province);
    if (region) compositeAddress.push(region);
    if (country) compositeAddress.push(country);

    let url = `${this.API_URL}&address=${compositeAddress.join(',')}`;

    return this.http.get(url).map(response => <any>response.json());
  }

  findFromLatLng(lat: number, lng: number): Observable<any> {
    let compositeLatLng = [lat, lng];
    let url = `${this.API_URL}&latlng=${compositeLatLng.join(',')}`;

    return this.http.get(url).map(response => <any>response.json());
  }
}