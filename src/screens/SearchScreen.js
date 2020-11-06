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
            movies: [],
            isLoading: false,
        };

        this.search = this.search.bind(this);
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

                <LoadingView
                    style={{ flex: 1 }}
                    isLoading={this.state.isLoading}
                >
                    <VideoListView
                        videos={this.state.movies}
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
