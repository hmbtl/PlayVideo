import React, { PureComponent } from "react";
import {
  Text,
  TouchableHighlight,
} from "react-native";
import { colors, constants } from "@config";
import PropTypes from "prop-types";
import { verticalScale, scale } from "react-native-size-matters";

export default class CategoryTab extends PureComponent {
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
        borderRadius: 5,
        borderWidth: 1,
        height: verticalScale(30),
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
        fontWeight: this.props.selected ? "400" : (this.state.isUnderlay ? "400" : "300"),
        textAlign: "center",
        color: this.props.selected ? "white" : (this.state.isUnderlay ? "white" : this.props.textColor)
      }
    }


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

CategoryTab.propTypes = {
  color: PropTypes.string,
  selected: PropTypes.bool,
  selectedColor: PropTypes.string,
  borderColor: PropTypes.string,
  textColor: PropTypes.string,
  name: PropTypes.string,
  onPress: PropTypes.func
};

CategoryTab.defaultProps = {
  color: "#fff",
  selected: false,
  selectedColor: colors.primary,
  textColor: "black",
  name: "tag"
};
