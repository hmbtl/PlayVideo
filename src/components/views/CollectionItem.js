import React, { PureComponent } from 'react'
import { Text, StyleSheet, View, Image, TouchableOpacity } from 'react-native'
import { constants, colors, images } from "@config"
import { verticalScale, scale, moderateScale } from "react-native-size-matters"
import PropTypes from 'prop-types';


export default class CollectionItem extends PureComponent {
    width = constants.screenWidth / 2 - 25;

    renderImages(posters) {

        let width = this.width / 2;

        // poster = posters[0];

        /*
        return posters.map(poster => {
            return (<Image
                style={[styles.image, { width: width }]}
                resizeMode="cover"
                source={
                    poster == "" ? images.placeholder :
                        { uri: poster }} />)
        })
        */

        return (
            <View style={{ flexDirection: "column" }}>
                <View style={{ height: width, flexDirection: "row" }}>
                    <Image
                        style={[styles.image, { width: width, borderTopLeftRadius: 10, }]}
                        resizeMode="cover"
                        source={
                            posters.length > 0 ? { uri: posters[0] } : images.placeholder}
                    />
                    <Image
                        style={[styles.image, { width: width, borderTopRightRadius: 10 }]}
                        resizeMode="cover"
                        source={
                            posters.length > 1 ? { uri: posters[1] } : images.placeholder}
                    />
                </View>

                <View style={{ height: width, flexDirection: "row" }}>
                    <Image
                        style={[styles.image, { width: width, borderBottomLeftRadius: 10 }]}
                        resizeMode="cover"
                        source={
                            posters.length > 2 ? { uri: posters[2] } : images.placeholder}
                    />
                    <Image
                        style={[styles.image, { width: width, borderBottomRightRadius: 10 }]}
                        resizeMode="cover"
                        source={
                            posters.length > 3 ? { uri: posters[3] } : images.placeholder}
                    />
                </View>
            </View>

        )
    }

    render() {
        const { poster, title, count, ...otherProps } = this.props;




        if (Array.isArray(poster)) {
            image = this.renderImages(poster);
        } else {
            image = <Image
                style={[styles.image, { width: this.width, borderRadius: 10 }]}
                resizeMode="cover"
                source={
                    poster == "" ? images.placeholder :
                        { uri: poster }} />
        }

        return (
            <View style={styles.container}>
                <TouchableOpacity
                    style={[styles.imageButton, { height: this.width, width: this.width }]}
                    activeOpacity={0.8}
                    {...otherProps}
                >
                    {image}
                </TouchableOpacity>

                <View style={styles.textContainer}>
                    <Text style={[styles.title, { width: this.width }]}>
                        {title}
                    </Text>
                </View>

            </View >

        )
        //  <Text style={styles.countText}>{count} videos</Text>

    }
}

const styles = StyleSheet.create({
    container: {
        paddingLeft: scale(5),
        paddingTop: verticalScale(5),
    },
    imageButton: {
        height: this.width,
        //  width: width,
        borderRadius: 10,
        shadowColor: 'black',
        shadowOffset: {
            width: 1,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 1
    },
    textContainer: {
        padding: moderateScale(5),
    },
    title: {
        fontSize: constants.fonts.medium,
        color: colors.primary,
        //  width: width,
        fontWeight: "600",
    },
    countText: {
        color: "black",
        fontSize: constants.fonts.xsmall,
    },
    image: {
        flex: 1,
        //  width: width,
        borderRadius: 0,
    },
})

CollectionItem.propTypes = {
    title: PropTypes.string,
    poster: PropTypes.any,
};

CollectionItem.defaultProps = {
    title: "Title",
    poster: "",
};


