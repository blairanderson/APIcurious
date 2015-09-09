require "vcr"

VCR.configure do |c|
    c.hook_into                 :webmock
    c.cassette_library_dir      = 'spec/support/vcr_cassettes'
    c.configure_rspec_metadata!
    c.default_cassette_options  = {:record => :new_episodes}
end

RSpec.configure do |config|
  config.expect_with :rspec do |expectations|
    expectations.include_chain_clauses_in_custom_matcher_descriptions = true
  end

  config.mock_with :rspec do |mocks|
    mocks.verify_partial_doubles = true
  end

  def user
    @user ||= User.new(provider: 'github',
                          uid: '12345',
                          email: 'user@email.com',
                          nickname: 'user',
                          image_url: 'http://36.media.tumblr.com/tumblr_lqeoxdzT3M1r27575o1_500.jpg',
                          token: 'abcdef')
  end

  def login_user
    OmniAuth.config.test_mode = true

    OmniAuth.config.mock_auth[:github] = {
      'provider' => user.provider,
      'uid'      => user.uid,
      'token'    => user.token,
      'info'     =>  {email: user.email,
                      nickname: user.nickname,
                      image_url: user.image_url}
    }
  end

  if ENV["CI"]
    require "codeclimate-test-reporter"
    CodeClimate::TestReporter.start
  else
    require "simplecov"
    SimpleCov.start
  end
end
