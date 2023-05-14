import { ApiResult, BaseService } from '../base.service';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Country } from './country';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {Apollo, gql} from "apollo-angular";
import {map} from "rxjs/operators";
@Injectable({
  providedIn: 'root',
})
export class CountryService
  extends BaseService<Country> {
  constructor(
    http: HttpClient,
    private apollo: Apollo) {
    super(http);
  }
/*  getData (
    pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string | null,
    filterQuery: string | null
  ): Observable<ApiResult<Country>> {
    var url = this.getUrl("api/Countries");
    var params = new HttpParams()
      .set("pageIndex", pageIndex.toString())
      .set("pageSize", pageSize.toString())
      .set("sortColumn", sortColumn)
      .set("sortOrder", sortOrder);
    if (filterColumn && filterQuery) {
      params = params
      .set("filterColumn", filterColumn)
      .set("filterQuery", filterQuery);
    }
      return this.http.get<ApiResult<Country>>(url, { params });
  }
  get(id: number): Observable<Country> {
    var url = this.getUrl("api/Countries/" + id);
    return this.http.get<Country>(url);
  }
  put(item: Country): Observable<Country> {
    var url = this.getUrl("api/Countries/" + item.id);
    return this.http.put<Country>(url, item);
  }
  post(item: Country): Observable<Country> {
    var url = this.getUrl("api/Countries");
    return this.http.post<Country>(url, item);
  }*/
  getData(
    pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string | null,
    filterQuery: string | null
  ): Observable<ApiResult<Country>> {
    console.log("graphql get countries")
    var params = new HttpParams()
      .set("pageIndex", pageIndex.toString())
      .set("pageSize", pageSize.toString())
      .set("sortColumn", sortColumn)
      .set("sortOrder", sortOrder);

    if (filterColumn && filterQuery) {
      params = params
        .set("filterColumn", filterColumn)
        .set("filterQuery", filterQuery);
    }

    return this.apollo
      .query({
        query: gql`
          query GetCountriesApiResult(
            $pageIndex: Int!,
            $pageSize: Int!,
            $sortColumn: String,
            $sortOrder: String,
            $filterColumn: String,
            $filterQuery: String) {
            countriesApiResult(
              pageIndex: $pageIndex
              pageSize: $pageSize
              sortColumn: $sortColumn
              sortOrder: $sortOrder
              filterColumn: $filterColumn
              filterQuery: $filterQuery
            ){
               data {
                 id
                 name
                 iso2
                 iso3
                 totCities
               },
               pageIndex
               pageSize
               totalCount
               totalPages
               sortColumn
               sortOrder
               filterColumn
               filterQuery
             }
          }
        `,
        variables: {
          pageIndex,
          pageSize,
          sortColumn,
          sortOrder,
          filterColumn,
          filterQuery
        }
      })
      .pipe(map((result: any) =>
        result.data.countriesApiResult));
  }

  get(id: number): Observable<Country> {
    return this.apollo
      .query({
        query: gql`
          query GetCountryById($id: Int!) {
            countries(where: { id: { eq: $id } }) {
              nodes {
                id
                name
                iso2
                iso3
              }
            }
          }
        `,
        variables: {
          id
        }
      })
      .pipe(map((result: any) =>
        result.data.countries.nodes[0]));
  }

  put(item: Country): Observable<Country> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation updateCountry($country: CountryDTOInput!) {
            updateCountry(countryDTO: $country) {
              id
              name
              iso2
              iso3
            }
          }
        `,
        variables: {
          country: item
        }
      })
      .pipe(map((result: any) =>
        result.data.updateCountry));
  }

  post(item: Country): Observable<Country> {
    debugger
    console.log(item)
    return this.apollo
      .mutate({
        mutation: gql`
          mutation addCountry($country: CountryDTOInput!) {
            addCountry(countryDTO: $country) {
              id
              name
              iso2
              iso3
            }
          }
        `,
        variables: {
          country: item
        }
      })
      .pipe(map((result: any) =>
        result.data.addCountry));
  }
  isDupeField(countryId: number, fieldName: string, fieldValue: string): Observable<boolean> {
    var params = new HttpParams()
      .set("countryId", countryId)
      .set("fieldName", fieldName)
      .set("fieldValue", fieldValue);
    var url = this.getUrl("api/Countries/IsDupeField");
    return this.http.post<boolean>(url, null, { params });
  }
}
