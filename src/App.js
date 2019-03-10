import React, { Component } from "react";

//import authors from "./data.js";

// Components
import Sidebar from "./Sidebar";
import Loading from "./Loading";
import AuthorsList from "./AuthorsList";
import AuthorDetail from "./AuthorDetail";
import axios from "axios";

class App extends Component {
  state = {
    currentAuthor: null,
    authors: [],
    filteredAuthors: [],
    loading: true
  };

  selectAuthor = async author => {
    this.setState({ loading: true });
    try {
      const request = await axios.get(
        `https://the-index-api.herokuapp.com/api/authors/${author.id}/`
      );

      const responce = request.data;
      this.setState({
        currentAuthor: responce,
        loading: false
      });
    } catch (error) {
      console.error("SOMETHING WENT WRONG");
      console.error(error);
      this.setState({ error: error });
    }
  };
  unselectAuthor = () => this.setState({ currentAuthor: null });
  async componentDidMount() {
    try {
      const request = await axios.get(
        "https://the-index-api.herokuapp.com/api/authors/"
      );
      const responce = request.data;
      this.setState({
        authors: responce,
        filterAuthors: responce,
        loading: false
      });
    } catch (error) {
      console.error("SOMETHING WENT WRONG");
      console.error(error);
      this.setState({ error: error });
    }
  }
  filterAuthors = query => {
    query = query.toLowerCase();
    let filteredAuthors = this.state.authors.filter(author => {
      return `${author.first_name} ${author.last_name}`
        .toLowerCase()
        .includes(query);
    });
    this.setState({ filteredAuthors: filteredAuthors });
  };

  getContentView = () => {
    if (this.state.loading) {
      return <Loading />;
    } else {
      if (this.state.currentAuthor) {
        return <AuthorDetail author={this.state.currentAuthor} />;
      } else {
        return (
          <AuthorsList
            selectAuthor={this.selectAuthor}
            filterAuthors={this.filterAuthors}
            authors={this.state.authors}
          />
        );
      }
    }
  };

  render() {
    return (
      <div id="app" className="container-fluid">
        <div className="row">
          <div className="col-2">
            <Sidebar unselectAuthor={this.unselectAuthor} />
          </div>
          <div className="content col-10">{this.getContentView()}</div>
        </div>
      </div>
    );
  }
}

export default App;
