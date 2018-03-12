import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class App extends Component {
  state = {
    capture: null,
    face_token: null
  };

  drawBoundingBox = ({ width, top, left, height }) => {
    const ctx = this.canvas.getContext('2d');
    ctx.strokeStyle = 'yellow';
    ctx.strokeRect(left, top, width, height);
  }

  analyseFace = () => {
    if (this.state.face_token === null) return;
    console.log('analysing face with token')
    axios
      .get('/analyse/' + this.state.face_token)
      .then(({ data }) => console.log(data))
  }

  detectFace = () => {
    console.log('detecting face... ')
    axios({
      method: 'post',
      url: '/base64',
      responseType: 'json',
      data: {
        base64: this.state.capture
      }
    }).then(res => {
      this.setState({
        face_token: res.data.face_token
      }, this.drawBoundingBox(res.data.face_rectangle))
    }).catch(e => console.log(e))
  }

  takePhoto = () => {
    console.log('take photo');
    const ctx = this.canvas.getContext('2d');
    ctx.drawImage(this.video, 0, 0, 800, 300);
    const dataURL = this.canvas.toDataURL('image/jpeg');
    this.setState({ capture: dataURL })
  }

  componentWillMount() {
    navigator.mediaDevices.getUserMedia({ video: true })
      // set the source of the video to the stream
      .then(stream => {
        this.video.srcObject = stream;
        this.video.play();
      })
      .catch(e => alert('cant access your webcam!' + e))
  }

  render() {
    return (
      <div>
        <h1>app</h1>
        <video
          height="600"
          width="800"
          ref={video => this.video = video}>
          Video is unavailable at the moment.
        </video>
        <canvas
          className='canvas'
          height="600"
          width="800"
          ref={canvas => this.canvas = canvas}>
        </canvas>

        {/*<img src={this.state.capture} />*/}
        <div>
          <button
            onClick={this.takePhoto}>
            1. Take photo
      </button>
          <button
            onClick={this.detectFace}>
            2. Find Face
      </button>
          <button
            onClick={this.analyseFace}>
            3. Analyse Face
      </button>
        </div>
      </div>
    )
  }
}

export default App;
