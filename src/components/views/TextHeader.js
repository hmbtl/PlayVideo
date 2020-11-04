import React, { PureComponent } from 'react'
import { Text, StyleSheet, View } from 'react-native'
import PropTypes from "prop-types";
import { colors } from '@config';

export default class TextHeader extends PureComponent {
    render() {

        const baseFontSize = 20;
        const fontSize = this.props.textStyle.fontSize;
        const width = this.props.children.length * (fontSize / baseFontSize) * 6;


        return (
            <View style={[{ justifyContent: "flex-start", alignItems: "flex-start" }, this.props.style]}>
                <Text style={[{ color: this.props.color, }, this.props.textStyle]} includeFontPadding={false} >{this.props.children}</Text>
                <View
                    style={{ height: 2, marginLeft: 1, marginTop: 3, backgroundColor: this.props.color, width: width, borderRadius: 20 }}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({})

TextHeader.propTypes = {
    style: PropTypes.object,
    children: PropTypes.string.isRequired,
    text: PropTypes.string,
    color: PropTypes.string
}

TextHeader.defaultProps = {
    textStyle: {
        fontSize: 20
    },
    text: "Header",
    color: colors.primary
}