import React from "react";
import {EuiLoadingSpinner, EuiProvider, EuiText} from "@elastic/eui";
import {QueryClient, QueryClientProvider, useQuery} from "react-query";
import {OlsApi} from "../../../../api/OlsApi";
import {TabWidgetProps} from "../../../../utils/types";
import { Entity, Thing } from "../../../../model/interfaces";
import { TabPresentation } from "./TabPresentation";
import { getErrorMessageToDisplay } from "../../../../utils/helper";
import { isEntity } from "../../../../model/ModelTypeCheck";
import ReactDOM from "react-dom";

function TabWidget(props: TabWidgetProps) {
  const { iri, api, ontologyId, entityType, parameter, useLegacy, ...rest } = props;
  const olsApi = new OlsApi(api);

  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error
  } = useQuery<Thing>(
    ["tabdata", api, parameter, entityType, iri, ontologyId, useLegacy],
    async () => {
      return olsApi.getEntityObject(iri, entityType, ontologyId, parameter, useLegacy);
    }
  );

  function render(data: Entity) {
    return (
      <TabPresentation
        data={data}
        iri={iri}
        api={api}
        useLegacy={useLegacy}
        entityType={data.getTypePlural()}
      />
    );
  }

  return (
    <>
      {isLoading && <EuiLoadingSpinner />}
      {isError && <EuiText>{getErrorMessageToDisplay(error, "description")}</EuiText>}
      {isSuccess && data &&
        <>
          {isEntity(data) ? render(data) : null}
        </>
      }
    </>
  );
}

function createTab(props: TabWidgetProps, container: any, callback?: ()=>void) {
  ReactDOM.render(WrappedTabWidget(props), container, callback);
}

function WrappedTabWidget(props: TabWidgetProps) {
  const queryClient = new QueryClient();
  return (
      <EuiProvider colorMode="light">
        <QueryClientProvider client={queryClient}>
          <TabWidget
              iri={props.iri}
              api={props.api}
              ontologyId={props.ontologyId}
              entityType={props.entityType}
              parameter={props.parameter}
          />
        </QueryClientProvider>
      </EuiProvider>
  )
}

export { TabWidget, createTab };
