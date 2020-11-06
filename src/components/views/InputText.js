import React, { PureComponent } from 'react'
import { TextInput, Text, View } from 'react-native'
import PropTypes from 'prop-types';
import { constants, colors } from "@config"


export default class InputText extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            isFocused: false,
            hasText: false
        };
        this.handleBlur = this.handleBlur.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
    }

    handleFocus() { this.setState({ isFocused: true }); }
    handleBlur() { this.setState({ isFocused: false }); }
    onChangeText(text) {

        this.setState({
            hasText: (text.length > 0)
        });

        if (this.props.onChangeText) {
            this.props.onChangeText(text);
        }
    }

    render() {
        let { label, labelStyle, focusColor, color, style, value, editable, textColor, error, errorColor, ...props } = this.props;
        let { isFocused, hasText } = this.state;

        if (value !== undefined && value.length > 0) {
            hasText = true;
        }

        if (typeof editable === "undefined" || editable) {
            textColor = "#000"
        } else {
            textColor = "#aaa"
        }

        const localLabelStyle = {
            position: 'absolute',
            left: 1,
            top: (isFocused || hasText) ? 0 : (constants.IS_IOS ? 14 : 14),
            fontSize: (isFocused || hasText) ? 14 : 20,
            color: error !== "" ? errorColor : (isFocused ? focusColor : color),
        };


        return (
            <View style={[{ paddingTop: 18, marginTop: 10 }, style]}>
                <Text style={[localLabelStyle, labelStyle]}>
                    {label}
                </Text>
                <TextInput
                    {...props}
                    onChangeText={this.onChangeText}
                    value={value}
                    editable={editable}
                    placeholder={label}
                    placeholderTextColor="transparent"
                    style={{ fontSize: 20, includeFontPadding: false, color: textColor, paddingLeft: 2, paddingVertical:0, margin: 0, borderBottomWidth: 1, borderRadius: 5, borderBottomColor: isFocused ? focusColor : color }}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                />
                {error !== "" &&
                    <Text style={{ fontSize: constants.fonts.xxsmall, paddingLeft: 2, paddingTop: 5, color: colors.primaryDark }}>{error}</Text>
                }
            </View>
        );
    }



}


/*
     bottomColor={colors.disabled}
                                focusColor={colors.primary}
*/
InputText.propTypes = {
    label: PropTypes.string,
    labelStyle: PropTypes.object,
    focusColor: PropTypes.string,
    color: PropTypes.string,
    style: PropTypes.object,
    value: PropTypes.string,
    editable: PropTypes.bool,
    textColor: PropTypes.string,
    error: PropTypes.string,
    errorColor: PropTypes.string
};

InputText.defaultProps = {
    label: "",
    focusColor: "#000",
    color: "#bbb",
    editable: true,
    textColor: "#000",
    error: "",
    errorColor: "#de1623"

};
