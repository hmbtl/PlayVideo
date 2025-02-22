/**
 * @providesModule Constants
 */
import { Dimensions, Platform } from "react-native";
import { verticalScale, moderateScale } from "react-native-size-matters";

const { width: viewportWidth, height: viewportHeight } = Dimensions.get(
  "window"
);
let headerHeight = Platform.OS === "ios" ? 55 : 46;
let footerHeight = 55;

const constants = {
  headerHeight: headerHeight,
  footerHeight: footerHeight,
  viewHeight: viewportHeight - headerHeight,
  viewPadding: 15,
  button: {
    height: verticalScale(40),
    width: verticalScale(100),
  },
  defaultSpacer: 10,
  screenHeight: viewportHeight,
  screenWidth: viewportWidth,
  fonts: {
    mini: moderateScale(8),
    xxsmall:moderateScale(10),
    xsmall: moderateScale(12),
    small: moderateScale(14),
    medium: moderateScale(16),
    large: moderateScale(18),
    xlarge: moderateScale(21),
    xxlarge:moderateScale(25)
  },
  IS_IOS: Platform.OS === "ios" ? true : false,
  IS_ANDROID: Platform.OS === "ios" ? false : true,
  wp: percentage => {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
  }
};

export default constants;
