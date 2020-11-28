import React, { Component } from 'react'
import { StyleSheet, SafeAreaView, View } from 'react-native'
import { VideoListView } from "@component/layouts"
import { ButtonImage, TextHeader, LoadingView } from "@component/views"
import { colors, images, constants } from "@config"
import api from "@service/api"
import update from 'immutability-helper';
import { scale } from 'react-native-size-matters';
import Snackbar from 'react-native-snackbar';


export default class WatchedVideosScreen extends Component {

    constructor(props) {
        super(props);


        this.state = {
            videos: [],
            isLoading: true,
            isRefreshing: true,
            isLoadingMore: false,
            hasNext: true,
            paging: {}

        }

        this.getWatchedVideos = this.getWatchedVideos.bind(this)
        this.loadMore = this.loadMore.bind(this);

    }



    loadMore() {
        if (!this.state.isLoadingMore) {
            if ("next" in this.state.paging) {
                this.setState({
                    isLoadingMore: true
                })

                api.getRecentVideos(this.state.paging.next).then(data => {

                    let videos = [];

                    if (data.status == 'error') {
                        Snackbar.show({
                            text: 'Cannot show liked videos. Try again later.',
                        });
                    } else {
                        videos = data.data
                    }

                    //let videosArray = this.state.videos;
                    //videosArray.push(videos);
                    let arr = this.state.videos.slice();
                    arr = arr.concat(videos)



                    this.setState({
                        videos: arr,
                        paging: data.paging,
                        isLoadingMore: false,
                        hasNext: "next" in data.paging
                    })


                }).catch(() => {
                    Snackbar.show({
                        text: 'Cannot show liked videos. Try again later.',
                    });

                });
            }
        }


    }


    componentDidMount() {
        this.getWatchedVideos()
    }

    onViewableItemsChanged({ changed }) {

        changed.forEach(item => {
            if (this.state.videos[item.index].isPlaying) {
                this.setState({
                    videos: update(this.state.videos, {
                        [item.index]: {
                            isPlaying: { $set: false }
                        }
                    })
                })
            }
        })
    }


    getWatchedVideos() {
        this.setState({
            isRefreshing: true
        })
        api.getRecentVideos().then(data => {
            let videos = this.state.videos;

            if (data.status == 'error') {
                Snackbar.show({
                    text: 'Cannot show liked videos. Try again later.',
                });
            } else {
                videos = data.data
            }

            this.setState({
                isLoading: false,
                isRefreshing: false,
                videos: videos,
                paging: data.paging
            })


        }).catch(() => {
            Snackbar.show({
                text: 'Cannot show liked videos. Try again later.',
            });

            this.setState({
                isRefreshing: false
            })

        });
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

                        <TextHeader textStyle={{ fontSize: constants.fonts.medium }} style={{ marginLeft: 5 }} color={colors.textBlack}>Watched videos</TextHeader>

                    </View>
                </View>

                <LoadingView
                    style={{ flex: 1 }}
                    isLoading={this.state.isLoading}
                >

                    <VideoListView
                        videos={this.state.videos}
                        isLoading={this.state.isRefreshing}
                        onRefresh={this.getWatchedVideos}
                        hasNext={this.state.hasNext}
                        navigation={this.props.navigation}
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
