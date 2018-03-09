import React from "react";

import { IPage } from "../../interfaces";

import Store from "../../store";

import Page from "../Page";

export default () => {
  return (
    <>
      {Store.pages.map((page: IPage) => {
        return (
          <Page
            key={page.id}
            page={page}
            selected={Store.tabGroups[0].selectedTab === page.id}
          />
        );
      })}
    </>
  );
};
