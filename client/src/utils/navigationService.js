import { createNavigationContainerRef } from "@react-navigation/native";
import * as React from "react";

// Create a reference for navigation container
export const navigationRef = createNavigationContainerRef();

export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  } else {
    console.error("Navigation is not ready yet.");
  }
}
