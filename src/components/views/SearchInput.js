import React, { Component } from 'react'
import { StyleSheet, View, Image, TextInput } from 'react-native'
import { images, colors, constants } from "@config";
import { verticalScale, scale, moderateScale } from 'react-native-size-matters';

class SearchInput extends Component {
    render() {

        const { containerStyle, style, innerRef, imageStyle, ...props } = this.props;

        return (
            <View style={[styles.searchContainer, containerStyle]}>
                <Image source={images.search} style={[{ tintColor: colors.primary, marginTop: 10 }, imageStyle]} />

                <TextInput
                    {...props}
                    ref={innerRef}
                    style={[styles.searchInput, style]}
                    returnKeyType="search"
                    placeholderTextColor="#C2C2C2"
                />

            </View>
        )
    }
}

export default React.forwardRef((props, ref) => <SearchInput
    innerRef={ref} {...props}
/>);

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: verticalScale(20),
        marginRight: verticalScale(20),
        marginBottom: verticalScale(5),
        justifyContent: "center"
    },
    searchInput: {
        flex: 1,
        height: scale(38),
        backgroundColor: "#F2F2F2",
        paddingLeft: verticalScale(20),
        paddingRight: verticalScale(20),
        borderRadius: 12,
        marginLeft: moderateScale(7),
        marginRight: moderateScale(7),
        marginTop: moderateScale(7),
        marginBottom: 0,
        fontSize: constants.fonts.small,
        color: colors.primary
    }
})
