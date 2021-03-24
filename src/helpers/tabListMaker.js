import { renderedTitle } from "./renderedTitle";

export const tabListMaker = (tabList, data) => {
  let tabObjects = [];
  for (let i = 0; i < tabList.length; i++) {
    tabObjects.push({ key: tabList[i], tab: renderedTitle(tabList[i]) });
  }
  let tabContent = {};
  for (let i = 0; i < tabList.length; i++) {
    tabContent[tabList[i]] = data[tabList[i]];
  }
  return { tabContent, tabObjects };
};
