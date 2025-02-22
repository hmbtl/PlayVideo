import React, { PureComponent } from 'react';
import { Text, TouchableHighlight, ActivityIndicator, View } from 'react-native';
import PropTypes from 'prop-types';
import { colors, constants } from '@config';

export default class Button extends PureComponent {
  render() {
    /*
        Default style for Button you can change button
        style with props: containerStyle;
    */
    let buttonStyle = {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: this.props.radius,
      padding: 10,
      height: constants.button.height,
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
      backgroundColor: this.props.color
    };

    /*
        Default style for Text within Button. You can change 
        text style with props: textStyle
    */
    let textStyle = {
      fontSize: this.props.textSize,
      color: this.props.textColor,
      textAlign: 'center',
    };


    let onPress = this.props.disabled ? null : this.props.onPress;

    let title = this.props.isLoading ? 'Loading' : this.props.text;

    let color = this.props.color;


    let indicator;
    if (this.props.isLoading) {
      onPress = null;
      color = colors.disabled;
      indicator = (
        <ActivityIndicator
          size="small"
          color="white"
          style={{ marginRight: 5 }}
        />
      );
    }

    buttonStyle.backgroundColor = this.props.disabled ? colors.disabled : color;


    return (
      <TouchableHighlight
        onPress={onPress}
        style={[[buttonStyle, this.props.containerStyle]]}
        underlayColor={this.props.underlayColor}
      >
        <View
          style={[{ flexDirection: "row", justifyContent: "center" }, this.props.style]}
        >
          {indicator}
          <Text style={[textStyle, this.props.textStyle]}>
            {this.props.allCaps ? title.toUpperCase() : title}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }
}

Button.propTypes = {
  color: PropTypes.string,
  text: PropTypes.string,
  isLoading: PropTypes.bool,
  textColor: PropTypes.string,
  disabled: PropTypes.bool,
  onPress: PropTypes.func,
  underlayColor: PropTypes.string,
  textSize: PropTypes.number,
  radius: PropTypes.number,
  allCaps: PropTypes.bool,
  containerStyle: PropTypes.object,
  textStyle: PropTypes.object,
  style: PropTypes.object,
};

Button.defaultProps = {
  color: colors.primary,
  text: 'Button',
  isLoading: false,
  textSize: constants.fonts.small,
  disabled: false,
  textColor: 'white',
  underlayColor: colors.primaryDark,
  radius: 50,
  allCaps: true,
};
