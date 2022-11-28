import './App.scss';
import React from 'react';


class App extends React.Component {
  
  constructor(props) {
    super(props); 
    this.state = {
      time: "25:00",
      breakTime: "05:00",
      session: 25,
      break: 5,
      isPaused: false,
      showElem: true,
      toDisplay: true
    }
    this.handleDecrement = this.handleDecrement.bind(this);
    this.handleIncrement = this.handleIncrement.bind(this);
    
    this.updateTime      = this.updateTime.bind(this);
    this.updateBreakTime = this.updateBreakTime.bind(this);
    
    this.handleStartStop = this.handleStartStop.bind(this);
    this.handleReset     = this.handleReset.bind(this);
    
    
    this.id = null;
    this.currentTime = null;
    this.endTime = null;
    this.breakTime = null;
    this.breakEndTime = null;

    this.beep = new Audio('https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav');
  }
  
  // Session and Break decrement
  handleDecrement(event) {
    if(event.currentTarget == document.getElementById("session-decrement") && this.state.session > 1) {
      const tempTime = this.state.session - 1;
      this.setState({
        time: tempTime>9 ? tempTime+":00" : "0"+tempTime+":00",
        session: this.state.session -= 1});
    } else if(event.currentTarget == document.getElementById("break-decrement") && this.state.break > 1) {
      const tempTime = this.state.break - 1;
      this.setState({
        breakTime: tempTime>9 ? tempTime+":00" : "0"+tempTime+":00",
        beak: this.state.break -= 1});
    }
    
  }
  // Session and Break increment
  handleIncrement(event) {
    if(event.currentTarget == document.getElementById("session-increment") && this.state.session < 60) {
      const tempTime = this.state.session + 1;
      this.setState({
        time: tempTime>9 ? tempTime+":00" : "0"+tempTime+":00",
        session: this.state.session += 1});
    } else if(event.currentTarget == document.getElementById("break-increment") && this.state.break < 60) {
      const tempTime = this.state.break + 1;
      this.setState({
        breakTime: tempTime>9 ? tempTime+":00" : "0"+tempTime+":00",
        beak: this.state.break += 1});
    }
  }
  
  // Session time countdown
  updateTime() {
    if(!this.state.isPaused) {
      this.currentTime += 1000;
    }
    const dateToCount = new Date();
    dateToCount.setTime(this.endTime - this.currentTime);
    const second = dateToCount.getSeconds();
    const minute = dateToCount.getMinutes();
    if( (this.endTime - this.currentTime) >= 0 ) {
      this.setState({ time: (minute>9?minute:"0"+minute) +":"+ (second>9?second:"0"+second) });
    } else {
      clearInterval(this.id);
      this.currentTime = this.currentTime - this.state.session*60*1000-1000;
      this.setState({
        time: this.state.session>9 ? this.state.session+":00" : "0"+this.state.session+":00",
        showElem: false});
      this.id = setInterval( () => this.updateBreakTime(), 1000);
    }
    if( (this.endTime - this.currentTime) == 0) { this.beep.play(); }
    
  }
  // Break time countdown
  updateBreakTime() {
    if(!this.state.isPaused) {
      this.breakTime += 1000;
    }
    const dateToCount = new Date();
    dateToCount.setTime(this.breakEndTime - this.breakTime);
    const second = dateToCount.getSeconds();
    const minute = dateToCount.getMinutes();
    if( (this.breakEndTime - this.breakTime) >= 0 ) {
      this.setState({ breakTime: (minute>9?minute:"0"+minute) +":"+ (second>9?second:"0"+second) });
    } else {
      clearInterval(this.id);
      this.breakTime = this.breakTime - this.state.break*60*1000-1000;
      this.setState({
        breakTime: this.state.break>9 ? this.state.break+":00" : "0"+this.state.break+":00",
        showElem: true});
      this.id = setInterval(() => this.updateTime(), 1000);
    }
    if( (this.breakEndTime - this.breakTime) == 0) { this.beep.play(); }
  }
  
  // Play and pause timer
  handleStartStop() {
    if(this.id == null) {
      this.currentTime = new Date().getTime();
      this.endTime = new Date().getTime() + this.state.session*60*1000; //this.state.session*60*1000
      this.breakTime = new Date().getTime();
      this.breakEndTime = new Date().getTime() + this.state.break*60*1000; //this.state.break*60*1000
      this.id = setInterval(() => this.updateTime(), 1000);
    } else {
      if(this.state.isPaused == false) {
        this.setState({ isPaused: true });
      } else if(this.state.isPaused == true) {
        this.setState({ isPaused: false });
      }
      
    }
    
    if(this.state.toDisplay) {
      this.setState({ toDisplay: false });
    } else {
      this.setState({ toDisplay: true });
    }
    
  }
  // Reset timer
  handleReset() {
    clearInterval(this.id);
    this.id = null;
    this.beep.pause();
    this.beep.currentTime = 0;
    this.setState({
      time: "25:00",
      breakTime: "05:00",
      session: 25,
      break: 5,
      isPaused: false,
      showElem: true,
      toDisplay: true
    });
  }
  
  render() 
  {
    return (
      <div id="container">
        <div id="clock">
          <h1>25 + 5 Clock</h1>
          <div id="timer-label">{this.state.showElem? "Session" : "Break"}</div>
          <div id="innerBorderRadius">
            <div id="timer">
              <div id="time-left">{this.state.showElem? this.state.time : this.state.breakTime}</div>
              <div id="timer-control">
                <div id="start_stop" onClick={this.handleStartStop}>
                  <i className="fa-solid fa-play" style={{display:this.state.toDisplay? 'inline':'none'}}></i>
                  <i className="fa-solid fa-pause" style={{display:this.state.toDisplay? 'none':'inline'}}></i>
                </div>
                <div id="reset" onClick={this.handleReset}><i className="fa-solid fa-arrows-rotate"></i></div>
              </div>
            </div>
          </div>
          
          <div id="lowerPart">
            <div className="row" id="rowSession">
              <div className="col-6" id="session-label">Session</div>
              <div className="col-2" id="session-decrement" onClick={this.handleDecrement}>
                <i className="fa-solid fa-arrow-down"></i></div>
              <div className="col-2" id="session-increment" onClick={this.handleIncrement}>
                <i className="fa-solid fa-arrow-up"></i></div>
              <div className="col-2" id="session-length">{this.state.session}</div>
            </div>
            <div className="row" id="rowBreak">
              <div className="col-6" id="break-label">Break</div>
              <div className="col-2" id="break-decrement" onClick={this.handleDecrement}>
                <i className="fa-solid fa-arrow-down"></i></div>
              <div className="col-2" id="break-increment" onClick={this.handleIncrement}>
                <i className="fa-solid fa-arrow-up"></i></div>
              <div className="col-2" id="break-length">{this.state.break}</div>
            </div>
          </div>
          {/* <audio
          id="beep"
          preload="auto"
          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"></audio> */}
        </div>
      </div>
    );
  }
  
}


export default App;
