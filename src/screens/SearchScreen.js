import React, { Component } from "react";
import {
    StyleSheet,
    FlatList,
    SafeAreaView,
    Modal,
    TouchableWithoutFeedback,
    View,
    Text,
    TouchableHighlight,
    Image,
    StatusBar,
} from "react-native";
import { NavigationEvents } from "react-navigation";
import { images, colors, constants } from "@config";
import { VideoContent } from "@component/layouts"
import { SearchInput } from "@component/views"
import Snackbar from 'react-native-snackbar';
import update from 'immutability-helper';
import api from "@service/api"
import { verticalScale, scale } from 'react-native-size-matters'


export default class SearchScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            movies: [],
            isLoading: false,
            showCollections: false,
            collections: [],
            lastSaveVideoId: 0
        };

        this.search = this.search.bind(this);
        this.onPlay = this.onPlay.bind(this);
        this.onLikePressed = this.onLikePressed.bind(this);
        this.onShowCollection = this.onShowCollection.bind(this);
        this.addVideoToCollection = this.addVideoToCollection.bind(this);
        this.onBookmarkPress = this.onBookmarkPress.bind(this);
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



    onBookmarkPress(index) {

        console.log("pressed here", this.state.movies[index].is_saved)

        this.setState({
            movies: update(this.state.movies, {
                [index]: {
                    is_saved: { $set: !this.state.movies[index].is_saved },
                }
            })
        });

        if (this.state.movies[index].is_saved) {
            console.log("deleted save", this.state.movies[index].is_saved)
            api.deleteVideoSaved(this.state.movies[index].video_id);
        } else {
            console.log("saved video")
            api.saveVideo(this.state.movies[index].video_id);
        }
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
            }

            this.setState({
                showCollections: true,
                collections: collections,
                lastSaveVideoId: this.state.movies[index].video_id
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


    onLikePressed(index) {
        this.setState({
            movies: update(this.state.movies, {
                [index]: {
                    is_liked: { $set: !this.state.movies[index].is_liked },
                    total_like: {
                        $set: this.state.movies[index].is_liked ?
                            parseInt(this.state.movies[index].total_like) - 1 : parseInt(this.state.movies[index].total_like) + 1
                    }
                }
            })
        })

        if (this.state.movies[index].is_liked) {
            api.dislikeVideo(this.state.movies[index].video_id);

        } else {
            api.likeVideo(this.state.movies[index].video_id);
        }

    }

    onPlay(index) {

        let movies = this.state.movies;


        if (!movies[index].is_watched) {
            api.watchVideo(movies[index].video_id)
            movies[index].is_watched = true;
            movies[index].total_watch = parseInt(movies[index].total_watch) + 1
        }


        if (movies[index].isPlaying) {
            movies[index].isPlaying = false
        } else {
            movies.forEach(item => {
                if (item.isPlaying) {
                    item.isPlaying = false
                }
            });
            movies[index].isPlaying = true;
        }

        this.setState({
            movies: movies
        })

    }

    search(event) {

        let text = event.nativeEvent.text;

        this.setState({
            isLoading: true
        });

        if (text !== "") {
            console.log(text)
            api.searchVideos(text).then(data => {
                let movies = this.state.movies;
                if (data.status == 'error') {
                    Snackbar.show({
                        text: 'Search not working. Try again later.',
                    });
                } else {
                    movies = data.data.videos;
                }

                this.setState({
                    movies: movies,
                    isLoading: false
                });
            })
                .catch(() => {
                    Snackbar.show({
                        text: 'Search not working. Try again later.',
                    });
                    this.setState({
                        isLoading: false
                    })
                });
        }
        {
            this.setState({
                movies: [],
                isLoading: false
            });
        }
    }


    render() {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar
                    backgroundColor="white"
                    barStyle="dark-content"
                    translucent={false}
                />

                <NavigationEvents
                    onDidFocus={() => {
                        this.myInput.focus();
                    }}
                />
                <SearchInput
                    ref={input => (this.myInput = input)}
                    returnKeyType="search"
                    autoFocus={true}
                    onSubmitEditing={this.search}
                    placeholderTextColor="#C2C2C2"
                    placeholder="Search video"
                />



                <Modal
                    animationType="slide"
                    transparent={true}
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
                    data={this.state.movies}
                    style={{ flex: 1 }}
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
                            isSaved={item.is_saved}
                            isWatched={item.is_watched}
                        />
                    )}
                    keyExtractor={item => item.video_id}
                />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1
    },
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
    },
    headerText: {
        color: "white",
        fontSize: constants.fonts.small
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
});
