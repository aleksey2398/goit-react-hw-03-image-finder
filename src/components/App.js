import React, { Component } from "react";
import Gallery from "./Gallery/Gallery";
import SearchBar from "./SearchBar/SearchBar";
import Modal from "./Modal/Modal";
import Button from "./Button/Button";
import Spinner from "./Spinner/Spinner";
import * as API from "../Api/Api";
import "../../src/App.css";
import styles from "../components/Modal/Modal.module.css";

class App extends Component {
  state = {
    images: [],
    searchQuery: "",
    currentPage: 1,
    largeImageURL: "",
    isModalOpen: false,
    isLoading: false,
    error: null,
  };

  componentDidUpdate(_, prevState) {
    if (prevState.searchQuery !== this.state.searchQuery) {
      this.onSearch();
    }
  }

  onSearch = () => {
    const { searchQuery, currentPage } = this.state;
    this.setState({ isLoading: true });

    API.fetchImages(searchQuery, currentPage)
      .then(({ data }) => {
        this.setState((prevState) => ({
          images: [...prevState.images, ...data.hits],
          isLoading: false,
          currentPage: prevState.currentPage + 1,
        }));
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "smooth",
        });

        this.setState({ isLoading: false });
      });
  };

  toggleModal = () => {
    this.setState(({ isModalOpen }) => ({ isModalOpen: !isModalOpen }));
  };

  getLargeUrl = (url) => {
    this.setState({ largeImageURL: url, isModalOpen: true });
  };

  onFormSubmit = (item) => {
    this.setState({
      searchQuery: item,
      images: [],
      currentPage: 1,
    });
  };

  render() {
    const { isModalOpen, images, largeImageURL, isLoading } = this.state;

    return (
      <div className="App">
        <SearchBar onSubmit={this.onFormSubmit} />
        <Gallery images={images} onClick={this.getLargeUrl} />
        {isModalOpen && (
          <Modal onClose={this.toggleModal}>
            <img className={styles.Modal} src={largeImageURL} alt="" />
          </Modal>
        )}
        {isLoading && <Spinner />}
        {images.length >= 12 && !isLoading && (
          <Button onClick={this.onSearch} />
        )}
      </div>
    );
  }
}

export default App;