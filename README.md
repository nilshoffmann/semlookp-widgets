# widgets-semlookp

## About The Project

This project includes a widget component library. The widgets are built with React and TypeScript.
The components can be viewed, built and tested with the included Storybook. After editing a component or adding new ones
the CI/CD pipeline will publish a new package release depending on the analysis of semantic release.
The built registry module can then be integrated into existing projects.

This work was done as part of the NFDI4Health Consortium and is published on behalf of this Consortium (www.nfdi4health.de). 
It is funded by the Deutsche Forschungsgemeinschaft (DFG, German Research Foundation) – project number 442326535.

## Documentation

[![Latest Release](https://gitlab.zbmed.de/km/semlookp/widgets-semlookp/-/badges/release.svg)](https://gitlab.zbmed.de/km/semlookp/widgets-semlookp/-/releases)
[Documentation](http://km.pages.gitlab.zbmed.de/semlookp/widgets-semlookp)

# Built With

- [ReactJS 17](https://reactjs.org/blog/2020/10/20/react-v17.html)
- [TypeScript 4.5](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-5.html)
- [Rollup](https://rollupjs.org)
- [Semantic Release](https://github.com/semantic-release/semantic-release)
- [Elastic UI](https://elastic.github.io/eui/#/)
- [Storybook](https://storybook.js.org/)

# Getting Started with Create React Storybook

## Requirements
The following tool is required to run the storybook.

- [Node.js 16](https://joshtronic.com/2021/05/09/how-to-install-nodejs-16-on-ubuntu-2004-lts/)

## Setup

Before starting the storybook for the first time you must run the following command.
```
npm install
```

## Run Storybook

To start the storybook use the following command

```
npm run storybook
```
Note: The Storybook uses per default the port 6006.

## Publish Components

To publish a new release, add to the commit message the semantic release trigger.

Start the commit with:

```
fix: for new patch release
```

```
feat: for new minor release
```

```
feat: for new major release
BREAKING CHANGE: The new breaking change is...
```

The GitLab CI/CD pipeline will then start semantic release,
publish a new package and increase the version number depending on the commit message.

[Source](https://docs.gitlab.com/ee/ci/examples/semantic-release.html)

## Use Components

To use the module, create a `.npmrc` file in your projects root folder.
Paste your authentication token with read and/or write access to the registry and the registry link.

```
npm config set @km:registry https://gitlab.zbmed.de/api/v4/projects/<project_id>/packages/npm/

npm config set -- '//gitlab.zbmed.de/api/v4/projects/<project_id>/packages/npm/:_authToken' "<your_token>"
```

Then run

```
npm i @km/widgets-semlookp
```

[Source](https://gitlab.zbmed.de/help/user/packages/npm_registry/index)

Note:

- The widgets are based on Elastic UI components. To load the correct appearance of the widgets, wrap them inside the
  `<EuiProvider>` component. Elastic UI needs following peer dependencies as well to work correctly:

```
npm install @elastic/eui @elastic/datemath @emotion/react moment prop-types
```

[Source](https://elastic.github.io/eui/#/utilities/provider)

- If this repository changes its location, you have to make sure that the project ID in the config:

```
npm config set @km:registry https://gitlab.zbmed.de/api/v4/projects/<project_id>/packages/npm/
```

matches the new project ID of this repository.

- The HierarchyWidget uses react-query to fetch data. To make the widget work properly, you have to wrap the component inside a `QueryClientProvider`.

[Source](https://tanstack.com/query/v4/docs/reference/QueryClient?from=reactQueryV3&original=https://react-query-v3.tanstack.com/reference/QueryClient)

## Components

- IriWidget
  - Widget for the iri of a given term
- DescriptionWidget
  - Widget for the description of a widget
- MetaDataWidget
  - Widget that shows the name, iri, ontology hierarchy, description, alternative names, hierarchy and cross-references of a term
- OntologyHierarchyWidget
  - Widget that shows badges of the current term and its ontology
- AlternativeNameTabWidget
  - Widget that shows inside a tab all alternative names of a term
- CrossRefTabWidget
  - Widget that shows inside a tab all cross-references of a term
- HierarchyTabWidget
  - Widget that shows the term hierarchy
- TabWidget
  - Widget that combines the AlternativeNameTabWidget, HierarchyTabWidget, CrossRefTabWidget
- Autocomplete Widget
  - Widget that searches an instance of OLS for matching terms

For more information about the existing widgets and its props, just run the included Storybook and the docs page.
