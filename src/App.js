import React from 'react';
import Signup from './routes/Signup';
import Login from './routes/Login';
import { Routes, Route } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

import LoggedInNav from './components/LoggedInNav.js';
import LoggedOutNav from './components/LoggedOutNav.js';
import Display from './routes/Display.js';
import Container from 'react-bootstrap/Container';

class App extends React.Component {

  constructor() {
    super();
    this.unsubscribe = null;
    this.state = {
      loading: false,
      user: null,
    };
  }

  componentDidMount() {
    this.unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        this.setState({
          user: user.toJSON(),
          loading: false,
        });
      } else {
        this.setState({
          loading: false,
        });
      }
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  render() {
    const { loading, user } = this.state;

    const routes = (
      <Routes className="appBody">
        <Route path="/" element={<Display />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    )

    if (loading) return null;

    if (!user) {
      return (
        <Container fluid>
          <LoggedOutNav />
          {routes}
        </Container>
      );
    }

    return (
      <Container fluid>
        <LoggedInNav />
        {routes}
      </Container>
    );
  }
}

export default App;
