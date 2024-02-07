import axios, {AxiosInstance, AxiosRequestConfig} from "axios";
import OLS4Class from "../model/ols4-model/OLS4Class";
import OLS4Individual from "../model/ols4-model/OLS4Individual";
import OLS4Property from "../model/ols4-model/OLS4Property";
import OLS3Class from "../model/ols3-model/OLS3Class";
import OLS3Ontology from "../model/ols3-model/OLS3Ontology";
import Thing from "../model/interfaces/Thing";
import OLS3Property from "../model/ols3-model/OLS3Property";
import OLS3Individual from "../model/ols3-model/OLS3Individual";
import OLS4Ontology from "../model/ols4-model/OLS4Ontology";
import OLS3Ontologies from "../model/ols3-model/OLS3Ontologies";
import Ontologies from "../model/interfaces/Ontologies";

interface PaginationParams {
  size?: string;
  page?: string;
}

interface SortingParams {
  sortField: string | number;
  sortDir?: "asc" | "desc";
}

interface ContentParams {
  ontologyId?: string;
  termIri?: string;
  propertyIri?: string;
  individualIri?: string;
  queryString?: string;

}

export type apiCallFn = (paginationParams?: PaginationParams, sortingParams?: SortingParams, contentParams?: ContentParams, parameter?: string, useLegacy?: boolean, abortSignal?: AbortSignal) => Promise<any>;

interface SearchQueryParams {
  query: string;
  exactMatch?: boolean;
  showObsoleteTerms?: boolean;
  types?: string;
  ontology?: string;
  groupByIri?: boolean;
}

interface SelectQueryParams {
  query: string;
}

interface SuggestQueryParams {
  query: string;
}

interface JsTreeParams {
  viewMode?: string;
  siblings?: boolean;
  child?: string;
}

const DEFAULT_SEARCH_RESULTS_PER_PAGE = 10;
const DEFAULT_USE_LEGACY = true;

export class OlsApi {
  private axiosInstance: AxiosInstance;

  constructor(api: string) {
    this.axiosInstance = axios.create({
      baseURL: api,
      headers: {
        Accept: "application/json",
        Content_Type: "application/json",
      },
    });
  }

  private buildParamsForGet(paginationParams?: PaginationParams, sortingParams?: SortingParams, contentParams?: ContentParams, parameter?: string) {
    if (sortingParams) {
      return { ...paginationParams, sort: `${sortingParams.sortField},${sortingParams.sortDir}`, ...contentParams, ...this.buildOtherParams(parameter)};
    }
    return { ...paginationParams, ...contentParams, ...this.buildOtherParams(parameter) };
  }

  private buildPaginationParams(paginationParams?: PaginationParams) {
    const params: any = {
      rows: paginationParams?.size,
    };

    if (paginationParams?.page) {
      if (paginationParams.size) {
        params.start = (+paginationParams.page * +paginationParams.size).toString();
      } else {
        params.start = (+paginationParams.page * DEFAULT_SEARCH_RESULTS_PER_PAGE).toString();
      }
    }

    return params;
  }

  private buildParamsForSearch(queryParams: SearchQueryParams, paginationParams: PaginationParams, contentParams?: ContentParams, parameter?: string) {
    const params: any = {
      q: queryParams.query,
      exact: queryParams.exactMatch,
      obsoletes: queryParams.showObsoleteTerms,
    };

    if (queryParams.groupByIri) {
      params.groupField = queryParams.groupByIri;
    }

    if (queryParams.types) {
      params.type = queryParams.types;
    }

    if (queryParams.ontology) {
      params.ontology = queryParams.ontology;
    }

    return { ...params, ...this.buildPaginationParams(paginationParams), ...contentParams, ...this.buildOtherParams(parameter) };
  }

  /**
   * Function for creating an object from string of parameters for axios input params
   * @param parameter
   * @private
   */
  private buildOtherParams(parameter?: string){
    const result: any = {};
    if (parameter) {
      const paramsSplitted = parameter.split("&")

      paramsSplitted.forEach((param: string) => {
      const key: string = param.split("=")[0]
      const value: string = param.split("=")[1]
      result[key] = value})
    }
    return result
  }

  private buildParamsForSelect(queryParams: SuggestQueryParams, paginationParams?: PaginationParams, contentParams?: ContentParams, parameters?: string) {
    const params: any = {
      q: queryParams.query,
    };

    return { ...params, ...this.buildPaginationParams(paginationParams), ...contentParams,  ...this.buildOtherParams(parameters) };
  }


  private buildParamsForSuggest(queryParams: SuggestQueryParams, paginationParams?: PaginationParams, contentParams?: ContentParams, parameters?: string) {
    const params: any = {
      q: queryParams.query,
    };

    return { ...params, ...this.buildPaginationParams(paginationParams), ...contentParams,  ...this.buildOtherParams(parameters) };
  }

  public check_for_errors(response: any): any {
    // resource not found/illegal argument exception in semanticlookup
    if(response["error"]) {
      throw Error(response["status"] + " " + response["error"] + " - " + response["message"] + " - " + response["exception"] + " at " + response["path"]);
    }
    // empty response - can be caught if this is expected, e.g. for fetching instances
    if(response["page"] !== undefined && response["page"]["totalElements"] === 0) {
      throw Error("Response contains 0 elements");
    }
    return response;
  }

  public getUseLegacy(useLegacy?: boolean): boolean {
    return (useLegacy !== undefined) ? useLegacy : DEFAULT_USE_LEGACY;
  }

  public async makeCall(url: string, config: AxiosRequestConfig<any> | undefined, useLegacy: boolean) {
    const apiVersionPrefix = this.getUseLegacy(useLegacy) ? "" : "v2/";
    const response = (await this.axiosInstance.get(apiVersionPrefix + url, config)).data;
    return this.check_for_errors(response);
  }

  public getOntologies: apiCallFn = async (paginationParams, sortingParams, contentParams, parameter) => {
    const response = (await this.axiosInstance.get("ontologies", { params: this.buildParamsForGet(paginationParams, sortingParams, contentParams, parameter) })).data;
    return this.check_for_errors(response);
  }

  /**
   * Fetch all ontologies. Currently only available for useLegacy since parameters aren't allowed in the OLS v2 API ontologies endpoint
   * @param parameter
   */
  public async getOntologiesData(parameter?: string): Promise<Ontologies> {
    let response;
    response = await this.getOntologies(undefined, undefined, undefined, parameter);
    if (!response || !response["_embedded"] || !response["_embedded"]["ontologies"]) {
      throw new Error("Ontologies data not found"); //TODO consistent error handling
    } else {
      let ontologiesData: OLS3Ontology[];
      ontologiesData = response["_embedded"]["ontologies"].map((ontologyData: any) => {
        return new OLS3Ontology(ontologyData);
      });
      return new OLS3Ontologies(ontologiesData)
    }
  }

  /**
   * Is used to fetch all terms from the api
   * @param paginationParams
   * @param sortingParams
   * @param contentParams
   * @param parameter
   * @param `useLegacy` Depending on the value of `useLegacy`, `"terms"` (`useLegacy == true`) or `"classes"` (`useLegacy == false`) will be used in the query url
   */
  public getTerms: apiCallFn = async (paginationParams, sortingParams, contentParams, parameter, useLegacy?: boolean) => {
    const typePrefix = this.getUseLegacy(useLegacy) ? "terms" : "classes";
    return this.makeCall(typePrefix, { params: this.buildParamsForGet(paginationParams, sortingParams, contentParams) }, this.getUseLegacy(useLegacy));
  }

  public getProperties: apiCallFn = async (paginationParams, sortingParams, contentParams, parameter, useLegacy?: boolean) => {
    return this.makeCall("properties", { params: this.buildParamsForGet(paginationParams, sortingParams, contentParams) }, this.getUseLegacy(useLegacy));
  }

  public getIndividuals: apiCallFn = async (paginationParams, sortingParams, contentParams, parameter, useLegacy?: boolean) => {
    return this.makeCall("individuals", { params: this.buildParamsForGet(paginationParams, sortingParams, contentParams) }, this.getUseLegacy(useLegacy));
  }

  public getOntology: apiCallFn = async (paginationParams, sortingParams, contentParams, parameter, useLegacy?: boolean) => {
    return this.makeCall("ontologies/"+contentParams?.ontologyId, { params: this.buildOtherParams(parameter) }, this.getUseLegacy(useLegacy));
  }

  /**
   * Is used to fetch an entity from the api in ols4 (for ols3, getTerm, getProperty and getIndividual are used respectively).
   * Always requires the respective object IRI in contentParams to be set
   * If ontologyId is undefined in contentParams, the object will be queried from all ontologies, containing a list of results
   * If an ontologyId is provided in contentParams, the returned list will only contain the object from that specific ontology
   */
  public getEntity: apiCallFn = async (paginationParams, sortingParams, contentParams, parameter, useLegacy?: boolean) => {
    const queryPrefix = contentParams?.ontologyId ? "ontologies/"+contentParams?.ontologyId+"/" : ""
    return this.makeCall(queryPrefix+"entities", { params: {iri: contentParams?.termIri, parameter: this.buildOtherParams(parameter)} }, this.getUseLegacy(useLegacy));
  }

  /**
   * Is used to fetch a term from the api
   * @param paginationParams
   * @param sortingParams
   * @param `contentParams` Always requires the respective object IRI in `contentParams` to be set.
   *                      If ontologyId is undefined in contentParams, the object will be queried from all ontologies, containing a list of results.
   *                      If an ontologyId is provided in contentParams, the returned list will only contain the object from that specific ontology.
   * @param parameter
   * @param `useLegacy` Depending on the value of `useLegacy`, `"terms"` (`useLegacy == true`) or `"classes"` (`useLegacy == false`) will be used in the query url
   * @param abortSignal
   */
  public getTerm: apiCallFn = async (paginationParams, sortingParams, contentParams, parameter, useLegacy?: boolean, abortSignal?: AbortSignal) => {
    const ontologyPrefix = contentParams?.ontologyId ? "ontologies/"+contentParams?.ontologyId+"/" : ""
    const typePrefix = this.getUseLegacy(useLegacy) ? "terms" : "classes";
    return this.makeCall(ontologyPrefix + typePrefix, { params: {iri: contentParams?.termIri, parameter: this.buildOtherParams(parameter)}, signal: abortSignal }, this.getUseLegacy(useLegacy));
  }

  /**
   * Is used to fetch a property from the api in ols3.
   * Always requires the respective object IRI in contentParams to be set
   * If ontologyId is undefined in contentParams, the object will be queried from all ontologies, containing a list of results
   * If an ontologyId is provided in contentParams, the returned list will only contain the object from that specific ontology
   */
  public getProperty: apiCallFn = async (paginationParams, sortingParams, contentParams, parameter, useLegacy?: boolean, abortSignal?: AbortSignal) => {
    const queryPrefix = contentParams?.ontologyId ? "ontologies/"+contentParams?.ontologyId+"/" : ""
    return this.makeCall(queryPrefix+"properties", { params: {iri: contentParams?.propertyIri, parameter: this.buildOtherParams(parameter)}, signal: abortSignal }, this.getUseLegacy(useLegacy));
  }

  /**
   * Is used to fetch an individual from the api in ols3.
   * Always requires the respective object IRI in contentParams to be set
   * If ontologyId is undefined in contentParams, the object will be queried from all ontologies, containing a list of results
   * If an ontologyId is provided in contentParams, the returned list will only contain the object from that specific ontology
   */
  public getIndividual: apiCallFn = async (paginationParams, sortingParams, contentParams, parameter, useLegacy?: boolean, abortSignal?: AbortSignal) => {
    const queryPrefix = contentParams?.ontologyId ? "ontologies/"+contentParams?.ontologyId+"/" : ""
    return this.makeCall(queryPrefix+"individuals", { params: {iri: contentParams?.individualIri, parameter: this.buildOtherParams(parameter)}, signal: abortSignal }, this.getUseLegacy(useLegacy));
  }

  public search = async (queryParams: SearchQueryParams, paginationParams: PaginationParams, contentParams?: ContentParams, parameter?: string, abortSignal?: AbortSignal): Promise<any> => {
    return this.makeCall("search", { params: this.buildParamsForSearch(queryParams, paginationParams, contentParams, parameter), signal: abortSignal }, true);
  }

  public select = async(queryParams: SelectQueryParams, paginationParams?: PaginationParams, contentParams?: ContentParams, parameter?: string): Promise<any> => {
    return this.makeCall("select", {params: this.buildParamsForSelect(queryParams, paginationParams, contentParams, parameter) }, true);
  }

  public suggest = async(queryParams: SuggestQueryParams, paginationParams?: PaginationParams, contentParams?: ContentParams, parameter?: string): Promise<any> => {
    return this.makeCall("suggest", { params: this.buildParamsForSuggest(queryParams, paginationParams, contentParams, parameter) }, true);
  }

  /**
   * getTermTree:
   * This method always requires an ontologyId in contentParams
   * 1) If no termIri is defined in contentParams, the ontology roots will be queried
   * 2) If a termIri is defined but no child in jsTreeParams, the hierarchy containing that term will be queried
   * 3) If a termIri is defined and also a child in jsTreeParams, the subhierarchy of that child will be queried
   */
  public getTermTree = async (contentParams: ContentParams, treeParams: JsTreeParams, paginationParams?: PaginationParams, sortingParams?: SortingParams ) => {
    let baseRequest = "ontologies/"+contentParams?.ontologyId+"/terms"
    if (!contentParams.termIri) return (await this.axiosInstance.get(baseRequest+"/roots")).data; //1)
    baseRequest = baseRequest+"/"+encodeURIComponent(encodeURIComponent(contentParams?.termIri))+"/jstree"
    if (treeParams.child) return (await this.axiosInstance.get(baseRequest+"/children/"+treeParams.child)).data; //3)
    else return (await this.axiosInstance.get(baseRequest, { params: treeParams })).data; //2)
  }

  public getTermRelations = async (contentParams: ContentParams, paginationParams?: PaginationParams, sortingParams?: SortingParams ) => {
    let baseRequest = "ontologies/"+contentParams?.ontologyId+"/terms"
    if (!contentParams.termIri) return (await this.axiosInstance.get(baseRequest+"/roots")).data; //1)
    baseRequest = baseRequest+"/"+encodeURIComponent(encodeURIComponent(contentParams?.termIri))+"/graph"
  }

  /**
   * Returns a response Object (implementing 'Class', 'Property', 'Individual' or 'Ontology').
   * Indirectly fetches the response JSON for the specified entityType, iri, ontologyId, parameter and API version (useLegacy).
   *
   * @param entityType
   * @param iri
   * @param ontologyId
   * @param parameter
   * @param useLegacy
   */
  public async getResponseObject(entityType?: string, iri?: string, ontologyId?: string, parameter?: string, useLegacy?: boolean) : Promise<Thing> {
    if(entityType) {
      let response;

      if(entityType === "ontology") {
        if(!ontologyId) throw Error("ontologyId has to be specified if entityType == 'ontology'");
        response = await this.getOntology(undefined, undefined, {ontologyId: ontologyId}, parameter, useLegacy);
        return useLegacy ? new OLS3Ontology(response) : new OLS4Ontology(response);
      }
      else {
        if(!iri) throw Error("iri has to be specified if entityType != 'ontology'");
        switch (entityType) {
          case 'term': case 'class': // also allow "class" even if it should actually be "term"
            response = await this.getTerm(undefined, undefined, {ontologyId: ontologyId, termIri: iri}, parameter, useLegacy);
            return useLegacy ? new OLS3Class(response["_embedded"]["terms"][0]) : new OLS4Class(response["elements"][0]);

          case 'property':
            response = await this.getProperty(undefined, undefined, {ontologyId: ontologyId, propertyIri: iri}, parameter, useLegacy);
            return useLegacy ? new OLS3Property(response["_embedded"]["properties"][0]) : new OLS4Property(response["elements"][0]);

          case 'individual':
            response = await this.getIndividual(undefined, undefined, {ontologyId: ontologyId, individualIri: iri}, parameter, useLegacy);
            return useLegacy ? new OLS3Individual(response["_embedded"]["individuals"][0]) : new OLS4Individual(response["elements"][0]);

          default:
            throw Error("Invalid entity type '" + entityType + "'. Must be one of {'term', 'class', 'ontology', 'property', 'individual'}");
        }
      }
    }
    else {
      if(iri) {
        if(useLegacy) {
          /*
            Test all types of entities (term, property, individual) manually with separate queries (as /entities does not exist for legacy API)
            -> return the response object which resolves with a contained entity
            -> throw error if none of the types contains an entity
          */
          const controller = new AbortController();
          const signal = controller.signal;

          let entity; // stores the entity to be returned in the end

          function setAndStop(response: any, type: "term" | "property" | "individual") {
            if (response["_embedded"] !== undefined) {
              switch (type) {
                case "term":
                  entity = new OLS3Class(response["_embedded"]["terms"][0]);
                  break;
                case "property":
                  entity = new OLS3Property(response["_embedded"]["properties"][0]);
                  break;
                case "individual":
                  entity = new OLS3Individual(response["_embedded"]["individuals"][0]);
                  break;
              }
              controller.abort(); // abort queries for other entityTypes
            }
          }

          await Promise.allSettled(
              [
                this.getTerm(undefined, undefined, {ontologyId: ontologyId, termIri: iri}, parameter, useLegacy, signal)
                    .then((response: any) => {setAndStop(response, "term")}),
                this.getProperty(undefined, undefined, {ontologyId: ontologyId, propertyIri: iri}, parameter, useLegacy, signal)
                    .then((response: any) => {setAndStop(response, "property")}),
                this.getIndividual(undefined, undefined, {ontologyId: ontologyId, individualIri: iri}, parameter, useLegacy, signal)
                    .then((response: any) => {setAndStop(response, "individual")})
              ]
          );

          if(entity !== undefined) return entity;
          else throw Error("Iri " + iri + " could not be resolved.");
        }
        else {
          const response = await this.getEntity(undefined, undefined, {ontologyId: ontologyId, termIri: iri}, parameter, useLegacy);
          const types = response["elements"][0]["type"]

          if(types.includes("class")) {
            return new OLS4Class(response["elements"][0]);
          }
          else if(types.includes("property")) {
            return new OLS4Property(response["elements"][0]);
          }
          else if(types.includes("individual")) {
            return new OLS4Individual(response["elements"][0]);
          }
          else {
            throw Error("Response object does not have a 'type' property");
          }
        }
      }
      else {
        if(!ontologyId) throw Error("ontologyId has to be specified if no iri is specified");
        const response = await this.getOntology(undefined, undefined, {ontologyId: ontologyId}, parameter, useLegacy);
        return useLegacy ? new OLS3Ontology(response) : new OLS4Ontology(response);
      }
    }
  }

  /**
   * Is used to fetch a classes instances from the api.
   * Always requires the respective object IRI in contentParams to be set
   * If ontologyId is undefined in contentParams, the object will be queried from all ontologies, containing a list of results
   * If an ontologyId is provided in contentParams, the returned list will only contain the object from that specific ontology
   */
  public getClassInstances: apiCallFn = async (paginationParams, sortingParams, contentParams, parameter) => {
    const queryPrefix = contentParams?.ontologyId ? "ontologies/"+contentParams?.ontologyId+"/" : ""
    return this.makeCall(queryPrefix+"classes/"+contentParams?.termIri+"/instances", { params: { parameter: this.buildOtherParams(parameter)} }, false);
  }
}
