ENV['RACK_ENV'] = 'test'

require_relative '../app'
require 'rspec'
require 'rack/test'
require 'pry'

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

  describe 'POST /' do
    let(:token) { 'longasstoken' }
    let(:project_id) { 'myproject' }
    let(:do_request) { post "/", tracker_api_token: token, project_id: project_id }

    before do
      Trove.any_instance.stub(:generate)
      Trove.any_instance.stub(:aggregate)
    end

    it 'generates data using Trove' do
      DataSlave.should_receive(:perform_async).with(token, project_id)
      do_request
    end

    it 'redirects to GET / with params' do
      do_request
      expect(last_response).to be_redirect
      follow_redirect!
      expect(last_request.fullpath).to eq("/?tracker_api_token=#{token}&project_id=#{project_id}")
    end
  end
end
