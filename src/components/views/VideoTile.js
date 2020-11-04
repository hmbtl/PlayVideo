import React, { PureComponent } from "react";
import { Text, StyleSheet, View, TouchableOpacity, Image } from "react-native";
import { constants, colors, images } from "@config";
import { scale, verticalScale } from "react-native-size-matters";


export default class VideoTile extends PureComponent {

    render() {
        console.log(this.props)
        return (
            <TouchableOpacity style={styles.container} onPress={this.props.onPress}>
                <View style={styles.slide}>
                    <Image
                        resizeMode="cover"
                        source={{ uri: this.props.poster }}
                        style={styles.image}
                    />
                </View>
                <Text style={styles.name} numberOfLines={2}>
                    {this.props.title}
                </Text>
                <Text style={styles.category}>{this.props.viewCount} views</Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8,
        borderRadius: 20,
        
    },
    image: {
        height: verticalScale(202)
    },
    slide: {
        borderRadius: 10,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6
        },
        margin: 0,
        shadowOpacity: 0.37,
        shadowRadius: 3.49,
        elevation: 4,
        height: verticalScale(160)
    },
    name: {
        marginTop: 3,
        fontSize: constants.fonts.medium,
        fontWeight: "bold",
        color: colors.red,
        textTransform: "capitalize"
    },
    category: {
        fontSize: constants.fonts.xsmall,
        color: "#575757"
    }
});
