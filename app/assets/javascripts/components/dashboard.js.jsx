var Dashboard = React.createClass ({
  getInitialState: function(){
    return window.data
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
                    following=  { this.state.users.following }
                    followers=  { this.state.users.followers }
                    feed=       { this.state.received_events }
                    currentUser={ this.state.user } />
        </div>
      </div>
    );
  }
});
