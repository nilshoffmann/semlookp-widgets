import React, { useState } from "react";
import { EuiComboBox } from "@elastic/eui";

export interface SearchWidgetProps {
  api: string;
  onChange({}): void;
  placeholder?: string | undefined;
}

function SearchWidget(props: SearchWidgetProps) {
  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    []
  );
  const [selectedOptions, setSelected] = useState([]);

  function searchTerm(searchValue: string) {
    const options_data: { label: string; value: string }[] = [];
    if (searchValue.length > 0) {
      fetch(`${props.api}search?q=${searchValue}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Content_Type: "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => res?.response?.docs)
        .then((res) => {
          for (const item in res) {
            const obo_short_form = res[item]?.obo_id
              ? res[item].obo_id.toUpperCase()
              : res[item]?.ontology_name == "mesh"
              ? "MESH: " + res[item].short_form.toUpperCase()
              : res[item]?.short_form.toUpperCase();
            options_data.push({
              label: res[item]?.label.toLowerCase() + " | " + obo_short_form,
              value: res[item],
            });
            if (options_data.length > 9) {
              break;
            }
          }
          setOptions(options_data);
        });
    } else {
      setOptions([]);
    }
  }

  const onSearchChange = (searchValue: string) => {
    searchTerm(searchValue);
  };

  //@ts-ignore
  function onChangeHandler(selectedOptions) {
    setSelected(selectedOptions);
    props.onChange(options);
  }

  return (
    <EuiComboBox
      aria-label="searchBar"
      placeholder={props.placeholder ? props.placeholder : "Search for Term"}
      options={options}
      selectedOptions={selectedOptions}
      onChange={onChangeHandler}
      onSearchChange={onSearchChange}
      isClearable
      async={true}
      singleSelection={{ asPlainText: true }}
      className="comboBox"
      fullWidth={true}
    />
  );
}

export { SearchWidget };
