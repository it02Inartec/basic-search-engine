import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, SearchGifsResponse } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey: string = 'c1UvuOUThcBv51YDH3lNgxUaqAHVZmaD';

  private UrlService: string=  'https://api.giphy.com/v1/gifs';

  private _history: string[] = [];

  public results: Gif[] = [];

  get historial() {
    return [...this._history];
  }

  constructor( private http: HttpClient) {
    // Nota: el simbolo de admiración sirve para decir "confía en mí, sí existe"
    this._history = JSON.parse( localStorage.getItem('history')! ) || [];
    this.results = JSON.parse( localStorage.getItem('results')! ) || [];
    // if ( localStorage.getItem('history') ) {
    //   this._history = JSON.parse( localStorage.getItem('history')! );
    // }
  }

  searchGifs( query: string ) {

    query = query.trim().toLowerCase();

    if ( !this._history.includes(query) ) {
      this._history.unshift( query );
      this._history = this._history.splice(0,10);

      localStorage.setItem('history', JSON.stringify( this._history ) );
    }

    const params = new HttpParams()
                  .set('api_key', this.apiKey)
                  .set('limit', '5')
                  .set('q', query);

    this.http.get<SearchGifsResponse>(`${ this.UrlService }/search`, { params })
    .subscribe( ( resp ) => {
      this.results = resp.data;
      localStorage.setItem('results', JSON.stringify( resp.data ) );
    });

  }
}
