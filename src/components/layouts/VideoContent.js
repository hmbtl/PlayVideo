import React, { PureComponent } from "react";
import { Text, StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { constants, colors, images } from "@config";
import { ButtonImage, Media, Tag } from "@component/views";
import { scale, moderateScale, verticalScale } from "react-native-size-matters"
import PropTypes from 'prop-types';


export default class VideoContent extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            showCollection: false,
            isCollectionLoading: true,
            collections: []
        }

        this.showCollections = this.showCollections.bind(this);
        this.saveVideo = this.saveVideo.bind(this);
    }


    componentWillUnmount() {
        clearTimeout(this.collectionTimeout); // This is just necessary in the case that the screen is closed before the timeout fires, otherwise it would cause a memory leak that would trigger the transition regardless, breaking the user experience.
    }

    saveVideo() {

        if (!this.props.isSaved) {
            this.setState({
                showCollection: true,
            });
            this.collectionTimeout = setTimeout(() => { this.setState({ showCollection: false }) }, 3000);

        } else {
            this.setState({
                showCollection: false,
            });
        }

        if (this.props.onBookmarkPress) {
            this.props.onBookmarkPress();
        }
    }

    showCollections() {



        /*
        this.setState({
            showCollection: !this.state.showCollection,
            isCollectionLoading: true
        })

        /*

        if (!this.state.showCollection) {
            this.setState({
                showCollection: true
            })

            api.getCollections().then(data => {
                if (data.status == 'error') {
                    Snackbar.show({
                        text: 'Cannot show collections. Try again later.',
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
                    text: 'Cannot show collections. Try again later.',
                });
                this.setState({
                    isCollectionLoading: false,
                    showCollection: false
                })
            });
        }
        */
    }


    renderTags(tags) {
        return tags.map((item) => {
            return <Tag
                selected={item.selected}
                name={item.name}
                selectable={false}
                key={item.tag_id}
            />
        });
    }

    render() {

        return (
            <View>

                <View style={styles.container}>
                    <View>

                        <Media
                            video={this.props.video}
                            poster={this.props.poster}
                            paused={this.props.paused}
                            duration={this.props.duration}
                            height={this.props.height}
                            width={this.props.width}
                            onPress={this.props.onPress}
                            onProgress={this.props.onProgress}
                            onLoadStart={this.props.onLoadStart}
                            onReadyForDisplay={this.props.onReadyForDisplay}
                        />
                        {
                            this.state.showCollection &&
                            <View
                                style={{
                                    flexDirection: "row",
                                    position: "absolute",
                                    backgroundColor: "#414141aa",
                                    width: "100%",
                                    padding: 10,
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    bottom: 0
                                }}>
                                <View
                                    style={{ flexDirection: "row", alignItems: "center" }}
                                >
                                    <Image
                                        resizeMode="cover"
                                        style={{ width: 30, height: 30 }}
                                        source={{ uri: this.props.poster }}
                                    />


                                    <Text style={{ color: colors.white, paddingLeft: 10 }}>
                                        Saved
                                    </Text>

                                </View>

                                <TouchableOpacity
                                    onPress={this.props.onShowCollection}
                                >
                                    <Text style={{
                                        fontSize: constants.fonts.small,
                                        fontWeight: "600",
                                        color: "#02aef7",

                                    }}>
                                        Save to Collection
                                  </Text>
                                </TouchableOpacity>

                            </View>

                        }
                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginLeft: scale(10),
                            marginTop: verticalScale(5),
                            alignItems: "center",
                            marginRight: scale(10)
                        }}
                    >
                        <Text
                            style={styles.count}>
                            {this.props.watchCount} view - {this.props.likeCount} like
                         </Text>
                        <View style={{ flexDirection: "row" }}>
                            <ButtonImage
                                image={images.like}
                                imageFilled={images.likeFilled}
                                selected={this.props.isLiked}
                                onPress={this.props.onLikePressed}
                                style={{ marginRight: verticalScale(10) }}
                            />
                            <ButtonImage
                                image={images.watch}
                                style={{ marginRight: verticalScale(10) }}
                                imageFilled={images.watchFilled}
                                disabled={true}
                                selected={this.props.isWatched}
                            />
                            <View
                                style={styles.divider}
                            />

                            <ButtonImage
                                image={images.bookmark}
                                imageFilled={images.bookmarkFilled}
                                onPress={this.saveVideo}
                                selected={this.props.isSaved}
                            />

                        </View>
                    </View>

                    <View style={styles.tagContainer}>
                        {this.renderTags(this.props.tags)}
                    </View>

                    <Text
                        style={styles.description}
                    >
                        {this.props.video.name}
                        <Text
                            style={{ fontWeight: "normal", fontSize: constants.fonts.xsmall }}
                        ><Text style={styles.title}>{this.props.title}</Text> - {this.props.description}</Text>
                    </Text>

                </View>


            </View>
        );

    }
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: verticalScale(10),
        backgroundColor: "white",
        borderWidth: 0.3,
        borderColor: "#00000044",
        marginBottom: verticalScale(20)
    },
    title: {
        fontWeight: "500",
        fontSize: constants.fonts.xsmall
    },
    count: {
        color: colors.red,
        fontWeight: "bold",
        fontSize: constants.fonts.xsmall
    },
    divider: {
        borderRightWidth: 1.5,
        marginRight: scale(10),
        marginLeft: scale(10),
        borderRightColor: colors.red
    },
    description: {
        fontWeight: "bold",
        textAlign: "justify",
        fontSize: constants.fonts.xxsmall,
        marginLeft: scale(10),
        marginRight: scale(10),
        marginTop: verticalScale(5)
    },
    tagContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingLeft: moderateScale(5),
        alignItems: "flex-start"
    },

});


VideoContent.propTypes = {
    title: PropTypes.string,
    poster: PropTypes.string,
    description: PropTypes.string,
    count: PropTypes.number,
    video: PropTypes.string,
    paused: PropTypes.bool,
    height: PropTypes.string,
    width: PropTypes.string,
    duration: PropTypes.any,
    likeCount: PropTypes.any,
    watchCount: PropTypes.any,
    isLiked: PropTypes.bool,
    isWatched: PropTypes.bool

};

VideoContent.defaultProps = {
    title: "Title",
    poster: "",
    count: 0,
    tags: []
};


