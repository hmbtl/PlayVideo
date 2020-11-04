import React, { Component } from 'react'
import { Text, StyleSheet, SafeAreaView, FlatList, View, Modal } from 'react-native'
import { ButtonImage, Media, Tag, CollectionItem, TextHeader, VideoTile } from "@component/views";
import api from "@service/api"
import Snackbar from 'react-native-snackbar';
import { colors, constants, images } from "@config"
import { moderateScale, verticalScale } from 'react-native-size-matters';





export default class ProfileScreen extends Component {

    constructor(props) {
        super(props)

        this.state = {
            collections: [],
            liked: [],
            recent: [],
            loadingCollection: false,
            loadingRecent: false,
            loadingLiked: false
        }

        this.getCollections = this.getCollections.bind(this);
        this.getRecentVideos = this.getRecentVideos.bind(this);
        this.getLikedVideos = this.getLikedVideos.bind(this);
    }




    getRecentVideos() {


        api.getRecentVideos().then(data => {
            if (data.status == 'error') {
                Snackbar.show({
                    text: 'Cannot show recent videos. Try again later.',
                });
                this.setState({
                    isCollectionLoading: false,
                    showCollection: false
                })
            } else {

                this.setState({
                    collections: data.data,
                    isCollectionLoading: false
                });
            }
        }).catch(() => {
            Snackbar.show({
                text: 'Cannot show recent videos. Try again later.',
            });
            this.setState({
                isCollectionLoading: false,
                showCollection: false
            })
        });
    }

    getLikedVideos() {

        this.setState({
            loadingLiked: true
        });

        api.getLikedVideos().then(data => {

            let liked = this.state.liked;

            if (data.status == 'error') {
                Snackbar.show({
                    text: 'Cannot show liked videos. Try again later.',
                });
            } else {
                liked = data.data
            }
            this.setState({
                liked: liked,
                loadingLiked: false
            });
        }).catch(() => {
            Snackbar.show({
                text: 'Cannot show liked videos. Try again later.',
            });
            this.setState({
                loadingLiked: false
            })
        });

    }

    getCollections() {

        this.setState({
            loadingCollection: true
        })

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
                isCollectionLoading: false,
                collections: collections
            })

        }).catch(() => {
            Snackbar.show({
                text: 'Cannot show collections. Try again later.',
            });

            this.setState({
                isCollectionLoading: false
            })
        });
    }

    componentDidMount() {
        this.getCollections();
        this.getLikedVideos();
    }


    render() {

        return (
            <SafeAreaView style={styles.container}>

                <View
                    style={{ padding: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
                >
                    <TextHeader textStyle={{ fontSize: constants.fonts.medium }} style={{ marginLeft: 10 }} color={colors.textBlack}>All collections</TextHeader>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={{ alignSelf: "flex-end", textAlign: "right", fontSize: constants.fonts.xsmall }}>add{"\n"}collection</Text>
                        <ButtonImage image={images.add} />
                    </View>



                </View>

                <View
                    style={{ height: verticalScale(210), borderBottomColor: colors.disabled, borderBottomWidth: 1 }}

                >

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={false}
                        onRequestClose={() => {
                            Alert.alert("Modal has been closed.");
                        }}
                    >
                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <View style={{
                                width: 300,
                                padding: 20,
                                height: 300,
                                backgroundColor: "yellow"
                            }}>
                                <Text>
                                    hello bro
                                </Text>
                            </View>
                        </View>

                    </Modal>


                    <FlatList
                        data={this.state.collections}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <CollectionItem
                                title={item.title}
                                count={item.total_videos}
                                poster={item.poster}
                            />
                        )}
                        keyExtractor={item => item.collection_id}
                    />
                </View>


                <TextHeader textStyle={{ fontSize: constants.fonts.medium }} style={{ marginLeft: 10, marginBottom: 5, marginTop: 10 }} color={colors.textBlack}>My liked videos</TextHeader>
                <View
                    style={{ flex: 1 }}
                >

                    <FlatList
                        data={this.state.liked}
                        horizontal={false}
                        numColumns={2}
                        style={{ flex: 1 }}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ index, item }) => (
                            <VideoTile
                                title={item.title}
                                onPress={() => this.props.navigation.navigate("List", {
                                    videos: JSON.stringify(this.state.liked),
                                    index: index
                                })}
                                viewCount={item.total_watch}
                                poster={item.thumb_url}
                            />
                        )}
                        keyExtractor={item => item.video_id}
                    />
                </View>

            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        backgroundColor: colors.background,
    }
})
