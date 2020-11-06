import React, { Component } from 'react'
import { StyleSheet, SafeAreaView, FlatList, Platform, View, Modal, TouchableWithoutFeedback, Text, TextInput, TouchableHighlight, Image } from 'react-native'
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
            collections: []
        }

        this.onPlay = this.onPlay.bind(this);
        this.onLikePressed = this.onLikePressed.bind(this);
        this.onBookmarkPress = this.onBookmarkPress.bind(this);
        this.onSearchFocus = this.onSearchFocus.bind(this)
        this.onViewableItemsChanged = this.onViewableItemsChanged.bind(this)
        this.onShowCollection = this.onShowCollection.bind(this);
        this.addVideoToCollection = this.addVideoToCollection.bind(this);
        this.createCollection = this.createCollection.bind(this);

    }

    componentDidMount() {
        this.setState({
            videos: this.props.videos
        })
    }


    componentDidUpdate(prevProps) {
        if (prevProps.videos !== this.props.videos) {
            this.setState({ videos: this.props.videos })
        }
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

    onSearchFocus() {
        this.props.navigation.navigate("Search")
        if (Platform.OS == "ios") {
            this.searchInput.blur();
        }
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
                                        renderItem={({ index, item }) => (
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

                                        )}
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
                    renderItem={({ index, item }) => (
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
                            title={item.title}
                            description={item.description}
                            onPress={() => this.onPlay(index)}
                            width={item.width}
                            isLiked={item.is_liked}
                            isWatched={item.is_watched}
                            isSaved={item.is_saved}
                        />
                    )}
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
