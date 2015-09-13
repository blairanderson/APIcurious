var Dashboard = React.createClass ({
  getInitialState: function(){
    data = window.data
    data.following = data.users.following
    dta.followers = data.users.followers
    return data
  },

  handleNewFollowing: function(following) {
    // notice concat creates a NEW array, this is important.
    // react needs a new object to know that it is getting new data.
    // the word 'immutability' is important in react
    this.setState({
      following: this.state.following.concat(following)
     })
  },

  handleUnfollow: function(unfollow){

    var following = this.state.following.filter(function(following){
      return following.username != unfollow.username;
    });

    this.setState({
      following: following
     })
  },

  render: function() {
    return (
      <div>
        <div className='col-lg-6'>
          <StatsBar key='statsbar'
                    starredRepos= { this.state.starredRepos }
                    organizations={ this.state.organizations }
                    repositories= { this.state.repositories }
                    commitHistory={ this.state.commit_history } />
        </div>
        <div className='col-lg-6'>
          <UsersBar key='usersbar'
                    handleUnfollow={this.handleUnfollow}
                    handleFollow={this.handleFollow}
                    following=  { this.state.following }
                    followers=  { this.state.followers }
                    feed=       { this.state.received_events }
                    currentUser={ this.state.user } />
        </div>
      </div>
    );
  }
});
