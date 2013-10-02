require 'sinatra'
require 'haml'

set :public_folder, File.dirname(__FILE__) + '/javascript'

get '/' do
  haml :index, locals: { credentials: "#{params[:tracker_api_token]}#{params[:project_id]}" }
end
