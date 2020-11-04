import React, { Component } from 'react'
import { StyleSheet, SafeAreaView, FlatList, StatusBar, Platform, View, Modal, TouchableWithoutFeedback, Text, TextInput, TouchableHighlight, Image } from 'react-native'
import { VideoContent } from "@component/layouts"
import { SearchInput, CategoryTab, LoadingView, ButtonImage, Dialog, Button } from "@component/views"
import { colors, constants, images } from "@config"
import api from "@service/api"
import Snackbar from 'react-native-snackbar';
import update from 'immutability-helper';
import { verticalScale, scale } from 'react-native-size-matters'



export default class HomeScreen extends Component {

    constructor(props) {
        super(props);

        //this.myInput = React.createRef();

        this.state = {
            paused: true,
            isLoading: true,
            selected_category_index: null,
            categories: [],
            showCreateCollection: false,
            recent: [],
            featured: [],
            showCollections: false,
            lastSaveVideoId: 0,
            collections: []
        }

        this.getCategories = this.getCategories.bind(this);
        this.getFeed = this.getFeed.bind(this);
        this.onPlay = this.onPlay.bind(this);
        this.onLikePressed = this.onLikePressed.bind(this);
        this.onBookmarkPress = this.onBookmarkPress.bind(this);
        this.onSearchFocus = this.onSearchFocus.bind(this)
        this.onViewableItemsChanged = this.onViewableItemsChanged.bind(this)
        this.onCategoryPressed = this.onCategoryPressed.bind(this)
        this.onShowCollection = this.onShowCollection.bind(this);
        this.addVideoToCollection = this.addVideoToCollection.bind(this);
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
            }

            this.setState({
                showCollections: true,
                collections: collections,
                lastSaveVideoId: this.state.recent[index].video_id
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

    onCategoryPressed(index) {

        let selected_category_index = this.state.selected_category_index;

        if (selected_category_index == null) {
            this.setState({
                categories: update(this.state.categories, {
                    [index]: {
                        selected: { $set: !this.state.categories[index].selected },
                    }
                }),
                selected_category_index: index
            });
            selected_category_index = index;
        } else if (selected_category_index == index) {
            this.setState({
                categories: update(this.state.categories, {
                    [index]: {
                        selected: { $set: !this.state.categories[index].selected },
                    }
                }),
                selected_category_index: null
            });
            selected_category_index = null
        } else {
            this.setState({
                categories: update(this.state.categories, {
                    [this.state.selected_category_index]: {
                        selected: { $set: false },
                    },
                    [index]: {
                        selected: { $set: true },
                    }
                }),
                selected_category_index: index
            });
            selected_category_index = index
        }
        this.getFeed(selected_category_index);

    }

    getCategories() {
        this.setState({
            isLoadingView: true
        })

        api.getCategories().then(data => {
            if (data.status == 'error') {
                Snackbar.show({
                    text: 'Cannot show categories. Try again later.',
                });
            } else {
                this.setState({
                    categories: data.data
                })

                this.getFeed();
            }

        }).catch((error) => {

            Snackbar.show({
                text: 'Cannot show categories. Try again later.',
            });
            this.setState({
                isLoadingView: false
            })
        });
    }


    onBookmarkPress(index) {

        this.setState({
            recent: update(this.state.recent, {
                [index]: {
                    is_saved: { $set: !this.state.recent[index].is_saved },
                }
            })
        });

        if (this.state.recent[index].is_saved) {
            api.deleteVideoSaved(this.state.recent[index].video_id);
        } else {
            api.saveVideo(this.state.recent[index].video_id);
        }
    }

    onLikePressed(index) {

        this.setState({
            recent: update(this.state.recent, {
                [index]: {
                    is_liked: { $set: !this.state.recent[index].is_liked },
                    total_like: {
                        $set: this.state.recent[index].is_liked ?
                            parseInt(this.state.recent[index].total_like) - 1 : parseInt(this.state.recent[index].total_like) + 1
                    }
                }
            })
        })

        if (this.state.recent[index].is_liked) {
            api.dislikeVideo(this.state.recent[index].video_id);

        } else {
            api.likeVideo(this.state.recent[index].video_id);
        }

    }

    onSearchFocus() {
        this.props.navigation.navigate("Search")
        if (Platform.OS == "ios") {
            this.searchInput.blur();
        }
    }

    onPlay(index) {

        let recent = this.state.recent;


        if (!recent[index].is_watched) {
            api.watchVideo(recent[index].video_id);

            recent[index].is_watched = true;
            recent[index].total_watch = parseInt(recent[index].total_watch) + 1
        }


        if (recent[index].isPlaying) {
            recent[index].isPlaying = false
        } else {
            recent.forEach(item => {
                if (item.isPlaying) {
                    item.isPlaying = false
                }
            });
            recent[index].isPlaying = true;
        }

        this.setState({
            recent: recent
        })
    }

    onViewableItemsChanged({ changed }) {

        changed.forEach(item => {
            if (this.state.recent[item.index].isPlaying) {
                this.setState({
                    recent: update(this.state.recent, {
                        [item.index]: {
                            isPlaying: { $set: false }
                        }
                    })
                })
            }
        })

    }

    componentDidMount() {
        this.getCategories();
    }

    getFeed(selected_category_index = null) {
        this.setState({
            isLoading: true,
        })



        if (selected_category_index == null) {
            api.getFeed().then(data => {
                let recent = this.state.recent;
                if (data.status == 'error') {
                    Snackbar.show({
                        text: 'Cannot show feed. Try again later.',
                    });
                } else {
                    recent = data.data.recent
                }
                this.setState({
                    recent: recent,
                    isLoading: false
                });
            }).catch(() => {
                Snackbar.show({
                    text: 'Cannot show collections. Try again later.',
                });
                this.setState({
                    isLoading: false
                })
            });
        } else {
            api.getCategoryVideos(this.state.categories[selected_category_index].category_id).then(data => {
                let recent = this.state.recent;
                if (data.status == 'error') {
                    Snackbar.show({
                        text: 'Cannot show feed. Try again later.',
                    });
                } else {
                    recent = data.data
                }
                this.setState({
                    recent: recent,
                    isLoading: false
                });
            }).catch(() => {
                Snackbar.show({
                    text: 'Cannot show collections. Try again later.',
                });
                this.setState({
                    isLoading: false
                })
            });
        }


    }


    render() {
        return (
            <SafeAreaView style={styles.container}>





                <Dialog
                    onOutsidePress={() => { this.setState({ showCreateCollection: false }) }}
                    animationType="fade"
                    transparent={true}
                    visible={this.state.showCreateCollection}
                    onRequestClose={() => this.setState({ showCreateCollection: false })}
                    title="Create collection"
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


                <StatusBar
                    backgroundColor="white"
                    barStyle="dark-content"
                    translucent={false}
                />
                <SearchInput
                    returnKeyType="search"
                    ref={input => (this.searchInput = input)}
                    onFocus={this.onSearchFocus}
                    autoFocus={false}
                    placeholderTextColor="#C2C2C2"
                    placeholder="Search video"
                />

                <View>


                    <FlatList
                        data={this.state.categories}
                        horizontal={true}
                        style={styles.categoryListContainer}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ index, item }) => (
                            <CategoryTab
                                name={item.name}
                                borderColor={item.color_hex}
                                selectedColor={item.color_hex}
                                textColor={item.color_hex}
                                selected={item.selected}
                                onPress={() => this.onCategoryPressed(index)}
                            />
                        )}
                        keyExtractor={item => item.category_id}
                    />

                </View>



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

                                        <View style={{ flexDirection: "row" }}>
                                            <Text style={{ alignSelf: "flex-end", textAlign: "right", fontSize: constants.fonts.xsmall, color: "white" }}>create{"\n"}collection</Text>
                                            <ButtonImage image={images.addWhite} onPress={() => { this.setState({ showCreateCollection: true }) }} />
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


                <LoadingView
                    style={{ flex: 1 }}
                    isLoading={this.state.isLoading}
                >

                    <FlatList
                        data={this.state.recent}
                        onRefresh={() => this.getFeed(this.state.selected_category_index)}
                        onViewableItemsChanged={this.onViewableItemsChanged}
                        refreshing={this.state.isLoading}
                        removeClippedSubviews={true}
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
    categoryListContainer: {
        backgroundColor: "white",
        paddingLeft: scale(5),
        paddingBottom: scale(5),
        paddingRight: verticalScale(10)
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
