import React, { Component } from "react";
import {
    StyleSheet,
    SafeAreaView,
    StatusBar,
} from "react-native";
import { NavigationEvents } from "react-navigation";
import { VideoListView } from "@component/layouts"
import { SearchInput, LoadingView } from "@component/views"
import Snackbar from 'react-native-snackbar';
import api from "@service/api"


export default class SearchScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            videos: [],
            isLoading: false,
            isLoadingMore: false,
            keyword: "",
            hasNext: false,
            paging: {}
        };

        this.search = this.search.bind(this);
        this.loadMore = this.loadMore.bind(this);
    }


    loadMore() {
        if (!this.state.isLoadingMore) {
            if ("next" in this.state.paging) {
                this.setState({
                    isLoadingMore: true
                })

                api.searchVideos(this.state.keyword, this.state.paging.next).then(data => {

                    let videos = [];


                    if (data.status == 'error') {
                        Snackbar.show({
                            text: 'Cannot show search results. Try again later.',
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


                }).catch((err) => {
                    console.log(err)
                    Snackbar.show({
                        text: 'Cannot show search results. Try again later.',
                    });

                });
            }
        }

    }




    search(event) {

        let text = event.nativeEvent.text;

        this.setState({
            isLoading: true,
            keyword: text
        });

        if (text !== "") {
            api.searchVideos(text).then(data => {
                let videos = this.state.videos;
                if (data.status == 'error') {
                    Snackbar.show({
                        text: 'Search not working. Try again later.',
                    });
                } else {
                    videos = data.data;
                }

                console.log(data.paging)

                this.setState({
                    videos: videos,
                    isLoading: false,
                    paging: data.paging,
                    hasNext: "next" in data.paging
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
        } else {
            this.setState({
                videos: [],
                isLoading: false,
                hasNext: false,
                paging: {}
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

                <LoadingView
                    style={{ flex: 1 }}
                    isLoading={this.state.isLoading}
                >
                    <VideoListView
                        videos={this.state.videos}
                        onRefresh={this.getWatchedVideos}
                        hasNext={this.state.hasNext}
                        navigation={this.props.navigation}
                        onEndReached={this.loadMore}
                    />

                </LoadingView>


            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1
    },

});
