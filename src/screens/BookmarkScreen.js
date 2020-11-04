import React, { Component } from 'react'
import { Text, StyleSheet, SafeAreaView, FlatList, View, TextInput, Image } from 'react-native'
import { ButtonImage, CollectionItem, TextHeader, LoadingView, Button, Dialog } from "@component/views";
import api from "@service/api"
import Snackbar from 'react-native-snackbar';
import { colors, constants, images } from "@config"
import { verticalScale, scale } from 'react-native-size-matters';



export default class BookmarkScreen extends Component {

    constructor(props) {
        super(props)

        this.state = {
            collections: [],
            isLoading: true,
            loadingCollection: false,
            showModal: false,
            collectionTitle: "",
            addButtonLoading: false

        }

        this.getCollections = this.getCollections.bind(this);
        this.createCollection = this.createCollection.bind(this);
        this.onCollectionPress = this.onCollectionPress.bind(this);
    }



    onCollectionPress(index) {
        this.props.navigation.navigate("Collection", {
            collection_id: this.state.collections[index].collection_id,
            title: this.state.collections[index].title
        })
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
            }
            this.setState({
                addButtonLoading: false,
                showModal: false,
                collectionTitle: ""
            });


            this.getCollections();
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
                loadingCollection: false,
                collections: collections
            })

        }).catch(() => {
            Snackbar.show({
                text: 'Cannot show collections. Try again later.',
            });

            this.setState({
                loadingCollection: false
            })
        });
    }

    componentDidMount() {
        this.focusListener = this.props.navigation.addListener('willFocus', () => {
            // do something
            this.getCollections();
        });
    }

    componentWillUnmount() {
        this.focusListener.remove();
    }


    render() {

        return (
            <SafeAreaView style={styles.container}>

                <LoadingView
                    style={{ flex: 1 }}
                    isLoading={this.state.loadingCollection}
                >


                    <Dialog
                        onOutsidePress={() => { this.setState({ showModal: false }) }}
                        animationType="fade"
                        transparent={true}
                        visible={this.state.showModal}
                        onRequestClose={() => this.setState({ showModal: false })}
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

                    <View style={styles.headerTitle}>
                        <TextHeader textStyle={{ fontSize: constants.fonts.large }} style={{ marginLeft: 10 }} color={colors.textBlack}>All collections</TextHeader>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={{ alignSelf: "flex-end", textAlign: "right", fontSize: constants.fonts.xsmall }}>add{"\n"}collection</Text>
                            <ButtonImage image={images.add} onPress={() => { this.setState({ showModal: true }) }} />
                        </View>



                    </View>


                    <FlatList
                        data={this.state.collections}
                        horizontal={false}
                        numColumns={2}
                        refreshing={this.state.loadingCollection}
                        onRefresh={this.getCollections}
                        showsVerticalScrollIndicator={false}
                        style={{ paddingLeft: 10, paddingRight: 10, paddingBottom: 30 }}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ index, item }) => (
                            <CollectionItem
                                title={item.title}
                                count={item.total_videos}
                                onPress={() => this.onCollectionPress(index)}
                                poster={item.poster}
                            />
                        )}
                        keyExtractor={item => item.collection_id}
                    />


                </LoadingView>

            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 5,
        backgroundColor: colors.background,
    },
    headerTitle: {
        paddingLeft: scale(10),
        paddingRight: scale(10),
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
    }
})
