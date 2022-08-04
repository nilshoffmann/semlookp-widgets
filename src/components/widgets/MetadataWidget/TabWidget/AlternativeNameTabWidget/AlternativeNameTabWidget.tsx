import React, { useEffect, useState } from 'react';
import { EuiFlexGroup, EuiFlexItem, EuiPanel, EuiText } from '@elastic/eui';

export interface AlternativeNameTabWidgetProps {
  term: string;
  api: string;
}

function AlternativeNameTabWidget(props: AlternativeNameTabWidgetProps) {
  const [altLabel, setAltLabel] = useState([]);
  const { term, api } = props;

  function renderAltLabel() {
    if (altLabel != null && altLabel.length > 0) {
      const table = altLabel.map((value, index) => <EuiFlexItem key={value + index}>{value}</EuiFlexItem>);
      return table;
    }
    return <EuiText>No alternative names exit for this concept.</EuiText>;
  }

  useEffect(() => {
    const getAltLabel = async () => {
      const altLabelData = await fetch(`${api}terms?iri=${term}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Content_Type: 'application/json',
        },
      })
        .then((response) => response.json())
        .then((response) => response._embedded.terms[0].synonyms);

      setAltLabel(altLabelData);
    };
    getAltLabel().catch((error) => console.log(error));
  }, [props.api, props.term]);

  return (
    <EuiPanel>
      <EuiFlexGroup style={{ padding: 10 }} direction="column">
        {renderAltLabel()}
      </EuiFlexGroup>
    </EuiPanel>

  );
}

export { AlternativeNameTabWidget };
