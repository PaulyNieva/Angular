import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class CiudadesService {
  private static CIUDADES_URL = "http://services.groupkt.com/state/get/{0}/all";
  private static PAISES_URL = "https://restcountries.eu/rest/v2/all";

  constructor(private http: Http) { }
  
  // Obtiene las ciudades en forma asincrona, devuelve una promesa
  getCiudades(pais: string): Promise<Ciudad[]> {
    let url = StringFormat.Format(CiudadesService.CIUDADES_URL, pais);
    return this.http.get(url)
      .toPromise()
      .then(response => response.json().RestResponse.result as Ciudad[])
      .catch(this.handleError);
  }

  // Obtiene la lista de paises en forma asincrona, devuelve una promesa
  getPaises(): Promise<Pais[]> {
    return this.http.get(CiudadesService.PAISES_URL)
      .toPromise()
      .then(response => response.json() as Pais[])
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}

export interface Ciudad {
  country: string;
  name: string;
  abbr: string;
  area: string;
  largest_city: string;
  capital: string;
}

export interface Pais {
  name: string;
  alpha2Code: string;
  alpha3Code: string;
}

export class StringFormat {
    public static Empty: string = "";

    public static isNullOrWhiteSpace(value: string): boolean {
        try {
            if (value == null || value == 'undefined')
                return false;

            return value.replace(/\s/g, '').length < 1;
        }
        catch (e) {
            return false;
        }
    }

    public static Format(value, ...args): string {
        try {
            return value.replace(/{(\d+(:.*)?)}/g, function (match, i) {
                var s = match.split(':');
                if (s.length > 1) {
                    i = i[0];
                    match = s[1].replace('}', '');
                }

                var arg = StringFormat.formatPattern(match, args[i]);
                return typeof arg != 'undefined' && arg != null ? arg : StringFormat.Empty;
            });
        }
        catch (e) {
            return StringFormat.Empty;
        }
    }

    private static formatPattern(match, arg): string {
        switch (match) {
            case 'L':
                arg = arg.toLowerCase();
                break;
            case 'U':
                arg = arg.toUpperCase();
                break;
            default:
                break;
        }

        return arg;
    }
}