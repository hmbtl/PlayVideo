import React, { PureComponent } from "react";
import { StyleSheet, Dimensions, Image, TouchableHighlight, Text, View, ActivityIndicator } from "react-native";
import Video from "react-native-video";
import FastImage from "react-native-fast-image"
import { utils, images, constants, colors } from "@config";
import { moderateScale } from "react-native-size-matters"


export default class Media extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            started: false,
            duration: this.props.duration,
            isLoading: false,
            status: "stopped"
        }
        this.onReadyForDisplay = this.onReadyForDisplay.bind(this);
        this.onLoadStart = this.onLoadStart.bind(this);
        this.onProgress = this.onProgress.bind(this);
    }


    componentDidMount() {
    }

    onLoadStart() {
        console.log(this.props.poster, "Load Start")
        if (!this.state.started) {
            this.setState({
                status: "loading"
            })
        }

        if (this.props.onLoadStart) {
            this.props.onLoadStart();
        }
    }

    onReadyForDisplay() {
        if (!this.state.started) {
            this.setState({
                started: true
            })
        }

        this.setState({
            status: "started"
        })


        if (this.props.onReadyForDisplay) {
            this.props.onReadyForDisplay();
        }
    }


    onProgress(time) {
        this.setState({
            duration: this.props.duration - time.currentTime
        })

        if (this.props.onProgress) {
            this.props.onProgress(time);
        }
    }

    render() {
        if (this.state.status !== "stopped")
            console.log(this.props.poster, this.state.status);
        const screenWidth = Dimensions.get("window").width;
        const {
            style,
            paused = true,
            height = 500,
            width = screenWidth,
            poster,
            video,
            onPress,
            ...props } = this.props;

        const heightScaled = height * (screenWidth / width);


        const localStyle = {
            backgroundColor: "black",
            width: screenWidth,
            height: heightScaled
        };

        let posterComponent = <FastImage
            style={localStyle}
            source={{ uri: poster }}
        />;



        let videoComponent =
            <Video
                {...props}
                source={{ uri: video }} // Can be a URL or a local file.
                paused={paused}
                resizeMode="contain"
                onReadyForDisplay={this.onReadyForDisplay}
                onLoadStart={this.onLoadStart}
                poster={poster}
                controls={false}
                onError={(error) => { console.log(error) }}
                progressUpdateInterval={1000}
                onProgress={this.onProgress}
                style={localStyle}
            />



        let pauseImage, component;


        if (this.state.status == "stopped" && this.props.paused) {
            component = posterComponent;
            //component = videoComponent;
            pauseImage = <Image style={styles.image} source={images.play} />
        }

        if (this.state.status == "stopped" && !this.props.paused) {
            component = videoComponent;
            pauseImage = <ActivityIndicator style={styles.image} size="large" color={colors.primary} />;
        }

        if (this.state.status == "loading" && !this.props.paused) {
            component = videoComponent;
            pauseImage = <ActivityIndicator style={styles.image} size="large" color={colors.primary} />;
        }


        if (this.state.status == "loading" && this.props.paused) {
            component = videoComponent;
            pauseImage = <Image style={styles.image} source={images.play} />
        }

        if (this.state.status == "started" && this.props.paused) {
            component = videoComponent;
            pauseImage = <Image style={styles.image} source={images.play} />
        }

        if (this.state.status == "started" && !this.props.paused) {
            component = videoComponent;
        }

        return (

            <TouchableHighlight
                style={[styles.container, localStyle, style]}
                onPress={onPress}
            >
                <View style={styles.mediaContainer}>
                    {component}
                    <Text style={styles.duration}>{utils.secondsToClock(this.state.duration)}</Text>
                    {pauseImage}
                </View>

            </TouchableHighlight>
        );

    }
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: "black",
    },
    duration: {
        position: "absolute",
        right: 0,
        top: 0,
        color: "black",
        fontSize: constants.fonts.xsmall,
        padding: moderateScale(5),
        margin: moderateScale(0),
    },
    image: {
        position: "absolute"
    },
    mediaContainer: {
        alignItems: "center",
        justifyContent: "center"
    }
});
