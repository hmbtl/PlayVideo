import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import VideoPlayer from 'react-native-video-controls';


export default class FullScreenVideo extends Component {
    constructor(props) {
        super(props);


        this.state = {
            video: this.props.navigation.getParam("video", {})
        }
    }


    render() {

        return (
            <VideoPlayer
                ref={ref => (this.player = ref)}
                style={styles.video}
                navigator={this.props.navigation}
                source={{ uri: this.state.video.video_url }}
            />
        )

    }
}

const styles = StyleSheet.create({

    video: {
        flex: 1
    }
})
