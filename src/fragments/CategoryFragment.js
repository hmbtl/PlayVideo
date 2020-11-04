import React, { PureComponent } from 'react'
import { StyleSheet, SafeAreaView, FlatList } from 'react-native'
import { VideoContent } from "@component/layouts"
import { colors } from "@config"
import api from "@service/api"
import update from 'immutability-helper';



export default class CategoryFragment extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            videos: this.props.videos,
        }

        this.onPlay = this.onPlay.bind(this);
        this.onLikePressed = this.onLikePressed.bind(this);
        this.onViewableItemsChanged = this.onViewableItemsChanged.bind(this)
    }

    onLikePressed(index) {

        this.setState({
            videos: update(this.state.videos, {
                [index]: {
                    is_liked: { $set: !this.state.videos[index].is_liked },
                    total_like: {
                        $set: this.state.videos[index].is_liked ?
                            parseInt(this.state.videos[index].total_like) - 1 : parseInt(this.state.videos[index].total_like) + 1
                    }
                }
            })
        })

        if (this.state.videos[index].is_liked) {
            api.dislikeVideo(this.state.videos[index].video_id);

        } else {
            api.likeVideo(this.state.videos[index].video_id);
        }

    }


    onPlay(index) {

        let videos = this.state.videos;


        if (!videos[index].is_watched) {
            api.watchVideo(videos[index].video_id);

            videos[index].is_watched = true;
            videos[index].total_watch = parseInt(videos[index].total_watch) + 1
        }


        if (videos[index].isPlaying) {
            videos[index].isPlaying = false
        } else {
            videos.forEach(item => {
                if (item.isPlaying) {
                    item.isPlaying = false
                }
            });
            videos[index].isPlaying = true;
        }

        this.setState({
            videos: videos
        })
    }

    onViewableItemsChanged({ changed }) {

        changed.forEach(item => {
            if (this.state.videos[item.index].isPlaying) {
                this.setState({
                    videos: update(this.state.videos, {
                        [item.index]: {
                            isPlaying: { $set: false }
                        }
                    })
                })
            }
        })

    }


    render() {
        return (
            <SafeAreaView style={styles.container}>
                <FlatList
                    data={this.state.videos}
                    style={{ flex: 1 }}
                    onViewableItemsChanged={this.onViewableItemsChanged}
                    renderItem={({ index, item }) => (
                        <VideoContent
                            id={item.video_id}
                            video={item.video_url}
                            poster={item.thumb_url}
                            paused={!item.isPlaying}
                            likeCount={item.total_like}
                            watchCount={item.total_watch}
                            duration={item.duration}
                            onLikePressed={() => this.onLikePressed(index)}
                            tags={item.tags}
                            height={item.height}
                            title={item.title}
                            description={item.description}
                            onPress={() => this.onPlay(index)}
                            width={item.width}
                            isLiked={item.is_liked}
                            isWatched={item.is_watched}
                        />
                    )}
                    keyExtractor={item => item.video_id}
                />


            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background
    }
})
