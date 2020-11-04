import React, { PureComponent } from "react";
import {
  Text,
  TouchableHighlight,
} from "react-native";
import { colors, constants } from "@config";
import PropTypes from "prop-types";
import { verticalScale, scale } from "react-native-size-matters";

export default class Tag extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isUnderlay: false
    }

  }

  onPress() { }



  render() {

    let localStyle = {
      tagButton: {
        flexDirection: "row",
        borderRadius: 23,
        borderWidth: 0.4,
        backgroundColor: this.props.selected ? this.props.selectedColor : this.props.color,
        borderColor: this.props.borderColor ? this.props.borderColor : this.props.selectedColor,
        alignItems: "center",
        justifyContent: "center",
        paddingLeft: scale(10),
        paddingRight: scale(10),
        margin: 3,
        paddingBottom: verticalScale(3),
        paddingTop: verticalScale(3)

      },
      tagText: {
        fontSize: constants.fonts.small,
        fontWeight: this.props.selected ? "300" : (this.state.isUnderlay ? "300" : "200"),
        textAlign: "center",
        color: this.props.selected ? "white" : (this.state.isUnderlay ? "white" : this.props.textColor)
      }
    }

    if (!this.props.selectable) {

      return (
        <TouchableHighlight
          style={{ padding: 5 }}
          onPress={this.props.onPress}
        >

          <Text
            style={{ fontSize: 15, fontWeight: "600", color: "#0779e4" }}
          >
            #{this.props.name}
          </Text>
        </TouchableHighlight >

      )
    }

    else {

      return (
        <TouchableHighlight
          style={localStyle.tagButton}
          onPress={this.props.onPress}
          onShowUnderlay={() => this.setState({
            isUnderlay: true
          })}
          onHideUnderlay={() => this.setState({
            isUnderlay: false
          })}
          underlayColor={this.props.selectedColor}
        >

          <Text style={localStyle.tagText}
          >
            {this.props.name}
          </Text>
        </TouchableHighlight>
      );
    }

  }

}

Tag.propTypes = {
  color: PropTypes.string,
  selected: PropTypes.bool,
  selectedColor: PropTypes.string,
  borderColor: PropTypes.string,
  textColor: PropTypes.string,
  name: PropTypes.string,
  selectable: PropTypes.bool,
  onPress: PropTypes.func
};

Tag.defaultProps = {
  color: "#F2F2F2",
  selected: false,
  selectedColor: colors.primary,
  textColor: "black",
  selectable: true,
  name: "tag"
};
