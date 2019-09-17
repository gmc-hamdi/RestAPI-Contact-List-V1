import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import ContactCart from './ContactCart';
import AddContact from './AddContact';
import "./App.css"
import axios from 'axios';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      phone: "",
      contactlist: [],
      id: "",
      edit: false
    }
  }


  componentDidMount = () => {
    this.getContacts();
  }

  getContacts = () => {
    axios.get("/contacts").then(res =>
      this.setState({
        contactlist: res.data
      })
    )
  };

  addContact = () => {
    axios.post("/addContact", {
      name: this.state.name,
      email: this.state.email,
      phone: this.state.phone
    }).then(this.getContacts);
    this.reset();
  }

  deleteContact = id => {
    axios.delete("/deleteContact/" + id)
      .then(this.getContacts)
      .catch(err => console.log(err))
  }

  editContact = () => {
    axios.put("/modifyContact/" + this.state.id, {
      name: this.state.name,
      phone: this.state.phone,
      email: this.state.email
    }).then(this.getContacts);
    this.reset();
  }

  reset = () => {
    this.setState({
      name: "",
      phone: "",
      email: '',
      edit: false
    })
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  getPerson = (contact) => {
    this.setState({
      id: contact._id,
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      edit: true
    })
  }

  render() {
    return (
      <div>
        <div>
          <h1>My Contact</h1>
          <Link to="/contact-list">
            <button className="button">Contact List</button>
          </Link>
          <Link to="/ajouter-contact">
            <button className="button">Add Contact</button>
          </Link>
        </div>
        <Route path="/contact-list" render={() => (
          <div className="contact-list">
            {this.state.contactlist.map(el => (<ContactCart contact={el} deleteContact={this.deleteContact} getPerson={this.getPerson} />))}
          </div>
        )} />
        <Route path="/(ajouter-contact|edit-contact)/" render={() => <AddContact handleChange={this.handleChange}
          action={this.state.edit ? this.editContact : this.addContact}
          contact={this.state}
          edit={this.state.edit} />} />
      </div>
    )
  }
}
