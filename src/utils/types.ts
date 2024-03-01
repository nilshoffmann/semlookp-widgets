import {EuiComboBoxProps} from "@elastic/eui/src/components/combo_box/combo_box";
import {EntityTypeName, ThingTypeName} from "../model/ModelTypeCheck";
import {EuiTextProps} from "@elastic/eui/src/components/text/text";
import {Action} from "@elastic/eui/src/components/basic_table/action_types";
import {EuiSuggestProps} from "@elastic/eui/src/components";
import {EuiCardProps} from "@elastic/eui";
import {EuiLinkColor} from "@elastic/eui/src/components/link/link";

type ParameterObj = {
    /**
     * Additional parameters to pass to the API.
     *
     * This parameters can be used to filter the search results. Each parameter can be combined via
     * the special character <i><b>&</b></i>. The values of a parameter key can be combined with a comma sign
     * <i><b>,</b></i>. The following keys could be used:<br/> <br/>
     *  <table>
     *  <thead><tr><th>Parameter</th><th>Description</th></tr></thead>
     *  <tr><td>ontology</td><td>Restrict a search to a set of ontologies e.g. ontology=uberon,mesh</td></tr>
     *  <tr><td>type</td><td>Restrict a search to an entity type, one of {class,property,individual,ontology}</td></tr>
     *  <tr><td>slim</td><td>Restrict a search to a particular set of slims by name</td></tr>
     *  <tr><td>fieldList</td><td>Specify the fields to return. Defaults are {iri,label,short_form,obo_id,ontology_name,ontology_prefix,description,type}</td></tr>
     *  <tr><td>obsoletes</td><td>Set to true to include obsolete terms in the results</td></tr>
     *  <tr><td>local</td><td>Set to true to only return terms that are in a defining ontology, e.g. only return matches to gene ontology terms in the gene ontology, and exclude ontologies where those terms are also referenced</td></tr>
     *  <tr><td>childrenOf</td><td>You can restrict a search to all children of a given term. Supply a list of IRI for the terms that you want to search under (subclassOf/is-a relation only)</td></tr>
     *  <tr><td>allChildrenOf</td><td>You can restrict a search to all children of a given term. Supply a list of IRI for the terms that you want to search under (subclassOf/is-a plus any hierarchical/transitive properties like 'part of' or 'develops from')</td></tr>
     *  <tr><td>rows</td><td>Set results per page</td></tr>
     *  <tr><td>start</td><td>Set the results page number</td></tr>
     *  <tr><td>collection</td><td>Restrict a search to a terminology subset e.g. collection=nfdi4health</td></tr>
     * </table>
     */
    parameter?: string;
};

type ApiObj = {
    /**
     * The API instance for the API call.
     * - **Official OLS4 API of EMBL-EBI**: [https://www.ebi.ac.uk/ols4/api/](https://www.ebi.ac.uk/ols4/api/)
     * - **Official SemLookP API (based on OLS3)**: [https://semanticlookup.zbmed.de/ols/api/](https://semanticlookup.zbmed.de/ols/api/)
     * - **Improved SemLookP API (beta version)**: [https://semanticlookup.zbmed.de/api/](https://semanticlookup.zbmed.de/api/)
     */
    api: string;
};

type UseLegacyObj = {
    /**
     * Specifies the API version used.
     */
     useLegacy?: boolean;
};

type OptionalThingTypeObj = {
    /**
     * Sets the type of the thing whose information you want to fetch.
     */
    thingType?: ThingTypeName;
};

type ForcedThingTypeObj = {
    /**
     * Sets the type of the thing whose information you want to fetch.
     */
    thingType: ThingTypeName;
};

type OptionalEntityTypeObj = {
    /**
     * Sets the type of the entity whose information you want to fetch.
     */
    entityType?: EntityTypeName;
};

// TODO: only temporary for widgets that not yet have entityType optional
type ForcedEntityTypeObj = {
    /**
     * Sets the type of the entity whose information you want to fetch.
     */
    entityType: EntityTypeName;
};

type OptionalOntologyIdObj = {
    /**
     * Select a specific ontology by id
     */
    ontologyId?: string;
}

type ForcedOntologyIdObj = {
    /**
     * Select a specific ontology by id
     */
    ontologyId: string;
}

type OptionalIriObj = {
    /**
     * Entity IRI whose information you want to fetch.
     */
    iri?: string;
}

type ForcedIriObj = {
    /**
     * Entity IRI whose information you want to fetch.
     */
    iri: string;
}

type HasTitleObj = {
    /**
     * Show title, default is true
     */
    hasTitle?: boolean;
}

type ShowBadgesObj = {
    /**
     * If true (default), entity badges linking to their defining ontologies are shown.
     */
    showBadges?: boolean;
}

type TargetLinkObj = {
    /**
     * Possible hyperlink to a corresponding terminology in a Resource Name cell. Set this if you want
     * a hyperlink to the terminology overview of your terminology service. Leave it blank if your application
     * isn't a terminology service.
     */
    targetLink?: string;
}

export type AutocompleteWidgetProps = EuiComboBoxProps<string> & ParameterObj & ApiObj & {
    /**
     * A method that is called once the set of selection changes
     * @param selectedOptions  The selected items
     */
    selectionChangedEvent: (selectedOptions: {
        label: string;
        iri?: string;
        ontology_name?: string;
        type?: string;
    }[]) => void;
    /**
     * Pass a pre select value.
     */
    selectOption?: { label?: string; iri?: string };
    /**
     * Placeholder to show if no user input nor selection is performed.
     */
    placeholder?: string;
    /**
     * If true, only the selected label of the entity is displayed. If false, the ontology and the entity short form is displayed behind the label. Default is true.
     */
    hasShortSelectedLabel?: boolean;
    /**
     * If true, custom terms that are not found in any ontology can be added.
     */
    allowCustomTerms: boolean;
    /**
     * If true, only one concept can be selected at once.
     */
    singleSelection: boolean;
};

export type DataContentWidgetProps = ApiObj & ParameterObj & UseLegacyObj;

export type EntityInfoWidgetProps = ApiObj & OptionalEntityTypeObj & OptionalOntologyIdObj & ForcedIriObj & HasTitleObj & ShowBadgesObj & ParameterObj & UseLegacyObj;

export type EntityRelationsWidgetProps = ApiObj & OptionalEntityTypeObj & OptionalOntologyIdObj & ForcedIriObj & HasTitleObj & ShowBadgesObj & ParameterObj;

export type JsonApiWidgetProps = {
    /**
     * The API query whose response JSON should be displayed on click.
     */
    apiQuery: string;

    /**
     * The text displayed on the button.
     */
    buttonText: string;

    /**
     * Size of the button.
     */
    buttonSize?: "s" | "m";
}

export type BreadcrumbWidgetProps = ApiObj & OptionalEntityTypeObj & OptionalOntologyIdObj & ForcedIriObj & ParameterObj & UseLegacyObj & {
    /**
     * Color of the first badge, can be primary, accent, success, warning, danger, ghost, text, subdued or a hex / rgb value
     */
    colorFirst?: EuiLinkColor | string;

    /**
     * Color of the second badge, can be primary, accent, success, warning, danger, ghost, text, subdued or a hex / rgb value
     */
    colorSecond?: EuiLinkColor | string;
}

export type DescriptionWidgetProps = EuiTextProps & ApiObj & OptionalThingTypeObj & OptionalOntologyIdObj & OptionalIriObj & ParameterObj & UseLegacyObj & {
    /**
     * Set your own text manually that overwrites the text fetched from the API
     */
    descText?: string;

    /**
     * Color of the text, names, hex or rgb
     */
    color?: EuiLinkColor | string;
}

export type IriWidgetProps = ForcedIriObj & ParameterObj & {
    /**
     * Set your own text manually, which will show as a clickable link instead of the IRI.
     */
    iriText?: string;
    /**
     * Color of the text, names, hex or rgb
     */
    color?: EuiLinkColor | string;
}

// TODO: entityType optional for TabWidget
export type TabWidgetProps = ApiObj & ForcedEntityTypeObj & OptionalOntologyIdObj & ForcedIriObj & ParameterObj;

export type AlternativeNameTabWidgetProps = TabWidgetProps;

export type CrossRefWidgetProps = TabWidgetProps;

export type HierarchyWidgetProps = ApiObj & OptionalOntologyIdObj & OptionalIriObj;

export type TitleWidgetProps = ApiObj & OptionalThingTypeObj & OptionalOntologyIdObj & OptionalIriObj & ParameterObj & UseLegacyObj & {
    /**
     * Set your own text manually that overwrites the text fetched from the API
     */
    titleText?: string;

    /**
     * Set the default text shown if the API fails to retrieve one.
     */
    default_value?: string
}

// TODO: entityType optional for MetadataWidget
export type MetadataWidgetProps = ApiObj & ForcedEntityTypeObj & OptionalOntologyIdObj & ForcedIriObj & ParameterObj;

export type OntologyInfoWidgetProps = ApiObj & ForcedOntologyIdObj & HasTitleObj & ShowBadgesObj & ParameterObj & UseLegacyObj;

export type ResourcesWidgetProps = ApiObj & TargetLinkObj & ParameterObj & {
    /**
     * Initial number of entries displayed per page.
     */
    initialEntriesPerPage?: number;

    /**
     * Possible values for number of entries displayed per page.
     */
    pageSizeOptions?: number[];

    /**
     * Column the table is sorted by initially.
     */
    initialSortField?: string;

    /**
     * Initial sorting direction.
     */
    initialSortDir?: "asc" | "desc";

    /**
     * Pass actions to each item in the table.
     */
    actions?: Array<Action<OlsResource>>;
}

export type OlsResource = ForcedOntologyIdObj & {
    loaded: string;
    numberOfTerms: number;
    numberOfProperties: number;
    numberOfIndividuals: number;
    config: {
        title: string;
        description: string;
        preferredPrefix: string;
        allowDownload: boolean;
        fileLocation: string;
        version?: string;
        [otherFields: string]: unknown;
    };
    [otherFields: string]: unknown;
}

export type SearchBarWidgetProps = Omit<EuiSuggestProps, "suggestions" | "onChange" | "onItemClick" | "value"> & ApiObj & ParameterObj & {
    /**
     * The search term to receive suggestions for.
     */
    query: string;

    /**
     * Function to be called when the search value in the search bar changes.
     * @param suggestion
     */
    onSearchValueChange: (suggestion: string) => void;
};

export type SearchResultsListWidgetProps = Partial<Omit<EuiCardProps, "layout">> & ApiObj & TargetLinkObj & ParameterObj & {
    /**
     * The terms to search. By default, the search is performed over term labels, synonyms, descriptions, identifiers and annotation properties.
     */
    query: string;

    /**
     * Initial number of items displayed per page.
     */
    initialItemsPerPage?: number;

    /**
     * Possible values for number of items displayed per page.
     */
    itemsPerPageOptions?: number[];
};

export type MetadataCompactProps = Partial<Omit<EuiCardProps, "layout">> & ApiObj & TargetLinkObj & ParameterObj & {
    result: any;
};