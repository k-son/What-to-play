import React, {Component} from 'react';
import {songList} from '../songList';
import Button from './Button';
import Display from './Display';
import Logo from './Logo';
import CurrentList from './CurrentList';
import ProgressBar from './ProgressBar';
import ProgressRing from './ProgressRing';
import Dialog from './Dialog';
import {ReactComponent as IconBackArrow} from '../icons/back-arrow.svg';
import {ReactComponent as IconChoice} from '../icons/one.svg';
import {ReactComponent as IconDices} from '../icons/dices.svg';
import {ReactComponent as IconRefresh} from '../icons/refresh.svg';
import {ReactComponent as IconClose} from '../icons/close.svg';
// Functionals
import KeyDownListener from './KeyDownListener';
import MouseDownListener from './MouseDownListener';
// Styles
import './App.css';
import '../variables.css'
// Libraries
import {CarouselProvider, Slider, Slide, ButtonBack, ButtonNext} from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';


class App extends Component {
  static defaultProps = {
    songs: songList
  }

  constructor(props) {
    super(props);
    this.state = {
      songs: localStorage.getItem('currentSongList') !== null ? JSON.parse(localStorage.getItem('currentSongList')) : this.props.songs,
      currentSong: localStorage.getItem('currentSong') !== null ? localStorage.getItem('currentSong') : ' ',
      slideTitle: 'off', //animates song title in Display
      modal: 'closed',
      confirmDialog: 'closed',
      confirmQuestion: ' ',
      confirmTitle: ' ',
      confirmCancel: undefined,
      confirmOk: undefined
    };
    this.drawSong = this.drawSong.bind(this);
    this.reloadFullSongList = this.reloadFullSongList.bind(this);
    this.reloadFullSongListConfirm = this.reloadFullSongListConfirm.bind(this);
    this.putBackCurrentSong = this.putBackCurrentSong.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.chooseSong = this.chooseSong.bind(this);
    this.removeSong = this.removeSong.bind(this);
  }


  // Local storage
  componentDidUpdate(prevProps, prevState) {
    if (prevState.songs !== this.state.songs) {
      localStorage.setItem('currentSongList', JSON.stringify(this.state.songs));
    }
    if (prevState.currentSong !== this.state.currentSong) {
      localStorage.setItem('currentSong', this.state.currentSong);
    }
  }


  // On Draw Button press - draw a random song from current song list
  drawSong() {
    const index = Math.floor(Math.random()*(this.state.songs.length));
    const drawnSong = this.state.songs[index];
    const filteredList = this.state.songs.filter(el => el !== drawnSong);

    this.setState({
      songs: filteredList,
      currentSong: drawnSong,
      slideTitle: 'on'
    });

    setTimeout(() => {
      this.setState({
        slideTitle: 'off'
      })
    }, 10)
  }


  // On Back Button press - move back drawn song to current song list
  putBackCurrentSong() {
    this.setState({
      songs: this.state.songs.concat(this.state.currentSong),
      currentSong: ' '
    })
  }


  // On Choose Button press - opens a modal view, then you choose song to play from current song list
  chooseSong(e) {
    const chosenSong = e.target.textContent;
    const filteredList = this.state.songs.filter(el => el !== chosenSong);

    this.setState({
      songs: filteredList,
      currentSong: chosenSong,
      modal: 'closed'
    })
  }


  // On Reload Button press - loads full setlist when you want to start all over
  reloadFullSongList() {
    this.setState({
      songs: this.props.songs,
      currentSong: ' '
    })
  }


  // Reloads full setlist - accessible in modal window when at least one song has already been drawn/chosen
  reloadFullSongListConfirm() {
    const closeConfirmDialog = () => {
      this.setState({
        confirmDialog: 'closed',
        confirmCancel: undefined,
        confirmOk: undefined
      })
      document.body.style.overflow = 'auto';
    }
    const reload = () => {
      this.reloadFullSongList();
      this.setState({
        confirmDialog: 'closed',
        confirmCancel: undefined,
        confirmOk: undefined,
        modal: 'closed'
      })
      document.body.style.overflow = 'auto';
    }

    this.setState({
      confirmQuestion: 'Reload full setlist?',
      confirmDialog: 'open',
      confirmCancel: closeConfirmDialog,
      confirmOk: reload
    })

    document.body.style.overflow = 'hidden';
  }


  // Tracks percentage of the songs left to play in current song list
  progress() {
    const percentage = Math.ceil(parseFloat(this.state.songs.length / this.props.songs.length).toFixed(2) * 100);
    return percentage;
  }


  // Opens modal view with current song list
  openModal() {
    this.setState({
      modal: 'open'
    })
  }


  // Closes modal view
  closeModal() {
    this.setState({
      modal: 'closed'
    })
  }


  // Remove song from current song list 
  removeSong(e) {
    const songToRemove = e.target.dataset.song;
    const closeConfirmDialog = () => {
      this.setState({
        confirmQuestion: ' ',
        confirmTitle: ' ',
        confirmDialog: 'closed',
        confirmCancel: undefined,
        confirmOk: undefined
      })
      document.body.style.overflow = 'auto';
    }; 
    const remove = () => {
      const filteredList = this.state.songs.filter(el => el !== songToRemove);
      this.setState({
        songs: filteredList,
        confirmQuestion: ' ',
        confirmTitle: ' ',
        confirmDialog: 'closed',
        confirmCancel: undefined,
        confirmOk: undefined
      })
      if (this.state.songs.length === 1) {
        this.setState({
          modal: 'closed'
        })
      }
      document.body.style.overflow = 'auto';
    }
    
    this.setState({
      confirmQuestion: 'Remove song from current list?',
      confirmTitle: songToRemove,
      confirmDialog: 'open',
      confirmCancel: closeConfirmDialog,
      confirmOk: remove
    })

    document.body.style.overflow = 'hidden';
  }


  // Adds outline to buttons when accessing by keyboard 
  handleKeyDown() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
          document.body.classList.remove('intent-mouse')
      }
    });
  }


  // Removes outline from buttons on mouse click 
  handleMouseDown() {
    document.addEventListener('mousedown', () =>
    document.body.classList.add('intent-mouse') 
    );
  }


  // RENDER
  render() {
    return(
      <div className="App">
        {/* Adds outline to element on keyboard access. Removes outline whent accessed by mouse. */}
        <KeyDownListener onKeyDown={this.handleKeyDown} />
        <MouseDownListener onMouseDown={this.handleMouseDown} />
        {/* Logo at the top - for higher screens */}
        <div className="Logo-box-desktop">
          <Logo />
        </div>
        <main>
          {/* [pure-react-carousel] For lower screens. With the buttons you can switch between circular progress bar and current song list. */}
          <div className="Carousel-box">
            <CarouselProvider className="mobileCarousel"
              naturalSlideWidth={200}
              naturalSlideHeight={200}
              totalSlides={2}
              touchEnabled={false}
            >
              <Slider className="mobileCarousel-slider" tabIndex={-1}>
                <Slide className="mobileCarousel-slide" index={0} tabIndex={-1}>
                  <ProgressRing sqSize="140" strokeWidth="6" songsLeft={this.state.songs.length} percentage={this.progress()}/>
                </Slide>
                <Slide className="mobileCarousel-slide" index={1} tabIndex={-1}>
                  <div><CurrentList songs={this.state.songs} /></div>
                </Slide>
              </Slider>
              <div className="mobileCarousel-buttons">
                <ButtonBack tabIndex={(this.state.modal === 'open' || this.state.confirmDialog === 'open') ? -1 : 0}>Progress</ButtonBack>
                <ButtonNext tabIndex={(this.state.modal === 'open' || this.state.confirmDialog === 'open') ? -1 : 0}>Song list</ButtonNext>
              </div>
            </CarouselProvider>
          </div>
          {/* Horizontal progress bar and current song list, both visible at the same time - for higher screens. */}
          <div className="Progress-box">
            <CurrentList songs={this.state.songs} />
            <ProgressBar progress={this.progress()} songsLeft={this.state.songs.length} />
          </div>
          {/* Showcase displaying song title to play. When no song drawn/selected, a substituting text shows up. */}
          <div className="Display-box">
            <Display song={this.state.currentSong} slideTitle={this.state.slideTitle} />
            {this.state.currentSong === ' ' && <p className="substitution">song to play</p>}
          </div>
          {/* Main buttons */}
          <div className="Buttons-box">
            <div className="App-buttons">
              {this.state.songs.length > 0 ? 
                <Button addClass="btn-draw" action={this.drawSong} icon={<IconDices />} description="Draw" title="Draw random song" ariaLabelledby="Draw" tabIndex={(this.state.modal === 'open' || this.state.confirmDialog === 'open') ? -1 : 0} /> : 
                <Button addClass="btn-reload" action={this.reloadFullSongList} icon={<IconRefresh />} description="Reload" title="Reload full setlist" ariaLabelledby="Reload" tabIndex={(this.state.modal === 'open' || this.state.confirmDialog === 'open') ? -1 : 0} />}
              {this.state.songs.length > 0 && this.state.currentSong !== ' ' ? 
                <Button addClass="btn-arrow" action={this.putBackCurrentSong} icon={<IconBackArrow />} description="Back" title="Put back current song" ariaLabelledby="Back" tabIndex={(this.state.modal === 'open' || this.state.confirmDialog === 'open') ? -1 : 0} /> : 
                null }
              {this.state.songs.length > 0 && <Button addClass="btn-choice" action={this.openModal} icon={<IconChoice />} description="Choose" title="Choose song manually" ariaLabelledby="Choose" tabIndex={(this.state.modal === 'open' || this.state.confirmDialog === 'open') ? -1 : 0} />}
            </div>
          </div>
        </main>
        {/* Logo at the bottom - for lower viewports */}
        <div className="Logo-box-mobile">
          <Logo />
        </div>

        {/* Confirm dialog. Out of the normal document flow. */}
        <Dialog isOpen={this.state.confirmDialog} question={this.state.confirmQuestion} songTitle={this.state.confirmTitle} onCancel={this.state.confirmCancel} onConfirm={this.state.confirmOk} />

        {/* Modal. Out of the normal document flow. */}
        <div className={`App-modal-${this.state.modal} ${this.state.confirmDialog === 'open' && 'padding-right-20'}`}>
          <div className="Modal-buttons">
            {this.progress() < 100 && <Button addClass="btn-reload" action={this.reloadFullSongListConfirm} icon={<IconRefresh />} title="Reload full setlist" ariaLabel="Reaload full setlist" tabIndex={this.state.confirmDialog === 'open' ? -1 : 0} /> }
            <Button addClass="btn-close" action={this.closeModal} icon={<IconClose />} title="Close choice view" ariaLabel="Close choice view" tabIndex={this.state.confirmDialog === 'open' ? -1 : 0} />
          </div>
          <ul className="App-modal-list">
            {this.state.songs
              .sort((a, b) => a > b ? 1 : -1)
              .map(item => 
                <li key={item}>
                  <button className="ModalList-chooseBtn" type="button" onClick={this.chooseSong} aria-label={item} tabIndex={this.state.confirmDialog === 'open' ? -1 : 0}>
                    <div className="ModalList-circle">
                      <div></div>
                    </div>
                    <p>{item}</p>
                  </button>
                  <button className="ModalList-removeSongBtn" type="button" onClick={this.removeSong} data-song={item} title="Remove song from current list" aria-label={`Remove '${item}' from current list`} tabIndex={this.state.confirmDialog === 'open' ? -1 : 0}></button>
                </li>
            )}
          </ul>
        </div>
      </div>
    );
  }
}

export default App;