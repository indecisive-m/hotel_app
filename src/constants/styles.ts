import { useWindowDimensions } from "react-native";

export default {
  light: {
    text: "rgb(7, 11, 29)",
    background: "rgb(247, 247, 247)",
    primary: "rgb(252, 128, 3)",
    secondary: "rgb(253, 204, 155)",
    accent: "rgb(0, 94, 255)",
  },

  dark: {
    text: "rgb(226, 230, 248)",
    background: "rgb(8, 8, 8)",
    primary: "rgb(252, 128, 3)",
    secondary: "rgb(100, 51, 2)",
    accent: "rgb(0, 94, 255)",
  },

  fontSize: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
};

export const roomSize = /\d\d[s][q][m]/gim;
