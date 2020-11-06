import React, { Component } from 'react'
import { StyleSheet, SafeAreaView, FlatList, StatusBar, Platform, View, } from 'react-native'
import { SearchInput, CategoryTab, LoadingView } from "@component/views"
import { VideoListView } from "@component/layouts"
import { colors } from "@config"
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
            isRefreshing: true,
            selected_category_index: null,
            categories: [],
            recent: [],
            featured: [],
        }

        this.getCategories = this.getCategories.bind(this);
        this.getFeed = this.getFeed.bind(this);
        this.onSearchFocus = this.onSearchFocus.bind(this)
        this.onCategoryPressed = this.onCategoryPressed.bind(this)
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

        }).catch(() => {

            Snackbar.show({
                text: 'Cannot show categories. Try again later.',
            });
            this.setState({
                isLoadingView: false
            })
        });
    }


    onSearchFocus() {
        this.props.navigation.navigate("Search")
        if (Platform.OS == "ios") {
            this.searchInput.blur();
        }
    }


    componentDidMount() {
        this.getCategories();
    }

    getFeed(selected_category_index = null) {
        this.setState({
            isRefreshing: true,
            isLoading: selected_category_index !== this.state.selected_category_index
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
                    isRefreshing: false,
                    isLoading: false
                });
            }).catch(() => {
                Snackbar.show({
                    text: 'Cannot show collections. Try again later.',
                });
                this.setState({
                    isRefreshing: false
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
                    isRefreshing: false,
                    isLoading: false,
                });
            }).catch(() => {
                Snackbar.show({
                    text: 'Cannot show collections. Try again later.',
                });
                this.setState({
                    isRefreshing: false
                })
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

                <LoadingView
                    style={{ flex: 1 }}
                    isLoading={this.state.isLoading}
                >
                    <VideoListView
                        videos={this.state.recent}
                        isLoading={this.state.isRefreshing}
                        onRefresh={() => this.getFeed(this.state.selected_category_index)}
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
})
