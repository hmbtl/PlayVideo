import React, { Component } from 'react'
import { StyleSheet, SafeAreaView, View } from 'react-native'
import { VideoListView } from "@component/layouts"
import { ButtonImage, TextHeader, LoadingView } from "@component/views"
import { colors, images, constants } from "@config"
import api from "@service/api"
import update from 'immutability-helper';
import { scale } from 'react-native-size-matters';
import Snackbar from 'react-native-snackbar';

export default class ListScreen extends Component {

    constructor(props) {
        super(props);


        this.state = {
            index: this.props.navigation.getParam("index", 0),
            videos: this.props.navigation.getParam("videos", []),
            title: this.props.navigation.getParam("title", "")
        }
    }


    render() {

        return (
            <SafeAreaView style={styles.container}>
                <View style={{ flexDirection: "row", alignItems: "center", paddingLeft: scale(10) }}>
                    <ButtonImage
                        image={images.back}
                        imageStyle={{ height: 25, resizeMode: "contain" }}
                        onPress={() => this.props.navigation.goBack()}
                    />
                    <View style={styles.headerTitle}>
                        <TextHeader textStyle={{ fontSize: constants.fonts.medium }} style={{ marginLeft: 5 }} color={colors.textBlack}>{this.state.title}</TextHeader>
                    </View>
                </View>

                <LoadingView
                    style={{ flex: 1 }}
                    isLoading={this.state.isLoading}
                >

                    <VideoListView
                        videos={this.state.videos}
                        isLoading={this.state.isRefreshing}
                        navigation={this.props.navigation}
                        onRefresh={this.getLikedVideos}
                        hasNext={this.state.hasNext}
                        onEndReached={this.loadMore}
                    />
                </LoadingView>


            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background
    },
    headerTitle: {
        paddingRight: scale(10),
        flex: 1,
        height: constants.headerHeight,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
})
