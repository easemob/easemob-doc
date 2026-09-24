export const pathSegmentToCategory = {
  android: "Android",
  ios: "iOS",
  web: "Web",
  applet: "Mini Program",
  harmonyos: "HarmonyOS",
  flutter: "Flutter",
  "react-native": "React Native",
  unity: "Unity",
  windows: "Windows",
  "server-side": "REST API",
  product: "Product",
  push: "Push",
  moderation: "Moderation",
  aigc: "MCP",
  solution_common: "Solution"
};

export const sParamToTab = {
  Android: "sdk",
  iOS: "sdk",
  Web: "sdk",
  "Mini Program": "sdk",
  HarmonyOS: "sdk",
  Flutter: "sdk",
  "React Native": "sdk",
  Unity: "sdk",
  Windows: "sdk",
  rest: "sdk",
  "REST API": "sdk",
  Product: "product",
  Push: "product",
  Moderation: "product",
  MCP: "product",
  Solution: "product",
  console: "product",
  "Android API Reference": "api-reference",
  "iOS API Reference": "api-reference",
  "Web API Reference": "api-reference"
};

export function getTabBySParam(s) {
  return sParamToTab[s] || "product";
}

export function isValidSParam(s) {
  return Object.prototype.hasOwnProperty.call(sParamToTab, s);
}
