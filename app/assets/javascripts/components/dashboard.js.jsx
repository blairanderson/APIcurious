var Dashboard = React.createClass ({
  getDefaultProps: function() {
    return { data: {} }
  },
  render: function() {
    return (
      <div>
        <div className='col-lg-6'>
          <StatsBar key='statsbar'
                    starredRepos= { this.props.data.starredRepos }
                    organizations={ this.props.data.organizations }
                    repositories= { this.props.data.repositories }
                    commitHistory={ this.props.data.commit_history } />
        </div>
        <div className='col-lg-6'>
          <UsersBar key='usersbar'
                    following=  { this.props.data.users.following }
                    followers=  { this.props.data.users.followers }
                    feed=       { this.props.data.received_events }
                    currentUser={ this.props.data.user } />
        </div>
      </div>
    );
  }
});
