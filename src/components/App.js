import React, { Component } from "react";
import Gallery from "./Gallery/Gallery";
import SearchBar from "./SearchBar/SearchBar";
import Modal from "./Modal/Modal";
import Button from "./Button/Button";
import Spinner from "./Spinner/Spinner";
import {Api} from "../Api/Api";
import "../../src/App.css";
import styles from "../components/Modal/Modal.module.css";
import Loader from "react-loader-spinner";

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

  componentDidUpdate(_,prevState) {
    // const prevQuery=prevState.searchQuery;
    // const nextQuery = this.state.searchQuery;
    // if (!nextQuery){
    //   return;
    // }
   
    
    // if (prevQuery !== nextQuery) {
    //   this. onSearch();
    //   this.setState({
    //     images: [],
    //     currentPage: 1,
        
    //   });
  const {currentPage, isLoading, searchQuery} = this.state;
  if(prevState.searchQuery !== searchQuery || (isLoading && prevState.currentPage < currentPage)) {this.onSearch();} 
  }
 // if (prevState.searchQuery !== this.state.searchQuery) {
    //  this.onSearch();
   // } 

  
  async onSearch() {
    try {
      
      const { currentPage ,searchQuery} = this.state;
      const result = await Api.fetchImages(currentPage, searchQuery);
      console.log(result)
      if (!result.data.hits.length) {
        alert("Sorry we can't find anything(");
        return;
      }
      this.setState((prevState) =>({
                images: [...prevState.images, ...result.data.hits],
                isLoading: false,
                error: false,
                //currentPage: prevState.currentPage + 1,
              }))
    } catch (error) {
      this.setState({isLoading: false, error})
    console.log(error);
    }
  }
  // onSearch = () => {
  //   const { searchQuery, currentPage } = this.state;
  //   this.setState({ isLoading: true });

  //  Api.fetchImages(searchQuery, currentPage)
  //     .then(({ data }) => {
  //       if (!data.hits.length){
  //           return alert("Impossible to load the pictures")
  //         }
  //       this.setState((prevState) =>({
  //         images: [...prevState.images, ...data.hits],
  //         isLoading: false,
  //         error: false,
  //         currentPage: prevState.currentPage + 1,
  //       }))
          

        
  //     })
      
  //     .catch((error) => {
  //       console.log(error);
  //     })
  //     .finally(() => {
  //       window.scrollTo({
  //         top: document.documentElement.scrollHeight,
  //         behavior: "smooth",
  //       });

  //       this.setState({ isLoading: false });
  //     });
  // };

  toggleModal = () => {
    this.setState(({ isModalOpen }) => ({ isModalOpen: !isModalOpen }));
  };

  getLargeUrl = (url) => {
    this.setState({ largeImageURL: url, isModalOpen: true });
  };

  onFormSubmit = (item) => {
    this.setState({
      searchQuery: item,
      // images: [],
      currentPage: 1,
    });
  };
  loadMore = ()=>{
    this.setState(({currentPage})=>({currentPage:currentPage+1,isLoading:true}));
  }

  render() {
    const { isModalOpen, images, largeImageURL, isLoading } = this.state;
    console.log(this.state.searchQuery)

    return (
      <div className="App">
        <SearchBar onSubmit={this.onFormSubmit} />
        <Gallery images={images} onClick={this.getLargeUrl} />
        {isModalOpen && (
          <Modal onClose={this.toggleModal}>
            <img className={styles.Modal} src={largeImageURL} alt="" />
          </Modal>
        )}
        {isLoading && <Loader />}
        {images.length >= 12 && !isLoading && (
          <Button onClick={this.loadMore} />
        )}
      </div>
    );
  }
}

export default App;