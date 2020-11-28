import React, { Component } from 'react'
import { StyleSheet, SafeAreaView, FlatList, AppState, View, Modal, TouchableWithoutFeedback, Text, TextInput, TouchableHighlight, Image, ActivityIndicator } from 'react-native'
import VideoContent from "./VideoContent"
import { ButtonImage, Dialog, Button } from "@component/views"
import { colors, constants, images } from "@config"
import api from "@service/api"
import Snackbar from 'react-native-snackbar';
import update from 'immutability-helper';
import { verticalScale, scale } from 'react-native-size-matters'



export default class VideoListView extends Component {

    constructor(props) {
        super(props);

        //this.myInput = React.createRef();

        this.state = {
            paused: true,
            videos: this.props.videos,
            addButtonLoading: false,
            showCreateCollection: false,
            addToNewCollection: false,
            showCollections: false,
            lastSaveVideoId: 0,
            appState: AppState.currentState,
            lastPlay: {
                index: -1,
                viewable: true
            },
            collections: []
        }


        this.viewabilityConfig = {
            itemVisiblePercentThreshold: 50,
        }


        this.onPlay = this.onPlay.bind(this);
        this.onLikePressed = this.onLikePressed.bind(this);
        this.onBookmarkPress = this.onBookmarkPress.bind(this);
        this.onViewableItemsChanged = this.onViewableItemsChanged.bind(this)
        this.onShowCollection = this.onShowCollection.bind(this);
        this.addVideoToCollection = this.addVideoToCollection.bind(this);
        this.createCollection = this.createCollection.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onFullScreenPress = this.onFullScreenPress.bind(this);

    }

    onFocus() {
        let lastPlay = this.state.lastPlay;

        if (lastPlay.viewable) {
            this.onPlay(lastPlay.index, "resume")
        }
    }

    onBlur() {
        this.onPlay(this.state.lastPlay.index, "stop")
    }

    onFullScreenPress(index) {

        let lastPlay = this.state.lastPlay

        lastPlay.index = (lastPlay.index !== index) ? -1 : lastPlay.index

        this.setState({
            lastPlay
        }, () => {
            this.props.navigation.push("FullScreen", {
                video: this.state.videos[index]
            })
        })



    }

    _handleAppStateChange(nextAppState) {
        if (
            this.state.appState.match(/inactive|background/) &&
            nextAppState === "active"
        ) {
            this.onFocus();
        } else if (this.state.appState === "active" && nextAppState.match(/inactive|background/)) {
            this.onBlur();
        }
        this.setState({ appState: nextAppState });
    }

    componentDidMount() {
        this.focusListener = this.props.navigation.addListener('willFocus', () => {
            // do something
            this.onFocus()
        });

        this.blurListener = this.props.navigation.addListener('willBlur', () => {
            // do something
            this.onBlur()
        });

        AppState.addEventListener("change", this._handleAppStateChange);



        this.setState({
            videos: this.props.videos
        })
    }

    componentWillUnmount() {
        AppState.removeEventListener("change", this._handleAppStateChange);
        this.focusListener.remove();
        this.blurListener.remove();
    }


    componentDidUpdate(prevProps) {
        /*
     console.log(prevProps.videos.length, this.props.videos.length)
      if (prevProps.videos.length !== this.props.videos.length) {
          console.log("update")
          this.setState({ videos: this.props.videos })
      }
/*     */
        if (prevProps.videos !== this.props.videos) {
            this.setState({ videos: this.props.videos })
        }
        //*/
    }


    createCollection() {
        this.setState({
            addButtonLoading: true,
        });

        api.createCollection(this.state.collectionTitle).then(data => {
            if (data.status == 'error') {
                Snackbar.show({
                    text: 'Cannot create collection. Try again later.',
                });
            } else {
                const id = data.data.id;

                this.setState({
                    addButtonLoading: false,
                    showCreateCollection: false,
                });

                this.addVideoToCollection(id);
            }


        }).catch(() => {
            Snackbar.show({
                text: 'Cannot create collection. Try again later.',
            });

            this.setState({
                addButtonLoading: false,
                showModal: false,
                collectionTitle: ""
            })
        });
    }


    addVideoToCollection(collection_id) {
        api.addVideoToCollection(collection_id, this.state.lastSaveVideoId).then(data => {
            if (data.status == 'error') {
                Snackbar.show({
                    text: 'Cannot add video to collection. Try again later.',
                });
            } else {
                Snackbar.show({
                    text: 'Video saved to collection.',
                });
            }

            this.setState({
                showCollections: false,
            })

        }).catch(() => {
            Snackbar.show({
                text: 'Cannot add video to collection. Try again later.',
            });

            this.setState({
                showCollections: false
            })
        });
    }

    onShowCollection(index) {

        api.getCollections().then(data => {

            let collections = this.state.collections;

            if (data.status == 'error') {
                Snackbar.show({
                    text: 'Cannot show collections. Try again later.',
                });
            } else {
                collections = data.data;
                collections = collections.filter(item => item.collection_id !== "all")
            }

            this.setState({
                showCollections: true,
                collections: collections,
                lastSaveVideoId: this.state.videos[index].video_id
            })

        }).catch(() => {
            Snackbar.show({
                text: 'Cannot show collections. Try again later.',
            });

            this.setState({
                showCollections: false
            })
        });
    }



    onBookmarkPress(index) {

        this.setState({
            videos: update(this.state.videos, {
                [index]: {
                    is_saved: { $set: !this.state.videos[index].is_saved },
                }
            })
        });

        if (this.state.videos[index].is_saved) {
            api.deleteVideoSaved(this.state.videos[index].video_id);
        } else {
            api.saveVideo(this.state.videos[index].video_id);
        }
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


    onPlay(index, action = undefined) {
        if (index !== -1) {
            this.setState(state => {

                let lastPlay = state.lastPlay;

                lastPlay.index = state.videos[index].isPlaying && action !== "stop" ? -1 : index;

                const videos = state.videos.map((video, j) => {
                    if (j === index) {
                        if (!video.is_watched) {
                            api.watchVideo(video.video_id);

                            video.is_watched = true;
                            video.total_watch = parseInt(video.total_watch) + 1
                        }

                        video.isPlaying = action === "resume" ? true : (action === "stop" ? false : !video.isPlaying)
                    } else if (video.isPlaying) (
                        video.isPlaying = false
                    )
                    return video;
                });

                return {
                    videos,
                    lastPlay
                };
            });
        } else {
            this.setState(state => {
                const videos = state.videos.map((video) => {
                    if (video.isPlaying) (
                        video.isPlaying = false
                    )
                    return video;
                });

                return {
                    videos,
                };
            });
        }

    }



    onViewableItemsChanged({ changed }) {
        let lastPlay = this.state.lastPlay;
        changed.forEach(item => {
            if (lastPlay.index === item.index) {
                lastPlay.viewable = item.isViewable;
                this.setState({
                    lastPlay,
                    videos: update(this.state.videos, {
                        [item.index]: {
                            isPlaying: { $set: item.isViewable }
                        }
                    })
                })
            }
        })

    }

    renderCollectionitem = ({ index, item }) => (
        <View
            style={{ alignItems: "center" }}
        >
            <TouchableHighlight
                style={[styles.imageContainer, { marginRight: index == this.state.collections.length - 1 ? 20 : 0 }]}
                underlayColor="#de1623"
                onPress={() => { this.addVideoToCollection(item.collection_id) }}
            >
                <Image
                    style={styles.image}
                    resizeMode="cover"
                    source={item.poster ?
                        { uri: item.poster } : images.placeholder} />

            </TouchableHighlight >
            <Text
                style={{ fontSize: constants.fonts.xxsmall }}>
                {item.title}
            </Text>
            <Text
                style={{ fontSize: constants.fonts.mini, color: colors.primary }}>
                {item.total_videos} videos
            </Text>


        </View>

    )

    renderFooter = () => {
        if (this.props.hasNext) {
            return (
                <View
                    style={{
                        padding: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <ActivityIndicator
                        size="large"
                        color={colors.primary}
                        style={{ margin: 10 }}
                    />
                </View>
            )
        } else {
            return null
        }
    }

    renderVideoItem = ({ index, item }) => (
        <VideoContent
            id={item.video_id}
            video={item.video_url}
            poster={item.thumb_url}
            paused={!item.isPlaying}
            likeCount={item.total_like}
            watchCount={item.total_watch}
            duration={item.duration}
            onLikePressed={() => this.onLikePressed(index)}
            onBookmarkPress={() => this.onBookmarkPress(index)}
            onShowCollection={() => this.onShowCollection(index)}
            tags={item.tags}
            height={item.height}
            onFullScreenPress={() => this.onFullScreenPress(index)}
            title={item.title}
            description={item.description}
            onPressPlayPause={() => this.onPlay(index)}
            width={item.width}
            isLiked={item.is_liked}
            isWatched={item.is_watched}
            isSaved={item.is_saved}
        />
    )


    render() {
        return (

            <View
                style={{ flex: 1 }}
            >

                <Dialog
                    onOutsidePress={() => { this.setState({ showCreateCollection: false }) }}
                    animationType="fade"
                    transparent={true}
                    visible={this.state.showCreateCollection}
                    onRequestClose={() => this.setState({ showCreateCollection: false })}
                    title="New collection"
                >
                    <View
                        style={{ alignItems: "center", padding: 20 }}
                    >
                        <Image
                            source={images.placeholder}
                            style={styles.imagePlaceholder}
                        />

                        <TextInput
                            value={this.state.collectionTitle}
                            onChangeText={(text) => this.setState({ collectionTitle: text })}
                            style={styles.collectionInput}
                            placeholder="Collection name"
                        />

                    </View>
                    <Button
                        text="Add"
                        isLoading={this.state.addButtonLoading}
                        onPress={this.createCollection}
                        containerStyle={styles.buttonStyle} />
                </Dialog>


                <Modal
                    animationType="slide"
                    transparent={true}
                    onDismiss={() => {
                        if (this.state.addToNewCollection) {
                            this.setState({
                                showCreateCollection: true,
                                addToNewCollection: false
                            })
                        }
                    }}
                    visible={this.state.showCollections}
                    onRequestClose={() => this.setState({ showCollections: false })}
                >
                    <TouchableWithoutFeedback
                        onPress={() => { this.setState({ showCollections: false }) }}
                    >
                        <SafeAreaView
                            style={styles.modalContainer}>

                            <TouchableWithoutFeedback>
                                <View style={styles.bodyContainer}>
                                    <View style={styles.headerContainer}>
                                        <Text style={styles.headerText}>Save to collection</Text>

                                        <View style={{ flexDirection: "row" }}>
                                            <Text style={{ alignSelf: "flex-end", textAlign: "right", fontSize: constants.fonts.xsmall, color: "white" }}>new{"\n"}collection</Text>
                                            <ButtonImage image={images.addWhite} onPress={() => { this.setState({ addToNewCollection: true, showCollections: false }) }} />
                                        </View>
                                    </View>

                                    <FlatList
                                        data={this.state.collections}
                                        horizontal={true}
                                        style={{ padding: 10 }}
                                        showsVerticalScrollIndicator={false}
                                        showsHorizontalScrollIndicator={false}
                                        renderItem={this.renderCollectionitem}
                                        keyExtractor={item => item.collection_id}
                                    />


                                </View>
                            </TouchableWithoutFeedback>
                        </SafeAreaView>
                    </TouchableWithoutFeedback>

                </Modal>



                <FlatList
                    data={this.state.videos}
                    onRefresh={this.props.onRefresh}
                    onViewableItemsChanged={this.onViewableItemsChanged}
                    refreshing={this.props.isLoading}
                    removeClippedSubviews={true}
                    ListFooterComponent={this.renderFooter}
                    onEndReached={this.props.onEndReached}
                    onEndReachedThreshold={0.5}
                    viewabilityConfig={this.viewabilityConfig}
                    renderItem={this.renderVideoItem}
                    keyExtractor={item => item.video_id}
                />

            </View>
        )
    }
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    bodyContainer: {
        width: "100%",
        backgroundColor: "white",
        paddingBottom: 40
    },
    headerContainer: {
        backgroundColor: colors.primary,
        padding: 15,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row"
    },
    headerText: {
        color: "white",
        fontSize: constants.fonts.medium
    },
    imageContainer: {
        margin: 10,
        borderRadius: 10
    },
    image: {
        height: scale(60),
        width: scale(60),
        borderRadius: 10
    },

    collectionInput: {
        marginTop: verticalScale(15),
        fontSize: constants.fonts.medium,
        paddingVertical: 0,
        textAlign: "center"
    },
    imagePlaceholder: {
        height: 100,
        width: 100,
        backgroundColor: colors.disabled,
        borderRadius: 4
    },
    buttonStyle: {
        marginLeft: 40,
        height: 40,
        marginRight: 40,
        marginBottom: 20
    },

})
