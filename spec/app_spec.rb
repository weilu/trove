ENV['RACK_ENV'] = 'test'

require_relative '../app'
require 'rspec'
require 'rack/test'

describe 'Trove app' do
  include Rack::Test::Methods

  def app
    Sinatra::Application
  end

  describe 'GET /' do
    context 'without params' do
      subject(:response) do
        get '/'
        last_response
      end

      it { should be_ok }

      %w(byReleaseChart summaryChart ganttChart).each do |chart|
        its(:body) { should include("#{chart}().draw('')") }
      end
    end

    context 'with credential & project params' do
      subject(:response) do
        get "/?tracker_api_token=#{token}&project_id=#{project_id}"
        last_response
      end
      let(:token) { 'longasstoken' }
      let(:project_id) { 'myproject' }

      it { should be_ok }

      %w(byReleaseChart summaryChart ganttChart).each do |chart|
        its(:body) { should include("#{chart}().draw('#{token}#{project_id}')") }
      end
    end
  end
end
