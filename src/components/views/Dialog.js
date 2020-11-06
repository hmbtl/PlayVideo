import React, { Component } from 'react'
import { Text, StyleSheet, View, Modal, TouchableWithoutFeedback } from 'react-native'
import { colors, constants } from "@config"
import { scale } from 'react-native-size-matters';


export default class Dialog extends Component {
    render() {

        const { onOutsidePress, title, headerStyle, style, ...otherProps } = this.props;
        return (

            <Modal
                animationType="fade"
                transparent={true}
                statusBarTranslucent={true}
                {...otherProps}
            >
                <TouchableWithoutFeedback
                    onPress={onOutsidePress}
                >
                    <View
                        style={styles.container}>

                        <TouchableWithoutFeedback>
                            <View style={[styles.bodyContainer, style]}>
                                <View style={[styles.headerContainer, headerStyle]}>
                                    <Text style={styles.headerText}>{title}</Text>
                                </View>

                                {this.props.children}
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>

            </Modal>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: "#000000cc",
        alignItems: 'center'
    },
    bodyContainer: {
        width: constants.screenWidth - 60,
        borderRadius: 10,
        backgroundColor: "white"
    },
    headerContainer: {
        backgroundColor: colors.primary,
        padding: 15,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    headerText: {
        color: "white",
        fontSize: constants.fonts.small
    }
})
