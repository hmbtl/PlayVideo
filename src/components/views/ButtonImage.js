import React, { Component } from "react";
import {
    Image,
    TouchableOpacity
} from "react-native";
import PropTypes from "prop-types";

export default class ButtonImage extends Component {
    render() {


        let onPress = this.props.disabled ? null : this.props.onPress;

        return (
            <TouchableOpacity
                onPress={onPress}
                style={[{ margin: 5 }, this.props.style]}
            >
                <Image
                    source={
                        this.props.selected && this.props.imageFilled !== ""
                            ? this.props.imageFilled
                            : this.props.image
                    }
                    tintColor={this.props.color}
                    style={[{ tintColor: this.props.color }, this.props.imageStyle]}
                />
            </TouchableOpacity>
        );
    }
}

ButtonImage.propTypes = {
    text: PropTypes.string,
    color: PropTypes.string,
    onPress: PropTypes.func,
    selected: PropTypes.bool,
    disabled: PropTypes.bool
};

ButtonImage.defaultProps = {
    text: "",
    disabled: false,
    selected: false,
    imageFilled: "",
    color: null
};
