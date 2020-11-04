import React, { Component } from 'react'
import { Text, StyleSheet, SafeAreaView, ImageBackground, Image, View } from 'react-native'
import Snackbar from 'react-native-snackbar';
import { images, colors } from "@config"
import { CardView, Button, Tag, TextHeader, LoadingView } from "@component/views"
import api from "@service/api"
import { verticalScale, scale } from "react-native-size-matters"



export default class TagsScreen extends Component {


    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            isLoading: false,
            tags: [],
            isLoadingTags: true
        }

        this.onSetTags = this.onSetTags.bind(this);
        this.getTags = this.getTags.bind(this);
        this.onPressTag = this.onPressTag.bind(this);
    }

    componentDidMount() {
        this.getTags();
    }

    onPressTag(index) {
        let tags = this.state.tags;

        tags[index].selected = tags[index].selected ? false : true;

        this.setState({
            tags: tags
        });
    }

    getTags() {
        api.getTags().then(data => {

            if (data.status == 'error') {
                Snackbar.show({
                    text: 'System error. Try again later.',
                });
                this.setState({
                    isLoadingTags: false
                });
            } else {
                let tags = data.data;

                this.setState({
                    tags: tags,
                    isLoadingTags: false
                });
            }
        })
            .catch(() => {
                Snackbar.show({
                    text: 'System error. Try again later.',
                });
                this.setState({
                    isLoadingTags: false
                });
            });
    }

    onSetTags() {
        this.setState({
            isLoading: true,
        });

        let tags = this.state.tags;

        var selectedTags = tags.reduce(function (filtered, option) {
            if (option.selected) {
                filtered.push(option.tag_id);
            }
            return filtered;
        }, []);

        if (selectedTags.length === 0) {
            this.props.navigation.navigate('Home')
        } else {
            api.addUserTags(selectedTags)
                .then(data => {
                    this.setState({
                        isLoading: false,
                    });

                    console.log(data);
                    if (data.status == 'error') {
                        let code = data.error.code;
                        if (code == 709) {
                            Snackbar.show({
                                text: "Cannot add tags to user. Try again later.",
                            });
                        } else {
                            Snackbar.show({
                                text: 'System error. Try again later.',
                            });
                        }
                    } else {
                        this.props.navigation.navigate('Home')
                    }
                })
                .catch(() => {
                    this.setState({
                        isLoading: false,
                    });
                    Snackbar.show({
                        text: 'System error. Try again later.',
                    });
                });
        }


    }

    renderTags(tags) {
        return tags.map((item, index) => {
            return <Tag
                selected={item.selected}
                name={item.name}
                key={item.tag_id}
                onPress={() => this.onPressTag(index)}
            />
        });
    }

    render() {
        return (
            <ImageBackground
                style={styles.background}
                source={images.background} >
                <SafeAreaView style={styles.container}>

                    <CardView style={styles.card}
                        cornerRadius={10}
                    >
                        <Image
                            style={styles.image}
                            source={images.logo}
                        />


                        <View style={{ flexDirection: "column", marginTop: 40, marginBottom: 40 }}>

                            <TextHeader textStyle={{ fontSize: 20 }}>Select tags</TextHeader>
                            <Text style={styles.text}>Please, select tags you are interested most. It will help you see videos more relevant.</Text>
                            <View
                                style={{ height: 10 }}
                            />
                            <LoadingView showBlur={false} isLoading={this.state.isLoadingTags} style={styles.tagContainer}>
                                {this.renderTags(this.state.tags)}

                            </LoadingView>
                        </View>


                        <Button
                            style={styles.button}
                            isLoading={this.state.isLoading}
                            text="See videos"
                            onPress={this.onSetTags}
                        />
                        <View
                            style={{ height: 10 }}
                        />
                        <Text style={styles.textButton} onPress={() => this.props.navigation.navigate('Home')}> Skip this step, start exploring.</Text>
                    </CardView>

                </SafeAreaView>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: "100%",
        height: "100%"
    },
    container: {
        flex: 1,
        justifyContent: "center"
    },
    image: {
        alignSelf: "center"
    },
    text: {
        color: colors.disabled,
        marginTop: 5
    },
    textButton: {
        alignSelf: 'center',
        color: colors.disabled
    },
    tagContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "flex-start"
    },
    card: {
        flexDirection: "column",
        marginTop: verticalScale(60),
        marginBottom: verticalScale(60),
        marginLeft: scale(20),
        marginRight: scale(20)
    },
    button: {
        width: "100%"
    },

})
