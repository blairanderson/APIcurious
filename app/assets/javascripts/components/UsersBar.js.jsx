var UsersBar = React.createClass ({
  getInitialState: function() {
    return { activeButton: 'following', following: this.props.following }
  },
  handleButtonClick: function(clicked) {
    this.setState({ activeButton: clicked });
  },
  handleUnfollow: function(userToUnfollow) {
    var following = this.state.following;

    $.ajax({
      url: 'https://api.github.com/user/following/' + userToUnfollow.login,
      type: "DELETE",
      headers: {"Authorization": "token " + this.props.currentUser.token},
      success: function(response) {
        // TODO: refresh child with updated list of following

      }, error: function(xhr) {
        console.log("You messed up.");
      }
    });
  },
  handleFollow: function(userToFollow) {
    $.ajax({
      url: 'https://api.github.com/user/following/' + userToFollow.login,
      type: "PUT",
      headers: {"Authorization": "token " + this.props.currentUser.token},
      success: function(response) {
        console.log("Yes");
      }, error: function(xhr) {
        console.log("You messed up")
      }
    });
  },
  render: function() {
    var Content;

    switch (this.state.activeButton) {
      case 'followers':
        Content = <Followers key='followers' users={ this.props.followers } />
        break;
      case 'following':
        Content = <Following following={ this.props.following } onUnfollow={ this.handleUnfollow } />
        break;
      case 'feed':
        Content = <Feed feed={ this.props.feed } />
        break;
      case 'search':
        Content = <Search searchValue={ this.props.searchValue } currentUser={ this.props.currentUser } onFollow={ this.handleFollow } />
        break;
    }

    var BUTTONS = [
      {
        identifier: 'followers',
        name: 'Followers'
      },
      {
        identifier: 'following',
        name: 'Following'
      },
      {
        identifier: 'feed',
        name: 'Feed'
      },
      {
        identifier: 'search',
        name: 'Search'
      }
    ]

    var buttons = BUTTONS.map(function(button, index) {
      return (
        <div
          className='btn-group'
          role='group'
          key={ button.name }
        >
          <button
            type='button'
            className='btn btn-primary'
            onClick={ this.handleButtonClick.bind(this, button.identifier) }>{ button.name }
          </button>
        </div>
      );
    }.bind(this));

    return (
      <div className='top-column'>
        <div className='btn-group btn-group-justified stats-bar' role='group' aria-label='...'>
          { buttons }
        </div>

        <div className='content'>
          { Content }
        </div>
      </div>
    );
  }
});

var StarredReposTable = React.createClass ({
  getDefaultProps: function() {
    return { starredRepos: [] };
  },
  render: function() {
    var repos = this.props.starredRepos.map(function(repo, index) {
      return (
        <tr>
          <td
            key={ index }
            className='dataRow'
          >
            <a href={ repo.html_url } >{ repo.full_name }</a>
          </td>
        </tr>
      )
    });

    return (
      <div className='starredRepos'>
        <table className='table'>
          <thead>
            <tr>
              <th>starred repositories</th>
            </tr>
          </thead>
          <tbody>
            { repos }
          </tbody>
        </table>
      </div>
    );
  }
});

Followers = React.createClass ({
  getDefaultProps: function() {
    return { users: [] }
  },
  render: function() {
    var users = this.props.users.map(function(user, index) {
      return (
        <div
          className='col-lg-4 col-sm-6 text-center'
          key={ index }
        >
          <img
            className='img-circle img-responsive img-center'
            src={user.avatar_url.slice(0, -4)}
          />

          <h3>
            <a href={ user.html_url } >{ user.login }</a>
          </h3>
        </div>
      );
    });
    return (
      <div className='follow-table'>
        { users }
      </div>
    );
  }
});

var Following = React.createClass ({
 getDefaultProps: function() {
    return { users: [] }
  },
  render: function() {
    var following = this.props.following

    var users = following.map(function(user, index) {
      return (<FollowingTableRow user={user} key={index} onUnfollow={ this.props.onUnfollow } />);
    }.bind(this));
    return (
      <div className='follow-table'>
        { users }
      </div>
    );
  }
});

var FollowingTableRow = React.createClass ({
  getInitialState: function() {
    return { followLink: 'Unfollow' }
  },
  handleUnfollow: function() {
    unfollowed = "Unfollowed";

    this.setState({ followLink: unfollowed })

    this.props.onUnfollow(this.props.user)
  },

  render: function() {
    return (
      <div
        className='col-lg-4 col-sm-6 text-center'
        key={ 'user-' + this.props.index }
      >
        <img
          className='img-circle img-responsive img-center'
          src={ this.props.user.avatar_url.slice(0, -4) } />

        <h3>
          <a href={ this.props.user.html_url } >{ this.props.user.login }</a><br />
            <small>
            <a
              className="unfollow"
              onClick={ this.handleUnfollow }
            >
            { this.state.followLink }
            </a>
          </small>
        </h3>
      </div>
    );
  }
});

var Feed = React.createClass ({
  render: function() {
    rows = this.props.feed.map(function(activity, index) {
      return (
        <tr
          key={ index }
        >
          <td
            className='dataRow'
          >

            { activity[1] } created <a href={ activity[0] }>{ activity[2] }
            </a>
          </td>
        </tr>
      );
    });

    return (
      <div className='orgs-table'>
        <table className='table'>
          <thead>
            <tr>
              <th>recent acitivites</th>
            </tr>
          </thead>
          <tbody>
            { rows }
          </tbody>
        </table>
      </div>
    );
  }
});

var Search = React.createClass ({
  getInitialState: function() {
    return { userRendering: "" }
  },
  handleSearch: function(e) {
    e.preventDefault();
    var component = this;
    var searchValue = (React.findDOMNode(this.refs.searchValue).value.trim());

    var response = $.ajax({
      url: 'https://api.github.com/users/' + searchValue,
      type: "GET",
      headers: {"Authorization": "token " + this.props.currentUser.token},
      success: function(response) {
        this.renderUser(response);
      }.bind(this), error: function(xhr) {
        console.log("You messed up.");
      }
    });
  },
  renderUser: function(value) {
    var userBox = <UserBox user={value} onFollow={ this.props.onFollow } />
    this.setState({ userRendering: userBox })
  },
  render: function() {
    return (
      <div>
        <form>
          <div className="form-group dropdown-toggle">
            <input type="text" ref="searchValue" placeholder="Search for a user..." id="searchfield" />
            <button name="button" onClick={ this.handleSearch } className="btn btn-primary">Search</button>
          </div>
        </form>

        <div className="user">
          { this.state.userRendering }
        </div>
      </div>
    );
  }
});

var UserBox = React.createClass ({
  getInitialState: function() {
    return ({ followLink: 'Follow' })
  },
  handleFollow: function() {
    followed = "Followed";
    this.setState({ followLink: followed });

    this.props.onFollow(this.props.user)
  },
  render: function() {
    return (
      <div
        className='col-lg-4 col-sm-6 text-center'
        key={ 'user-' + this.props.user.login }
      >
        <img
          className='img-circle img-responsive img-center'
          src={ this.props.user.avatar_url.slice(0, -4) } />

        <h3>
          <a href={ this.props.user.html_url } >{ this.props.user.login }</a><br />
            <small>
            <a
              className="follow"
              onClick={ this.handleFollow }
            >
            { this.state.followLink }
            </a>
          </small>
        </h3>
      </div>
    );
  }
});

var OrganizationsTable = React.createClass ({
  getDefaultProps: function() {
    return { organizations: [] }
  },
  render: function() {
    var orgs = this.props.organizations.map(function(org, index) {
      return (
        <tr>
          <td
            key={ index }
            className='dataRow'
          >
            <a
              href={ org.url }
            >
              { org.login }
            </a>
          </td>
        </tr>
      );
    });
    return (
      <div className='orgs-table'>
        <table className='table'>
          <thead>
            <tr>
              <th>organizations</th>
            </tr>
          </thead>
          <tbody>
            { orgs }
          </tbody>
        </table>
      </div>
    );
  }
});


var RepositoriesTable = React.createClass ({
  getDefaultProps: function() {
    return { repositories: [] }
  },
  render: function() {
    var repos = this.props.repositories.map(function(repo, index) {
      return (
        <tr>
          <td
            key={ index }
            className='dataRow'
          >
            <a href={ repo.html_url } >{ repo.full_name }</a>
          </td>
        </tr>
      );
    });
    return (
      <div className='repos-table'>
        <table className='table'>
          <thead>
            <tr>
              <th>repositories</th>
            </tr>
          </thead>
          <tbody>
            { repos }
          </tbody>
        </table>
      </div>
    );
  }
});

var CommitStatsTable = React.createClass ({
  render: function() {
    var NAMES = [
      {
        data: this.props.commitHistory.daily_commits,
        name: "Today's contributions"
      },
      {
        data: this.props.commitHistory.current_streak,
        name: 'Current Streak'
      },
      {
        data: this.props.commitHistory.longest_streak,
        name: 'Longest Streak'
      },
      {
        data: this.props.commitHistory.total_commits,
        name: 'Total contributions'
      }
    ]

    var rows = NAMES.map(function(row, index) {
      return (
        <tr
          key={index}
          className='dataRow'
          >
          <td>
            { row.name } <span className='badge pull-right'>{ row.data }</span>
          </td>
        </tr>
      );
    });

    return (
      <div className='commits-table'>
        <table className='table'>
          <thead>
            <tr>
              <th>commit history</th>
            </tr>
          </thead>
          <tbody>
            { rows }
          </tbody>
        </table>
      </div>
    );
  }
});
