import React, { PureComponent } from "react";
import { StyleSheet, Dimensions, Image, TouchableOpacity, Text, View, ActivityIndicator, TouchableHighlight, Animated } from "react-native";
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
            showControls: true,
            opacity: new Animated.Value(1),
            status: "stopped"
        }
        this.onReadyForDisplay = this.onReadyForDisplay.bind(this);
        this.onLoadStart = this.onLoadStart.bind(this);
        this.onProgress = this.onProgress.bind(this);
        this.toggleControls = this.toggleControls.bind(this);
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

    toggleControls(isClick = true) {
        // console.log("toggle", this.state.status, this.props.paused)
        if (this.state.status === "started") {
            const { showControls } = this.state
            Animated.timing(this.state.opacity, {
                toValue: showControls ? 0 : 1,
                duration: isClick ? 300 : 1000,
                useNativeDriver: true
            }).start(() => {
                this.setState({ showControls: !this.state.showControls });//set the new state, so the next click will have different value
            })
        } else {
            this.props.onPressPlayPause();
        }

    }

    componentDidUpdate(prevProps, prevState) {


        if (prevState.status === "loading" && this.state.status === "started") {
            this.toggleControls(false)
        } else if (this.state.status === "started" && !this.props.paused && prevProps.paused) {
            this.toggleControls(false)
        } else if (this.state.status === "started" && this.props.paused && !prevProps.paused && !this.state.showControls) {
            this.toggleControls(true)
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
        //console.log("state", this.state.status, this.props.paused)
        const screenWidth = Dimensions.get("window").width;
        const {
            style,
            paused = true,
            height = 500,
            width = screenWidth,
            poster,
            video,
            onPressPlayPause,
            onFullScreenPress,
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



        let pauseImage, component, controls;


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
            pauseImage = <Image style={styles.image} source={images.pause} />
        }

        if (pauseImage !== undefined) {
            pauseImage = (
                <TouchableOpacity
                    style={{ position: "absolute", left: "50%", marginLeft: -15, top: "50%", marginTop: -15 }}
                    onPress={onPressPlayPause}
                    disabled={!this.state.showControls}
                >
                    {pauseImage}
                </TouchableOpacity>
            )
        }

        controls = (
            <Animated.View style={{ position: "absolute", width: "100%", height: "100%", opacity: this.state.opacity }}>
                {pauseImage}
                {this.state.status === "started" &&
                    <TouchableOpacity
                        style={{ right: 0, bottom: 0, position: "absolute", marginRight: 15, marginBottom: 15 }}
                        onPress={onFullScreenPress}
                    >
                        <Image style={styles.image} source={images.fullscreen} />
                    </TouchableOpacity>
                }
            </Animated.View>
        )

        return (

            <TouchableHighlight
                style={[styles.container, localStyle, style,]}
                onPress={this.toggleControls}
            >
                <View style={styles.mediaContainer}>
                    {component}
                    <Text style={styles.duration}>{utils.secondsToClock(this.state.duration)}</Text>
                    {controls}
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
    },
    mediaContainer: {
        alignItems: "center",
        justifyContent: "center"
    }
});
