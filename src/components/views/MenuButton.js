import React, { Component } from 'react'
import { Text, StyleSheet, View, TouchableHighlight, Image } from 'react-native'
import { colors, constants, images } from "@config"
import { scale } from 'react-native-size-matters';

export default class MenuButton extends Component {

    constructor(props) {
        super(props);

        this.state = {
            onShow: false,
        }
    }

    render() {
        const { text, ...otherProps } = this.props;

        return (
            <TouchableHighlight style={styles.buttonStyle}
                underlayColor={colors.primary}
                onPress={this.showEditUserModal}
                onShowUnderlay={() => {
                    this.setState({
                        onShow: true
                    })
                }}
                onHideUnderlay={() => {
                    this.setState({
                        onShow: false
                    })
                }}

                {...otherProps}
            >
                <View style={styles.buttonContainer}>
                    <Text style={[styles.buttonText, { color: this.state.onShow ? "white" : "#414141" }]}>{text}</Text>
                    <Image
                        style={[styles.buttonImage, { tintColor: this.state.onShow ? "white" : "#414141" }]}
                        source={images.chevronRight}
                    />
                </View>

            </TouchableHighlight>

        )
    }
}

const styles = StyleSheet.create({
    buttonImage: {
        tintColor: "#414141"
    },
    buttonText: {
        fontSize: constants.fonts.xsmall,
        color: "#414141"
    },
    buttonContainer: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingLeft: scale(30),
        paddingRight: scale(20)
    },
    buttonStyle: {
        height: 40,
        justifyContent: "space-around",
    },

})
