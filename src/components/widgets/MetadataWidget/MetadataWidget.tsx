import React from "react";
import { EuiFlexGroup, EuiFlexItem } from "@elastic/eui";
import { BreadcrumbWidget } from "./BreadcrumbWidget";
import { IriWidget } from "./IriWidget";
import { TitleWidget } from "./TitleWidget";
import { DescriptionWidget } from "./DescriptionWidget";
import { TabWidget } from "./TabWidget";

export interface MetadataWidgetProps {
  iri: string;
  ontologyID: string;
  api: string;
}

function MetadataWidget(props: MetadataWidgetProps) {
  return (
    <EuiFlexGroup direction="column" style={{ maxWidth: 600 }}>
      <EuiFlexItem grow={false}>
        <span>
          <BreadcrumbWidget iri={props.iri} api={props.api} />
        </span>
      </EuiFlexItem>
      <EuiFlexItem>
        <EuiFlexGroup direction="column">
          <EuiFlexItem>
            <EuiFlexGroup>
              <EuiFlexItem grow={false}>
                <IriWidget iri={props.iri} api={props.api} />
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexItem>

          <EuiFlexItem grow={false}>
            <TitleWidget iri={props.iri} ontologyID={props.ontologyID} api={props.api} objType={"term"} />
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlexItem>
      <EuiFlexItem>
        <DescriptionWidget iri={props.iri} ontologyID={props.ontologyID} api={props.api} objType={"term"} />
      </EuiFlexItem>
      <EuiFlexItem>
        <TabWidget
          iri={props.iri}
          ontologyID={props.ontologyID}
          api={props.api}
        />
      </EuiFlexItem>
    </EuiFlexGroup>
  );
}
export { MetadataWidget };
