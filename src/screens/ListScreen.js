import React, { PureComponent } from 'react'
import { StyleSheet, SafeAreaView, FlatList, View, Text } from 'react-native'
import { VideoContent } from "@component/layouts"
import { ButtonImage, TextHeader } from "@component/views"
import { colors, images, constants } from "@config"
import api from "@service/api"
import update from 'immutability-helper';
import { verticalScale, scale } from 'react-native-size-matters';



export default class ListScreen extends PureComponent {

    constructor(props) {
        super(props);

        const { navigation } = this.props;

        this.state = {
            videos: JSON.parse(navigation.getParam("videos", "[]")),
            index: parseInt(navigation.getParam("index", 0)),
            title: navigation.getParam("title", "")
        }

        this.onPlay = this.onPlay.bind(this);
        this.onLikePressed = this.onLikePressed.bind(this);
        this.onViewableItemsChanged = this.onViewableItemsChanged.bind(this)
        this.onProgress = this.onProgress.bind(this);
        this.onLoadStart = this.onLoadStart.bind(this);
        this.onReadyForDisplay = this.onReadyForDisplay.bind(this);
    }


    onReadyForDisplay() {

    }

    onProgress(time) {
        console.log(time)
    }

    onLoadStart() {

    }

    onLikePressed(index) {

        this.setState({
            videos: update(this.state.videos, {
                [index]: {
                    is_liked: { $set: !this.state.videos[index].is_liked },
                    total_like: {
                        $set: this.state.videos[index].is_liked ?
                            parseInt(this.state.videos[index].total_like) - 1 : parseInt(this.state.videos[index].total_like) + 1
                    }
                }
            })
        })

        if (this.state.videos[index].is_liked) {
            api.dislikeVideo(this.state.videos[index].video_id);

        } else {
            api.likeVideo(this.state.videos[index].video_id);
        }

    }

    componentDidMount() {
        this._initialScrollIndex = setTimeout(
            () =>
                this.flatListRef.scrollToIndex({ animated: false, index: this.state.index }),
            80
        );
    }

    onPlay(index) {

        let videos = this.state.videos;


        if (!videos[index].is_watched) {
            api.watchVideo(videos[index].video_id);

            videos[index].is_watched = true;
            videos[index].total_watch = parseInt(videos[index].total_watch) + 1
        }


        if (videos[index].isPlaying) {
            videos[index].isPlaying = false
        } else {
            videos.forEach(item => {
                if (item.isPlaying) {
                    item.isPlaying = false
                }
            });
            videos[index].isPlaying = true;
        }

        this.setState({
            videos: videos
        })
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

                <FlatList
                    ref={ref => {
                        this.flatListRef = ref;
                    }}
                    data={this.state.videos}
                    style={{ flex: 1 }}
                    onViewableItemsChanged={this.onViewableItemsChanged}
                    removeClippedSubviews={true}
                    onScrollToIndexFailed={() => { }}
                    renderItem={({ index, item }) => (
                        <VideoContent
                            id={item.video_id}
                            video={item.video_url}
                            poster={item.thumb_url}
                            paused={!item.isPlaying}
                            likeCount={item.total_like}
                            watchCount={item.total_watch}
                            onLoadStart={this.onLoadStart}
                            onProgress={this.onProgress}
                            onReadyForDisplay={this.onReadyForDisplay}
                            duration={item.duration}
                            onLikePressed={() => this.onLikePressed(index)}
                            tags={item.tags}
                            height={item.height}
                            title={item.title}
                            description={item.description}
                            onPress={() => this.onPlay(index)}
                            width={item.width}
                            isLiked={item.is_liked}
                            isWatched={item.is_watched}
                        />
                    )}
                    keyExtractor={item => item.video_id}
                />


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
