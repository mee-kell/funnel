import React from 'react';
import Home from './routes/Home.js';
import Signup from './routes/Signup';
import Login from './routes/Login';
import { Routes, Route } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

import Upload from './routes/Upload.js';
import LoggedInNav from './components/LoggedInNav.js';
import LoggedOutNav from './components/LoggedOutNav.js';
import Display from './routes/Display.js';

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
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/display" element={<Display />} />
      </Routes>
    )

    if (loading) return null;

    if (!user) {
      return (
            <div>
              <LoggedOutNav />
              {routes}
            </div>
      );
    }

    return (
      <div>
        <LoggedInNav />
        {routes}
      </div>
    );
  }
}

export default App;
