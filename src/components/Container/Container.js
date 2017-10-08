import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './Container.css';
import spotify from '../../lib/spotify';
import youtube from '../../lib/youtube';
import Form from '../Form/Form';
import Player from '../Player/Player';

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlist: [],
      visibility: 'hidden',
      current: null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.myCallback = this.myCallback.bind(this);
  }

  handleChange(playlist) {
    this.setState({
      playlist,
      visibility: 'visible'
    });

    youtube.setPlaylist(playlist);

    // Scroll down to the player
    const node = ReactDOM.findDOMNode(this.refs.player);
    if (node) {
      window.scrollTo(0, node.offsetTop);
    }

    const current = this.state.playlist[0].id;

    // Start playing the first song in the playlist
    youtube.play(current);
    youtube.setCurrent(current);
    this.setState({ current });

  }

  // Will be the playlist
  myCallback(genre, energy, danceability, happiness) {
    // Get recommendations from spotify
    const recommendations = spotify.getRecommendations(genre, energy, danceability, happiness);
    
    recommendations.then((tracks) => youtube.getVideos(tracks)).then((playlist) => {
      if (playlist.length < 1) {
        alert('Could not find any songs, try changing the options');
      } else {
        this.handleChange(playlist);
      }
    }).catch((res) => {
      console.log(res);
      if (res && res.error && res.error.message) {
        alert(res.error.message);
      }
    });
  }

  render() {
    return (
      <div id="container">
        <Form callbackFromParent={this.myCallback} />
        <Player ref="player" playlist={this.state.playlist} visibility={this.state.visibility} />
      </div>
    );
  }
}

export default Container;
