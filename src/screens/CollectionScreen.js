import React, { Component } from 'react'
import { Text, StyleSheet, View, FlatList, TouchableHighlight, SafeAreaView, Image } from 'react-native'
import { ButtonImage, TextHeader, LoadingView, Button, Dialog } from "@component/views";
import api from "@service/api"
import Snackbar from 'react-native-snackbar';
import { colors, constants, images } from "@config"
import { verticalScale, scale } from 'react-native-size-matters';


export default class CollectionScreen extends Component {

    constructor(props) {
        super(props);

        const { navigation } = this.props;

        this.state = {
            videos: [],
            isLoading: true,
            isRefreshing: false,
            collectionId: navigation.getParam("collection_id", 0),
            title: navigation.getParam("title", ""),
            showModal: false,
            deleteButtonLoading: false
        }

        this.getCollectionVideo = this.getCollectionVideo.bind(this);
        this.deleteCollection = this.deleteCollection.bind(this);
        this.onVideoPress = this.onVideoPress.bind(this);
        this.onVideoLongPress = this.onVideoLongPress.bind(this);
        console.log(this.state.collectionId)
    }

    onVideoPress(index) {
        console.log("Press:" + index)
    }

    onVideoLongPress(index) {
        console.log("LongPress: " + index);
    }

    getCollectionVideo() {
        this.setState({
            isRefreshing: false
        })

        api.getCollectionVideo(this.state.collectionId).then(data => {

            let videos = this.state.videos;

            if (data.status == 'error') {
                Snackbar.show({
                    text: 'Cannot show videos. Try again later.',
                });
            } else {
                videos = data.data;
            }

            this.setState({
                isLoading: false,
                isRefreshing: false,
                videos: videos
            })

        }).catch(() => {
            Snackbar.show({
                text: 'Cannot show videos. Try again later.',
            });

            this.setState({
                isLoading: false,
                isRefreshing: false,
            })
        });
    }

    componentDidMount() {
        this.getCollectionVideo();
    }

    deleteCollection() {
        this.setState({
            deleteButtonLoading: true,
        });

        api.deleteCollection(this.state.collectionId).then(data => {
            if (data.status == 'error') {
                Snackbar.show({
                    text: 'Cannot delete collection. Try again later.',
                });
            }
            this.setState({
                deleteButtonLoading: false,
                showModal: false,
            });


            this.props.navigation.goBack();
        }).catch(() => {
            Snackbar.show({
                text: 'Cannot delete collection. Try again later.',
            });

            this.setState({
                deleteButtonLoading: false,
                showModal: false,
            })
        });
    }


    renderItem({ index, item }) {
        return (
            <TouchableHighlight
                style={styles.imageContainer}
                onPress={() => this.props.navigation.navigate("List", {
                    videos: JSON.stringify(this.state.liked),
                    index: index
                })}
                onLongPress={() => { console.log("long press", index) }}
                underlayColor="#de1623"
            >
                <Image
                    style={styles.image}
                    resizeMode="cover"
                    source={
                        { uri: item.thumb_url }} />

            </TouchableHighlight >
        )
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
                        {this.state.collectionId !== "all" &&
                            <View style={{ flexDirection: "row" }}>
                                <Text style={{ alignSelf: "flex-end", textAlign: "right", fontSize: constants.fonts.xsmall }}>delete{"\n"}collection</Text>
                                <ButtonImage image={images.delete} onPress={() => { this.setState({ showModal: true }) }} />
                            </View>
                        }
                    </View>
                </View>


                <Dialog
                    onOutsidePress={() => { this.setState({ showModal: false }) }}
                    animationType="fade"
                    transparent={true}
                    visible={this.state.showModal}
                    onRequestClose={() => this.setState({ showModal: false })}
                    title="Delete collection"
                >

                    <View
                        style={{ alignItems: "center", padding: 20 }}
                    >
                        <Text>
                            Are you sure you want to delete this collection ?
                        </Text>

                    </View>
                    <Button
                        text="Delete"
                        isLoading={this.state.deleteButtonLoading}
                        onPress={this.deleteCollection}
                        containerStyle={styles.buttonStyle} />
                </Dialog>


                <LoadingView
                    style={styles.container}
                    isLoading={this.state.isLoading}
                >


                    <FlatList
                        data={this.state.videos}
                        horizontal={false}
                        numColumns={3}
                        style={{ marginLeft: 5 }}
                        refreshing={this.state.isRefreshing}
                        onRefresh={this.getCollectionVideo}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ index, item }) => (
                            <TouchableHighlight
                                style={styles.imageContainer}
                                onPress={() => this.props.navigation.navigate("List", {
                                    videos: JSON.stringify(this.state.videos),
                                    index: index,
                                    title: this.state.title
                                })}
                                onLongPress={() => { console.log("long press", index) }}
                                underlayColor="#de1623"
                            >
                                <Image
                                    style={styles.image}
                                    resizeMode="cover"
                                    source={
                                        { uri: item.thumb_url }} />

                            </TouchableHighlight >
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
        backgroundColor: "white"
    },
    headerTitle: {
        paddingRight: scale(10),
        flex: 1,
        height: constants.headerHeight,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    buttonStyle: {
        marginLeft: 40,
        height: 40,
        marginRight: 40,
        marginBottom: 20
    },
    imageContainer: {
        borderColor: "#00000022",
        borderWidth: 1,
        marginLeft: 1,
        borderRadius: 2,
        marginBottom: 1,
    },
    image: {
        width: constants.screenWidth / 3 - 5,
        height: constants.screenWidth / 3 - 5,

    }
})
